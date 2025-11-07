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
    this.keys = [
      {
        x: 32,
        y: 320,
        text: "A"
      },
      {
        x: 160,
        y: 320,

        text: "B"
      },
      {
        x: 224,
        y: 320,

        text: "C"
      },
      {
        x: 288,
        y: 320,

        text: "D"
      },
      {
        x: 352,
        y: 320,

        text: "E"
      },
      {
        x: 416,
        y: 320,

        text: "F"
      },
      {
        x: 64,
        y: 285,

        text: "G"
      },
      {
        x: 128,
        y: 285,

        text: "H"
      },
      {
        x: 256,
        y: 285,

        text: "I"
      },
      {
        x: 320,
        y: 285,

        text: "J"
      },
      {
        x: 384,
        y: 285,

        text: "K"
      }
    ]

    this.clear = this.add
      .text(75, 700, "clear")
      .setInteractive()
      .on("pointerdown", () => {
        this.password = ""
        this.display.setText("")
      })

    this.enter = this.add
      .text(375, 700, "enter")
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
          fontSize: "16px",
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
      fontSize: "16px",
      color: "#ff00ff"
    })
  }

  update() {
    // timer
    this.display.setText(
      `${(this.game as typeof MultiPlayerGame).minutes}:${
        (this.game as typeof MultiPlayerGame).seconds
      }`
    )
  }
}
