import { Scene } from "phaser";
import MultiPlayerGame from "../main";

export class Scene4 extends Scene {
  // Timer
  timer!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "Scene4" });
  }

  preload() {
    this.load.image("leitorbarras", "assets/scene4/leitorbarras.png");
  }

  create() {
    this.add
      .image(220, 400, "leitorbarras")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop();
        this.scene.start("Preloader");
      });
    // Timer
    this.timer = this.add.text(50, 100, "");
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
