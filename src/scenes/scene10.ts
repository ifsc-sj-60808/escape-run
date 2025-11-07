import { Scene } from "phaser"
import MultiPlayerGame from "../main"
import WebFont from "webfontloader"

export class Scene10 extends Scene {
  display!: Phaser.GameObjects.Text

  constructor() {
    super({ key: "Scene10" })
  }

  init() {
    WebFont.load({
      google: {
        families: ["Sixtyfour"]
      }
    })
  }

  preload() {
    // CORRIGIDO AQUI: O nome do arquivo é "start.png", não "cena10-start.png"
    // E o caminho deve ser o que o seu projeto usa, provavelmente 'assets/scene10/start.png'
    this.load.image("cena10-start", "assets/scene10/start.png") 
  }

  create() {
    // CORRIGIDO AQUI: Usamos a 'key' que definimos no preload, "cena10-start"
    this.add.image(225, 400, "cena10-start")

    this.display = this.add.text(25, 25, "", {
      fontFamily: "Sixtyfour",
      fontSize: "16px",
      color: "#ff00ff"
    })
  }

  update() {
    if (this.game && (this.game as typeof MultiPlayerGame).seconds !== undefined) {
      const seconds = String((this.game as typeof MultiPlayerGame).seconds).padStart(2, '0');
      this.display.setText(
        `[${(this.game as typeof MultiPlayerGame).minutes}:${seconds}]`
      )
    }
  }
}