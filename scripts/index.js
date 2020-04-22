import { Chess } from "./chess.js";
import { Util } from "./util.js";
const isFirstGameSetup = true;
let browserCurrentGame;

export const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

if (isBrowser) {
  document.addEventListener("DOMContentLoaded", () => {
    registerHandlers();
    browserCurrentGame = new Chess();
  });

  function registerHandlers() {
    document
      .getElementById("start-game")
      .addEventListener("click", onStartButton);
    document
      .getElementById("restart-game")
      .addEventListener("click", onResetButton);
    document
      .querySelector(".try-one-more")
      .addEventListener("click", onTryAgain);
  }

  function onStartButton(event) {
    event.target.disabled = true;
    onResetButton();
  }

  function onTryAgain() {
    const modal = document.querySelector(".endgame-modal");
    modal.style.display = "none";
    onResetButton();
  }

  function onResetButton() {
    browserCurrentGame = new Chess(isFirstGameSetup);
    const chessboard = document.getElementById("chessboard");
    chessboard.removeEventListener("click", handleSquareClick);
    chessboard.addEventListener("click", handleSquareClick);
  }

  function handleSquareClick(event) {
    const isFilledSquare = event.target.parentNode.parentNode.id || false;
    if (isFilledSquare) {
      browserCurrentGame.selectPosition(
        JSON.parse(event.target.parentNode.parentNode.id)
      );
    } else {
      browserCurrentGame.selectPosition(JSON.parse(event.target.id));
    }
  }
} else {
  const stdin = process.openStdin();
  const nodeCurrentGame = new Chess(isFirstGameSetup);

  console.log(`Please, enter coordinates for move in format:
             ColumnRow ColumnRow . (e.g: e2 e4)`);
  nodeCurrentGame.display.render(nodeCurrentGame.currentTurn);

  stdin.addListener("data", function (input) {
    try {
      const [moveFrom, moveTo] = input.toString().trim().split(/\s+/g);
      nodeCurrentGame.selectPosition(Util._convertToNumbersCoordinate(moveFrom));
      nodeCurrentGame.selectPosition(Util._convertToNumbersCoordinate(moveTo));
      nodeCurrentGame.display.render(nodeCurrentGame.currentTurn);
    } catch (error) {
      console.log("\x1b[31m%s\x1b[0m", "Wrong input!");
    }
  });

}

export { browserCurrentGame };