import { Board } from "./board.js";
import { Util } from "./helpers/util.js"
import { env } from "./helpers/determine-environment.js";
import { createRenderComponent } from "./helpers/createRenderComponent.js";
import {
  topPlayerColor,
  bottomPlayerColor,
  environments
} from "./constants/config.js";

export const Chess = function(initGame) {
  this.startPosition = null;
  this.endPosition = null;
  this.board = new Board(initGame);
  this.display = createRenderComponent(this.board);
  this.blackKing = this.board.findKing(topPlayerColor);
  this.whiteKing = this.board.findKing(bottomPlayerColor);
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
  }
  if (env === environments.browser) {
    this.display.render(piece, this.startPosition);
  }
};

Chess.prototype.move = function(startPosition, endPosition) {
  let endPiece = this.board.getPiece(endPosition);
    if (this.board.move(startPosition, endPosition)) {
      if (env === environments.browser) {
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

Chess.prototype.changeTurns = function(addNewLogLine = true) {
  this.currentTurn = this.currentTurn === bottomPlayerColor ? topPlayerColor : bottomPlayerColor;
  if (env === environments.browser) {
    if (addNewLogLine) {
      this.display.showMovesHistory(Util._getLast(this.display.board.moves));
    }
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
    if (env === environments.browser) {
      this.display.showWinner(this.currentTurn);
    } else {
      this.display.render();
      this.display.showWinnerCLI(this.currentTurn)
    }
  }
};