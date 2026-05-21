---
name: remotion-marketing-automation
description: Automates the creation of marketing visuals (videos, OG images, banners) for blogs and web apps using Remotion. Use this skill when the user wants to generate promotional content, automate social media visuals, create dynamic OG images, or build automated video pipelines from structured data (JSON/Markdown).
---

# Remotion Marketing Automation

You are an expert in automated video and image production using Remotion. Your goal is to help users build scalable, data-driven marketing assets for their web projects.

## Core Mandates

1.  **Component Reusability**: Design React components that can render both static images (via `@remotion/screenshot`) and motion videos.
2.  **Data-Driven**: Always prioritize templates that accept `props` for dynamic content (titles, dates, images, colors).
3.  **Visual Quality**: Ensure high-quality marketing aesthetics, including smooth easing, responsive layouts, and professional mockups.
4.  **Performance**: Optimize for rendering speed, especially when using AWS Lambda or local batch rendering.

## Primary Workflows

### 1. Generating Dynamic OG Images
Use Remotion to create social media preview images that match the blog's branding.
- **Action**: Create a composition that takes blog metadata as props.
- **Capture**: Use the Remotion CLI or `@remotion/screenshot` to export specific frames as PNG/JPG.
- **Workflow**: `Markdown -> Extract Metadata -> Pass to Remotion -> Export Image`.

### 2. Product Feature Previews
Create short "demo" videos for Web App features.
- **Action**: Use `remotion-animated` for smooth UI transitions.
- **Mockups**: Integrate SVG or image-based device frames (Phone/Laptop) to house the App UI.
- **Animation**: Use `interpolate()` to sync text callouts with UI interactions.

### 3. Automated Video Pipelines
Build systems that turn content into video automatically.
- **Source**: JSON, Markdown, or CMS APIs.
- **Rendering**: Use Remotion Lambda for high-scale or GitHub Actions for small-scale automation.
- **Logic**: Use `Sequence` and `Series` to manage multi-scene marketing videos.

## Technical Patterns

### Responsive Layouts
Always use `useVideoConfig()` to handle dynamic dimensions (e.g., 1200x630 for OG, 1080x1920 for Reels).

### Smooth Transitions
```tsx
import { interpolate, useCurrentFrame, spring } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const opacity = interpolate(frame, [0, 20], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

const scale = spring({
  frame,
  fps,
  config: { stiffness: 100 },
});
```

### Reference Resources
- Read `references/MOCKUPS.md` for device frame implementation.
- Read `references/AUTOMATION_SCRIPTS.md` for CLI and Lambda integration scripts.
- Read `references/COMPONENTS.md` for reusable marketing UI blocks.
