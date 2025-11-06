import { Scene } from "phaser"
import MultiPlayerGame from "../main"

interface Key {
  x: number
  y: number
  image: string
  text: string
  code: string
  sound?: Phaser.Sound.BaseSound
  sprite?: Phaser.GameObjects.Sprite
}
export class Scene3 extends Scene {
  // Timer
  timer!: Phaser.GameObjects.Text

  // Piano
  keys!: Key[]
  do!: Phaser.Sound.BaseSound
  dos!: Phaser.Sound.BaseSound
  re!: Phaser.Sound.BaseSound
  res!: Phaser.Sound.BaseSound
  mi!: Phaser.Sound.BaseSound
  fa!: Phaser.Sound.BaseSound
  fas!: Phaser.Sound.BaseSound
  sol!: Phaser.Sound.BaseSound
  sols!: Phaser.Sound.BaseSound
  la!: Phaser.Sound.BaseSound
  las!: Phaser.Sound.BaseSound
  si!: Phaser.Sound.BaseSound
  password!: string
  enter!: Phaser.GameObjects.Sprite
  display!: Phaser.GameObjects.Text
  clear!: Phaser.GameObjects.Sprite

  constructor() {
    super({ key: "Scene3" })
  }

  create() {
    // Background
    this.add.image(225, 400, "scene3-background")

    // Timer
    this.timer = this.add.text(50, 100, "")

    // Piano
    this.display = this.add.text(50, 150, "")
    this.do = this.sound.add("do")
    this.dos = this.sound.add("dos")
    this.re = this.sound.add("re")
    this.res = this.sound.add("res")
    this.mi = this.sound.add("mi")
    this.fa = this.sound.add("fa")
    this.fas = this.sound.add("fas")
    this.sol = this.sound.add("sol")
    this.sols = this.sound.add("sols")
    this.la = this.sound.add("la")
    this.las = this.sound.add("las")
    this.si = this.sound.add("si")

    this.password = ""

    this.keys = [
      {
        x: 32,
        y: 320,
        image: "keyWhite",
        text: "Dó",
        code: "c",
        sound: this.do
      },
      {
        x: 96,
        y: 320,
        image: "keyWhite",
        text: "Ré",
        code: "d",
        sound: this.re
      },
      {
        x: 160,
        y: 320,
        image: "keyWhite",
        text: "Mi",
        code: "e",
        sound: this.mi
      },
      {
        x: 224,
        y: 320,
        image: "keyWhite",
        text: "Fá",
        code: "f",
        sound: this.fa
      },
      {
        x: 288,
        y: 320,
        image: "keyWhite",
        text: "Sol",
        code: "g",
        sound: this.sol
      },
      {
        x: 352,
        y: 320,
        image: "keyWhite",
        text: "Lá",
        code: "a",
        sound: this.la
      },
      {
        x: 416,
        y: 320,
        image: "keyWhite",
        text: "Si",
        code: "b",
        sound: this.si
      },
      {
        x: 64,
        y: 285,
        image: "keyBlack",
        text: "Do#",
        code: "C",
        sound: this.dos
      },
      {
        x: 128,
        y: 285,
        image: "keyBlack",
        text: "Ré#",
        code: "D",
        sound: this.res
      },
      {
        x: 256,
        y: 285,
        image: "keyBlack",
        text: "Fá#",
        code: "F",
        sound: this.fas
      },
      {
        x: 320,
        y: 285,
        image: "keyBlack",
        text: "Sol#",
        code: "G",
        sound: this.sols
      },
      {
        x: 384,
        y: 285,
        image: "keyBlack",
        text: "Lá#",
        code: "A",
        sound: this.las
      }
    ]

    // Botão clear
    this.clear = this.physics.add
      .sprite(75, 700, "clear")
      .setInteractive()
      .on("pointerdown", () => {
        this.password = ""
        this.display.setText("")
      })

    // Botão enter
    this.enter = this.physics.add
      .sprite(375, 700, "enter")
      .setInteractive()
      .on("pointerdown", () => {
        ;(this.game as typeof MultiPlayerGame).mqttClient.publish(
          "escape-run/devices/scene3/chest",
          this.password
        )

        this.password = ""
        this.display.setText("")
      })

    this.keys.forEach((key) => {
      key.sprite = this.physics.add
        .sprite(key.x, key.y, key.image)
        .setInteractive()
        .on("pointerdown", () => {
          if (this.password.length < 5) {
            if (key.sound) key.sound.play()
            this.password += key.code
            this.display.setText(this.display.text + key.text + " ")
          }
        })

      this.add.text(key.x - 10, key.y + 60, key.text, {
        fontSize: "12px",
        color: "#881753",
        fontStyle: "bold"
      })
    })
  }

  update() {
    // Timer
    this.timer.setText(
      `${(this.game as typeof MultiPlayerGame).minutes}:${
        (this.game as typeof MultiPlayerGame).seconds
      }`
    )
  }
}
