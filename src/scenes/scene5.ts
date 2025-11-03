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
  // posição da última imagem camera-background (coordenadas do jogo)
  lastBgX: number = 220
  lastBgY: number = 400

  constructor() {
    super({ key: "Scene5" })
  }

  create() {
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
      // Adiciona a nova imagem de fundo da câmera (última imagem)
      this.add.image(220, 400, "camera-background")
      // atualiza posição registrada da imagem
      this.lastBgX = 220
      this.lastBgY = 400

      // Não removemos mais a câmera nem os botões aqui. Apenas iniciamos a
      // câmera se ela ainda não estiver presente (para evitar duplicatas).
      if (!this.videoElement) {
        this.time.delayedCall(100, () => {
          this.startCamera()
        })
      }
    }, 5000)

    // Timer
    this.timer = this.add.text(25, 25, "", {
      fontFamily: "Sixtyfour",
      fontSize: "16px",
      color: "#ff00ff"
    })
    // A câmera será iniciada a partir do setInterval quando a imagem for adicionada
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

  // Mapeia coordenadas do jogo (x,y,w,h) para posições/valores CSS no DOM
  private mapGameToDOM(
    x: number,
    y: number,
    w: number,
    h: number
  ): {
    left: number
    top: number
    cssWidth: number
    cssHeight: number
    container: HTMLElement
  } {
    const container = (document.getElementById("game-container") ||
      document.body) as HTMLElement
    const canvas = (this.game.canvas || document.querySelector("canvas")) as
      | HTMLCanvasElement
      | undefined

    // fallback: centraliza na viewport
    if (!canvas) {
      const left = window.innerWidth / 2
      const top = window.innerHeight / 2
      return {
        left,
        top,
        cssWidth: w,
        cssHeight: h,
        container
      }
    }

    const rect = canvas.getBoundingClientRect()
    const gameW = this.scale.width
    const gameH = this.scale.height

    const left = rect.left + (x / gameW) * rect.width
    const top = rect.top + (y / gameH) * rect.height
    const scale = rect.width / gameW
    const cssWidth = Math.round(w * scale)
    const cssHeight = Math.round(h * (rect.height / gameH))

    return { left, top, cssWidth, cssHeight, container }
  }

  async startCamera() {
    const stream = navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { exact: "environment" } } })
      .then((mediaStream) => {
        this.stream = mediaStream
        this.track = mediaStream.getVideoTracks()[0]

        // Calcula onde posicionar o vídeo para que fique sobre a imagem
        const dom = this.mapGameToDOM(
          this.lastBgX,
          this.lastBgY,
          CamWidth,
          CamHeight
        )

        this.videoElement = document.createElement("video")
        this.videoElement.id = "camera-video"
        this.videoElement.autoplay = true
        this.videoElement.playsInline = true
        this.videoElement.style.position = "absolute"
        this.videoElement.style.left = `${dom.left}px`
        this.videoElement.style.top = `${dom.top}px`
        this.videoElement.style.width = `${dom.cssWidth}px`
        this.videoElement.style.height = `${dom.cssHeight}px`
        this.videoElement.style.transform = "translate(-50%, -50%)"
        this.videoElement.style.zIndex = "99999"
        this.videoElement.style.pointerEvents = "none" // Não interfere nos cliques do Phaser
        this.videoElement.srcObject = mediaStream

        // Anexa no body com z-index alto para garantir que fique acima do canvas
        document.body.appendChild(this.videoElement)

        // Adiciona botões após o vídeo ser adicionado
        this.addControlButtons()
      })
      .catch((err) => {
        console.error("Erro ao acessar a câmera: ", err)
        // mesmo sem câmera, ainda posicionamos os botões sobre a imagem
        this.addControlButtons()
      })
  }

  addControlButtons() {
    // evita duplicação
    if (this.flashButton || this.filtroButton) return

    // calcula posição baseada na última imagem
    const dom = this.mapGameToDOM(
      this.lastBgX,
      this.lastBgY,
      CamWidth,
      CamHeight
    )

    // Botão Flash
    this.flashButton = document.createElement("button")
    this.flashButton.innerText = "Ligar Flash"
    this.flashButton.style.position = "absolute"
    // posiciona logo abaixo do vídeo, alinhado à esquerda
    this.flashButton.style.left = `${dom.left - 80}px`
    this.flashButton.style.top = `${dom.top + dom.cssHeight / 2 + 12}px`
    this.flashButton.style.transform = "translate(0, 0)"
    this.flashButton.style.zIndex = "99999"
    this.flashButton.style.padding = "0.6em 1em"
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
    this.filtroButton.style.left = `${dom.left + 20}px`
    this.filtroButton.style.top = `${dom.top + dom.cssHeight / 2 + 12}px`
    this.filtroButton.style.transform = "translate(0, 0)"
    this.filtroButton.style.zIndex = "99999"
    this.filtroButton.style.padding = "0.6em 1em"
    this.filtroButton.style.width = "8em"
    this.filtroButton.style.fontSize = "1.1em"
    this.filtroButton.style.fontFamily = "sans-serif"
    this.filtroButton.style.color = "#b62271ff"
    this.filtroButton.style.fontWeight = "bold"
    this.filtroButton.style.backgroundColor = "#130b1cff"
    this.filtroButton.style.border = "2px solid #881753"
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
