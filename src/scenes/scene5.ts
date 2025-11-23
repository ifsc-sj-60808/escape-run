import { Scene } from "phaser"
import MultiPlayerGame from "../main"

// Camera com altura levemente maior
var CamHeight = 500
var CamWidth = CamHeight * (9 / 16)

export class Scene5 extends Scene {
  timer!: Phaser.GameObjects.Text
  batteryIcon3?: Phaser.GameObjects.Image
  batteryIcon4?: Phaser.GameObjects.Image
  batteryIcon5?: Phaser.GameObjects.Image
  batteryToggle: boolean = false

  canvasElement?: HTMLCanvasElement
  canvasCtx?: CanvasRenderingContext2D
  animationFrameId?: number
  redRevealOverlay?: HTMLDivElement
  videoElement?: HTMLVideoElement
  stream?: MediaStream
  track?: MediaStreamTrack

  flashButton?: HTMLButtonElement
  filtroButton?: HTMLButtonElement
  filtroAtivo: boolean = false
  flashAtivo: boolean = false

  sceneCreatedAt?: number
  cameraStartScheduled: boolean = false

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

    setTimeout(() => {
      this.batteryIcon3?.setVisible(false)
      this.batteryIcon4?.setVisible(true)
    }, 1000)

    setTimeout(() => {
      this.batteryIcon4?.setVisible(false)
      this.batteryIcon5?.setVisible(true)
    }, 2000)

    //    const geradorSom = this.sound.add("gerador")
    //    this.time.delayedCall(500, () => {
    //      geradorSom.play({ loop: false, volume: 1.5 })
    //    })

    // record when scene was created so we can prevent early camera prompts
    this.sceneCreatedAt = Date.now()

    // start camera only after 5 seconds
    this.time.delayedCall(5000, () => {
      this.add.image(220, 400, "camera-background")
      if (!this.videoElement) {
        this.startCamera()
      }
    })

    this.timer = this.add.text(25, 25, "", {
      fontFamily: "Sixtyfour",
      fontSize: "16px",
      color: "#ff00ff"
    })

    // camera will be started by the delayedCall above after 5s
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
    // prevent requesting camera permissions before 5s since scene creation
    const MIN_DELAY = 5000
    const createdAt = this.sceneCreatedAt ?? Date.now()
    const elapsed = Date.now() - createdAt
    if (elapsed < MIN_DELAY) {
      if (!this.cameraStartScheduled) {
        this.cameraStartScheduled = true
        this.time.delayedCall(MIN_DELAY - elapsed, () => {
          this.cameraStartScheduled = false
          // call startCamera again at the proper time
          this.startCamera()
        })
      }
      return
    }

    const stream = navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { exact: "environment" } }
      })
      .then((mediaStream) => {
        this.stream = mediaStream
        this.track = mediaStream.getVideoTracks()[0]
        this.videoElement = document.createElement("video")
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

        // Cria canvas para efeito red reveal (esteganografia)
        this.canvasElement = document.createElement("canvas")
        this.canvasElement.width = CamWidth
        this.canvasElement.height = Math.floor(CamHeight * 0.75)
        this.canvasElement.style.position = "absolute"
        this.canvasElement.style.top = this.videoElement.style.top
        this.canvasElement.style.left = this.videoElement.style.left
        this.canvasElement.style.width = this.videoElement.style.width
        this.canvasElement.style.height = Math.floor(CamHeight * 0.75) + "px"
        this.canvasElement.style.transform = this.videoElement.style.transform
        this.canvasElement.style.zIndex = "11"
        this.canvasElement.style.pointerEvents = "none"
        this.canvasElement.style.display = "none"
        document.body.appendChild(this.canvasElement)
        this.canvasCtx = this.canvasElement.getContext("2d")!

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
        advanced: [{ torch: this.flashAtivo }]
      })
      this.flashButton!.innerText = this.flashAtivo
        ? "Desligar Flash"
        : "Ligar Flash"
    } catch (e) {
      alert("Não foi possível ligar o flash.")
    }
  }

  toggleFiltro() {
    if (!this.videoElement || !this.canvasElement || !this.canvasCtx) return
    this.filtroAtivo = !this.filtroAtivo
    if (this.filtroAtivo) {
      this.canvasElement.style.display = "block"
      this.videoElement.style.visibility = "hidden"
      this.filtroButton!.innerText = "Desativar Filtro"
      this.filtroButton!.style.width = "10em"
      this.flashButton!.style.left = "25%"
      this.startRedReveal()
    } else {
      this.canvasElement.style.display = "none"
      this.videoElement.style.visibility = "visible"
      this.filtroButton!.innerText = "Ativar Filtro"
      this.filtroButton!.style.width = "8em"
      this.flashButton!.style.left = "30%"
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId)
    }
  }

  startRedReveal() {
    if (!this.videoElement || !this.canvasCtx || !this.canvasElement) return
    const canvasHeight = Math.floor(CamHeight * 0.75)
    const draw = () => {
      this.canvasCtx!.drawImage(
        this.videoElement!,
        0,
        0,
        CamWidth,
        canvasHeight
      )
      const frame = this.canvasCtx!.getImageData(0, 0, CamWidth, canvasHeight)
      const l = frame.data.length
      for (let i = 0; i < l; i += 4) {
        // Intensifica o vermelho
        frame.data[i] = Math.min(255, frame.data[i] * 1.5) // R
        frame.data[i + 1] = 0 // G
        frame.data[i + 2] = 0 // B
        // Aumenta opacidade se vermelho for forte
        if (frame.data[i] > 100) {
          frame.data[i + 3] = 255
        } else {
          frame.data[i + 3] = 80
        }
      }
      this.canvasCtx!.putImageData(frame, 0, 0)
      this.animationFrameId = requestAnimationFrame(draw)
    }
    draw()
  }
}
