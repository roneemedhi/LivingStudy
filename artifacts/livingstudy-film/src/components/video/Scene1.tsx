import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Scene1() {
  const [sourceVisible, setSourceVisible] = useState(false);
  const [handoff, setHandoff] = useState(false);
  useSceneTimer([
    { time: 2450, callback: () => setSourceVisible(true) },
    { time: 4050, callback: () => setHandoff(true) },
  ]);

  return (
    <motion.section
      className="film-scene film-grain"
      style={{ background: '#173b35', color: '#f4f0e5' }}
      initial={{ opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.14, filter: 'blur(10px)' }}
      transition={{ duration: 0.72, ease: EASE }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: .16, backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 7.5vmin, rgba(241,238,223,.22) 7.55vmin 7.62vmin)' }} />
      <div style={{ position: 'absolute', left: '4.8%', top: '22%', width: '48%', zIndex: 2 }}>
        <motion.h1
          className="film-headline"
          style={{ fontSize: '9.2vmin', position: 'relative', zIndex: 1 }}
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: .65, delay: .34, ease: EASE }}
        >
          REMEMBER
        </motion.h1>
        <motion.div
          className="film-headline"
          style={{ fontSize: '8.1vmin', marginTop: '.7vmin', color: '#d9e1cf' }}
          initial={{ opacity: 0, scale: .96, x: -20 }}
          animate={{ opacity: 1, scale: [1, 1.035, 1], x: 0 }}
          transition={{ duration: .6, delay: .8, ease: EASE }}
        >
          WHAT MATTERS.
        </motion.div>
        <motion.p
          className="film-kicker"
          style={{ margin: '4.2vmin 0 0', color: '#a9bcac', fontSize: '1.85vmin' }}
          initial={{ opacity: 0, letterSpacing: '.19em' }}
          animate={{ opacity: 1, letterSpacing: '.12em' }}
          transition={{ duration: .62, delay: 1.55, ease: EASE }}
        >
          A STUDY SPACE BUILT AROUND YOUR OWN WORDS
        </motion.p>
      </div>

      <motion.div
        aria-hidden="true"
        style={{ position: 'absolute', right: '7%', top: '-11%', width: '41%', height: '94%', zIndex: 1 }}
        initial={{ rotate: -8, scale: .92 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <svg viewBox="0 0 440 700" width="100%" height="100%" fill="none">
          <path d="M104 240c0-112 70-184 172-184 96 0 160 65 160 153 0 72-40 116-110 160-47 30-61 54-61 99" stroke="#d77e5f" strokeWidth="24" strokeLinecap="round" />
          <path d="M106 240c0-112 70-184 172-184 96 0 160 65 160 153" stroke="#f3c1a7" strokeWidth="2" strokeDasharray="2 16" opacity=".74" />
        </svg>
      </motion.div>
      <motion.div
        style={{ position: 'absolute', left: '72.2%', top: '68%', width: '5.3vmin', height: '5.3vmin', borderRadius: '50%', background: '#d77e5f', zIndex: 5, boxShadow: '0 0 0 1.1vmin rgba(215,126,95,.13)' }}
        animate={handoff ? { left: '52%', top: '68%', scale: 4.3, opacity: [1, 1, 0] } : { y: [0, -5, 0] }}
        transition={handoff ? { duration: .95, ease: EASE } : { duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
      />
      <AnimatePresence>
        {sourceVisible && (
          <motion.div
            key="source-sentence"
            style={{ position: 'absolute', right: '6.5%', bottom: '13%', width: '40%', color: '#f4f0e5', font: '500 2.8vmin/1.28 var(--font-display)', zIndex: 4 }}
            initial={{ opacity: 0, y: 22, clipPath: 'inset(100% 0 0 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: .65, ease: EASE }}
          >
            <span style={{ display: 'block', color: '#d77e5f', font: '500 1.6vmin var(--font-mono)', letterSpacing: '.1em', marginBottom: '1.2vmin' }}>ONE THOUGHT, KEPT CLOSE</span>
            A good question begins with the sentence it came from.
            <motion.div className="film-rule" style={{ marginTop: '1.8vmin', width: '100%', color: '#b9c9b6' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .25, duration: .6, ease: EASE }} />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="film-kicker" style={{ position: 'absolute', top: '7%', right: '6%', color: '#8fa998', fontSize: '1.7vmin' }} initial={{ opacity: 0 }} animate={{ opacity: .9 }} transition={{ delay: .3 }}>
        LIVINGSTUDY / 01
      </motion.div>
    </motion.section>
  );
}
