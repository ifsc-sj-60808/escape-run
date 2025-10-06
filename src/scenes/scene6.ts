import { Scene } from "phaser";

export class Scene6 extends Scene {
  constructor() {
    super({ key: "Scene6" });
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
