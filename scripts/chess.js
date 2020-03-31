import { Board } from "./board.js";
import { Util } from "./util.js"
import { Display } from "./display.js";
import { topPlayerColor, bottomPlayerColor, blackKingCoordinates, whiteKingCoordinates } from "./constants/config.js";

export const Chess = {
  newGame(initGame) {
    this.startPosition = null;
    this.endPosition = null;
    this.board = new Board(initGame);
    this.display = new Display(this.board);
    this.blackKing = this.board.findKing(blackKingCoordinates);
    this.whiteKing = this.board.findKing(whiteKingCoordinates);
    this.currentTurn = bottomPlayerColor;
  },

  selectPosition(currentCoordinates) {
    const isOnPieceClicked = (position, piece) => {
      return position === null && piece !== null && piece.color === this.currentTurn;
    }

    let piece = this.board.getPiece(currentCoordinates);

    if (isOnPieceClicked(this.startPosition, piece)) {
      this.startPosition = currentCoordinates;
      piece.availableMoves();
    } else if (Util._arrayEquals(this.startPosition, currentCoordinates)) {
      this.startPosition = null;
      this.moves = [];
      piece = null;
    } else if (this.startPosition !== null) {
      this.endPosition = currentCoordinates;
      this.move(this.startPosition, this.endPosition);
      piece = null;
      this.display.showMovesHistory(Util._getLast(this.display.board.moves));
    }
    this.display.render(piece);
  },

  move(startPosition, endPosition) {
    let endPiece = this.board.getPiece(endPosition);
    if (this.board.move(startPosition, endPosition)) {
      if (endPiece !== null && this.currentTurn !== endPiece.color) {
        let king = endPiece.color === topPlayerColor ? this.whiteKing : this.blackKing;
        if (!king.inCheck()) {
          this.display.addBeatenPiece(endPiece);
        }
      }
      this.reverseIfInCheck(this.changeTurns.bind(this));
      this.gameOver();
    }
    this.startPosition = null;
    this.endPosition = null;
  },

  changeTurns() {
    this.currentTurn = this.currentTurn === bottomPlayerColor ? topPlayerColor : bottomPlayerColor;
    this.display.changeTurnIndicator();
  },

  reverseIfInCheck(callback) {
    if (this.currentTurn === bottomPlayerColor && this.whiteKing.inCheck()) {
      this.board.reverseLastMove();
      return;
    } else if (this.currentTurn === topPlayerColor && this.blackKing.inCheck()) {
      this.board.reverseLastMove();
      return;
    }
    callback();
  },

  gameOver() {
    if (this.currentTurn === bottomPlayerColor) {
      if (this.whiteKing.checkmate()) {
        this.display.showWinner(document.querySelectorAll(".player-name")[0].textContent);
      }
    } else {
      if (this.blackKing.checkmate()) {
        this.display.showWinner(document.querySelectorAll(".player-name")[1].textContent);
      }
    }
  }
}