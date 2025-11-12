import { Scene } from "phaser"
import WebFont from "webfontloader"

export class Scene13 extends Scene {
  constructor() {
    super({ key: "Scene13" })
  }

  init() {
    WebFont.load({
      google: { families: ["Sixtyfour"] }
    })
  }

  create() {
    this.add.image(225, 400, "scene13-background")

    this.add
      .text(225, 640, "Final\nBônus!", {
        fontFamily: "Sixtyfour",
        fontSize: "48px",
        color: "#333333"
      })
      .setOrigin(0.5)
  }
}
