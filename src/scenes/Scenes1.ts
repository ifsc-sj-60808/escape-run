import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload() {
    this.load.image("taco-das-estrelas", "assets/taco-nas-estrelas.jpg");
  }

  create() {
    this.add
      .image(400, 225, "taco-das-estrelas")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop();
        this.scene.start("Preloader");
      });
  }
}
