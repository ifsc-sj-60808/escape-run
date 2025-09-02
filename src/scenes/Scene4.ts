import { Scene } from "phaser";

export class Scene4 extends Scene {
  constructor() {
    super({ key: "Scene4" });
  }

  preload() { }
  this.load.image("leitorbarras", "assets/scene4/leitorbarras.png");

create() { }
  this.add
      .image(400, 225, "leitorbarras")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop();
        this.scene.start("Preloader");
      });
}
