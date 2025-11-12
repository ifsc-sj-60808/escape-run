import { Scene } from "phaser"
import MultiPlayerGame from "../main"

var CamHeight = 600
var CamWidth = CamHeight * (9 / 16)
export class Scene6 extends Scene {
  // Timer
  timer!: Phaser.GameObjects.Text
  arrow!: Phaser.GameObjects.Sprite
  videoElement?: HTMLVideoElement
  flashButton?: HTMLButtonElement
  filtroButton?: HTMLButtonElement
  stream?: MediaStream
  track?: MediaStreamTrack
  filtroAtivo: boolean = false
  flashAtivo: boolean = false
  text!: Phaser.GameObjects.Text

  constructor() {
    super({ key: "Scene6" })
  }

  create() {
    // Remove câmera e botões da scene5
    const videoElement = document.getElementById("camera-video") as HTMLVideoElement
    if (videoElement) {
      videoElement.remove()
      // Para a stream de vídeo
      if (videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }

    // Remove botões Flash e Filtro
    const buttons = document.querySelectorAll("button")
    buttons.forEach(button => {
      if (button.innerText === "Ligar Flash" || button.innerText === "Desligar Flash" ||
          button.innerText === "Ativar Filtro" || button.innerText === "Desativar Filtro") {
        button.remove()
      }
    })

    this.add.image(220, 400, "detector-background")

    this.arrow = this.add.sprite(220, 385, "arrow").setOrigin(0.1, 0.5)
    this.arrow.angle = -175

    // Timer
    this.timer = this.add.text(25, 25, "")
  }

  update() {
    this.timer.setText(
      `${String((this.game as typeof MultiPlayerGame).minutes).padStart(
        2,
        "0"
      )}:${String((this.game as typeof MultiPlayerGame).seconds).padStart(
        2,
        "0"
      )}`
    )
    // Rotate arrow
    if (this.arrow.angle <= -15) this.arrow.angle += 2
  }
}
