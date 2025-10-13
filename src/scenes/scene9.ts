import { Scene } from "phaser";
import MultiPlayerGame from "../main";
import WebFont from "webfontloader";

export class Scene9 extends Scene {
  display!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "Scene9" });
  }

  init() {
    WebFont.load({
      google: {
        families: ["Sixtyfour"],
      },
    });
  }

  create() {
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
