import { Scene } from "phaser";
import MultiPlayerGame from "../main";

export class Boot extends Scene {
  texto!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "Boot" });
  }

  create() {
    this.texto = this.add.text(100, 100, "Boot Scene\nScore: 0");
  }

  update() {
    this.texto.setText(`Boot Scene\nScore: ${(this.game as typeof MultiPlayerGame).score}`);
  }
}
