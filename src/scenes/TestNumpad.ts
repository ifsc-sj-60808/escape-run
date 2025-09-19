import { Scene } from "phaser";
import MultiPlayerGame from "../main";
import WebFont from "webfontloader";

interface Button {
  x: number;
  y: number;
  number: string;
  sprite?: Phaser.GameObjects.Sprite;
}

export class TestNumpad extends Scene {
  // Score
  score!: Phaser.GameObjects.Text;

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
    super({ key: "TestNumpad" });
  }

  init() {
    WebFont.load({
      google: {
        families: ['Tiny5', "Sixtyfour"]
      }
    });
  }

  preload() {
    // Background
    this.load.image(
      "TestNumpad-background",
      "assets/TestNumpad/background.png"
    );

    // Numpad
    this.load.image("void", "assets/TestNumpad/void.png");
  }

  create() {
    //Background
    this.add.image(225, 400, "TestNumpad-background");

    // Score
    this.score = this.add.text(50, 50, "");

    // Timer
    this.timer = this.add.text(50, 100, "", {
      fontFamily: "Sixtyfour",
      fontSize: "64px",
      color: "#ff00ff",
    });

    // Numpad
    this.password = "";

    this.display = this.add.text(50, 150, "");

    this.buttons = [
      { x: 75, y: 250, number: "7" },
      { x: 225, y: 250, number: "8" },
      { x: 375, y: 250, number: "9" },
      { x: 75, y: 400, number: "4" },
      { x: 225, y: 400, number: "5" },
      { x: 375, y: 400, number: "6" },
      { x: 75, y: 550, number: "1" },
      { x: 225, y: 550, number: "2" },
      { x: 375, y: 550, number: "3" },
      { x: 225, y: 700, number: "0" },
    ];

    this.buttons.forEach((button) => {
      button.sprite = this.physics.add
        .sprite(button.x, button.y, "void")
        .setInteractive()
        .on("pointerdown", () => {
          this.password = this.password + button.number;
        });
    });

    this.clear = this.physics.add
      .sprite(75, 700, "void")
      .setInteractive()
      .on("pointerdown", () => {
        this.password = "";
      });

    this.enter = this.physics.add
      .sprite(375, 700, "void")
      .setInteractive()
      .on("pointerdown", () => {
        (this.game as typeof MultiPlayerGame).mqttClient.publish(
          "escape-run/devices/vault",
          this.password
        );
      });
  }

  update() {
    // Score
    this.score.setText(`Score: ${(this.game as typeof MultiPlayerGame).score}`);

    // Timer
    this.timer.setText(
      `${String((this.game as typeof MultiPlayerGame).minutes)}:${String(
        (this.game as typeof MultiPlayerGame).seconds
      )}`
    );

    // Numpad
    this.display.setText(this.password);
  }
}
