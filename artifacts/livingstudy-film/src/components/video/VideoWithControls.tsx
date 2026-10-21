import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ChevronDown, ChevronUp, Pause, Play, Repeat, Volume2, VolumeX } from 'lucide-react';
import { SCENE_DURATIONS } from './VideoTemplate';
import { SCENE_DETAILS } from './sceneMeta';
import { useSceneControls } from './useSceneControls';
import VideoTemplate from './VideoTemplate';

const PROGRESS_TICK_MS = 60;

function announceSceneSelection(index: number, sceneKeys: string[]) {
  const key = sceneKeys[index];
  const details = SCENE_DETAILS[key];
  if (!details?.filePath) return;
  window.parent.postMessage({
    type: 'REPLIT_VIDEO_SCENE_SELECTED',
    payload: {
      sceneIndex: index,
      sceneCount: sceneKeys.length,
      sceneTitle: details.title || key,
      filePath: details.filePath,
      lineNumber: 1,
    },
  }, '*');
}

export default function VideoWithControls() {
  const isIframed = typeof window !== 'undefined' && window.self !== window.top;
  const [muted, setMuted] = useState(false);
  const sensorRef = useRef<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tapPinned, setTapPinned] = useState(false);
  const {
    sceneKeys, activeIndex, locked, paused, mountKey, tick,
    durations, activeDuration, activeStartTime, totalDuration,
    onSceneChange, jumpTo, toggleLock, togglePause,
  } = useSceneControls(SCENE_DURATIONS);

  const handleJumpTo = useCallback((index: number) => {
    jumpTo(index);
    announceSceneSelection(index, sceneKeys);
  }, [jumpTo, sceneKeys]);

  const handlePointerEnter = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setHovering(true);
  }, []);
  const handlePointerLeave = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setHovering(false);
  }, []);
  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' && collapsed) setTapPinned(true);
  }, [collapsed]);
  const handleToggleCollapsed = useCallback(() => {
    setCollapsed((current) => {
      if (!current) { setHovering(false); setTapPinned(false); }
      return !current;
    });
  }, []);

  useEffect(() => {
    if (!(collapsed && tapPinned)) return;
    const onDocumentPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      if (sensorRef.current && !sensorRef.current.contains(event.target as Node)) setTapPinned(false);
    };
    document.addEventListener('pointerdown', onDocumentPointerDown);
    return () => document.removeEventListener('pointerdown', onDocumentPointerDown);
  }, [collapsed, tapPinned]);

  useEffect(() => {
    if (!paused) return;
    const frozen = document.getAnimations().filter((animation) => animation.playState === 'running');
    frozen.forEach((animation) => animation.pause());
    return () => frozen.forEach((animation) => animation.play());
  }, [paused]);

  if (!isIframed) return <VideoTemplate />;

  const barVisible = !collapsed || hovering || tapPinned;
  return (
    <div className="relative w-full h-screen">
      <VideoTemplate
        key={mountKey}
        durations={durations}
        loop
        paused={paused}
        muted={muted}
        onSceneChange={onSceneChange}
      />
      <div
        ref={sensorRef}
        className="absolute bottom-0 left-0 right-0 z-50 flex flex-col justify-end"
        style={{ height: '25%' }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        <div className="flex-1 w-full" aria-hidden="true" />
        <ControlBar
          visible={barVisible}
          collapsed={collapsed}
          locked={locked}
          paused={paused}
          muted={muted}
          sceneKeys={sceneKeys}
          activeIndex={activeIndex}
          activeDuration={activeDuration}
          activeStartTime={activeStartTime}
          totalDuration={totalDuration}
          tick={tick}
          onTogglePause={togglePause}
          onToggleLock={toggleLock}
          onToggleMute={() => setMuted((value) => !value)}
          onJumpTo={handleJumpTo}
          onToggleCollapsed={handleToggleCollapsed}
        />
      </div>
    </div>
  );
}

interface ControlBarProps {
  visible: boolean;
  collapsed: boolean;
  locked: boolean;
  paused: boolean;
  muted: boolean;
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  activeStartTime: number;
  totalDuration: number;
  tick: number;
  onTogglePause: () => void;
  onToggleLock: () => void;
  onToggleMute: () => void;
  onJumpTo: (index: number) => void;
  onToggleCollapsed: () => void;
}

function ControlBar({
  visible, collapsed, locked, paused, muted, sceneKeys, activeIndex,
  activeDuration, activeStartTime, totalDuration, tick, onTogglePause,
  onToggleLock, onToggleMute, onJumpTo, onToggleCollapsed,
}: ControlBarProps) {
  const iconButton = 'flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-white/65 transition-colors hover:bg-white/10 hover:text-white';
  return (
    <div
      className={`flex items-center gap-3 border-t border-white/10 bg-[#132821]/85 px-5 py-4 text-white backdrop-blur-md transition-all duration-200 ease-out ${visible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'}`}
      aria-hidden={!visible}
    >
      <button onClick={onTogglePause} className={iconButton} title={paused ? 'Play' : 'Pause'} aria-label={paused ? 'Play' : 'Pause'}>
        {paused ? <Play className="h-8 w-8" /> : <Pause className="h-8 w-8" />}
      </button>
      <button
        onClick={onToggleLock}
        className={`${iconButton} ${locked ? 'bg-white/15 text-white' : ''}`}
        title={locked ? 'Loop current scene: on' : 'Loop current scene: off'}
        aria-label={locked ? 'Loop current scene: on' : 'Loop current scene: off'}
        aria-pressed={locked}
      >
        <Repeat className="h-8 w-8" />
      </button>
      <button onClick={onToggleMute} className={iconButton} title={muted ? 'Unmute audio' : 'Mute audio'} aria-label={muted ? 'Unmute audio' : 'Mute audio'} aria-pressed={muted}>
        {muted ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
      </button>
      <div className="w-px self-stretch bg-white/15" aria-hidden="true" />
      <PlaybackStatus
        sceneKeys={sceneKeys}
        activeIndex={activeIndex}
        activeDuration={activeDuration}
        activeStartTime={activeStartTime}
        totalDuration={totalDuration}
        tick={tick}
        paused={paused}
        onJumpTo={onJumpTo}
      />
      <button onClick={onToggleCollapsed} className={iconButton} title={collapsed ? 'Show controls' : 'Hide controls'} aria-label={collapsed ? 'Show controls' : 'Hide controls'} aria-expanded={!collapsed}>
        {collapsed ? <ChevronUp className="h-10 w-10" /> : <ChevronDown className="h-10 w-10" />}
      </button>
    </div>
  );
}

function PlaybackStatus({
  sceneKeys, activeIndex, activeDuration, activeStartTime, totalDuration, tick, paused, onJumpTo,
}: {
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  activeStartTime: number;
  totalDuration: number;
  tick: number;
  paused: boolean;
  onJumpTo: (index: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const elapsedBaseRef = useRef(0);

  useEffect(() => {
    setElapsed(0);
    elapsedBaseRef.current = 0;
  }, [tick]);
  useEffect(() => {
    if (paused) return;
    const start = performance.now();
    const timer = window.setInterval(() => {
      setElapsed(elapsedBaseRef.current + (performance.now() - start));
    }, PROGRESS_TICK_MS);
    return () => {
      window.clearInterval(timer);
      elapsedBaseRef.current += performance.now() - start;
    };
  }, [tick, paused]);

  const progress = activeDuration > 0 ? Math.min(1, elapsed / activeDuration) : 0;
  const totalElapsed = Math.min(totalDuration, activeStartTime + Math.min(elapsed, activeDuration));
  return (
    <>
      <div className="flex flex-1 items-center gap-1.5">
        {sceneKeys.map((key, index) => (
          <button
            key={key}
            onClick={() => onJumpTo(index)}
            className="relative min-h-[12px] h-3 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/20 transition-all hover:h-4 hover:bg-white/25"
            aria-label={`Jump to scene ${index + 1}: ${SCENE_DETAILS[key]?.title ?? key}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          >
            <span className="absolute inset-y-0 left-0 rounded-full bg-[#e5e8d8] transition-[width] duration-100" style={{ width: `${index < activeIndex ? 100 : index === activeIndex ? progress * 100 : 0}%` }} />
          </button>
        ))}
      </div>
      <div className="shrink-0 font-mono text-xl tabular-nums text-white/65">{activeIndex + 1}/{sceneKeys.length}</div>
      <div className="min-w-[11ch] shrink-0 text-right font-mono text-xl tabular-nums text-white/80" role="timer" aria-label={`Playback time ${formatTime(totalElapsed)} of ${formatTime(totalDuration)}`}>
        {formatTime(totalElapsed)} / {formatTime(totalDuration)}
      </div>
    </>
  );
}

function formatTime(durationMs: number) {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  return `${Math.floor(totalSeconds / 60)}:${(totalSeconds % 60).toString().padStart(2, '0')}`;
}
