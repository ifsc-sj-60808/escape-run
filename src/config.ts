import { Types } from "phaser";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene7 } from "./scenes/Scene7";
import { Scene8 } from "./scenes/Scene8";
import { TestNumpad } from "./scenes/TestNumpad";
import { TestPiano } from "./scenes/TestPiano";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 450,
  height: 800,
  parent: "game-container",
  input: {
    gamepad: true,
  },  
  scene: [
    Scene7,
    Scene1,
    Scene2,
    Scene3,
    Scene4, 
    Scene5,
    Scene8,
    TestNumpad,
    TestPiano,
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
