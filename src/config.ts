import { Types } from "phaser";
import { Boot } from "./scenes/Boot";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene7 } from "./scenes/Scene7";
import { Scene8 } from "./scenes/Scene8";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 450,
  height: 800,
  parent: "game-container",
  scene: [Scene4, Scene1, Scene2, Scene3, Boot, Scene5, Scene7, Scene8],
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
