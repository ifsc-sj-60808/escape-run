import { Scene } from "phaser";

export class Scene7 extends Scene {
  constructor() {
    super({ key: "Scene7" });
  }

  preload() {
    this.load.image("Scene7-1", "assets/Scene7/1.png");
    this.load.image("Scene7-2", "assets/Scene7/2.png");
  }

  create() {
    this.add.image(225, 400, "Scene7-1");
    
    setTimeout(() => {
      this.add.image(225, 400, "Scene7-2");
    }, 1000);
  }
}
