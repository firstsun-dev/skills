# Reusable Marketing UI Components

## Text Reveal with Spring
Professional-looking entrance for titles.

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const SpringTitle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <h1 style={{ transform: `scale(${scale})`, fontSize: 80, textAlign: 'center' }}>
      {text}
    </h1>
  );
};
```

## Cursor Overlay
For App feature demos, show where the "user" is clicking.

```tsx
export const Cursor: React.FC<{ x: number, y: number }> = ({ x, y }) => {
  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 30,
      height: 30,
      backgroundColor: 'rgba(255, 0, 0, 0.5)',
      borderRadius: '50%',
      border: '2px solid white',
      pointerEvents: 'none'
    }} />
  );
};
```

## Progress Bar
Keep the audience engaged by showing video progress.

```tsx
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      height: 10,
      backgroundColor: '#3b82f6',
      width: `${progress * 100}%`
    }} />
  );
};
```
