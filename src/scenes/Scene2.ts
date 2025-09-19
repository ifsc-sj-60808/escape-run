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
  do!: Phaser.Sound.BaseSound;
  dos!: Phaser.Sound.BaseSound;
  re!: Phaser.Sound.BaseSound;
  res!: Phaser.Sound.BaseSound;
  mi!: Phaser.Sound.BaseSound;
  fa!: Phaser.Sound.BaseSound;
  fas!: Phaser.Sound.BaseSound;
  sol!: Phaser.Sound.BaseSound;
  sols!: Phaser.Sound.BaseSound;
  la!: Phaser.Sound.BaseSound;
  las!: Phaser.Sound.BaseSound;
  si!: Phaser.Sound.BaseSound;
  password!: string;
  enter!: Phaser.GameObjects.Sprite;
  display!: Phaser.GameObjects.Text;
  clear!: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: "Scene2" });
  }

  preload() {
    // Background
    this.load.image("background", "assets/scene2/background.png");

    // Piano
    this.load.image("keyBlack", "assets/scene2/keyBlack.png"); // imagem das teclas pretas
    this.load.image("keyWhite", "assets/scene2/keyWhite.png"); // imagem das teclas brancas
    this.load.image("enter", "assets/scene2/enter.png"); // imagem do botão enter
    this.load.image("clear", "assets/scene2/clear.png"); // imagem do botão clear
    this.load.audio("do", "assets/scene2/do.mp3"); // som da tecla dó
    this.load.audio("dos", "assets/scene2/dos.mp3"); // som da tecla dó sustenido
    this.load.audio("re", "assets/scene2/re.mp3"); // som da tecla ré
    this.load.audio("res", "assets/scene2/res.mp3"); // som da tecla ré sustenido
    this.load.audio("mi", "assets/scene2/mi.mp3"); // som da tecla mi
    this.load.audio("fa", "assets/scene2/fa.mp3"); // som da tecla fá
    this.load.audio("fas", "assets/scene2/fas.mp3"); // som da tecla fá sustenido
    this.load.audio("sol", "assets/scene2/sol.mp3"); // som da tecla sol
    this.load.audio("sols", "assets/scene2/sols.mp3"); // som da tecla sol sustenido
    this.load.audio("la", "assets/scene2/la.mp3"); // som da tecla lá
    this.load.audio("las", "assets/scene2/las.mp3"); // som da tecla lá sustenido
    this.load.audio("si", "assets/scene2/si.mp3"); // som da tecla si
  }

  create() {
    // Background
    this.add.image(225, 400, "background");

    // Timer
    this.timer = this.add.text(50, 100, "");

    // Piano
    this.display = this.add.text(50, 150, "");
    this.do = this.sound.add("do");
    this.dos = this.sound.add("dos");
    this.re = this.sound.add("re");
    this.res = this.sound.add("res");
    this.mi = this.sound.add("mi");
    this.fa = this.sound.add("fa");
    this.fas = this.sound.add("fas");
    this.sol = this.sound.add("sol");
    this.sols = this.sound.add("sols");
    this.la = this.sound.add("la");
    this.las = this.sound.add("las");
    this.si = this.sound.add("si");
    this.password = "";

    this.keys = [
      { x: 32, y: 320, image: "keyWhite", text: "do", sound : this.do },
      { x: 96, y: 320, image: "keyWhite", text: "re", sound : this.re },
      { x: 160, y: 320, image: "keyWhite", text: "mi", sound : this.mi },
      { x: 224, y: 320, image: "keyWhite", text: "fa", sound : this.fa },
      { x: 288, y: 320, image: "keyWhite", text: "sol", sound : this.sol },
      { x: 352, y: 320, image: "keyWhite", text: "la",  sound : this.la },
      { x: 416, y: 320, image: "keyWhite", text: "si", sound : this.si },

      { x: 64, y: 285, image: "keyBlack", text: "do#", sound : this.dos },
      { x: 128, y: 285, image: "keyBlack", text: "re#", sound : this.res },
      { x: 256, y: 285, image: "keyBlack", text: "fa#", sound : this.fas },
      { x: 320, y: 285, image: "keyBlack", text: "sol#", sound : this.sols },
      { x: 384, y: 285, image: "keyBlack", text: "la#", sound : this.las },
    ];

    // Botão clear
    this.clear = this.physics.add
      .sprite(75, 700, "clear")
      .setInteractive()
      .on("pointerdown", () => {
        this.password = "";
      });

    // Botão enter
    this.enter = this.physics.add
      .sprite(375, 700, "enter")
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
          if (this.password.length < 10) this.password += key.text;
        });

      this.add.text(key.x - 10, key.y + 60, key.text, {
        fontSize: "12px",
        color: "#881753",
        fontStyle: "bold",
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
