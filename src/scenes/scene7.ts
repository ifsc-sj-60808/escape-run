import Phaser from "phaser";

export class Scene7 extends Phaser.Scene {
  private password: string = "";
  private correctPassword: string = "6666";
  private displayText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private timeLeft: number = 600; // 10 minutos

  constructor() {
    super({ key: "Scene7" });
  }

  create() {
    // Fundo neon
    this.cameras.main.setBackgroundColor("#0a0014");

    // Título
    this.add
      .text(this.scale.width / 2, 100, "DIGITE A SENHA PARA\nLIBERAR O COFRE", {
        fontFamily: "Big Shoulders Display",
        fontSize: "32px",
        color: "#ff00cc",
        align: "center",
      })
      .setOrigin(0.5);

    // Timer
    this.timerText = this.add
      .text(this.scale.width / 2, 50, "10:00", {
        fontFamily: "Big Shoulders Display",
        fontSize: "40px",
        color: "#00ccff",
      })
      .setOrigin(0.5);

    // Display da senha digitada
    this.displayText = this.add
      .text(this.scale.width / 2, 250, "", {
        fontFamily: "Big Shoulders Display",
        fontSize: "40px",
        color: "#ff00cc",
      })
      .setOrigin(0.5);

    // Teclado numérico
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
      "ENTRAR",
    ];
    const startY = 400;
    const buttonSize = 80;
    const spacing = 20;

    numbers.forEach((num, i) => {
      const x = this.scale.width / 2 + ((i % 3) - 1) * (buttonSize + spacing);
      const y = startY + Math.floor(i / 3) * (buttonSize + spacing);

      const btn = this.add
        .text(x, y, num, {
          fontFamily: "Big Shoulders Display",
          fontSize: "36px",
          color:
            num === "ENTRAR" ? "#00ccff" : num === "X" ? "#ff3366" : "#ff00cc",
        })
        .setOrigin(0.5)
        .setPadding(16)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.handleInput(num));
    });

    // Timer
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
          const min = Math.floor(this.timeLeft / 60);
          const sec = this.timeLeft % 60;
          this.timerText.setText(
            `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
          );
        }
      },
    });
  }

  handleInput(value: string) {
    if (value === "X") {
      this.password = "";
    } else if (value === "ENTRAR") {
      if (this.password === this.correctPassword) {
        this.scene.start("Scene8");
      } else {
        alert("Senha incorreta. Tente novamente.");
        this.password = "";
      }
    } else {
      this.password += value;
    }
    this.displayText.setText(this.password);
  }
}
