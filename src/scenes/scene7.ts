import Phaser from "phaser";

export class Scene7 extends Phaser.Scene {
  private password: string = "";
  private correctPassword: string = "6666";
  private displayText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private timeLeft: number = 600;

  constructor() {
    super("Scene7");
  }

  create() {
    // Fundo com gradiente roxo → azul
    const graphics = this.add.graphics();
    const gradient = graphics.createLinearGradient(0, 0, 0, 800);
    gradient.addColorStop(0, "#1a0033");
    gradient.addColorStop(1, "#000022");
    graphics.fillGradientStyle(0, 0, 0, 1);
    graphics.fillRect(0, 0, 450, 800);

    // Título
    this.add
      .text(225, 80, "ACESSO RESTRITO", {
        fontFamily: "monospace",
        fontSize: "32px",
        color: "#b84cff",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#b84cff", 12, true, true);

    // Timer
    this.timerText = this.add
      .text(225, 140, "10:00", {
        fontFamily: "monospace",
        fontSize: "36px",
        color: "#4dcaff",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#4dcaff", 12, true, true);

    // Display da senha
    this.displayText = this.add
      .text(225, 220, "", {
        fontFamily: "monospace",
        fontSize: "40px",
        color: "#ff33cc",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#ff33cc", 8, true, true);

    // Numpad
    const numbers = [
      "7",
      "8",
      "9",
      "4",
      "5",
      "6",
      "1",
      "2",
      "3",
      "X",
      "0",
      "✔",
    ];
    let startX = 120;
    let startY = 300;
    let index = 0;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const value = numbers[index++];
        const btn = this.add
          .text(startX + col * 70, startY + row * 70, value, {
            fontFamily: "monospace",
            fontSize: "36px",
            color: value === "X" ? "#ff3366" : "#4dcaff",
          })
          .setOrigin(0.5)
          .setInteractive()
          .setShadow(
            0,
            0,
            value === "X" ? "#ff3366" : "#4dcaff",
            12,
            true,
            true
          );

        btn.on("pointerover", () => {
          btn.setScale(1.2);
        });
        btn.on("pointerout", () => {
          btn.setScale(1);
        });
        btn.on("pointerdown", () => this.handleInput(value));
      }
    }

    // Timer conta
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

  handleInput(value: string) {
    if (value === "X") {
      this.password = "";
    } else if (value === "✔") {
      if (this.password === this.correctPassword) {
        this.scene.start("Scene8");
      } else {
        this.password = "";
      }
    } else {
      this.password += value;
    }
    this.displayText.setText(this.password);
  }

  updateTimer() {
    const min = Math.floor(this.timeLeft / 60);
    const sec = this.timeLeft % 60;
    this.timerText.setText(
      `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    );
  }
}
