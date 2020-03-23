document.addEventListener("DOMContentLoaded", () => {
  Chess.newGame();
  const startButton = document.getElementById("start-game");
  startButton.addEventListener("click", event => {
    event.target.disabled = true;
    Chess.newGame(true);
  });

  document.getElementById("restart-game").addEventListener("click", () => {
    Chess.newGame(true);
  });
});