import { Scene } from "phaser"
import MultiPlayerGame from "../main"
import WebFont from "webfontloader"

export class Scene2 extends Scene {
  display!: Phaser.GameObjects.Text
  password: string = ""
  enter!: Phaser.GameObjects.Text
  clear!: Phaser.GameObjects.Text
  keys!: Array<{
    x: number
    y: number
    text: string
    sprite?: Phaser.GameObjects.Text
  }>

  constructor() {
    super({ key: "Scene2" })
  }

  init() {
    WebFont.load({
      google: {
        families: ["Sixtyfour", "Noto Sans Devanagari"]
      }
    })
  }

  create() {
    this.add.image(225, 400, "scene2-background")

    this.keys = [
      {
        x: 32,
        y: 320,
        text: "स"
      },
      {
        x: 160,
        y: 320,

        text: "मा"
      },
      {
        x: 224,
        y: 320,

        text: "के"
      },
      {
        x: 288,
        y: 320,

        text: "गौ"
      },
      {
        x: 352,
        y: 320,

        text: "औ"
      },
      {
        x: 416,
        y: 320,

        text: "चूं"
      },
      {
        x: 64,
        y: 285,

        text: "कि"
      },
      {
        x: 128,
        y: 285,

        text: "रि"
      },
      {
        x: 256,
        y: 285,

        text: "स्यों"
      },
      {
        x: 320,
        y: 285,

        text: "वा"
      },
      {
        x: 384,
        y: 285,

        text: "न्म"
      }
    ]

    this.clear = this.add
      .text(100, 700, "clear", {
        fontFamily: "Sixtyfour",
        fontSize: "32px",
        color: "#ff00ff"
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.password = ""
        this.display.setText("")
      })

    this.enter = this.add
      .text(350, 700, "enter", {
        fontFamily: "Sixtyfour",
        fontSize: "32px",
        color: "#ff00ff"
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        ;(this.game as typeof MultiPlayerGame).mqttClient.publish(
          "escape-run/devices/scene2/0",
          this.password
        )

        this.password = ""
        this.display.setText("")
      })

    this.keys.forEach((key) => {
      key.sprite = this.add
        .text(key.x, key.y, key.text, {
          fontFamily: "Noto Sans Devanagari",
          fontSize: "32px",
          color: "#881753"
        })
        .setInteractive()
        .on("pointerdown", () => {
          if (this.password.length < 5) this.password += key.text
          this.display.setText(this.display.text + key.text + " ")
        })
    })

    this.display = this.add.text(25, 25, "", {
      fontFamily: "Sixtyfour",
      fontSize: "32px",
      color: "#ff00ff"
    })
  }

  update() {
    this.display.setText(
      `${(this.game as typeof MultiPlayerGame).minutes}:${
        (this.game as typeof MultiPlayerGame).seconds
      }`
    )

    this.keys.forEach((key) => {
      key.sprite?.setColor(
        this.password.includes(key.text) ? "#ff0000" : "#881753"
      )
    })
  }
}
