import { Scene } from "phaser"
import MultiPlayerGame from "../main"
import WebFont from "webfontloader"

export class Scene10 extends Scene {
  display!: Phaser.GameObjects.Text

  constructor() {
    super({ key: "Scene10" })
  }

  init() {
    WebFont.load({
      google: {
        families: ["Sixtyfour"]
      }
    })
  }

  preload() {
    this.load.image("cena10-start", "assets/scene10/start.png") 
  }

  create() {
    this.add.image(225, 400, "cena10-start")

    this.display = this.add.text(25, 25, "", {
      fontFamily: "Sixtyfour",
      fontSize: "16px",
      color: "#ff00ff"
    })
  }

  update() {
    if (this.game && (this.game as typeof MultiPlayerGame).seconds !== undefined) {
      const seconds = String((this.game as typeof MultiPlayerGame).seconds).padStart(2, '0');
      this.display.setText(
        `[${(this.game as typeof MultiPlayerGame).minutes}:${seconds}]`
      )
    }
  }
}
