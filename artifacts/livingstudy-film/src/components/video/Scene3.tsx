import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Scene3() {
  const [answerVisible, setAnswerVisible] = useState(false);
  const [approved, setApproved] = useState(false);
  const [handoff, setHandoff] = useState(false);
  useSceneTimer([
    { time: 1900, callback: () => setAnswerVisible(true) },
    { time: 2850, callback: () => setApproved(true) },
    { time: 4150, callback: () => setHandoff(true) },
  ]);

  return (
    <motion.section
      className="film-scene film-grain"
      style={{ background: '#23473e', color: '#f3efe3' }}
      initial={{ opacity: 0, clipPath: 'polygon(0 0, 70% 0, 100% 50%, 70% 100%, 0 100%)' }}
      animate={{ opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      exit={{ opacity: 0, scale: 1.12, filter: 'blur(11px)' }}
      transition={{ duration: .62, ease: EASE }}
    >
      <motion.div className="film-kicker" style={{ position: 'absolute', left: '6.2%', top: '8%', color: '#a9bcac' }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .45 }}>
        02 / YOUR DECISION
      </motion.div>
      <motion.h1 className="film-headline" style={{ position: 'absolute', left: '6%', top: '17%', fontSize: '6.3vmin', width: '56%', zIndex: 2 }}
        initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ delay: .6, duration: .6, ease: EASE }}>
        Nothing is approved<br />for you.
      </motion.h1>
      <motion.div aria-hidden="true" style={{ position: 'absolute', left: '34%', top: '7%', width: '50vmin', height: '50vmin', border: '1px solid rgba(197,215,195,.27)', borderRadius: '50%', zIndex: 0 }}
        animate={{ rotate: 360, scale: [1, 1.04, 1] }} transition={{ rotate: { duration: 24, repeat: Infinity, ease: 'linear' }, scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }} />
      <div style={{ position: 'absolute', right: '9%', top: '16%', height: '66%', width: '38%', border: `1px solid ${approved ? '#85a981' : 'rgba(226,234,214,.42)'}`, borderRadius: '1.5vmin', zIndex: 1, transition: 'border-color .25s' }}>
        <div style={{ position: 'absolute', left: '-.5vmin', top: '49%', width: '2.8vmin', height: '2.8vmin', borderRadius: '50%', background: '#173b35', border: '1px solid rgba(226,234,214,.45)' }} />
        <motion.div className="film-paper" style={{ position: 'absolute', left: '-19%', top: '13%', width: '91%', minHeight: '48%', padding: '2.4vmin 2.8vmin', borderRadius: '1vmin', zIndex: 2 }}
          initial={{ opacity: 0, x: -48, rotate: -4, scale: .9 }}
          animate={approved ? { opacity: 1, x: '43%', rotate: 0, scale: .88 } : { opacity: 1, x: 0, rotate: -1, scale: 1 }}
          transition={{ duration: approved ? .85 : .7, ease: EASE }}>
          <div className="film-kicker" style={{ fontSize: '1.7vmin', color: '#9a7056' }}>EXACT SOURCE</div>
          <div style={{ font: '500 2.7vmin/1.25 var(--font-display)', marginTop: '1.5vmin' }}>A good question begins with the sentence it came from.</div>
          <motion.svg viewBox="0 0 100 12" style={{ width: '100%', height: '2vmin', marginTop: '1.2vmin' }} aria-hidden="true">
            <motion.path d="M2 7 H98" stroke="#d77e5f" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: answerVisible ? 1 : 0 }} transition={{ duration: .55, ease: EASE }} />
          </motion.svg>
        </motion.div>
        {answerVisible && (
          <motion.div className="film-paper" style={{ position: 'absolute', right: '-12%', bottom: '10%', width: '83%', minHeight: '24%', padding: '2vmin 2.3vmin', borderRadius: '1vmin', zIndex: 3 }}
            initial={{ opacity: 0, y: 20, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: .55, ease: EASE }}>
            <div className="film-kicker" style={{ fontSize: '1.6vmin', color: '#748778' }}>ANSWER MATCHES SOURCE</div>
            <motion.svg viewBox="0 0 120 24" style={{ position: 'absolute', right: '2vmin', top: '1.5vmin', width: '4vmin', height: '3vmin' }}>
              <motion.path d="M6 13l7 7L27 5" fill="none" stroke="#628961" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .15, duration: .42 }} />
            </motion.svg>
          </motion.div>
        )}
        {approved && (
          <motion.div
            style={{ position: 'absolute', left: '46%', top: '52%', width: '15vmin', height: '15vmin', borderRadius: '50%', border: '.36vmin solid #d77e5f', color: '#f0b69a', display: 'grid', placeItems: 'center', textAlign: 'center', font: '500 1.9vmin/1.2 var(--font-mono)', zIndex: 5, transform: 'translate(-50%,-50%)' }}
            initial={{ scale: 3.7, opacity: 0, rotate: -30 }}
            animate={handoff ? { scale: 3.2, opacity: 0, rotate: 14, x: '-25vw' } : { scale: [0.92, 1.05, 1], opacity: 1, rotate: 0 }}
            transition={{ duration: handoff ? .8 : .52, ease: EASE }}
          >
            YOU<br />APPROVE
          </motion.div>
        )}
      </div>
      <motion.div className="film-kicker" style={{ position: 'absolute', left: '6.2%', bottom: '16%', color: '#d77e5f', fontSize: '1.7vmin' }}
        initial={{ opacity: 0 }} animate={{ opacity: answerVisible ? 1 : 0 }} transition={{ duration: .4 }}>
        ONLY EXPLICIT APPROVAL
      </motion.div>
      {approved && <motion.p className="film-caption" style={{ position: 'absolute', left: '6.2%', bottom: '9%', color: '#c1d1bd' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1 }} transition={{ duration: .4 }}>
        Only then: verified.
      </motion.p>}
      <motion.div style={{ position: 'absolute', right: '10%', top: '78%', height: '.22vmin', width: '28%', background: '#d77e5f', transformOrigin: 'left', zIndex: 5 }}
        animate={handoff ? { scaleX: 1, width: '120%', x: '-42vw', y: '8vh' } : { scaleX: approved ? 1 : 0 }}
        transition={{ duration: .65, ease: EASE }} />
    </motion.section>
  );
}
