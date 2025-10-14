import Phaser from "phaser";

export class Scene8 extends Phaser.Scene {
  private timerText!: Phaser.GameObjects.Text;
  private timeLeft: number = parseInt(
    localStorage.getItem("timer-seconds") || "600"
  );

  constructor() {
    super({ key: "Scene8" });
  }

  create() {
    // Fundo futurista com roxo neon
    const bg = this.add.graphics();
    const gradient = bg.createGradient(0, 0, 0, 800, [
      { offset: 0, color: 0x080022 },
      { offset: 1, color: 0x1a0044 },
    ]);
    bg.fillGradientStyle(gradient);
    bg.fillRect(0, 0, 450, 800);

    // Texto de status
    this.add
      .text(225, 100, "✅ ACESSO CONCEDIDO ✅", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#00ffff",
      })
      .setOrigin(0.5);

    this.add
      .text(225, 160, "O cofre foi aberto.\nContinue a missão.", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#39ff14",
        align: "center",
      })
      .setOrigin(0.5);

    // Timer persistente
    this.timerText = this.add
      .text(225, 50, this.formatTime(this.timeLeft), {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#00ffff",
      })
      .setOrigin(0.5);

    // Atualiza o timer
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
          localStorage.setItem("timer-seconds", this.timeLeft.toString());
          this.timerText.setText(this.formatTime(this.timeLeft));
        }
      },
    });

    // Animação suave de transição
    this.cameras.main.fadeIn(800, 0, 0, 0);
  }

  private formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
}
