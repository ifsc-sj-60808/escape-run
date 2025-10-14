import { Scene } from "phaser";
import MultiPlayerGame from "../main";

var CamHeight = 600;
var CamWidth = CamHeight * (9 / 16);
export class Scene4 extends Scene {
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
    super({ key: "Scene4" });
  }

  preload() {
    this.load.image("TelaBateriaBaixa", "assets/Scene4/TelaBateriaBaixa.png");
    //this.load.image("Visor", "assets/Scene4/Visor.png");
  }

  create() {
    this.add.image(220, 400, "TelaBateriaBaixa");

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
    this.timer = this.add.text(60, 130, "");

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