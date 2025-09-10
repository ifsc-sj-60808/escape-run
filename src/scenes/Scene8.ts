import { Scene } from "phaser";

export class Scene8 extends Scene {
  constructor() {
    super({ key: "Scene8" });
  }

  preload() { 
    this.load.image("scene8-1", "assets/scene8/4.png");
    this.load.image("scene8-2", "assets/scene8/3.png");
  }

  create() {
    this.add.image(225, 400, "scene8-1");
  }
}
