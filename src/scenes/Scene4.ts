import { Scene } from "phaser";
import MultiPlayerGame from "../main";

export class Scene4 extends Scene {
  // Timer
  timer!: Phaser.GameObjects.Text;
  videoElement?: HTMLVideoElement;
  stream!: MediaStream | null;
  track!: MediaStreamTrack | null;

  constructor() {
    super({ key: "Scene4" });
  }

  preload() {
    this.load.image("leitorbarras", "assets/scene4/leitorbarras.png");
  }

  create() {
    this.add
      .image(220, 400, "leitorbarras")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop();
        this.scene.start("Preloader");
        // Ao sair da cena, pare o vídeo e remova o elemento
        if (this.videoElement) {
          this.videoElement.pause();
          this.videoElement.srcObject = null;
          this.videoElement.remove();
        }
      });
    // Timer
    this.timer = this.add.text(50, 100, "");

    // Solicitar acesso à câmera
    this.startCamera();
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
    );
  }

  async ligarLanterna() {
    if (!navigator.mediaDevices) {
      alert("API não suporta neste navegador. ");
      return;
    }
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    this.track = this.stream.getVideoTracks()[0];
    await this.track.applyConstraints({
      advanced: [{ torch: true } as MediaTrackConstraintSet],
    });
  }
  async desligarLanterna() {
    if (this.track) {
      this.track.stop();
      this.track = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement = document.createElement("video");
      this.videoElement.autoplay = true;
      this.videoElement.playsInline = true;
      this.videoElement.style.position = "absolute";
      this.videoElement.style.top = "0";
      this.videoElement.style.left = "0";
      this.videoElement.style.width = "90vw";
      this.videoElement.style.height = "100vh";
      this.videoElement.style.zIndex = "10";
      this.videoElement.style.pointerEvents = "none"; // Não interfere nos cliques do Phaser
      this.videoElement.srcObject = stream;
      document.body.appendChild(this.videoElement);
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err);
    }
  }
}
