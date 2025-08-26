import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload() {
    this.load.image("discoteca", "assets/scene8/abertura-fundo.png");
  }

  create() {
    this.add
      .image(400, 225, "discoteca")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop();
        this.scene.start("Preloader");
      });
  }
}