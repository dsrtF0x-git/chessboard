const Chess = {
  newGame(initGame) {
    this.startPosition = null;
    this.endPosition = null;
    this.board = new this.Board(initGame);
    this.display = new this.Display(this.board);
    this.bKing = this.board.grid[0][4];
    this.wKing = this.board.grid[7][4];
    this.currentTurn = "white";
  },

  selectPosition(array) {
    let piece = this.board.getPiece(array);
    if (this.startPosition === null && piece !== null && piece.color === this.currentTurn) {
      this.startPosition = array;
      piece.availableMoves();
    } else if (this.Util._arrayEquals(this.startPosition, array)) {
      this.startPosition = null;
      this.moves = [];
      piece = null;
    } else if (this.startPosition !== null) {
      this.endPosition = array;
      this.move(this.startPosition, this.endPosition);
      piece = null;
      this.display.showMovesHistory(this.display.board.moves[this.display.board.moves.length - 1]);
    }
    this.display.render(piece);
  },

  move(startPosition, endPosition) {
    if (this.board.move(startPosition, endPosition)) {
      this.reverseIfInCheck(this.changeTurns.bind(this));
      this.gameOver();
    }
    this.startPosition = null;
    this.endPosition = null;
  },

  changeTurns() {
    this.currentTurn = this.currentTurn === "white" ? "black" : "white";
    [...document.querySelectorAll(".player-name")].forEach(item => {
      item.classList.toggle("current-turn");
    });
  },

  reverseIfInCheck(callback) {
    if (this.currentTurn === "white" && this.wKing.inCheck()) {
      this.board.reverseLastMove();
      return;
    } else if (this.currentTurn === "black" && this.bKing.inCheck()) {
      this.board.reverseLastMove();
      return;
    }
    callback();
  },

  gameOver() {
    if (this.currentTurn === "white") {
      if (this.wKing.checkmate()) {
        this.display.showWinner(document.querySelectorAll(".player-name")[0].textContent);
      }
    } else {
      if (this.bKing.checkmate()) {
        this.display.showWinner(document.querySelectorAll(".player-name")[1].textContent);
      }
    }
  }
}