import { Scene } from "phaser"
import MultiPlayerGame from "../main"

export class Scene15 extends Scene {
  constructor() {
    super({ key: "Scene15" })
  }

  create() {
    this.add.image(225, 400, "scene15-black")

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
  }
}
