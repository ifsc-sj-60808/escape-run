import { Scene } from "phaser"
import MultiPlayerGame from "../main"

var CamHeight = 510
var CamWidth = CamHeight * (9 / 16)
export class Scene5 extends Scene {
  // Timer
  timer!: Phaser.GameObjects.Text
  batteryIcon3?: Phaser.GameObjects.Image
  batteryIcon4?: Phaser.GameObjects.Image
  batteryIcon5?: Phaser.GameObjects.Image
  batteryToggle: boolean = false

  videoElement?: HTMLVideoElement
  flashButton?: HTMLButtonElement
  filtroButton?: HTMLButtonElement
  stream?: MediaStream
  track?: MediaStreamTrack
  filtroAtivo: boolean = false
  flashAtivo: boolean = false

  constructor() {
    super({ key: "Scene5" })
  }

  create() {
    // Garante que o container do jogo ocupe toda a tela quando o site estiver em fullscreen
    const container = document.getElementById("game-container")
    if (container) {
      container.style.position = "fixed"
      container.style.top = "0"
      container.style.left = "0"
      container.style.width = "100vw"
      container.style.height = "100vh"
      container.style.zIndex = "5"
    }
    this.add.image(220, 400, "charged-background")
    this.batteryIcon3 = this.add.image(220, 400, "batteryicon3")
    this.batteryIcon4 = this.add
      .image(220, 400, "batteryicon4")
      .setVisible(false)
    this.batteryIcon5 = this.add
      .image(220, 400, "batteryicon5")
      .setVisible(false)

    setInterval(() => {
      this.batteryIcon3?.setVisible(false)
      this.batteryIcon4?.setVisible(true)
    }, 1000)

    setInterval(() => {
      this.batteryIcon4?.setVisible(false)
      this.batteryIcon5?.setVisible(true)
    }, 2000)

    // Reproduzir som gerador.mp3 automaticamente com atraso de 500ms
    const geradorSom = this.sound.add("gerador")
    this.time.delayedCall(500, () => {
      geradorSom.play({ loop: false, volume: 1.5 })
    })

    setInterval(() => {
      this.add.image(220, 400, "camera-background")

      if (this.videoElement) {
        this.videoElement.pause()
        this.videoElement.srcObject = null
        this.videoElement.remove()
      }
      if (this.flashButton) this.flashButton.remove()
      if (this.filtroButton) this.filtroButton.remove()
      if (this.stream) this.stream.getTracks().forEach((t) => t.stop())
    }, 5000)

    // Timer
    this.timer = this.add.text(25, 25, "", {
      fontFamily: "Sixtyfour",
      fontSize: "16px",
      color: "#ff00ff"
    })
    // Só inicia a câmera após garantir que a imagem foi carregada/renderizada
    this.time.delayedCall(500, () => {
      this.startCamera()
    })
  }

  update() {
    // Timer
    this.timer.setText(
      `${String((this.game as typeof MultiPlayerGame).minutes).padStart(
        2,
        "0"
      )}:${String((this.game as typeof MultiPlayerGame).seconds).padStart(
        2,
        "0"
      )}`
    )
  }

  async startCamera() {
    const stream = navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { exact: "environment" } }
      })
      .then((mediaStream) => {
        this.stream = mediaStream
        this.track = mediaStream.getVideoTracks()[0]
        this.videoElement = document.createElement("video")
        this.videoElement.id = "camera-video"
        this.videoElement.autoplay = true
        this.videoElement.playsInline = true
        this.videoElement.style.position = "absolute"
        this.videoElement.style.top = "55%"
        this.videoElement.style.left = "50%"
        this.videoElement.style.width = `${CamWidth}px`
        this.videoElement.style.height = `${CamHeight}px`
        this.videoElement.style.transform = "translate(-50%, -50%)"
        this.videoElement.style.zIndex = "10"
        this.videoElement.style.pointerEvents = "none" // Não interfere nos cliques do Phaser
        this.videoElement.srcObject = mediaStream
        document.body.appendChild(this.videoElement)

        // Adiciona botões após o vídeo ser adicionado
        this.addControlButtons()
      })
      .catch((err) => {
        console.error("Erro ao acessar a câmera: ", err)
      })
  }

  addControlButtons() {
    // Botão Flash
    this.flashButton = document.createElement("button")
    this.flashButton.innerText = "Ligar Flash"
    this.flashButton.style.position = "absolute"
    this.flashButton.style.top = "87%"
    this.flashButton.style.left = "30%"
    this.flashButton.style.transform = "translate(-50%, 0)"
    this.flashButton.style.zIndex = "20"
    this.flashButton.style.padding = "1em"
    this.flashButton.style.fontSize = "1.1em"
    this.flashButton.style.fontFamily = "sans-serif"
    this.flashButton.style.color = "#b62271ff"
    this.flashButton.style.fontWeight = "bold"
    this.flashButton.style.backgroundColor = "#130b1cff"
    this.flashButton.style.border = "2px solid #881753"
    this.flashButton.onclick = () => this.toggleFlash()
    document.body.appendChild(this.flashButton)

    // Botão Filtro Vermelho
    this.filtroButton = document.createElement("button")
    this.filtroButton.innerText = "Ativar Filtro"
    this.filtroButton.style.position = "absolute"
    this.filtroButton.style.top = "87%"
    this.filtroButton.style.left = "70%"
    this.filtroButton.style.transform = "translate(-50%, 0)"
    this.filtroButton.style.zIndex = "20"
    this.filtroButton.style.padding = "1em"
    this.filtroButton.style.width = "8em"
    this.filtroButton.style.fontSize = "1.1em"
    this.filtroButton.style.fontFamily = "sans-serif"
    this.filtroButton.style.color = "#b62271ff"
    this.filtroButton.style.fontWeight = "bold"
    this.filtroButton.style.backgroundColor = "#130b1cff"
    this.filtroButton.style.border = "2px solid #881753"
    this.filtroButton.style.fontWeight = "bold"
    this.filtroButton.onclick = () => this.toggleFiltro()
    document.body.appendChild(this.filtroButton)
  }

  async toggleFlash() {
    if (!this.track) return
    const capabilities = this.track.getCapabilities()
    if (!("torch" in capabilities)) {
      alert("Seu dispositivo não suporta flash via navegador.")
      return
    }
    try {
      this.flashAtivo = !this.flashAtivo
      await this.track.applyConstraints({
        advanced: [{ torch: this.flashAtivo } as any]
      })
      this.flashButton!.innerText = this.flashAtivo
        ? "Desligar Flash"
        : "Ligar Flash"
    } catch (e) {
      alert("Não foi possível alternar o flash.")
    }
  }

  toggleFiltro() {
    if (!this.videoElement) return
    this.filtroAtivo = !this.filtroAtivo
    if (this.filtroAtivo) {
      this.videoElement.style.filter =
        "brightness(0.7) sepia(1) hue-rotate(-50deg) saturate(6)"
      // Ajusta a sombra para o tamanho do vídeo
      const w = this.videoElement.offsetWidth
      const h = this.videoElement.offsetHeight
      this.videoElement.style.boxShadow = `${Math.max(
        CamWidth,
        CamHeight
      )}px rgba(255,0,0,0.2) inset`
      this.filtroButton!.innerText = "Desativar Filtro"
      this.filtroButton!.style.width = "10em"
      this.flashButton!.style.left = "25%"
    } else {
      this.videoElement.style.filter = ""
      this.videoElement.style.boxShadow = ""
      this.filtroButton!.innerText = "Ativar Filtro"
      this.filtroButton!.style.width = "8em"
      this.flashButton!.style.left = "30%"
    }
  }
}
