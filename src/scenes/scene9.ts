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
  private correctPassword: string = "6696"

  constructor() {
    super({ key: "Scene9" })
  }

  init() {
    WebFont.load({
      google: { families: ["Tiny5", "Sixtyfour"] }
    })
  }

  preload() {
    // Carrega o fundo do teclado (único asset)
    this.load.image("teclado", "assets/scene11/numpad.png")

    // Botões transparentes (clicáveis)
    this.load.image("void", "assets/scene9/void.png")
    this.load.image("void-3x", "assets/scene9/void-3x.png")
  }

  create() {
    // 🔮 Fundo do teclado neon
    this.add.image(225, 400, "teclado")

    // 💾 Campo de exibição do código digitado (na parte superior)
    this.display = this.add
      .text(225, 115, "", {
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

    // 🧱 Cria os botões invisíveis, mas interativos
    this.buttons.forEach((button) => {
      button.sprite = this.add
        .image(button.x, button.y, "void")
        .setDisplaySize(90, 90)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          if (this.password.length < 4) {
            this.password += button.number
            this.display.setText(this.password)
          }
        })
    })

    // ⌨️ Botão ENTER (maior botão no layout)
    this.enter = this.add
      .image(290, 585, "void-3x")
      .setDisplaySize(120, 90)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        if (this.password === this.correctPassword) {
          // ✅ Publica para todos os jogadores mudarem de cena
          ;(this.game as typeof MultiPlayerGame).mqttClient.publish(
            "escape-run/scene/change",
            "Scene9"
          )
        } else {
          this.password = ""
          this.display.setText("")
        }
      })
  }

  update() {
    // Exibe o código digitado
    this.display.setText(this.password)
  }
}
