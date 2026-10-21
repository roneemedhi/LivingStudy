import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';

const EASE = [0.22, 1, 0.36, 1] as const;
const WORDS = ['CAPTURE.', 'REVIEW.', 'RECALL.'];

export function Scene5() {
  const [word, setWord] = useState(-1);
  const [mark, setMark] = useState(false);
  const [handoff, setHandoff] = useState(false);
  useSceneTimer([
    { time: 250, callback: () => setWord(0) },
    { time: 720, callback: () => setWord(1) },
    { time: 1180, callback: () => setWord(2) },
    { time: 1850, callback: () => setMark(true) },
    { time: 4100, callback: () => setHandoff(true) },
  ]);

  return (
    <motion.section
      className="film-scene film-grain"
      style={{ background: '#173b35', color: '#f3efe3' }}
      initial={{ opacity: 0, backgroundColor: '#dce8d8' }}
      animate={{ opacity: 1, backgroundColor: '#173b35' }}
      exit={{ opacity: 0 }}
      transition={{ duration: .42, ease: EASE }}
    >
      <motion.div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 51% 48%, rgba(85,117,89,.27), transparent 43%)' }} />
      <AnimatePresence mode="sync">
        {word >= 0 && !mark && (
          <motion.div
            key={word}
            className="film-headline"
            style={{ position: 'absolute', top: '10%', left: '5%', width: '90%', textAlign: 'center', fontSize: '23vmin', color: '#f3efe3', whiteSpace: 'nowrap', zIndex: 4 }}
            initial={{ opacity: 0, scale: .78, y: 16, filter: 'blur(7px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.18, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: .34, ease: EASE }}
          >
            {WORDS[word]}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ position: 'absolute', left: '50%', top: '44%', width: '56vmin', height: '56vmin', marginLeft: '-28vmin', marginTop: '-28vmin', zIndex: 2 }}
        initial={{ scale: .4, opacity: 0, rotate: -12 }}
        animate={mark ? (handoff ? { scale: .58, opacity: 1, x: '-17vw', y: '-3vh', rotate: -28 } : { scale: 1, opacity: 1, rotate: 0 }) : { scale: .4, opacity: 0, rotate: -12 }}
        transition={{ duration: handoff ? .9 : .8, ease: EASE }}
      >
        <svg viewBox="0 0 600 600" width="100%" height="100%" fill="none" aria-label="LivingStudy leaf mark">
          <motion.path d="M300 510C134 456 76 334 144 209 196 114 308 81 446 95 456 242 420 350 335 426 308 450 278 463 245 467" stroke="#e7eddb" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: mark ? 1 : 0 }} transition={{ duration: 1.1, ease: EASE }} />
          <motion.path d="M159 225C248 251 331 315 378 393M228 148C270 234 295 327 300 447M380 127C356 205 333 282 310 360" stroke="#9db89b" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: mark ? 1 : 0 }} transition={{ duration: 1, delay: .25, ease: EASE }} />
          <motion.circle cx="300" cy="510" r="13" fill="#d77e5f" initial={{ scale: 0 }} animate={{ scale: mark ? 1 : 0 }} transition={{ delay: .8, duration: .3 }} />
        </svg>
      </motion.div>
      <motion.div
        className="film-headline"
        style={{ position: 'absolute', top: '22%', left: '0', width: '100%', textAlign: 'center', fontSize: '7.8vmin', zIndex: 5 }}
        initial={{ opacity: 0, clipPath: 'inset(0 50% 0 50%)' }}
        animate={mark ? { opacity: 1, clipPath: 'inset(0 0% 0 0%)' } : { opacity: 0, clipPath: 'inset(0 50% 0 50%)' }}
        transition={{ duration: .62, ease: EASE }}
      >
        LivingStudy
      </motion.div>
      <motion.p className="film-caption" style={{ position: 'absolute', top: '73%', left: 0, width: '100%', textAlign: 'center', fontSize: '3.2vmin', color: '#dbe3d4', zIndex: 5 }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: mark && !handoff ? 1 : 0, y: mark && !handoff ? 0 : 10 }} transition={{ delay: .18, duration: .5 }}>
        Keep what you can recall.
      </motion.p>
      <motion.div className="film-kicker" style={{ position: 'absolute', top: '81%', width: '100%', textAlign: 'center', fontSize: '1.85vmin', color: '#9db49d', zIndex: 5 }}
        initial={{ opacity: 0 }} animate={{ opacity: mark && !handoff ? 1 : 0 }} transition={{ delay: .3, duration: .5 }}>
        YOUR NOTES. YOUR APPROVAL. YOUR PRACTICE.
      </motion.div>
      <motion.div
        style={{ position: 'absolute', left: '49.2%', top: '69%', width: '2.6vmin', height: '2.6vmin', borderRadius: '50%', background: '#d77e5f', zIndex: 6 }}
        animate={handoff ? { left: '72.2%', top: '68%', scale: 2.04 } : { scale: mark ? 1 : 0 }}
        transition={{ duration: handoff ? .76 : .32, ease: EASE }}
      />
      <motion.div style={{ position: 'absolute', left: '51%', top: '62%', width: '21vmin', height: '19vmin', border: '1px solid rgba(215,126,95,.6)', borderRadius: '50%', transform: 'rotate(-34deg)', zIndex: 1 }}
        animate={handoff ? { left: '69%', top: '12%', width: '39vmin', height: '85vmin', rotate: 3, opacity: .9 } : { opacity: mark ? .55 : 0 }}
        transition={{ duration: .9, ease: EASE }} />
    </motion.section>
  );
}
