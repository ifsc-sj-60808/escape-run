import Phaser from "phaser";

export class Scene7 extends Phaser.Scene {
  private password: string = "";
  private displayText!: Phaser.GameObjects.Text;
  private correctPassword: string = "6666";
  private timerText!: Phaser.GameObjects.Text;
  private timeLeft: number = parseInt(
    localStorage.getItem("timer-seconds") || "600"
  );

  constructor() {
    super({ key: "Scene7" });
  }

  create() {
    // Fundo gradiente estilo hacker
    const bg = this.add.graphics();
    const gradient = bg.createGradient(0, 0, 0, 800, [
      { offset: 0, color: 0x000010 },
      { offset: 1, color: 0x0a0030 },
    ]);
    bg.fillGradientStyle(gradient);
    bg.fillRect(0, 0, 450, 800);

    // Partículas leves de “energia”
    const particles = this.add.particles(0, 0, "spark", {
      x: { min: 0, max: 450 },
      y: { min: 0, max: 800 },
      lifespan: 4000,
      speed: 10,
      scale: { start: 0.02, end: 0 },
      tint: 0x00ffff,
      alpha: { start: 0.4, end: 0 },
      quantity: 1,
    });

    // Título
    this.add
      .text(225, 100, "🔐 ACESSO RESTRITO 🔐", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#00ffff",
      })
      .setOrigin(0.5);

    // Display da senha
    this.displayText = this.add
      .text(225, 180, "----", {
        fontFamily: "monospace",
        fontSize: "32px",
        color: "#39ff14",
      })
      .setOrigin(0.5);

    // Timer
    this.timerText = this.add
      .text(225, 50, this.formatTime(this.timeLeft), {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#00ffff",
      })
      .setOrigin(0.5);

    // Inicia contagem regressiva
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

    // Criação dos botões numéricos
    const buttonValues = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["X", "0", "OK"],
    ];

    buttonValues.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const x = 140 + colIndex * 60;
        const y = 300 + rowIndex * 70;

        const button = this.add
          .rectangle(x, y, 50, 50, 0x002244)
          .setStrokeStyle(2, 0x00ffff)
          .setInteractive({ useHandCursor: true });

        const label = this.add
          .text(x, y, value, {
            fontFamily: "monospace",
            fontSize: "22px",
            color: "#00ffff",
          })
          .setOrigin(0.5);

        // Efeitos de hover
        button.on("pointerover", () => {
          button.setFillStyle(0x004488);
          this.tweens.add({
            targets: label,
            scale: 1.2,
            duration: 150,
            yoyo: true,
          });
        });
        button.on("pointerout", () => button.setFillStyle(0x002244));

        // Clique do botão
        button.on("pointerdown", () => this.handleInput(value));
      });
    });
  }

  private handleInput(value: string) {
    if (value === "X") {
      this.password = "";
      this.displayText.setText("----");
    } else if (value === "OK") {
      if (this.password === this.correctPassword) {
        this.scene.start("Scene8");
      } else {
        this.cameras.main.shake(200, 0.02);
        this.displayText.setText("ERRO");
        this.time.delayedCall(1000, () => this.displayText.setText("----"));
        this.password = "";
      }
    } else {
      if (this.password.length < 4) this.password += value;
      this.displayText.setText(this.password.padEnd(4, "-"));
    }
  }

  private formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
}
