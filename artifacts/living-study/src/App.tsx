import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import {
  ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2,
  ChevronRight, CircleHelp, ClipboardCheck, Clock3, Eye, FileText,
  Focus, Leaf, Library, LockKeyhole, LogOut, Moon, Plus, RotateCcw, Search,
  Settings as SettingsIcon, ShieldAlert, Sun, Trash2,
} from 'lucide-react';

type Note = { id: string; text: string; createdAt: string };
type StudyItem = {
  id: string; sourceNoteId: string; sourceSentence: string; question: string;
  answer: string; type: 'recall'; verified: boolean; createdAt: string;
};
type Progress = { completed: number; correct: number; streak: number; lastStudied: string | null };
type Settings = { theme: 'light' | 'dark'; displayName: string; quizMode: QuizMode };
type QuizMode = 'flashcard' | 'written' | 'choice';
type Session = { unlocked: boolean; pinHash: string | null; pinSalt: string | null };
type Store = { notes: Note[]; items: StudyItem[]; progress: Progress; settings: Settings; session: Session };

const STORE_KEY = 'living-study-state-v1';
const INITIAL: Store = {
  notes: [], items: [], progress: { completed: 0, correct: 0, streak: 0, lastStudied: null },
  settings: { theme: 'light', displayName: 'Study friend', quizMode: 'flashcard' },
  session: { unlocked: false, pinHash: null, pinSalt: null },
};

function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return INITIAL;
    const value = JSON.parse(raw) as Partial<Store>;
    const savedSession = value.session as (Partial<Session> & { pin?: string }) | undefined;
    return {
      ...INITIAL, ...value,
      notes: Array.isArray(value.notes) ? value.notes : [],
      items: Array.isArray(value.items) ? value.items : [],
      progress: { ...INITIAL.progress, ...value.progress },
      settings: { ...INITIAL.settings, ...value.settings },
      // Always require the local demo lock again after a reload. Drop legacy
      // plaintext passphrases while keeping study data from earlier builds.
      session: {
        unlocked: false,
        pinHash: savedSession?.pinHash ?? null,
        pinSalt: savedSession?.pinSalt ?? null,
      },
    };
  } catch { return INITIAL; }
}

function uid() { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }
function bytesToHex(bytes: Uint8Array) { return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(''); }
async function hashPassphrase(passphrase: string, saltHex: string) {
  const salt = Uint8Array.from(saltHex.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 210_000, hash: 'SHA-256' }, key, 256);
  return bytesToHex(new Uint8Array(bits));
}
function splitSentences(text: string) {
  return (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? []).map((sentence) => sentence.trim()).filter(Boolean);
}
function normalize(value: string) { return value.trim().toLocaleLowerCase().replace(/[.,!?;:]+$/g, '').replace(/\s+/g, ' '); }
function dateLabel(date: string) {
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function App() {
  const [store, setStore] = useState<Store>(readStore);
  const [location] = useLocation();
  const [toast, setToast] = useState('');
  useEffect(() => { localStorage.setItem(STORE_KEY, JSON.stringify(store)); }, [store]);
  useEffect(() => { document.documentElement.classList.toggle('dark', store.settings.theme === 'dark'); }, [store.settings.theme]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const update = (patch: Partial<Store>) => setStore((old) => ({ ...old, ...patch }));
  const setSettings = (patch: Partial<Settings>) => setStore((old) => ({ ...old, settings: { ...old.settings, ...patch } }));
  const navProps = { settings: store.settings, location, session: store.session, onLock: () => update({ session: { ...store.session, unlocked: false } }), onToggleTheme: () => setSettings({ theme: store.settings.theme === 'light' ? 'dark' : 'light' }) };

  if (!store.session.unlocked) {
    return <Gate session={store.session} settings={store.settings} onUnlock={(pinHash, pinSalt, name) => {
      update({ session: { unlocked: true, pinHash, pinSalt }, settings: { ...store.settings, displayName: name || store.settings.displayName } });
    }} />;
  }

  return (
    <div className="app-shell">
      <Sidebar {...navProps} />
      <div className="main-area">
        <header className="topbar">
          <div><div className="topbar-kicker">A quieter way to remember</div><div className="topbar-name">Your private study space</div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <button className="icon-button" aria-label="Lock study space" data-testid="button-lock-session" onClick={navProps.onLock}><LockKeyhole size={15} /></button>
            <div className="user-badge" data-testid="text-user-initials">{(store.settings.displayName || 'S').trim().slice(0, 1).toUpperCase()}</div>
          </div>
        </header>
        <Switch>
          <Route path="/">
            <Dashboard store={store} update={update} notify={setToast} />
          </Route>
          <Route path="/library">
            <LibraryPage items={store.items.filter((item) => item.verified)} />
          </Route>
          <Route path="/quiz">
            <QuizPage store={store} setSettings={setSettings} update={update} />
          </Route>
          <Route path="/settings">
            <SettingsPage store={store} setSettings={setSettings} update={update} notify={setToast} />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
      <MobileNav {...navProps} />
      {toast && <div role="status" className="toast-message" data-testid="status-toast">{toast}</div>}
    </div>
  );
}

type NavProps = { settings: Settings; location: string; session: Store['session']; onLock: () => void; onToggleTheme?: () => void };
const navItems = [
  { href: '/', label: 'Study desk', icon: Focus },
  { href: '/library', label: 'Master library', icon: Library },
  { href: '/quiz', label: 'Self-quiz', icon: CircleHelp },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

function Sidebar({ settings, location, onLock, onToggleTheme }: NavProps) {
  return <aside className="sidebar">
    <Link href="/" className="brand" data-testid="link-brand-home"><span className="brand-mark"><Leaf size={19} /></span><span className="brand-name">LivingStudy</span></Link>
    <div className="nav-caption">Your practice</div>
    <nav className="nav-list" aria-label="Main navigation">
      {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`nav-link ${location === href ? 'active' : ''}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={17} /><span>{label}</span>{href === '/library' ? <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: .5 }} /> : null}</Link>)}
    </nav>
    <div className="side-bottom">
      <div style={{ padding: '12px 9px 16px', display: 'flex', alignItems: 'center', gap: 9 }}>
        <button className="icon-button" aria-label="Toggle theme" data-testid="button-toggle-theme-sidebar" onClick={onToggleTheme}><Moon size={15} /></button>
        <span style={{ color: '#78877c', fontSize: 10 }}>{settings.displayName}</span>
        <button className="icon-button" aria-label="Lock" data-testid="button-sidebar-lock" style={{ marginLeft: 'auto' }} onClick={onLock}><LogOut size={14} /></button>
      </div>
      <div className="privacy-note"><strong><LockKeyhole size={12} style={{ display: 'inline', marginRight: 5 }} />Stays on this device</strong>Notes are never sent to an AI or server. LocalStorage is not encrypted.</div>
    </div>
  </aside>;
}

function MobileNav({ location }: NavProps) {
  return <nav className="mobile-nav" aria-label="Main navigation">
    {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`nav-link ${location === href ? 'active' : ''}`} data-testid={`mobile-nav-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={17} /><span>{label === 'Master library' ? 'Library' : label === 'Study desk' ? 'Desk' : label === 'Self-quiz' ? 'Quiz' : label}</span></Link>)}
  </nav>;
}

function Gate({ session, settings, onUnlock }: { session: Session; settings: Settings; onUnlock: (pinHash: string, pinSalt: string, name: string) => void }) {
  const [pin, setPin] = useState('');
  const [name, setName] = useState(settings.displayName === 'Study friend' ? '' : settings.displayName);
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      if (session.pinHash && session.pinSalt) {
        const candidate = await hashPassphrase(pin, session.pinSalt);
        if (candidate !== session.pinHash) { setError('That passphrase doesn’t match this device.'); return; }
        onUnlock(session.pinHash, session.pinSalt, name.trim());
        return;
      }
      const saltBytes = crypto.getRandomValues(new Uint8Array(16));
      const salt = bytesToHex(saltBytes);
      const hash = await hashPassphrase(pin, salt);
      onUnlock(hash, salt, name.trim());
    } catch {
      setError('This browser could not create a local lock. Try an up-to-date browser in a secure context.');
    }
  }
  return <main className="session-gate">
    <section className="gate-art">
      <Link href="/" className="brand" data-testid="link-gate-brand"><span className="brand-mark"><Leaf size={19} /></span><span className="brand-name">LivingStudy</span></Link>
      <div className="gate-copy"><div className="eyebrow">A small space to think clearly</div><h1 className="serif">Remember what<br />you meant.</h1><p>Turn your own product notes into thoughtful prompts. Keep every idea connected to the sentence it came from.</p></div>
      <div className="gate-foot">LOCAL BY DESIGN &nbsp;·&nbsp; NO AI, NO SERVER</div>
    </section>
    <section className="gate-form-area">
      <form className="gate-form" onSubmit={submit}>
        <div className="eyebrow">{session.pinHash ? 'Welcome back' : 'A private desk, on this device'}</div>
        <h2 className="serif">{session.pinHash ? 'Unlock your desk' : 'Settle in'}</h2>
        <p className="subhead">{session.pinHash ? 'Enter your local passphrase to continue.' : 'Choose a name and a local passphrase to begin.'}</p>
        {!session.pinHash && <><label className="field-label" htmlFor="display-name">What should we call you?</label><input id="display-name" data-testid="input-login-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="nickname" /></>}
        <label className="field-label" htmlFor="local-pin">{session.pinHash ? 'Local passphrase' : 'Create a local passphrase'}</label>
        <input id="local-pin" data-testid="input-login-passphrase" type="password" value={pin} onChange={(e) => { setPin(e.target.value); setError(''); }} placeholder={session.pinHash ? 'Your passphrase' : 'At least 8 characters'} autoComplete={session.pinHash ? 'current-password' : 'new-password'} required minLength={session.pinHash ? 1 : 8} />
        {error && <p role="alert" style={{ color: '#a04f44', fontSize: 11, margin: '8px 0 0' }} data-testid="status-login-error">{error}</p>}
        <button className="button button-primary" type="submit" data-testid="button-unlock"><LockKeyhole size={15} />{session.pinHash ? 'Unlock my study desk' : 'Create my study desk'}</button>
        <div className="notice"><strong>Just a local demo lock.</strong> This is not real account security. A salted passphrase verifier and your study data are stored in browser LocalStorage; the study data is not encrypted. Anyone with access to this browser profile may be able to read it.</div>
      </form>
    </section>
  </main>;
}

function Dashboard({ store, update, notify }: { store: Store; update: (patch: Partial<Store>) => void; notify: (message: string) => void }) {
  const [draft, setDraft] = useState('');
  const [edits, setEdits] = useState<Record<string, { question: string; answer: string }>>({});
  const pending = store.items.filter((item) => !item.verified);
  const bySource = new Map(store.notes.map((note) => [note.id, note]));
  function addNote(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const note: Note = { id: uid(), text, createdAt: new Date().toISOString() };
    const generated: StudyItem[] = splitSentences(text).map((sentence) => ({
      id: uid(), sourceNoteId: note.id, sourceSentence: sentence,
      question: 'What is the key point in this sentence?',
      answer: sentence, type: 'recall', verified: false, createdAt: new Date().toISOString(),
    }));
    update({ notes: [note, ...store.notes], items: [...generated, ...store.items] });
    setDraft('');
    notify(`${generated.length} ${generated.length === 1 ? 'prompt' : 'prompts'} added to review — nothing was approved.`);
  }
  function approve(id: string) {
    const item = store.items.find((candidate) => candidate.id === id);
    const source = item && bySource.get(item.sourceNoteId);
    const stillAnchored = !!item && !!source && splitSentences(source.text).includes(item.sourceSentence);
    if (!item || item.verified || !stillAnchored || item.answer.trim() !== item.sourceSentence) {
      notify('Could not approve: restore the exact source sentence as the answer first.');
      return;
    }
    update({ items: store.items.map((candidate) => candidate.id === id ? { ...candidate, verified: true } : candidate) });
    notify('Approved into your verified library.');
  }
  function editItem(item: StudyItem, key: 'question' | 'answer', value: string) {
    setEdits((old) => ({ ...old, [item.id]: { question: old[item.id]?.question ?? item.question, answer: old[item.id]?.answer ?? item.answer, [key]: value } }));
  }
  function saveItem(item: StudyItem) {
    const edit = edits[item.id];
    if (!edit) { notify('No changes to save.'); return; }
    update({ items: store.items.map((candidate) => candidate.id === item.id && !candidate.verified ? { ...candidate, question: edit.question.trim(), answer: edit.answer.trim() } : candidate) });
    setEdits((old) => { const next = { ...old }; delete next[item.id]; return next; });
    notify('Edits saved locally. Approval remains a separate choice.');
  }
  function discard(id: string) {
    update({ items: store.items.filter((item) => item.id !== id) });
    notify('Discarded permanently. This prompt was removed.');
  }
  function removeNote(id: string) {
    const doomed = store.items.filter((item) => item.sourceNoteId === id && !item.verified);
    update({ notes: store.notes.filter((note) => note.id !== id), items: store.items.filter((item) => item.sourceNoteId !== id || item.verified) });
    if (doomed.length) notify(`${doomed.length} pending prompt${doomed.length === 1 ? '' : 's'} removed with the note.`);
  }
  return <main className="page">
    <div className="welcome-band">
      <div><div className="eyebrow">Your study desk</div><h1 className="serif" style={{ marginBottom: 6 }}>A little progress, {store.settings.displayName.split(' ')[0] || 'today'}.</h1><p>Capture a thought. Keep its source close. Approve only what feels right.</p></div>
      <div className="welcome-mark"><Leaf size={25} /></div>
    </div>
    <div className="stat-row" style={{ marginBottom: 20 }}>
      <Stat label="In your library" value={store.items.filter((item) => item.verified).length} />
      <Stat label="Awaiting your review" value={pending.length} />
      <Stat label="Recall streak" value={store.progress.streak} suffix="days" />
    </div>
    <div className="dashboard-grid">
      <div className="column-stack">
        <section className="panel" data-testid="section-note-ingestion">
          <div className="panel-head"><div><div className="panel-label">01 / Capture</div><h2 style={{ marginTop: 6 }}>Bring a note to life</h2><p className="subhead">Paste your own product thinking. One sentence becomes one review prompt.</p></div><FileText size={20} color="#7f9981" /></div>
          <div className="panel-body">
            <form className="note-form" onSubmit={addNote}>
              <label htmlFor="note-entry" className="field-label" style={{ marginTop: 0 }}>Your note</label>
              <textarea id="note-entry" data-testid="input-source-note" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="For example: Shorter onboarding flows can improve activation when they remove unnecessary decisions." />
              <div className="form-footer"><span className="fineprint">Split into sentences locally. No AI or server involved.</span><button className="button button-primary" type="submit" disabled={!draft.trim()} data-testid="button-add-note"><Plus size={15} /> Add to review</button></div>
            </form>
            <div className="fineprint" style={{ marginTop: 12 }}>Sentence boundaries are deterministic. Generated answers quote the exact sentence you entered; nothing enters the library until you approve it.</div>
          </div>
        </section>
        <section className="panel" data-testid="section-source-notes">
          <div className="panel-head"><div><div className="panel-label">Your source notes</div><h2 style={{ marginTop: 6 }}>The original thinking</h2></div><span className="pending-count" data-testid="text-note-count">{store.notes.length}</span></div>
          <div className="panel-body" style={{ paddingTop: 8 }}>
            {!store.notes.length ? <Empty icon={<FileText size={19} />} title="Your notes live here" text="Add a sentence above to create a source-anchored prompt for review." /> :
              store.notes.map((note) => {
                const staged = pending.filter((item) => item.sourceNoteId === note.id);
                return <div className="note-row" key={note.id} data-testid={`note-source-${note.id}`}>
                  <div className="note-copy">{note.text}</div>
                  <div className="note-meta"><span>Added {dateLabel(note.createdAt)} · {staged.length} awaiting review</span><button className="tiny-action" onClick={() => removeNote(note.id)} data-testid={`button-remove-note-${note.id}`} aria-label="Remove source note">Remove note</button></div>
                </div>;
              })}
          </div>
        </section>
      </div>
      <section className="panel" data-testid="section-review-queue">
        <div className="panel-head"><div><div className="panel-label">02 / Your decision</div><h2 style={{ marginTop: 6 }}>Review, then decide</h2><p className="subhead">Each prompt stays beside the sentence it came from.</p></div><span className="pending-count" data-testid="text-pending-count">{pending.length}</span></div>
        <div className="panel-body" style={{ paddingTop: 7 }}>
          {!pending.length ? <Empty icon={<ClipboardCheck size={19} />} title="Nothing waiting on you" text="Add a note to stage review cards here. They will never approve themselves." /> :
            pending.map((item) => {
              const note = bySource.get(item.sourceNoteId);
              const edit = edits[item.id];
              const currentQuestion = edit?.question ?? item.question;
              const currentAnswer = edit?.answer ?? item.answer;
              const hasUnsavedEdits = !!edit && (currentQuestion !== item.question || currentAnswer !== item.answer);
              const isExact = !!note && splitSentences(note.text).includes(item.sourceSentence) && item.answer.trim() === item.sourceSentence && !hasUnsavedEdits;
              return <article className="source-stage" key={item.id} data-testid={`pending-card-${item.id}`}>
                <div className="source-quote" data-testid={`source-sentence-${item.id}`}><span><span className="panel-label" style={{ display: 'block', marginBottom: 5 }}>Exact source · {note ? dateLabel(note.createdAt) : 'missing'}</span>{item.sourceSentence}</span></div>
                <div className="stage-connector"><ArrowRight size={15} /></div>
                <div className="stage-card">
                  <div className="stage-tag"><Clock3 size={12} /> Needs your review</div>
                  <label className="field-label" htmlFor={`question-${item.id}`} style={{ marginTop: 0 }}>Prompt</label>
                  <input id={`question-${item.id}`} data-testid={`input-pending-question-${item.id}`} value={currentQuestion} onChange={(e) => editItem(item, 'question', e.target.value)} aria-label="Edit prompt question" />
                  <label className="field-label" htmlFor={`answer-${item.id}`}>Answer · must match source to approve</label>
                  <textarea id={`answer-${item.id}`} data-testid={`input-pending-answer-${item.id}`} value={currentAnswer} onChange={(e) => editItem(item, 'answer', e.target.value)} aria-label="Edit prompt answer" style={{ minHeight: 67 }} />
                  <div className="fineprint" data-testid={`status-source-match-${item.id}`} style={{ color: isExact ? '#6b886e' : '#aa7052' }}>{hasUnsavedEdits ? 'Save edits before approval.' : isExact ? 'Answer is grounded in the exact source.' : 'Restore the exact source sentence to enable approval.'}</div>
                  <div className="stage-actions">
                    <button className="button button-primary" onClick={() => approve(item.id)} disabled={!isExact} data-testid={`button-approve-${item.id}`}><Check size={13} /> Approve</button>
                    <button className="button button-secondary" onClick={() => saveItem(item)} data-testid={`button-save-edit-${item.id}`}>Edit &amp; Save</button>
                    <button className="button button-danger" onClick={() => discard(item.id)} data-testid={`button-discard-${item.id}`}><Trash2 size={12} /> Discard</button>
                  </div>
                </div>
              </article>;
            })}
          <div className="fineprint" style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #edf0e9' }}><ShieldAlert size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Only explicit approval moves an item to the verified library. Discard removes it permanently.</div>
        </div>
      </section>
    </div>
  </main>;
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return <div className="stat" data-testid={`stat-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="stat-label">{label}</div><div className="stat-value">{value}<span style={{ font: '11px "DM Sans", sans-serif', color: '#819087', marginLeft: 5 }}>{suffix}</span></div></div>;
}
function Empty({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div className="empty" data-testid={`empty-${title.toLowerCase().replaceAll(' ', '-')}`}><div className="empty-icon">{icon}</div><strong>{title}</strong><p>{text}</p></div>;
}

function LibraryPage({ items }: { items: StudyItem[] }) {
  const [search, setSearch] = useState('');
  const approved = items.filter((item) => item.verified);
  const filtered = approved.filter((item) => `${item.question} ${item.answer} ${item.sourceSentence}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  return <main className="page">
    <div className="page-header"><div><div className="eyebrow">Only what you approved</div><h1 className="serif">Master knowledge library</h1><p className="subhead">A growing collection of ideas you chose to keep.</p></div><div className="search-wrap"><Search size={15} /><input type="search" aria-label="Search verified library" data-testid="input-library-search" placeholder="Search knowledge…" value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><span className="verified-chip"><CheckCircle2 size={12} /> Verified only</span><span className="fineprint" data-testid="text-library-count">{filtered.length} {filtered.length === 1 ? 'item' : 'items'}{search ? ' found' : ' saved'}</span></div>
    {!filtered.length ? <section className="panel"><Empty icon={<Library size={19} />} title={search ? 'No matching ideas' : 'A library, by your choice'} text={search ? 'Try another word or phrase.' : 'Approved study prompts will appear here. Pending cards stay on your study desk until you approve them.'} /></section> :
      <div className="library-list">{filtered.map((item) => <article className="library-card" key={item.id} data-testid={`library-item-${item.id}`}>
        <div className="library-top"><span className="verified-chip"><CheckCircle2 size={12} /> Verified · {dateLabel(item.createdAt)}</span><BookOpen size={16} color="#879b86" /></div>
        <div className="library-question" data-testid={`text-library-question-${item.id}`}>{item.question}</div>
        <div className="library-answer" data-testid={`text-library-answer-${item.id}`}>{item.answer}</div>
        <div className="library-source"><strong>From your note</strong> &nbsp;{item.sourceSentence}</div>
      </article>)}</div>}
  </main>;
}

function QuizPage({ store, setSettings, update }: { store: Store; setSettings: (patch: Partial<Settings>) => void; update: (patch: Partial<Store>) => void }) {
  const [search, setSearch] = useState('');
  const cards = useMemo(() => store.items.filter((item) => item.verified).filter((item) =>
    !search || `${item.question} ${item.answer} ${item.sourceSentence}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  ), [store.items, search]);
  const [currentId, setCurrentId] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [written, setWritten] = useState('');
  const [feedback, setFeedback] = useState<null | { correct: boolean; message: string }>(null);
  const [choice, setChoice] = useState('');
  useEffect(() => {
    if (!cards.some((item) => item.id === currentId)) setCurrentId(cards[0]?.id ?? '');
    setRevealed(false); setWritten(''); setFeedback(null); setChoice('');
  }, [currentId, cards]);
  const current = cards.find((item) => item.id === currentId) ?? cards[0];
  const mode = store.settings.quizMode;
  const answers = useMemo(() => {
    if (!current) return [];
    const wrong = cards.filter((item) => item.id !== current.id).slice(0, 3).map((item) => item.answer);
    return [...wrong, current.answer].sort((a, b) => a.localeCompare(b));
  }, [current, cards]);
  function record(correct: boolean) {
    const today = new Date().toISOString().slice(0, 10);
    const previous = store.progress.lastStudied;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    update({ progress: {
      completed: store.progress.completed + 1, correct: store.progress.correct + (correct ? 1 : 0),
      streak: previous === today ? store.progress.streak : previous === yesterday ? store.progress.streak + 1 : 1,
      lastStudied: today,
    } });
    setFeedback({ correct, message: correct ? 'That’s it. You remembered the idea.' : 'Not quite. Let the source sentence settle in, then try again.' });
  }
  function advance() {
    if (!current || cards.length < 2) { setRevealed(false); setFeedback(null); setWritten(''); return; }
    const index = cards.findIndex((item) => item.id === current.id);
    setCurrentId(cards[(index + 1) % cards.length].id); setRevealed(false); setFeedback(null); setWritten(''); setChoice('');
  }
  function chooseMode(next: QuizMode) { setSettings({ quizMode: next }); setFeedback(null); setWritten(''); setRevealed(false); setChoice(''); }
  const modes: { id: QuizMode; title: string; description: string }[] = [
    { id: 'flashcard', title: 'Flashcard', description: 'Recall, then reveal' },
    { id: 'written', title: 'Write it out', description: 'Type what you remember' },
    { id: 'choice', title: 'Pick an answer', description: 'Choose from your library' },
  ];
  return <main className="page">
    <div className="page-header"><div><div className="eyebrow">A moment of recall</div><h1 className="serif">Self-quiz</h1><p className="subhead">Practice with the knowledge you personally approved.</p></div><div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}><div className="search-wrap"><Search size={15} /><input type="search" aria-label="Filter quiz by keyword" data-testid="input-quiz-search" placeholder="Filter approved ideas…" value={search} onChange={(e) => setSearch(e.target.value)} /></div><Link href="/library" className="button button-secondary" data-testid="link-quiz-library"><Library size={15} /> Your library <ArrowRight size={14} /></Link></div></div>
    <div className="stat-row" style={{ marginBottom: 18 }}>
      <Stat label="Questions practiced" value={store.progress.completed} />
      <Stat label="Correct recalls" value={store.progress.correct} />
      <Stat label="Recall streak" value={store.progress.streak} suffix="days" />
    </div>
    <div className="quiz-layout">
      <section className="panel quiz-card" data-testid="section-quiz-card">
        {!current ? <div style={{ margin: 'auto' }}><Empty icon={<BookOpen size={19} />} title={search ? 'No matching ideas' : 'Your first question is waiting'} text={search ? 'Try another keyword or clear the filter to see your approved cards.' : 'Approve a study prompt from your desk and it will be ready to quiz.'} />{search ? <button className="button button-secondary" style={{ margin: '14px auto 0' }} onClick={() => setSearch('')} data-testid="button-clear-quiz-search">Clear filter</button> : <Link href="/" className="button button-primary" style={{ margin: '14px auto 0', width: 'fit-content' }} data-testid="link-quiz-desk"><ArrowLeft size={14} /> Back to study desk</Link>}</div> :
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span className="quiz-progress" data-testid="text-quiz-position">Question {Math.max(1, cards.findIndex((item) => item.id === current.id) + 1)} of {cards.length}</span><span className="verified-chip"><CheckCircle2 size={12} /> Approved</span></div>
            <div className="quiz-question" data-testid="text-quiz-question">{current.question}</div>
            {mode === 'flashcard' && <>
              {revealed ? <div className="quiz-feedback correct" data-testid="text-quiz-answer"><strong>From your note</strong><br />{current.answer}</div> : <p className="subhead">Take a breath and try to recall it before revealing.</p>}
              {!feedback && !revealed && <button className="button button-primary" onClick={() => setRevealed(true)} data-testid="button-reveal-answer"><Eye size={15} /> Reveal answer</button>}
              {revealed && !feedback && <div className="quiz-actions"><button className="button button-primary" onClick={() => record(true)} data-testid="button-recall-correct"><Check size={14} /> I remembered</button><button className="button button-secondary" onClick={() => record(false)} data-testid="button-recall-again"><RotateCcw size={14} /> Practice again</button></div>}
            </>}
            {mode === 'written' && <>
              <textarea className="answer-field" data-testid="input-quiz-answer" value={written} onChange={(e) => setWritten(e.target.value)} placeholder="Write what you remember…" aria-label="Write your recalled answer" disabled={!!feedback} />
              {!feedback && <button className="button button-primary" style={{ marginTop: 12, width: 'fit-content' }} onClick={() => record(normalize(written) === normalize(current.answer))} disabled={!written.trim()} data-testid="button-check-written-answer"><Check size={14} /> Check my answer</button>}
              {feedback && <div className={`quiz-feedback ${feedback.correct ? 'correct' : 'incorrect'}`} data-testid="text-written-feedback"><strong>{feedback.message}</strong><br />Source answer: {current.answer}</div>}
            </>}
            {mode === 'choice' && <>
              <div style={{ display: 'grid', gap: 8 }}>
                {answers.map((answer, index) => <button key={`${current.id}-${index}`} className={`button ${choice === answer ? 'button-primary' : 'button-secondary'}`} style={{ justifyContent: 'flex-start', textAlign: 'left', whiteSpace: 'normal', height: 'auto', minHeight: 44, padding: '11px 13px' }} onClick={() => setChoice(answer)} data-testid={`button-answer-option-${index}`}>{answer}</button>)}
              </div>
              {!feedback && <button className="button button-primary" style={{ marginTop: 12, width: 'fit-content' }} onClick={() => record(choice === current.answer)} disabled={!choice} data-testid="button-check-choice"><Check size={14} /> Check selection</button>}
              {feedback && <div className={`quiz-feedback ${feedback.correct ? 'correct' : 'incorrect'}`} data-testid="text-choice-feedback">{feedback.message}<br />Source answer: {current.answer}</div>}
            </>}
            {feedback && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginTop: 'auto', paddingTop: 20 }}><span className="fineprint">Your progress is saved on this device.</span><button className="button button-secondary" onClick={advance} data-testid="button-next-question">Next question <ArrowRight size={14} /></button></div>}
          </>}
      </section>
      <aside className="panel quiz-sidebar" data-testid="section-quiz-modes">
        <div className="panel-label">Choose your practice</div>
        <h3 style={{ font: "500 18px 'Fraunces', serif", margin: '7px 0 12px' }}>A mode for this moment</h3>
        {modes.map((item) => <button className={`mode-choice ${mode === item.id ? 'active' : ''}`} key={item.id} onClick={() => chooseMode(item.id)} data-testid={`button-quiz-mode-${item.id}`}><span><strong style={{ display: 'block', marginBottom: 3 }}>{item.title}</strong><span style={{ fontWeight: 400, color: '#87948a' }}>{item.description}</span></span>{mode === item.id && <Check size={14} />}</button>)}
        <div style={{ borderTop: '1px solid #edf0e9', marginTop: 16, paddingTop: 14 }}><div className="fineprint"><ShieldAlert size={12} style={{ display: 'inline', marginRight: 4 }} />Quiz uses only approved items. Typed answers are checked against the exact saved answer.</div></div>
      </aside>
    </div>
  </main>;
}

function SettingsPage({ store, setSettings, update, notify }: { store: Store; setSettings: (patch: Partial<Settings>) => void; update: (patch: Partial<Store>) => void; notify: (message: string) => void }) {
  const [confirmReset, setConfirmReset] = useState(false);
  function resetData() {
    if (!confirmReset) { setConfirmReset(true); return; }
    const session = store.session;
    const settings = store.settings;
    update({ notes: [], items: [], progress: { completed: 0, correct: 0, streak: 0, lastStudied: null }, settings, session });
    setConfirmReset(false); notify('Study notes, cards, and quiz progress cleared.');
  }
  return <main className="page">
    <div className="page-header"><div><div className="eyebrow">Make the space yours</div><h1 className="serif">Settings</h1><p className="subhead">A few small choices for your personal study desk.</p></div></div>
    <div className="settings-grid">
      <section className="panel">
        <div className="panel-head"><div><div className="panel-label">Your preferences</div><h2 style={{ marginTop: 6 }}>Study space</h2></div><SettingsIcon size={19} color="#849984" /></div>
        <div className="panel-body">
          <div className="setting-row"><div><div className="setting-title">Display name</div><p className="setting-desc">Shown in your welcome message and on this device.</p></div><input className="setting-control" data-testid="input-settings-name" aria-label="Display name" value={store.settings.displayName} onChange={(e) => setSettings({ displayName: e.target.value })} /></div>
          <div className="setting-row"><div><div className="setting-title">Color of your desk</div><p className="setting-desc">Choose a softer evening palette or keep the daylight theme.</p></div><div className="setting-control" style={{ display: 'flex', gap: 7 }}><button className={`button ${store.settings.theme === 'light' ? 'button-primary' : 'button-secondary'}`} onClick={() => setSettings({ theme: 'light' })} data-testid="button-theme-light"><Sun size={14} /> Daylight</button><button className={`button ${store.settings.theme === 'dark' ? 'button-primary' : 'button-secondary'}`} onClick={() => setSettings({ theme: 'dark' })} data-testid="button-theme-dark"><Moon size={14} /> Evening</button></div></div>
          <div className="setting-row"><div><div className="setting-title">Default quiz mode</div><p className="setting-desc">You can change modes any time from the quiz screen.</p></div><select className="setting-control" data-testid="select-default-quiz-mode" value={store.settings.quizMode} onChange={(e) => setSettings({ quizMode: e.target.value as QuizMode })}><option value="flashcard">Flashcard</option><option value="written">Write it out</option><option value="choice">Pick an answer</option></select></div>
        </div>
      </section>
      <div className="column-stack">
        <section className="panel">
          <div className="panel-head"><div><div className="panel-label">Your data, your device</div><h2 style={{ marginTop: 6 }}>A clear boundary</h2></div><LockKeyhole size={18} color="#849984" /></div>
          <div className="panel-body"><p className="subhead" style={{ fontSize: 12, marginBottom: 12 }}>LivingStudy runs entirely in this browser. Your notes are parsed locally, never sent to an AI or server.</p><div className="notice" style={{ marginTop: 0 }}><strong>Local demo authentication is not real account security.</strong> Data and simulated passphrase live in browser LocalStorage, which is not encrypted. Avoid entering sensitive information on a shared device.</div><button className="button button-secondary" style={{ marginTop: 13 }} onClick={() => { update({ session: { ...store.session, unlocked: false } }); notify('Study desk locked.'); }} data-testid="button-settings-lock"><LogOut size={14} /> Lock this desk</button></div>
        </section>
        <section className="panel danger-zone">
          <div className="panel-head"><div><div className="panel-label">Start fresh</div><h2 style={{ marginTop: 6 }}>Clear local study data</h2></div><Trash2 size={18} color="#a46c5e" /></div>
          <div className="panel-body"><p className="subhead" style={{ fontSize: 11, marginBottom: 14 }}>Permanently removes notes, pending and approved cards, and quiz progress. Your theme and name stay.</p><button className="button button-danger" onClick={resetData} data-testid="button-clear-local-data"><Trash2 size={14} />{confirmReset ? 'Confirm clear everything' : 'Clear study data'}</button>{confirmReset && <button className="button button-quiet" style={{ marginLeft: 8 }} onClick={() => setConfirmReset(false)} data-testid="button-cancel-clear">Keep my data</button>}</div>
        </section>
      </div>
    </div>
  </main>;
}

function NotFound() {
  return <main className="page"><div className="panel empty"><div className="empty-icon"><Search size={19} /></div><strong>That page isn’t in your study space</strong><p>Return to your desk and pick up where you left off.</p><Link href="/" className="button button-primary" style={{ margin: '15px auto 0', width: 'fit-content' }} data-testid="link-not-found-home"><ArrowLeft size={14} /> Study desk</Link></div></main>;
}

export default App;
