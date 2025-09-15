window.addEventListener("DOMContentLoaded", () => {
  const correctPassword = "1234";
  let password = "";
  const display = document.getElementById("display")!;
  let time = parseInt(localStorage.getItem("timer-seconds") || "600");

  function updateTimerDisplay() {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    document.querySelectorAll("#timer, #game-timer").forEach((el) => {
      if (el)
        el.textContent =
          String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
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
      const value = btn.innerText;
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
