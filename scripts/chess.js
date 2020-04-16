import { isBrowser } from "./index.js";
import { Board } from "./board.js";
import { Util } from "./util.js"
import { Display } from "./display.js";
import { DisplayCLI } from "./displayCLI.js";
import {
  topPlayerColor,
  bottomPlayerColor,
  blackKingCoordinates,
  whiteKingCoordinates
} from "./constants/config.js";

export const Chess = function(initGame) {
  this.startPosition = null;
  this.endPosition = null;
  this.board = new Board(initGame);
  this.display = isBrowser ? new Display(this.board) : new DisplayCLI(this.board);
  this.blackKing = this.board.findKing(blackKingCoordinates);
  this.whiteKing = this.board.findKing(whiteKingCoordinates);
  this.currentTurn = bottomPlayerColor;
}

Chess.prototype.selectPosition = function(currentCoordinates) {
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
    if (isBrowser) {
      this.display.showMovesHistory(Util._getLast(this.display.board.moves));
    }
  }
  if (isBrowser) {
    this.display.render(piece, this.startPosition);
  } else {
    //this.display.renderToCLI();
  }
};

Chess.prototype.move = function(startPosition, endPosition) {
  let endPiece = this.board.getPiece(endPosition);
    if (this.board.move(startPosition, endPosition)) {
      if (isBrowser) {
        if (endPiece !== null && this.currentTurn !== endPiece.color) {
          let king = endPiece.color === topPlayerColor ? this.whiteKing : this.blackKing;
          if (!king.inCheck()) {
            this.display.addBeatenPiece(endPiece);
          }
        }
      }
      this.reverseIfInCheck(this.changeTurns.bind(this));
      this.gameOver();
    }
    this.startPosition = null;
    this.endPosition = null;
};

Chess.prototype.changeTurns = function() {
  this.currentTurn = this.currentTurn === bottomPlayerColor ? topPlayerColor : bottomPlayerColor;
  if (isBrowser) {
    this.display.changeTurnIndicator();
  }
};

Chess.prototype.isCheck = function () {
  switch (this.currentTurn) {
    case bottomPlayerColor: return this.whiteKing.inCheck();
    case topPlayerColor: return this.blackKing.inCheck();
    default: throw new Error();
  }
};

Chess.prototype.reverseIfInCheck = function (callback) {
  this.isCheck() ? this.board.reverseLastMove() : callback();
};

Chess.prototype.gameOver = function() {
  if (this.whiteKing.checkmate() || this.blackKing.checkmate()) {
    if (isBrowser) {
      this.display.showWinner(this.currentTurn);
    } else {
      this.display.renderToCLI();
      this.display.showWinnerCLI(this.currentTurn)
    }
  }
};