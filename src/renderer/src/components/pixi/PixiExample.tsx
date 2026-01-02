import { Graphics } from "pixi.js";
import type React from "react";
import { usePixiApp } from "../../hooks/usePixiApp";

const PixiSquare: React.FC = () => {
  const { containerRef } = usePixiApp({
    width: 1000,
    height: 1000,
    backgroundColor: 0x1a1a1a,
    antialias: true,
    onSetup: (app) => {
      const square = new Graphics();
      square.rect(0, 0, 100, 100);
      square.fill(0xff0000);
      square.x = 400;
      square.y = 0;
      app.stage.addChild(square);

      // Animate the square moving to the right
      app.ticker.add(() => {
        square.x += 1; // Move 1 pixel to the right each frame

        // Optional: wrap around when it goes off screen
        if (square.x > 1000) {
          square.x = -100;
        }
      });
    },
  });

  return <div ref={containerRef} />;
};

export default PixiSquare;
