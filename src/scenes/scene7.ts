import { Scene } from "phaser"
import MultiPlayerGame from "../main"
import WebFont from "webfontloader"

interface Button {
  x: number
  y: number
  number: string
  sprite?: Phaser.GameObjects.Image
}

export class Scene7 extends Scene {
  private password: string = ""
  private display!: Phaser.GameObjects.Text
  private buttons!: Button[]
  private enter!: Phaser.GameObjects.Image
  private correctPassword: string = "6666"

  constructor() {
    super({ key: "Scene7" })
  }

  init() {
    WebFont.load({
      google: { families: ["Tiny5", "Sixtyfour"] }
    })
  }

  preload() {
    // Carrega o fundo do teclado (único asset)
    this.load.image("scene7-background", "assets/Scene7/tecladocena7.png")

    // Botões transparentes (clicáveis)
    this.load.image("void", "assets/scene11/void.png")
    this.load.image("void-3x", "assets/scene11/void-3x.png")
  }

  create() {
    // 🔮 Fundo do teclado neon
    this.add.image(225, 400, "scene7-background")

    // 💾 Campo de exibição do código digitado (na parte superior)
    this.display = this.add
      .text(225, 115, "", {
        fontFamily: "Sixtyfour",
        fontSize: "64px",
        color: "#ff00ff"
      })
      .setOrigin(0.5)

    // 🔢 Botões (posicionados sobre o teclado no asset)
    this.buttons = [
      { x: 100, y: 250, number: "1" },
      { x: 225, y: 250, number: "2" },
      { x: 350, y: 250, number: "3" },
      { x: 100, y: 370, number: "4" },
      { x: 225, y: 370, number: "5" },
      { x: 350, y: 370, number: "6" },
      { x: 100, y: 490, number: "7" },
      { x: 225, y: 490, number: "8" },
      { x: 350, y: 490, number: "9" },
      { x: 100, y: 610, number: "0" }
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
      .image(350, 610, "void-3x")
      .setDisplaySize(120, 90)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        if (this.password === this.correctPassword) {
          // ✅ Publica para todos os jogadores mudarem de cena
          ;(this.game as typeof MultiPlayerGame).mqttClient.publish(
            "escape-run/scene/change",
            "Scene8"
          )
        } else {
          this.password = ""
          this.display.setText("")
        }
      })

    // 📡 Recebe mensagem MQTT para mudar de cena (sincronização)
    ;(this.game as typeof MultiPlayerGame).mqttClient.subscribe(
      "escape-run/scene/change"
    )

    ;(this.game as typeof MultiPlayerGame).mqttClient.on(
      "message",
      (topic, message) => {
        if (topic === "escape-run/scene/change") {
          const sceneName = message.toString()
          if (sceneName === "Scene8") {
            this.scene.start("Scene8")
          }
        }
      }
    )
  }

  update() {
    // Exibe o código digitado
    this.display.setText(this.password)
  }
}
