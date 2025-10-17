import { Scene } from "phaser"
import MultiPlayerGame from "../main"

export class Scene8 extends Scene {
  constructor() {
    super({ key: "Scene8" })
  }

  preload() {
    // Carrega a imagem (ajuste o caminho se necessário)
    this.load.image("regras8", "assets/Scene8/regras8.png")
  }

  create() {
    // Define o tamanho fixo desejado
    const targetWidth = 450
    const targetHeight = 800

    // Centraliza na tela
    const centerX = this.scale.width / 2
    const centerY = this.scale.height / 2

    // Adiciona a imagem
    const bg = this.add.image(centerX, centerY, "regras8")

    // Define tamanho fixo de exibição (sem redimensionar automaticamente)
    bg.setDisplaySize(targetWidth, targetHeight)
    bg.setScrollFactor(0)

    // MQTT: publica que está na Scene8
    ;(this.game as typeof MultiPlayerGame).mqttClient.publish(
      "escape-run/player/scene",
      "Scene8"
    )

    // Transição automática para a próxima cena após 10 segundos
    this.time.delayedCall(10000, () => {
      ;(this.game as typeof MultiPlayerGame).mqttClient.publish(
        "escape-run/player/scene",
        "Scene9"
      )
    })
  }

  update() {
    // Nenhuma atualização necessária
  }
}
