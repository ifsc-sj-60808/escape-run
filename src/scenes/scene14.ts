import { Scene } from "phaser"

export class Scene14 extends Scene {
  constructor() {
    super({ key: "Scene14" })
  }

  create() {
    this.add.image(225, 400, "scene14-background")


    this.add
      .text(225, 640, "Final...\n  Feliz?", {
        fontFamily: "Sixtyfour",
        fontSize: "48px",
        color: "#ffffff"
      })
      .setOrigin(0.5)
  }
}
