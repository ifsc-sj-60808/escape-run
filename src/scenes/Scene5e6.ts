window.addEventListener("DOMContentLoaded", () => {
  // --- Injeção de CSS (Neon / Cyberpunk) ---
  const style = document.createElement("style");
  style.textContent = `
    @import url("https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;700;900&display=swap");
    body {
      margin: 0;
      padding: 0;
      font-family: "Big Shoulders Display", cursive;
      background: linear-gradient(180deg, #0a0014 0%, #1a0026 100%);
      color: #ff4dd2;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      text-align: center;
    } 
    .container {
      max-width: 400px;
      width: 100%;
      box-sizing: border-box;
      padding: 16px;
    }
    .timer {
      font-size: 40px;
      margin-bottom: 20px;
      color: #00ccff;
      text-shadow: 0 0 10px #00ccff, 0 0 20px #00ccff, 0 0 40px #00ccff;
    }
    .title {
      font-size: 26px;
      margin-bottom: 40px;
      line-height: 1.4;
      color: #ff00cc;
      text-shadow: 0 0 15px rgba(255,0,204,0.8);
    }
    .numpad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 12px;
      justify-content: center;
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
    }
    .btn {
      background: transparent;
      border: 2px solid #ff00cc;
      color: #ff00cc;
      font-size: 32px;
      padding: 16px 0;
      cursor: pointer;
      border-radius: 8px;
      transition: 0.2s;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      text-shadow: 0 0 6px #ff00cc;
      box-shadow: 0 0 8px rgba(255,0,204,0.6);
    }
    .btn:hover {
      background: rgba(255,0,204,0.2);
    }
    .btn:active {
      transform: scale(0.95);
    }
    .btn-clear {
      border-color: #ff3366;
      color: #ff3366;
      box-shadow: 0 0 8px rgba(255,51,102,0.6);
    }
    .btn-enter {
      border-color: #00ccff;
      color: #00ccff;
      box-shadow: 0 0 8px rgba(0,204,255,0.6);
    }
    .display {
      font-size: 28px;
      margin: 20px 0;
      letter-spacing: 5px;
      color: #ff00cc;
      text-shadow: 0 0 6px #ff00cc;
    }
    .wrap {
      display: none;
      min-height: 100%;
      align-items: flex-start;
      justify-content: center;
      padding: 24px 10px;
      box-sizing: border-box;
      color: #e31b2b;
    }
    .card {
      width: 100%;
      max-width: 720px;
      text-align: center;
      margin: 0 auto;
    }
    .game-timer {
      font-size: 64px;
      margin: 0 0 16px;
      font-weight: 900;
      color: #e31b2b;
      text-shadow: 0 0 18px rgba(227,27,43,0.8), 0 0 6px rgba(227,27,43,0.6);
    }
    .heading {
      font-size: 40px;
      margin: 6px 0 28px;
      font-weight: 700;
    }
    .text-block {
      font-size: 18px;
      line-height: 1.4;
      margin: 0 auto 16px;
      white-space: pre-wrap;
    }
    .text-block p {
      margin: 12px 0;
    }
    .footer-note {
      font-size: 18px;
      margin-top: 8px;
      letter-spacing: 1px;
    }
  `;
  document.head.appendChild(style);

  // --- Injeção de HTML ---
  document.body.innerHTML = `
    <div id="cofre" class="container">
      <div class="timer" id="timer">10:00</div>
      <div class="title">DIGITE A SENHA PARA<br />LIBERAR O COFRE</div>
      <div class="display" id="display"></div>
      <div class="numpad">
        <button class="btn">7</button>
        <button class="btn">8</button>
        <button class="btn">9</button>
        <button class="btn">4</button>
        <button class="btn">5</button>
        <button class="btn">6</button>
        <button class="btn">1</button>
        <button class="btn">2</button>
        <button class="btn">3</button>
        <button class="btn btn-clear">X</button>
        <button class="btn">0</button>
        <button class="btn btn-enter"> </button>
      </div>
    </div>
    <div id="jogo" class="wrap">
      <div class="card">
        <div class="game-timer" id="game-timer">00:10</div>
        <div class="heading">VAMOS JOGAR!</div>
        <div class="text-block">
          <p>APÓS COLETAR O BARALHO DENTRO DO COFRE SENTEM-SE E AGUARDEM COM AS MÃOS PARA FRENTE</p>
          <p>A MORTE IRÁ PRENDER TODOS E APENAS OS 2 MELHORES JOGADORES IRÃO SOBREVIVER</p>
          <p>FORMEM DUPLAS, E COM O BARALHO COLETADO DECIDAM APENAS UMA DUPLA VENCEDORA, ATRAVÉS DE UM JOGO DE CARTAS</p>
          <p>A ESCOLHA DA FORMA DE DISPUTA ESTÁ NA MÃO DE VOCÊS. AO FINAL DO JOGO A DUPLA VENCEDORA LEVANTA A MÃO E A MORTE IRÁ GUIÁ-LOS PARA FORA</p>
          <p>LEMBREM-SE: APENAS DOIS JOGADORES SAIRÃO VIVOS DESSA SALA</p>
          <p>O TEMPO ESTÁ CORRENDO</p>
        </div>
        <div class="footer-note">Prepare-se</div>
      </div>
    </div>
  `;

  // --- Lógica do jogo ---
  const correctPassword = "6666"; // senha correta
  let password = "";
  const display = document.getElementById("display")!;
  let time = parseInt(localStorage.getItem("timer-seconds") || "600");

  function updateTimerDisplay() {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    document.querySelectorAll("#timer, #game-timer").forEach((el) => {
      if (el)
        el.textContent = `${String(min).padStart(2, "0")}:${String(
          sec
        ).padStart(2, "0")}`;
    });
  }

  updateTimerDisplay();
  setInterval(() => {
    if (time > 0) {
      time--;
      localStorage.setItem("timer-seconds", time.toString());
      updateTimerDisplay();
    }
  }, 1000);

  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = (btn as HTMLElement).innerText;
      if (value === "X") {
        password = "";
      } else if (value === " ") {
        if (password === correctPassword) {
          (document.getElementById("cofre") as HTMLElement).style.display =
            "none";
          (document.getElementById("jogo") as HTMLElement).style.display =
            "flex";
        } else {
          alert("Senha incorreta. Tente novamente.");
          password = "";
        }
      } else {
        password += value;
      }
      display.textContent = password;
    });
  });
});
