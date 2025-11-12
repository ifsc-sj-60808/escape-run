import { Scene } from "phaser"
import WebFont from "webfontloader"

export class Scene15 extends Scene {
  gameOver!: Phaser.GameObjects.Text

  constructor() {
    super({ key: "Scene15" })
  }

  init() {
    WebFont.load({
      google: { families: ["Sixtyfour"] }
    })
  }

  create() {
    this.add.image(225, 400, "scene15-background")

    this.anims.create({
      key: "tv-noise",
      frames: this.anims.generateFrameNumbers("scene15-tv-noise", {
        start: 0,
        end: 61
      }),
      frameRate: 12,
      repeat: -1
    })

    this.add.sprite(225, 400, "scene15-tv-noise").play("tv-noise")

    this.gameOver = this.add
      .text(225, 640, "GAME OVER", {
        fontFamily: "Sixtyfour",
        fontSize: "48px",
        color: "#ff00ff"
      })
      .setOrigin(0.5)
  }
}
