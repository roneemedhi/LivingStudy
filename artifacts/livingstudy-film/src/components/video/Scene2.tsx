import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';

const EASE = [0.22, 1, 0.36, 1] as const;
const sentence = 'A good question begins with the sentence it came from.';

export function Scene2() {
  const [promptVisible, setPromptVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [handoff, setHandoff] = useState(false);
  useSceneTimer([
    { time: 2150, callback: () => setPromptVisible(true) },
    { time: 3350, callback: () => setReviewVisible(true) },
    { time: 4050, callback: () => setHandoff(true) },
  ]);

  return (
    <motion.section
      className="film-scene"
      style={{ background: '#f3efe3', color: '#24443a' }}
      initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
      animate={{ opacity: 1, clipPath: 'inset(0 0 0 0%)' }}
      exit={{ opacity: 0, scale: 1.12, filter: 'blur(8px)' }}
      transition={{ duration: .62, ease: EASE }}
    >
      <motion.div
        style={{ position: 'absolute', inset: '9% 6%', borderTop: '1px solid rgba(42,71,57,.2)', borderBottom: '1px solid rgba(42,71,57,.2)' }}
        initial={{ scaleX: 0, transformOrigin: 'left' }}
        animate={{ scaleX: 1 }}
        transition={{ duration: .7, ease: EASE }}
      />
      <motion.div className="film-kicker" style={{ position: 'absolute', left: '7%', top: '12%', color: '#718277' }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .45 }}>
        01 / CAPTURE
      </motion.div>
      <motion.div
        className="film-paper"
        style={{ position: 'absolute', top: '21%', left: '7%', width: '84%', minHeight: '22%', padding: '3.1vmin 4vmin 3.5vmin', borderRadius: '1.2vmin', zIndex: 3, transformOrigin: '12% 100%' }}
        initial={{ opacity: 0, y: -18, rotateX: -8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: .18, duration: .7, ease: EASE }}
      >
        <div className="film-kicker" style={{ fontSize: '1.7vmin', color: '#9a7056', marginBottom: '1.6vmin' }}>SOURCE NOTE · ILLUSTRATIVE COPY</div>
        <div style={{ font: '500 4.15vmin/1.18 var(--font-display)', maxWidth: '88%' }}>{sentence}</div>
        <motion.div className="film-rule" style={{ color: '#d77e5f', height: '.34vmin', position: 'absolute', left: '0', bottom: 0 }}
          initial={{ width: '3%', scaleX: .1 }} animate={handoff ? { width: '94%', scaleX: 1, x: '1vw', y: '21vh', rotate: -13 } : { width: '46%', scaleX: 1 }}
          transition={{ duration: handoff ? .9 : .75, ease: EASE }} />
      </motion.div>
      <motion.div
        style={{ position: 'absolute', left: '7%', top: '57%', color: '#9caa9d', font: '500 16vmin/.8 var(--font-display)', letterSpacing: '-.08em', zIndex: 0 }}
        initial={{ opacity: 0, x: -26 }} animate={{ opacity: .58, x: 0 }} transition={{ delay: .4, duration: .65, ease: EASE }}
      >
        01
      </motion.div>
      <motion.div
        style={{ position: 'absolute', left: '13%', top: '64%', zIndex: 2, color: '#718277' }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: .45 }}
      >
        <div className="film-kicker" style={{ fontSize: '1.8vmin' }}>ONE SENTENCE</div>
        <div style={{ font: '500 2.35vmin/1.3 var(--font-display)', marginTop: '1.2vmin' }}>Exact words stay connected<br />to their source.</div>
      </motion.div>

      {promptVisible && (
        <motion.div
          className="film-paper film-card-shadow"
          style={{ position: 'absolute', right: '8%', bottom: '8%', width: '47%', minHeight: '34%', padding: '2.6vmin 3vmin 2.3vmin', border: '1px solid #d8d9cb', borderRadius: '1.2vmin', zIndex: 5, transformOrigin: '0% 0%' }}
          initial={{ opacity: 0, rotateY: 12, rotateZ: -2, scale: .86, x: 42 }}
          animate={handoff ? { opacity: 1, rotateY: 0, rotateZ: -1, scale: 3.2, x: '-4vw', y: '-9vh', filter: 'blur(8px)' } : { opacity: 1, rotateY: 0, rotateZ: -1, scale: 1, x: 0, y: 0 }}
          transition={{ duration: handoff ? .83 : .78, ease: EASE }}
        >
          <div className="film-kicker" style={{ fontSize: '1.8vmin', color: '#9a7056' }}>REVIEW PROMPT</div>
          <div style={{ font: '500 3.4vmin/1.14 var(--font-display)', marginTop: '1.55vmin', maxWidth: '95%' }}>What is the key point in this sentence?</div>
          <motion.div className="film-rule" style={{ color: '#c0ccba', marginTop: '2.1vmin', width: '100%' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .3, duration: .6, ease: EASE }} />
          {reviewVisible && <motion.div className="film-kicker" style={{ color: '#a87753', fontSize: '1.7vmin', marginTop: '1.65vmin', display: 'flex', alignItems: 'center', gap: '.8vmin' }} initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .35 }}>
            <span style={{ width: '.8vmin', height: '.8vmin', borderRadius: '50%', background: '#d77e5f' }} /> PENDING REVIEW
          </motion.div>}
        </motion.div>
      )}
      <motion.div className="film-kicker" style={{ position: 'absolute', top: '12%', right: '7%', color: '#718277', fontSize: '1.7vmin' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>
        SOURCE-ANCHORED / LOCAL
      </motion.div>
      <motion.div style={{ position: 'absolute', right: '6%', top: '52%', width: '1.25vmin', height: '1.25vmin', borderRadius: '50%', background: '#d77e5f', zIndex: 6 }}
        animate={handoff ? { scale: [1, 3.2, 0], x: '-24vw', y: '25vh' } : { scale: [1, 1.25, 1] }}
        transition={handoff ? { duration: .9, ease: EASE } : { duration: 1.4, repeat: Infinity }} />
    </motion.section>
  );
}
