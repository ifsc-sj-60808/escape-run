import { Scene } from "phaser";
import MultiPlayerGame from "../main";
import WebFont from "webfontloader";

export class Scene1 extends Scene {
  display!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "Scene1" });
  }

  init() {
    (this.game as typeof MultiPlayerGame).timer = 1800;

    WebFont.load({
      google: {
        families: ["Sixtyfour"],
      },
    });
  }

  preload() {
    this.load.image("scene1-background", "assets/scene1/background.png");

    this.display = this.add.text(25, 25, "", {
      fontFamily: "Sixtyfour",
      fontSize: "16px",
      color: "#ff00ff",
    });
  }

  create() {
    this.add.image(225, 400, "scene1-background");

    this.display = this.add.text(25, 25, "", {
      fontFamily: "Sixtyfour",
      fontSize: "16px",
      color: "#ff00ff",
    });
  }

  update() {
    this.display.setText(
      `[${(this.game as typeof MultiPlayerGame).minutes}:${
        (this.game as typeof MultiPlayerGame).seconds
      }]`
    );
  }
}
