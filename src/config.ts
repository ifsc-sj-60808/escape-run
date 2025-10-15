import { Types } from "phaser";
import { Scene0 } from "./scenes/scene0";
import { Scene1 } from "./scenes/scene1";
import { Scene2 } from "./scenes/scene2";
import { Scene3 } from "./scenes/scene3";
import { Scene4 } from "./scenes/scene4";
import { Scene5 } from "./scenes/scene5";
import { Scene6 } from "./scenes/scene6";
import { Scene7 } from "./scenes/scene7";
import { Scene8 } from "./scenes/scene8";
import { Scene9 } from "./scenes/scene9";
import { Scene10 } from "./scenes/scene10";
import { Scene11 } from "./scenes/scene11";
import { Scene12 } from "./scenes/scene12";
import { Scene13 } from "./scenes/scene13";
import { Scene14 } from "./scenes/scene14";
import { Scene15 } from "./scenes/scene15";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 450,
  height: 800,
  parent: "game-container",
  input: {
    gamepad: true,
  },
  scene: [
    Scene12,
    Scene13,
    Scene14,
    Scene15,
  ],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export default config;
