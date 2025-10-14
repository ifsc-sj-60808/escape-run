import Phaser from "phaser";

export class Scene8 extends Phaser.Scene {
  private gameTimerText!: Phaser.GameObjects.Text;
  private timeLeft: number = 600; // 10 minutos

  constructor() {
    super({ key: "Scene8" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    this.gameTimerText = this.add
      .text(this.scale.width / 2, 100, "10:00", {
        fontFamily: "Big Shoulders Display",
        fontSize: "64px",
        color: "#e31b2b",
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, 200, "VAMOS JOGAR!", {
        fontFamily: "Big Shoulders Display",
        fontSize: "48px",
        color: "#e31b2b",
      })
      .setOrigin(0.5);

    const text = [
      "APÓS COLETAR O BARALHO DENTRO DO COFRE SENTEM-SE E AGUARDEM COM AS MÃOS PARA FRENTE",
      "A MORTE IRÁ PRENDER TODOS E APENAS OS 2 MELHORES JOGADORES IRÃO SOBREVIVER",
      "FORMEM DUPLAS, E COM O BARALHO COLETADO DECIDAM APENAS UMA DUPLA VENCEDORA, ATRAVÉS DE UM JOGO DE CARTAS",
      "A ESCOLHA DA FORMA DE DISPUTA ESTÁ NA MÃO DE VOCÊS.",
      "AO FINAL DO JOGO A DUPLA VENCEDORA LEVANTA A MÃO E A MORTE IRÁ GUIÁ-LOS PARA FORA.",
      "LEMBREM-SE: APENAS DOIS JOGADORES SAIRÃO VIVOS DESSA SALA.",
      "O TEMPO ESTÁ CORRENDO.",
    ];

    this.add
      .text(this.scale.width / 2, 300, text.join("\n\n"), {
        fontFamily: "Big Shoulders Display",
        fontSize: "18px",
        color: "#ff4dd2",
        align: "center",
        wordWrap: { width: 400 },
      })
      .setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
          const min = Math.floor(this.timeLeft / 60);
          const sec = this.timeLeft % 60;
          this.gameTimerText.setText(
            `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
          );
        }
      },
    });
  }
}
