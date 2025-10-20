import { Scene } from "phaser"
import MultiPlayerGame from "../main"

export class Scene8 extends Scene {
  private timerText!: Phaser.GameObjects.Text
  private totalTime: number = 10 * 60 // 10 minutos em segundos
  private timerEvent!: Phaser.Time.TimerEvent

  constructor() {
    super("scene8")
  }

  preload() {
    // Carrega imagem de fundo
    this.load.image("regras8", "assets/scene8/regras8.png")
  }

  create() {
    // Fundo
    const bg = this.add.image(0, 0, "regras8").setOrigin(0)
    bg.displayWidth = 450
    bg.displayHeight = 800

    // Texto do cronômetro
    this.timerText = this.add
      .text(225, 100, this.formatTime(this.totalTime), {
        fontFamily: "Arial",
        fontSize: "72px",
        color: "#00FFFF",
        fontStyle: "bold"
      })
      .setOrigin(0.5)
      

    // Atualiza o cronômetro a cada segundo
    this.timerEvent = this.time.addEvent({
      delay: 1000, // 1 segundo
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    })
  }

  private updateTimer() {
    if (this.totalTime > 0) {
      this.totalTime--
      this.timerText.setText(this.formatTime(this.totalTime))
    } else {
      this.timerEvent.remove()
      this.timerText.setText("00:00")
      this.timerText.setColor("#FF00FF")
      this.timerText.setShadow(0, 0, "#FF00FF", 30, true, true)
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const partInSeconds = seconds % 60
    const minutesStr = minutes.toString().padStart(2, "0")
    const secondsStr = partInSeconds.toString().padStart(2, "0")
    return `${minutesStr}:${secondsStr}`
  }
}
