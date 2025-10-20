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

  constructor() {
    super({ key: "Scene6" })
  }

  preload() {
    this.load.image("detector-background", "assets/scene6/detector-background.png")
    this.load.image("arrow", "assets/scene6/detector-arrow.png")
    //this.load.image("Visor", "assets/scene4/Visor.png");
  }

  text!: Phaser.GameObjects.Text;

  create() {
    this.add.image(220, 400, "detector-background")

    this.arrow = this.add.sprite(220, 400, 'arrow').setOrigin(0, 0);
    
    // Timer
    this.timer = this.add.text(25, 25, "");
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
    // Rotate arrow
    this.arrow.angle += 0.1
  }
}
