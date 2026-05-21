# Device Mockups in Remotion

To showcase a Web App, you often need to place your UI inside a device frame.

## SVG-based Laptop Mockup
Using SVGs is preferred for scalability and performance.

```tsx
import React from 'react';
import { AbsoluteFill } from 'remotion';

export const LaptopMockup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      {/* Laptop Frame */}
      <div style={{
        width: 800,
        height: 500,
        backgroundColor: '#333',
        borderRadius: 20,
        padding: 20,
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
      }}>
        {/* Screen Area */}
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
          overflow: 'hidden',
          borderRadius: 5
        }}>
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

## Responsive Phone Mockup
For mobile app previews.

```tsx
export const PhoneMockup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{
      width: 300,
      height: 600,
      border: '10px solid #222',
      borderRadius: 40,
      overflow: 'hidden',
      position: 'relative'
    }}>
      {children}
    </div>
  );
};
```

## Tips
- Use `transform: scale()` to fit the mockup into different video dimensions.
- Use `box-shadow` to add depth.
- Add a "glossy" overlay div with low opacity for extra realism.
