import { Chess } from "./chess.js";
import { Util } from "./helpers/util.js";
import { BASE_URL, topPlayerColor, bottomPlayerColor } from "./constants/config.js";

export let browserCurrentGame;

export function launchBrowserGame(isFirstGameSetup) {
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
      .getElementById("save-game")
      .addEventListener("click", saveCurrentState);
    document
      .getElementById("load-game")
      .addEventListener("click", getStoredState);
    document
      .querySelector(".try-one-more")
      .addEventListener("click", onTryAgain);
  }

  async function saveCurrentState() {
    const namesList = Util._getTextContent([...document.querySelectorAll(".player-name")]);
    const beatenPieces = Util._getTextContent([ ...document.querySelectorAll(".beaten-pieces")]);
    const gameLog = document.querySelector(".logs").innerHTML;
    const boardState = browserCurrentGame.board;

    const fullState = {
      namesList,
      gameLog,
      beatenPieces,
      blankBoard: boardState.blankBoard,
      grid: Util._optimizeBoardGrid(boardState.grid),
      moves: boardState.moves.map(move => move.map(item => {
        if (Util._isObject(item)) {
          return { name: item.name, color: item.color }
        }
        return item;
      })),
    };

    await fetch(`${BASE_URL}/save-state`, {
      method: "POST",
      body: JSON.stringify(fullState),
    });
  }

  async function getStoredState() {

    const headers = await fetch(`${BASE_URL}/load-state`);
    const {
      namesList,
      blankBoard,
      grid,
      moves,
      gameLog,
      beatenPieces,
    } = await headers.json();

    onResetButton();
    const boardState = browserCurrentGame.board;

    boardState.grid.map((row, i) => {
      row.map((_piece, j) => {
        boardState.grid[i][j] = boardState.replacePiece(grid[i][j]);
      });
    });

    browserCurrentGame.whiteKing = browserCurrentGame.board.findKing(bottomPlayerColor);
    browserCurrentGame.blackKing = browserCurrentGame.board.findKing(topPlayerColor);
    browserCurrentGame.board.moves = moves;
    boardState.blankBoard = blankBoard;
    
    Util._replaceTextContent(document.querySelectorAll(".player-name"), namesList);
    Util._replaceTextContent(document.querySelectorAll(".beaten-pieces"), beatenPieces);   
    document.querySelector(".logs").innerHTML = gameLog;

    const savedTurn =
      document.querySelector(".logs")
        .innerHTML.match(/>\d+</gm).length % 2 === 0
        ? bottomPlayerColor
        : topPlayerColor;

    if (browserCurrentGame.currentTurn !== savedTurn) {
      let addNewLogLine = false;
      browserCurrentGame.changeTurns(addNewLogLine);
    }

    browserCurrentGame.display.render(null);
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
    document.getElementById("save-game").disabled = false;
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
}