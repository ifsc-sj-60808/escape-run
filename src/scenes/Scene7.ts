import { Scene } from "phaser";
import MultiPlayerGame from "../main";

export class Scene7 extends Scene {
  tempoAcabando: boolean = false;

  constructor() {
    super({ key: "Scene7" });
  }

  preload() {
    this.load.image("Scene7-1", "assets/Scene7/1.png");
    this.load.image("Scene7-2", "assets/Scene7/2.png");
  }

  create() {
    this.add.image(225, 400, "Scene7-1");
  }

  update() {
    if (!this.tempoAcabando && (this.game as typeof MultiPlayerGame).timer <= 300) {
      this.tempoAcabando = true;
      this.add.image(225, 400, "Scene7-2");
    }
  } 
}
