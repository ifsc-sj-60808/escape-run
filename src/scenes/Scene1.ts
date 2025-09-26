import { Scene } from "phaser";
import MultiPlayerGame from "../main";

interface Key {
  x: number;
  y: number;
  image: string;
  sprite?: Phaser.GameObjects.Sprite;
}
export class Scene1 extends Scene {
  password!: string;
  enter!: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: "Scene1" });
  }

  preload() {
    this.load.image("background", "assets/scene2/background.png");
    this.load.image("enter", "assets/scene2/enter.png");
  }

  create() {
    this.add.image(225, 400, "background");
    this.password = "";

    this.enter = this.physics.add
      .sprite(375, 700, "enter")
      .setInteractive()
      .on("pointerdown", () => {
        (this.game as typeof MultiPlayerGame).mqttClient.publish(
          "escape-run/devices/scene2/chest",
          this.password
        );
  
        this.password = "";
      })
  };
  }
