import { Chess } from "./chess.js";
import { isFirstGameSetup } from "./constants/config.js";

Chess.newGame();
document.addEventListener("DOMContentLoaded", () => {
  registerHandlers();
});

function registerHandlers() {
  document.getElementById("start-game").addEventListener("click", onStartButton);
  document.getElementById("restart-game").addEventListener("click", onResetButton);
}

function onStartButton(event) {
  event.target.disabled = true;
  Chess.newGame(isFirstGameSetup);
}

function onResetButton() {
  Chess.newGame(isFirstGameSetup);
}