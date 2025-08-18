// src/PixiSquare.tsx

import { Application, Graphics } from "pixi.js";
import type React from "react";
import { useEffect, useRef } from "react";
import "pixi.js/unsafe-eval";

const PixiSquare: React.FC = () => {
  const pixiContainer = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    let isEffectActive = true;

    const setupPixi: () => Promise<void> = async () => {
      if (pixiContainer.current) {
        const app = new Application();
        await app.init({
          width: 200,
          height: 200,
          backgroundColor: 0x1a1a1a,
          antialias: true,
        });

        if (!isEffectActive) {
          app.destroy(true, {
            children: true,
            texture: true,
          });
          return;
        }

        pixiContainer.current.appendChild(app.canvas);

        const square = new Graphics();
        square.rect(50, 50, 100, 100);
        square.fill(0xff0000);
        app.stage.addChild(square);

        appRef.current = app;
      }
    };

    setupPixi();

    return () => {
      isEffectActive = false;
      if (appRef.current) {
        appRef.current.destroy(true, {
          children: true,
          texture: true,
        });
        appRef.current = null;
      }
    };
  }, []);

  return <div ref={pixiContainer} />;
};

export default PixiSquare;
