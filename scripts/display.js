Chess.Display = function(board) {
  this.board = board;
  this.chessBoard = document.getElementById("chessboard");
  this.currentState = 1;
  this.states = {
    Game: 1,
    End: 0
  };
  this.winner = "";
  this.render(null);
};

Chess.Display.prototype.render = function(selectedPiece) {
  this.empty();
  this.addPlayersName();
    for (let i = 0; i < this.board.grid.length; i++) {
      for (let j = 0; j < this.board.grid[i].length; j++) {
        this.appendSquare(i, j, this.board.grid[i][j], selectedPiece);
    }
  }
  if (this.currentState === this.states.End) this.gameOver(this.winner);
};

Chess.Display.prototype.empty = function() {
  while(this.chessBoard.firstChild) {
    this.chessBoard.removeChild(this.chessBoard.firstChild);
  }
};

Chess.Display.prototype.appendSquare = function(i, j, piece, selectedPiece) {
  const square = document.createElement("div");

  if (piece instanceof Chess.Pawn) piece.promotion();

  if (selectedPiece !== null && Chess.Util._includesSubArray(selectedPiece.moves, [i, j])) {
    square.className = "green";
  } else if ((i + j) % 2 === 0) {
    square.className = "white";
  } else {
    square.className = "brown";
  }

  square.id = `[${i},${j}]`;

  if (piece !== null) square.innerHTML = piece.show;

  if (Chess.startPosition !== null && Chess.startPosition[0] === i && Chess.startPosition[1] === j) {
    square.classList.add("selected-piece");
  }

  square.addEventListener("click", () => {
    Chess.selectPosition(JSON.parse(square.id));
  });

  this.chessBoard.appendChild(square);
};

Chess.Display.prototype.pawnPromotion = function(piece) {
  const modalBg = document.createElement("div");
  const modal = document.createElement("div");
  const question = document.createElement("p");

  modalBg.className = "chessboard-modal-bg";
  modal.className = "chessboard-modal";
  question.className = "modal-question";

  question.textContent = "Choose piece";
  modal.appendChild(question);

  this.generateButton(piece, "Queen", modal);
  this.generateButton(piece, "Rook", modal);
  this.generateButton(piece, "Bishop", modal);
  this.generateButton(piece, "Knight", modal);

  this.chessBoard.appendChild(modalBg);
  this.chessBoard.appendChild(modal);
};

Chess.Display.prototype.clearPromotion = function() {
  this.render(null);
};

Chess.Display.prototype.addPlayersName = function() {
  const blackPlayer = document.getElementsByClassName("player-name")[0];
  const whitePlayer = document.getElementsByClassName("player-name")[1];
  const inputForBlackPlayer = document.querySelectorAll(".player-name-input")[0];
  inputForBlackPlayer.addEventListener("input", event => {
    blackPlayer.textContent = event.target.value || "Black";
  });
  const inputForWhitePlayer = document.querySelectorAll(".player-name-input")[1];
  inputForWhitePlayer.addEventListener("input", event => {
    whitePlayer.textContent = event.target.value || "White";
  });
};

Chess.Display.prototype.gameOver = function(color) {
  const modalBg = document.createElement("div");
  const modal = document.createElement("div");
  const question = document.createElement("p");
  const newGameButton = document.createElement("button");

  modalBg.className = "chessboard-modal-bg";
  modal.className = "chessboard-modal";
  question.className = "modal-question";

  question.textContent = `Checkmate, ${color} won!`;

  modal.appendChild(question);
  newGameButton.innerHTML = "New game";
  newGameButton.onclick = Chess.newGame.bind(Chess);

  modal.appendChild(newGameButton);
  
  this.chessBoard.appendChild(modalBg);
  this.chessBoard.appendChild(modal);
};

Chess.Display.prototype.showWinner = function(color) {
  this.currentState = this.states.End;
  this.winner = color;
};

Chess.Display.prototype.generateButton = function(piece, choice, element) {
  const choosePiece = document.createElement("input");
  choosePiece.type = "button";
  choosePiece.value = choice;
  choosePiece.className = "piece-select";

  switch(choice) {
    case "Queen":
      choosePiece.onclick = piece.toQueen.bind(piece);
      break;
    case "Bishop":
      choosePiece.onclick = piece.toBishop.bind(piece);
      break;
    case "Knight":
      choosePiece.onclick = piece.toKnight.bind(piece);
      break;
    case "Rook":
      choosePiece.onclick = piece.toRook.bind(piece);
      break;
  }

  element.appendChild(choosePiece);
}