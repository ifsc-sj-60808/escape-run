import { Scene } from "phaser";
import MultiPlayerGame from "../main";

interface Key {
  x: number;
  y: number;
  image: string;
  sound?: Phaser.Sound.BaseSound;
  sprite?: Phaser.GameObjects.Sprite;
}

export class TestPiano extends Scene {
  // Score
  score!: Phaser.GameObjects.Text;

  // Timer
  timer!: Phaser.GameObjects.Text;

  // Piano
  keys!: Key[];
  c!: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: "TestPiano" });
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

    // Score
    this.score = this.add.text(50, 50, "");

    // Timer
    this.timer = this.add.text(50, 100, "");

    // Piano
    this.c = this.sound.add("C");

    this.keys = [
      { x: 32, y: 250, image: "keyWhite", sound: this.c },
      { x: 96, y: 250, image: "keyWhite" },
      { x: 160, y: 250, image: "keyWhite" },
      { x: 224, y: 250, image: "keyWhite" },
      { x: 288, y: 250, image: "keyWhite" },
      { x: 352, y: 250, image: "keyWhite" },
      { x: 416, y: 250, image: "keyWhite" },

      { x: 64, y: 218, image: "keyBlack" },
      { x: 128, y: 218, image: "keyBlack" },
      { x: 256, y: 218, image: "keyBlack" },
      { x: 320, y: 218, image: "keyBlack" },
      { x: 384, y: 218, image: "keyBlack" },
    ];

    this.keys.forEach((key) => {
      key.sprite = this.physics.add
        .sprite(key.x, key.y, key.image)
        .setInteractive()
        .on("pointerdown", () => {
          if (key.sound) key.sound.play();
        });
    });
  }

  update() {
    // Score
    this.score.setText(`Score: ${(this.game as typeof MultiPlayerGame).score}`);

    // Timer
    this.timer.setText(
      `${(this.game as typeof MultiPlayerGame).minutes}:${
        (this.game as typeof MultiPlayerGame).seconds
      }`
    );
  }
}
