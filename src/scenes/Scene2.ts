import { Scene } from "phaser";
import MultiPlayerGame from "../main";

interface Key {
  x: number;
  y: number;
  image: string;
  text: string;
  sound?: Phaser.Sound.BaseSound;
  sprite?: Phaser.GameObjects.Sprite;
}
export class Scene2 extends Scene {
  // Timer
  timer!: Phaser.GameObjects.Text;

  // Piano
  keys!: Key[];
  c!: Phaser.Sound.BaseSound;
  password!: string;
  enter!: Phaser.GameObjects.Sprite;
  display!: Phaser.GameObjects.Text;
  clear!: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: "Scene2" });
  }

  preload() {
    // Background
    this.load.image("TestPiano-background", "assets/TestPiano/background.png");

    // Piano
    this.load.image("keyBlack", "assets/TestPiano/keyBlack.png");
    this.load.image("keyWhite", "assets/TestPiano/keyWhite.png");
    this.load.audio("C", "assets/TestPiano/c.mp3");
  }

  create() {
    // Background
    this.add.image(225, 400, "TestPiano-background");

    // Timer
    this.timer = this.add.text(50, 100, "");

    // Piano
    this.display = this.add.text(50, 150, "");
    this.c = this.sound.add("C");
    this.password = "";

    this.keys = [
      { x: 32, y: 250, image: "keyWhite", text: "C", sound: this.c },
      { x: 96, y: 250, image: "keyWhite", text: "D" },
      { x: 160, y: 250, image: "keyWhite", text: "E" },
      { x: 224, y: 250, image: "keyWhite", text: "F" },
      { x: 288, y: 250, image: "keyWhite", text: "G" },
      { x: 352, y: 250, image: "keyWhite", text: "A" },
      { x: 416, y: 250, image: "keyWhite", text: "B" },

      { x: 64, y: 218, image: "keyBlack", text: "C#" },
      { x: 128, y: 218, image: "keyBlack", text: "D#" },
      { x: 256, y: 218, image: "keyBlack", text: "F#" },
      { x: 320, y: 218, image: "keyBlack", text: "G#" },
      { x: 384, y: 218, image: "keyBlack", text: "A#" },
    ];

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
          "escape-run/devices/scene2/chest",
          this.password
        );
      });

    this.keys.forEach((key) => {
      key.sprite = this.physics.add
        .sprite(key.x, key.y, key.image)
        .setInteractive()
        .on("pointerdown", () => {
          if (key.sound) key.sound.play();
          if (this.password.length < 5) this.password += key.text;
        });

      this.add.text(key.x + 12, key.y, key.text, {
        fontSize: "12px",
        color: "#000",
      });
    });
  }

  update() {
    // Timer
    this.timer.setText(
      `${String((this.game as typeof MultiPlayerGame).minutes)}:${String(
        (this.game as typeof MultiPlayerGame).seconds
      )}`
    );

    // Display
    this.display.setText(this.password);
  }
}
