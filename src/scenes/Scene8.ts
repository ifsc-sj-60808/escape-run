import { Scene } from "phaser";
import MultiPlayerGame from "../main";
import WebFont from "webfontloader";

interface Button {
  x: number;
  y: number;
  number: string;
  sprite?: Phaser.GameObjects.Sprite;
}

export class Scene8 extends Scene {
  // Timer
  timer!: Phaser.GameObjects.Text;

  // Numpad
  password!: string;
  display!: Phaser.GameObjects.Text;
  void!: Phaser.GameObjects.Sprite;
  buttons!: Button[];
  clear!: Phaser.GameObjects.Sprite;
  enter!: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: "Scene8" });
  }

  init() {
    WebFont.load({
      google: {
        families: ["Tiny5", "Sixtyfour"],
      },
    });
  }

  preload() {
    // Background
    this.load.image("scene8-background", "assets/Scene8/numpad.png");

    // Numpad
    this.load.image("void", "assets/Scene8/void.png");
    this.load.image("void-3x", "assets/Scene8/void-3x.png");
  }

  create() {
    //Background
    this.add.image(225, 400, "scene8-background");

    // Timer
    this.timer = this.add.text(50, 700, "", {
      fontFamily: "Sixtyfour",
      fontSize: "32px",
      color: "#ff00ff",
    });

    // Numpad
    this.password = "";

    this.display = this.add.text(125, 75, "", {
      fontFamily: "Sixtyfour",
      fontSize: "64px",
      color: "#ff00ff",
    });

    this.buttons = [
      { x: 100, y: 225, number: "1" },
      { x: 225, y: 225, number: "2" },
      { x: 350, y: 225, number: "3" },
      { x: 100, y: 345, number: "4" },
      { x: 225, y: 345, number: "5" },
      { x: 350, y: 345, number: "6" },
      { x: 100, y: 465, number: "7" },
      { x: 225, y: 465, number: "8" },
      { x: 350, y: 465, number: "9" },
      { x: 100, y: 585, number: "0" },
    ];

    this.buttons.forEach((button) => {
      button.sprite = this.physics.add
        .sprite(button.x, button.y, "void")
        .setInteractive()
        .on("pointerdown", () => {
          if (this.password.length < 3) {
            this.password = this.password + button.number;
          }
        });
    });

    this.enter = this.physics.add
      .sprite(290, 585, "void-3x")
      .setInteractive()
      .on("pointerdown", () => {
        (this.game as typeof MultiPlayerGame).mqttClient.publish(
          "escape-run/room/cultura/0",
          this.password
        );

        this.password = "";
      });
  }

  update() {
    // Timer
    this.timer.setText(
      `${(this.game as typeof MultiPlayerGame).minutes}:${
        (this.game as typeof MultiPlayerGame).seconds
      }`
    );

    // Numpad
    this.display.setText(this.password);
  }
}
