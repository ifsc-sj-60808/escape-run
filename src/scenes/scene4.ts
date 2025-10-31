import { Scene } from "phaser"
import MultiPlayerGame from "../main"
export class Scene4 extends Scene {
  // Timer
  timer!: Phaser.GameObjects.Text
  batteryIcon1?: Phaser.GameObjects.Image
  batteryIcon2?: Phaser.GameObjects.Image
  batteryToggle: boolean = false

  constructor() {
    super({ key: "Scene4" })
  }

  create() {
    this.add.image(220, 400, "battery-background")

    // criar as duas imagens uma vez e alternar visibilidade a cada segundo
    this.batteryIcon1 = this.add.image(220, 400, "batteryicon1")
    this.batteryIcon2 = this.add.image(220, 400, "batteryicon2")
    // começar com a primeira visível e a segunda oculta
    this.batteryIcon1.setVisible(true)
    this.batteryIcon2.setVisible(false)

    this.time.addEvent({
      delay: 400,
      loop: true,
      callback: () => {
        this.batteryToggle = !this.batteryToggle
        if (this.batteryIcon1 && this.batteryIcon2) {
          this.batteryIcon1.setVisible(this.batteryToggle)
          this.batteryIcon2.setVisible(!this.batteryToggle)
        }
      }
    })
    // Timer
    this.timer = this.add.text(25, 25, "")
  }

  update() {
    // Timer
    this.timer.setText(
      `${String((this.game as typeof MultiPlayerGame).minutes).padStart(
        2,
        "0"
      )}:${String((this.game as typeof MultiPlayerGame).seconds).padStart(
        2,
        "0"
      )}`
    )
  }
}
