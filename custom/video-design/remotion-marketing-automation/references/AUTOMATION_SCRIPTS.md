# Automation Scripts for Remotion Marketing

## CLI Batch Rendering
Generate OG images for all blog posts.

```bash
# Render a specific frame as an image
npx remotion render src/index.ts MyOGImage out/post-1.png --props='{"title": "My Blog Post", "author": "Tianyao"}' --frame=30
```

## Node.js Batch Script
Automate the pipeline.

```javascript
const { bundle } = require("@remotion/bundler");
const { renderStill, getCompositions } = require("@remotion/renderer");
const path = require("path");

const start = async () => {
  const bundled = await bundle(path.join(__dirname, "./src/index.ts"));
  const comps = await getCompositions(bundled);
  const composition = comps.find((c) => c.id === "OGImage");

  const blogPosts = [
    { id: "post-1", title: "React Tips" },
    { id: "post-2", title: "Remotion Guide" },
  ];

  for (const post of blogPosts) {
    await renderStill({
      composition,
      serveUrl: bundled,
      output: `out/${post.id}.png`,
      inputProps: { title: post.title },
      frame: 0,
    });
    console.log(`Rendered ${post.id}`);
  }
};

start();
```

## GitHub Actions Workflow
Automatically generate visuals on every commit.

```yaml
jobs:
  render:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx remotion render MyVideo out/video.mp4 --props='{"text": "Hello world"}'
```
