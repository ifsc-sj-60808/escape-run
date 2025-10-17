import { Scene } from "phaser"
import MultiPlayerGame from "../main"
import WebFont from "webfontloader"

export class Scene0 extends Scene {
  cursor: string = "_"

  rules!: string
  loadingDisplay!: Phaser.GameObjects.Text
  rulesDisplay!: Phaser.GameObjects.Text

  constructor() {
    super({ key: "Scene0" })
  }

  init() {
    WebFont.load({
      google: {
        families: ["Sixtyfour"]
      }
    })

    this.loadingDisplay = this.add.text(25, 700, "Carregando...", {
      fontFamily: "monospace",
      fontSize: "24px",
      color: "#ff00ff"
    })

    this.load.on("progress", (progress: number) => {
      console.log(progress)
      this.loadingDisplay.setText(
        " Carregando jogo em RAM...\n[" +
          "#".repeat(Math.floor(progress * 25)) +
          ".".repeat(25 - Math.floor(progress * 25)) +
          "]"
      )
    })
  }

  preload() {
    this.load.image("scene0-background", "assets/scene0/background.png")

    this.load.image("scene1-background", "assets/scene1/background.png")

    this.load.image("scene2-background", "assets/scene2/background.png")
    this.load.image("keyBlack", "assets/scene2/keyBlack.png")
    this.load.image("keyWhite", "assets/scene2/keyWhite.png")
    this.load.image("enter", "assets/scene2/enter.png")
    this.load.image("clear", "assets/scene2/clear.png")
    this.load.audio("do", "assets/scene2/do.mp3")
    this.load.audio("dos", "assets/scene2/dos.mp3")
    this.load.audio("re", "assets/scene2/re.mp3")
    this.load.audio("res", "assets/scene2/res.mp3")
    this.load.audio("mi", "assets/scene2/mi.mp3")
    this.load.audio("fa", "assets/scene2/fa.mp3")
    this.load.audio("fas", "assets/scene2/fas.mp3")
    this.load.audio("sol", "assets/scene2/sol.mp3")
    this.load.audio("sols", "assets/scene2/sols.mp3")
    this.load.audio("la", "assets/scene2/la.mp3")
    this.load.audio("las", "assets/scene2/las.mp3")
    this.load.audio("si", "assets/scene2/si.mp3")

    this.load.image("bateriabaixa", "assets/Scene4/bateriabaixa.png")

    this.load.image("background", "assets/Scene5/background.png")
    this.load.audio("gerador", "assets/Scene5/Sound-effects/gerador.mp3")

    this.load.image("detectorco", "assets/Scene6/detectorco.png")

    this.load.image("scene11-background", "assets/scene11/numpad.png")
    this.load.image("void", "assets/scene11/void.png")
    this.load.image("void-3x", "assets/scene11/void-3x.png")

    this.load.image("cena12-fantasma", "assets/scene12/fantasma.png")

    this.load.image("scene15-black", "assets/scene15/black.png")
    this.load.spritesheet("scene15-tv-noise", "assets/scene15/tv-noise.png", {
      frameWidth: 450,
      frameHeight: 333
    })
  }

  create() {
    let cursorBlinking = true
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.cursor = cursorBlinking ? " " : "_"
        cursorBlinking = !cursorBlinking
      }
    })

    this.rules =
      "> LOAD RULES\n\nRegras do jogo:\n- Duração de 30 minutos.\n- Sem interação com os\n  atores.\n\nAntes de começar:\n- Toque na tela para\n  preparar o celular:\n  tela cheia e mídias.\n\n> "

    this.add
      .image(225, 400, "scene0-background")
      .setInteractive()
      .on("pointerdown", () => {
        this.rules += "REQUEST MEDIA ACCESS\n\n> "

        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then(() => {
            if (this.scale.isFullscreen) {
              this.scale.stopFullscreen()
            } else {
              this.scale.startFullscreen()
            }
          })
      })

    this.rulesDisplay = this.add.text(25, 25, "", {
      fontFamily: "Sixtyfour",
      fontSize: "16px",
      color: "#ff00ff"
    })
  }

  update() {
    this.rulesDisplay.setText(`${this.rules}${this.cursor}`)
  }
}
