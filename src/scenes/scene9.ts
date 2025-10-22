import { Scene } from "phaser"
import MultiPlayerGame from "../main"
import WebFont from "webfontloader"

interface Button {
  x: number
  y: number
  number: string
  sprite?: Phaser.GameObjects.Image
}

export class Scene9 extends Scene {
  private password: string = ""
  private display!: Phaser.GameObjects.Text
  private buttons!: Button[]
  private enter!: Phaser.GameObjects.Image

  private readonly NUMERO_CORRETO = "1955"
  private isConnecting: boolean = false

  constructor() {
    super({ key: "Scene9" })
  }

  init() {
    WebFont.load({
      google: { families: ["Sixtyfour"] }
    })
  }

  preload() {
    this.load.image("scene9-numpad", "assets/scene9/numpad.png")
    this.load.image("scene9-void", "assets/scene9/void.png")
    this.load.image("scene9-void-3x", "assets/scene9/void-3x.png")
  }

  create() {
    this.add.image(225, 400, "scene9-numpad")

    this.display = this.add
      .text(225, 110, "", {
        fontFamily: "Sixtyfour",
        fontSize: "64px",
        color: "#ff00ff"
      })
      .setOrigin(0.5)

    this.buttons = [
      { x: 100, y: 225, number: "1" },
      { x: 225, y: 225, number: "2" },
      { x: 350, y: 225, number: "3" },
      { x: 100, y: 345, number: "4" },
      { x: 225, y: 345, number: "5" },
      { x: 350, y: 345, number: "6" },
      { x: 100, y: 465, number: "7" },
      { x: 225, y: 465, number: "8" },
      { x: 350, y: 465, number: "9" },
      { x: 100, y: 585, number: "0" }
    ]

    this.buttons.forEach((button) => {
      button.sprite = this.add
        .image(button.x, button.y, "scene9-void")
        .setDisplaySize(90, 90)
        .setInteractive()
        .on("pointerdown", () => {
          if (!this.isConnecting && this.password.length < 4) {
            this.password += button.number
          }
        })
    })

    this.enter = this.add
      .image(290, 585, "scene9-void-3x")
      .setDisplaySize(120, 90)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        if (this.password === this.NUMERO_CORRETO) {
          this.isConnecting = true
          this.input.enabled = false

          this.display.setFontSize("40px")
          this.display.setText("CHAMANDO")
          this.display.setColor("#ffff00")

          this.time.delayedCall(3000, () => {
            this.display.setText("LIBERADO")
            this.display.setColor("#00ff00")

            this.time.delayedCall(2000, () => {
              ;(this.game as typeof MultiPlayerGame).mqttClient.publish(
                "escape-run/player/scene",
                "Scene10"
              )
            })
          })
        } else {
          this.display.setFontSize("32px")
          this.display.setText("DISCAGEM INCORRETA")
          this.display.setColor("#ff0000")
          this.password = ""

          this.time.delayedCall(1500, () => {
            this.display.setFontSize("64px")
            this.display.setText("")
            this.display.setColor("#ff00ff")
          })
        }
      })
  }

  update() {
    if (!this.isConnecting) {
      this.display.setText(this.password)
    }
  }
}
