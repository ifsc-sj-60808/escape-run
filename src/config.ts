import { Types } from "phaser";
import { Scene0 } from "./scenes/scene0";
import { Scene1 } from "./scenes/scene1";
import { Scene3 } from "./scenes/scene3";
import { Scene4 } from "./scenes/scene4";
import { Scene56 } from "./scenes/scene56";
import { Scene7 } from "./scenes/scene7";
import { Scene8 } from "./scenes/scene8";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 450,
  height: 800,
  parent: "game-container",
  input: {
    gamepad: true,
  },
  scene: [
    Scene0,
    Scene1,
    Scene3,
    Scene4,
    Scene56,
    Scene7,
    Scene8,
  ],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export default config;
