import { Scene } from "phaser";
import MultiPlayerGame from "../main";

var CamHeight = 600;
var CamWidth = CamHeight * (9 / 16);
export class Scene6 extends Scene {
  // Timer
  timer!: Phaser.GameObjects.Text;
  videoElement?: HTMLVideoElement;
  flashButton?: HTMLButtonElement;
  filtroButton?: HTMLButtonElement;
  stream?: MediaStream;
  track?: MediaStreamTrack;
  filtroAtivo: boolean = false;
  flashAtivo: boolean = false;

  constructor() {
    super({ key: "Scene6" });
  }

  preload() {
    this.load.image("detectorco", "assets/Scene6/detectorco.png");
    //this.load.image("Visor", "assets/Scene4/Visor.png");
  }

  create() {
    this.add.image(220, 400, "detectorco");

    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.srcObject = null;
      this.videoElement.remove();
    }
    if (this.flashButton) this.flashButton.remove();
    if (this.filtroButton) this.filtroButton.remove();
    if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
    // });
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
    );
  }
}