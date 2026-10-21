import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Scene4() {
  const [queryVisible, setQueryVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [invert, setInvert] = useState(false);
  const [handoff, setHandoff] = useState(false);
  useSceneTimer([
    { time: 650, callback: () => setQueryVisible(true) },
    { time: 1950, callback: () => setExpanded(true) },
    { time: 3050, callback: () => setAnswerVisible(true) },
    { time: 3650, callback: () => setInvert(true) },
    { time: 4250, callback: () => setHandoff(true) },
  ]);

  return (
    <motion.section
      className="film-scene"
      style={{ background: invert ? '#173b35' : '#dce8d8', color: invert ? '#f3efe3' : '#23473e' }}
      initial={{ opacity: 0, scale: 1.12, filter: 'blur(9px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: .93, rotateY: 9 }}
      transition={{ duration: .72, ease: EASE, backgroundColor: { duration: .3 } }}
    >
      <motion.div className="film-kicker" style={{ position: 'absolute', left: '7%', top: '9%', color: invert ? '#a9bcac' : '#748778' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}>
        MASTER LIBRARY
      </motion.div>
      <motion.div
        style={{ position: 'absolute', left: '7%', right: '7%', top: '20%', height: '9%', borderRadius: '1.5vmin', border: `1px solid ${invert ? 'rgba(243,239,227,.35)' : 'rgba(35,71,62,.23)'}`, padding: '0 2.2vmin', display: 'flex', alignItems: 'center', gap: '1.5vmin', zIndex: 2 }}
        initial={{ scaleX: 0, transformOrigin: 'left' }} animate={{ scaleX: 1 }} transition={{ duration: .65, ease: EASE }}
      >
        <motion.div style={{ width: '1.4vmin', height: '1.4vmin', borderRadius: '50%', border: `1px solid ${invert ? '#c9d5c2' : '#718277'}` }} animate={handoff ? { scale: 5, x: '35vw', y: '32vh' } : { scale: 1 }} transition={{ duration: .85, ease: EASE }} />
        {queryVisible && <motion.span className="film-mono" style={{ fontSize: '2.1vmin', letterSpacing: '.05em' }} initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} transition={{ duration: .45 }}>sentence</motion.span>}
        <motion.span className="film-kicker" style={{ marginLeft: 'auto', fontSize: '1.55vmin', opacity: .65 }}>VERIFIED ONLY</motion.span>
      </motion.div>
      <motion.div style={{ position: 'absolute', left: '12%', top: '38%', width: '63%', height: '46%', display: 'grid', gap: '1.1vmin', alignContent: 'start', zIndex: 1 }}
        animate={handoff ? { x: '18vw', y: '-9vh', scale: 1.15, rotate: -3, opacity: .6 } : { x: 0, y: 0, scale: 1 }}>
        {[0, 1, 2].map((row, idx) => (
          <motion.div key={row} style={{ height: expanded && row === 0 ? '22vmin' : '8.2vmin', border: `1px solid ${invert ? 'rgba(221,233,215,.32)' : 'rgba(35,71,62,.22)'}`, borderRadius: '1vmin', display: 'flex', alignItems: 'center', padding: '0 2vmin', background: invert ? 'rgba(243,239,227,.06)' : 'rgba(248,245,235,.55)', transformOrigin: '0 0', overflow: 'hidden' }}
            initial={{ opacity: 0, x: -24, rotateY: -8 }} animate={expanded && row === 0 ? { opacity: 1, x: 0, rotateY: 0, height: '22vmin', scale: handoff ? 3.2 : 1, filter: handoff ? 'blur(8px)' : 'blur(0px)' } : { opacity: 1, x: 0, rotateY: 0, height: '8.2vmin' }}
            transition={{ duration: .55, delay: idx * .17, ease: EASE }}>
            <div style={{ width: '.55vmin', alignSelf: 'stretch', background: idx === 0 ? '#d77e5f' : (invert ? '#7e9e81' : '#88a082'), marginRight: '1.6vmin' }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ font: '500 2.2vmin/1.1 var(--font-display)', whiteSpace: 'nowrap', opacity: idx === 2 ? .65 : 1 }}>{idx === 0 ? 'A good question begins with…' : idx === 1 ? 'One sentence, one prompt.' : 'Keep the source close.'}</div>
              {expanded && idx === 0 && <motion.div style={{ marginTop: '1.5vmin', font: '500 2.6vmin/1.2 var(--font-display)' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 }}>
                What is the key point in this sentence?
              </motion.div>}
            </div>
            <div className="film-kicker" style={{ fontSize: '1.35vmin', color: invert ? '#bbd1b5' : '#628165', marginLeft: '1vmin' }}>VERIFIED</div>
          </motion.div>
        ))}
      </motion.div>
      {answerVisible && (
        <motion.div
          className="film-paper"
          style={{ position: 'absolute', right: '8%', bottom: '11%', width: '47%', minHeight: '25%', padding: '2.2vmin 2.7vmin', borderRadius: '1vmin', zIndex: 5, transformOrigin: '50% 0' }}
          initial={{ opacity: 0, rotateY: -16, y: 12, scale: .9 }}
          animate={handoff ? { opacity: 0, rotateY: 0, y: -35, scale: 1.05 } : { opacity: 1, rotateY: 0, y: 0, scale: 1 }}
          transition={{ duration: .58, ease: EASE }}
        >
          <div className="film-kicker" style={{ color: '#8f9d8b', fontSize: '1.55vmin' }}>ANSWER</div>
          <div style={{ font: '500 2.45vmin/1.24 var(--font-display)', marginTop: '1.25vmin' }}>A good question begins with the sentence it came from.</div>
          <motion.div className="film-rule" style={{ color: '#91a88f', marginTop: '1.5vmin' }} initial={{ scaleX: 0 }} animate={{ scaleX: handoff ? 1 : 1 }} transition={{ duration: .4 }} />
        </motion.div>
      )}
      <motion.div className="film-kicker" style={{ position: 'absolute', left: '12%', bottom: '10%', display: 'flex', gap: '2.1vmin', fontSize: '1.75vmin', color: invert ? '#c2d2bd' : '#6e8172' }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: invert ? 1 : 0, y: invert ? 0 : 12 }} transition={{ duration: .4 }}>
        <span>FLASHCARD</span><span>·</span><span>WRITTEN</span><span>·</span><span>MULTIPLE CHOICE</span>
      </motion.div>
    </motion.section>
  );
}
