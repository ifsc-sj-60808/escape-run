import { Scene } from "phaser"
import WebFont from "webfontloader"
import MultiPlayerGame from "../main"

export class Scene8 extends Scene {
  private display!: Phaser.GameObjects.Text

  constructor() {
    super("Scene8")
  }

  init() {
    WebFont.load({
      google: { families: ["Sixtyfour"] }
    })
  }

  create() {
    // Fundo
    const bg = this.add.image(225, 400, "regras8").setDisplaySize(450, 800)

    // Texto do cronômetro
    this.display = this.add
      .text(225, 100, "", {
        fontFamily: "Sixtyfour",
        fontSize: "64px",
        color: "#ff00ff"
      })
      .setOrigin(0.5)
  }

  update() {
    this.display.setText(
      `${(this.game as typeof MultiPlayerGame).scene8Minutes}:${
        (this.game as typeof MultiPlayerGame).scene8Seconds
      }`
    )
  }
}
