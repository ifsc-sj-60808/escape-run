import { Scene } from "phaser";
import MultiPlayerGame from "../main";
import WebFont from "webfontloader";

export class Scene0 extends Scene {
  rules!: string;
  display!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "Scene0" });
  }

  init() {
    WebFont.load({
      google: {
        families: ["Tiny5", "Sixtyfour"],
      },
    });
  }

  preload() {
    this.load.image("scene0-background", "assets/scene0/background.png");
  }

  create() {
    this.add
      .image(225, 400, "scene0-background")
      .setInteractive()
      .on("pointerdown", () => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then(() => {
            if (this.scale.isFullscreen) {
              this.scale.stopFullscreen();
            } else {
              this.scale.startFullscreen();
            }
          });
      });

    this.rules =
      "Regras do jogo:\n- Duração de 30 minutos.\n- Sem interação com os\n  atores.\n\nAntes de começar:\n- Toque na tela para\n  preparar o celular:\n  tela cheia e mídias.";

    this.display = this.add.text(25, 25, "", {
      fontFamily: "Sixtyfour",
      fontSize: "16px",
      color: "#ff00ff",
    });
  }

  update() {
    this.display.setText(
      `[${(this.game as typeof MultiPlayerGame).minutes}:${
        (this.game as typeof MultiPlayerGame).seconds
      }]\n\n${this.rules}`
    );
  }
}
