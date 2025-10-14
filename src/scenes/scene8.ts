import Phaser from "phaser";

export class Scene8 extends Phaser.Scene {
  private timerText!: Phaser.GameObjects.Text;
  private timeLeft: number = 600;

  constructor() {
    super("Scene8");
  }

  create() {
    // Fundo gradiente roxo → azul
    const graphics = this.add.graphics();
    const gradient = graphics.createLinearGradient(0, 0, 0, 800);
    gradient.addColorStop(0, "#1a0033");
    gradient.addColorStop(1, "#000022");
    graphics.fillGradientStyle(0, 0, 0, 1);
    graphics.fillRect(0, 0, 450, 800);

    // Título
    this.add
      .text(225, 100, "JOGO INICIADO", {
        fontFamily: "monospace",
        fontSize: "38px",
        color: "#b84cff",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#b84cff", 20, true, true);

    // Texto central
    this.add
      .text(
        225,
        250,
        "APÓS COLETAR O BARALHO\nDENTRO DO COFRE,\nSENTEM-SE E AGUARDEM.\n\nAPENAS DOIS SOBREVIVERÃO.",
        {
          fontFamily: "monospace",
          fontSize: "20px",
          color: "#4dcaff",
          align: "center",
          wordWrap: { width: 400 },
        }
      )
      .setOrigin(0.5)
      .setShadow(0, 0, "#4dcaff", 10, true, true);

    // Timer
    this.timerText = this.add
      .text(225, 720, "10:00", {
        fontFamily: "monospace",
        fontSize: "48px",
        color: "#ff33cc",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#ff33cc", 15, true, true);

    // Timer loop
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
          this.updateTimer();
        }
      },
    });
  }

  updateTimer() {
    const min = Math.floor(this.timeLeft / 60);
    const sec = this.timeLeft % 60;
    this.timerText.setText(
      `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    );
  }
}
