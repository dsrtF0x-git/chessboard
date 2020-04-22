import { Util } from "./util.js";
import { Pawn } from "./pieces/pawn.js";
import { piecesImage, bottomPlayerColor, topPlayerColor, pieceIcons } from "./constants/config.js";

export const Display = function(board) {
  this.board = board;
  this.chessBoard = document.getElementById("chessboard");
  this.currentState = 1;
  this.states = {
    Game: 1,
    End: 0
  };
  this.winner = "";
  this.render(null);
  this.clearMovesHistory();
  this.addPlayersName();
};

Display.prototype.render = function(selectedPiece, startPosition) {
  this.clearBoard();
  for (let i = 0; i < this.board.grid.length; i++) {
    for (let j = 0; j < this.board.grid[i].length; j++) {
      this.appendSquare(i, j, this.board.grid[i][j], selectedPiece, startPosition);
    }
  }
  if (this.currentState === this.states.End) {
    this.gameOver(this.winner);
  }
};

Display.prototype.clearMovesHistory = function() {
  const logTable = document.querySelector(".logs");
  const playerNames = document.querySelectorAll(".player-name");
  document.querySelectorAll(".beaten-pieces").forEach(item => item.innerHTML = "");
  if (playerNames[0].className.includes("current-turn")) {
    playerNames[0].classList.remove("current-turn");
    playerNames[1].classList.add("current-turn");
  }
  logTable.innerHTML = ``;
};

Display.prototype.clearBoard = function() {
  while(this.chessBoard.firstChild) {
    this.chessBoard.removeChild(this.chessBoard.firstChild);
  }
};

Display.prototype.appendSquare = function(i, j, piece, selectedPiece, startPosition = []) {
  const square = document.createElement("div");
  if (piece instanceof Pawn) {
    piece.promotion();
  }

  if (selectedPiece !== null && Util._includesSubArray(selectedPiece.moves, [i, j])) {
    square.className = "possibleMove";
  } else if ((i + j) % 2 === 0) {
    square.className = "white square";
  } else {
    square.className = "brown square";
  }

  square.id = `[${i},${j}]`;

  if (piece !== null) {
    const pieceImagePath = piecesImage.get(`${piece.color}${piece.name}`);
    square.innerHTML = `<div><img src='${pieceImagePath}'></div>`;
  }

  if (startPosition !== null && startPosition[0] === i && startPosition[1] === j) {
    square.classList.add("selected-piece");
  }

  this.chessBoard.appendChild(square);
};

Display.prototype.addBeatenPiece = function (piece) {
  if (piece === null) {
    return;
  }
  const [blacksTrophies, whiteTrophies] = document.querySelectorAll(".beaten-pieces");
  piece.color === bottomPlayerColor
    ? (blacksTrophies.innerHTML += `${pieceIcons.get(
        piece.color + piece.name
      )}`)
    : (whiteTrophies.innerHTML += `${pieceIcons.get(
        piece.color + piece.name
      )}`);
};

Display.prototype.changeTurnIndicator = function() {
  [...document.querySelectorAll(".player-name")].forEach(item => {
    item.classList.toggle("current-turn");
  });
};

Display.prototype.showMovesHistory = function(lastMove) {
  const logGameTable = document.querySelector(".logs");
  const moveFrom = Util._trackMove(lastMove[0], lastMove[1]).split(":")[0];
  const moveTo = Util._trackMove(lastMove[0], lastMove[1]).split(":")[1];
  const tableRow = `<tr>
                      <td>${this.board.moves.length}</td>
                      <td>${lastMove[2].color}</td>
                      <td>${lastMove[2].name}</td>
                      <td>${moveFrom}</td>
                      <td>${moveTo}</td>
                    </tr>`;
  if (logGameTable.lastChild !== null) {
    let lastMove = '';
    const currentMove = tableRow.match(/(?<=<td>)(.+?)(?=<\/.+>)/gm).join("");
    logGameTable.lastChild.childNodes.forEach(item => lastMove += item.textContent);
    lastMove = lastMove.replace(/\s+/g, "");
    if (currentMove === lastMove) {
      return;
    };
  }
  logGameTable.innerHTML += tableRow;
};

Display.prototype.pawnPromotion = function(piece) {
  const modal = document.createElement("div");
  const question = document.createElement("p");

  modal.className = "chessboard-modal";
  question.className = "modal-question";

  question.textContent = "Choose piece";
  modal.appendChild(question);
  
  this.generateButton(piece, "Queen", modal);
  this.generateButton(piece, "Rook", modal);
  this.generateButton(piece, "Bishop", modal);
  this.generateButton(piece, "Knight", modal);

  this.chessBoard.appendChild(modal);
};

Display.prototype.clearPromotion = function() {
  this.render(null);
};

Display.prototype.addPlayersName = function() {
  const [ blackPlayer, whitePlayer ] = document.getElementsByClassName("player-name");
  
  const inputForBlackPlayer = document.querySelectorAll(".player-name-input")[0];
  inputForBlackPlayer.addEventListener("input", event => {
    blackPlayer.textContent = event.target.value || "Black";
  });
  const inputForWhitePlayer = document.querySelectorAll(".player-name-input")[1];
  inputForWhitePlayer.addEventListener("input", event => {
    whitePlayer.textContent = event.target.value || "White";
  });
};

Display.prototype.gameOver = function(color) {
  const modal = document.querySelector(".endgame-modal");
  const question = document.querySelector(".endgame-message");

  modal.style.display = "flex";

  question.textContent = `Checkmate, ${color} won!`;
};

Display.prototype.showWinner = function(color) {
  this.currentState = this.states.End;
  const [ topPlayerName, bottomPlayerName ] = [...document.querySelectorAll(".player-name")];
  switch(color) {
    case bottomPlayerColor: this.winner = topPlayerName.textContent; break;
    case topPlayerColor: this.winner = bottomPlayerName.textContent; break;
    default: this.winner = "Draw";
  }
};

Display.prototype.generateButton = function(piece, choice, element) {
  const choosePiece = document.createElement("button");
  choosePiece.type = "button";
  choosePiece.textContent = choice;
  choosePiece.className = "piece-select";

  choosePiece.onclick = piece.promoteTo.bind(piece, choice);
  element.appendChild(choosePiece);
};