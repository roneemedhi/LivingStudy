// Optional scene metadata for Replit workspace integrations. When the
// workspace's scene controls are enabled for this project, a viewer's click on
// a scene segment scopes their next chat request to that scene's source file.
// Fill one entry per SCENE_DURATIONS key in VideoTemplate.tsx only when a
// skill reference asks for it; otherwise leave the map empty. Scenes missing
// from the map still play and can be jumped to.
//
// Example:
//   export const SCENE_DETAILS: Record<string, SceneDetails> = {
//     open: { title: 'Intro', filePath: 'src/components/video/video_scenes/Scene1.tsx' },
//   };

export interface SceneDetails {
  title: string;
  filePath: string;
}

export const SCENE_DETAILS: Record<string, SceneDetails> = {
  opening: { title: 'Remember what matters', filePath: 'src/components/video/Scene1.tsx' },
  capture: { title: 'From sentence to prompt', filePath: 'src/components/video/Scene2.tsx' },
  approval: { title: 'Approval is yours', filePath: 'src/components/video/Scene3.tsx' },
  recall: { title: 'Search and recall', filePath: 'src/components/video/Scene4.tsx' },
  resolve: { title: 'Keep what you can recall', filePath: 'src/components/video/Scene5.tsx' },
};
