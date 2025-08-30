import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload() {
    this.load.image("boi", "assets/scene6/medo.jpg");
  }

  create() {
    this.add
      .image(400, 225, "medo")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop();
        this.scene.start("Preloader");
      });
  }
}
