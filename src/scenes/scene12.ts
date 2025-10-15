import { Scene } from "phaser";
import MultiPlayerGame from "../main";
import WebFont from "webfontloader";

export class Scene12 extends Scene {
  display!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "Scene12" });
  }

  init() {
    WebFont.load({
      google: {
        families: ["Sixtyfour"],
      },
    });
  }

  preload() {
    this.load.image("cena12-fantasma", "assets/scene12/fantasma.png");
  }

  create() {
    this.add.image(225, 400, "cena12-fantasma");

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
