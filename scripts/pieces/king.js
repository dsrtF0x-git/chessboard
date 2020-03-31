import { linkPrototype, Piece } from "./piece.js";
import { Util } from "../util.js";
import { Chess } from "../chess.js";

export const King = function(color, board, position) {
  this.init(color, board, position);
  this.name = "King";
  this.icon = "♔";
};

linkPrototype(King);

King.prototype.validMove = function(startPosition, endPosition) {
  const [ startPositionX, startPositionY ] = startPosition;
  const [ endPositionX, endPositionY ] = endPosition;

  if (this.checkIfCastleMove(endPosition)) {
    return true;
  }

  if (Math.abs(endPositionX - startPositionX) < 2 && Math.abs(endPositionY - startPositionY) < 2) {
    const enemyKing = this.color === "white" ? Chess.blackKing : Chess.whiteKing;
    let enemyKingPositionX = enemyKing.currentPosition[0],
        enemyKingPositionY = enemyKing.currentPosition[1];
    if (Math.abs(endPositionX - enemyKingPositionX) <= 1 && Math.abs(endPositionY - enemyKingPositionY) <= 1) {
      return false;
    }
    return Piece.prototype.validMove.call(this, startPosition, endPosition);
  }
  return false;
};

King.prototype.checkmate = function() {
  let startPosition, endPosition, piece;
  for (let i = 0; i < this.board.grid.length; i++) {
    for (let j = 0; j < this.board.grid[i].length; j++) {
      startPosition = [i, j];
      piece = this.board.getPiece(startPosition);

      if (piece !== null && piece.color === this.color) {
        for (let m = 0; m < this.board.grid.length; m++) {
          for (let n = 0; n < this.board.grid[i].length; n++) {
            endPosition = [m, n];
            if (this.board.move(startPosition, endPosition)) {
              if (!this.inCheck()) {
                this.board.reverseLastMove();
                return false;
              }
              this.board.reverseLastMove();
            }
          }
        }
      }
    }
  }
  return true;
};

King.prototype.inCheck = function(position) {
  let piece;
  if (typeof position === "undefined") {
    position = this.currentPosition;
  }

  for (let i = 0; i < this.board.grid.length; i++) {
    for (let j = 0; j < this.board.grid[i].length; j++) {
      piece = this.board.getPiece([i, j]);
      if (piece !== null && piece.color !== this.color && !(piece instanceof King)) {
        if (Util._includesSubArray(piece.availableMoves(), position)) {
          return true;
        }
      }
    }
  }
  return false;
};

King.prototype.canWhiteKingDidCastle = function(lastPosition) {
  return Util._arrayEquals(lastPosition, [7, 4]) &&
         (Util._arrayEquals(this.currentPosition, [7, 6]) || 
          Util._arrayEquals(this.currentPosition, [7, 2]));
};

King.prototype.canBlackKingDidCastle = function(lastPosition) {
  return Util._arrayEquals(lastPosition, [0, 4]) &&
         (Util._arrayEquals(this.currentPosition, [0, 6]) ||
          Util._arrayEquals(this.currentPosition, [0, 2]));

}

King.prototype.didCastle = function(lastPosition) {
  if (this.moved === 1) {
    return this.canWhiteKingDidCastle(lastPosition) || this.canBlackKingDidCastle(lastPosition);
  }
};

King.prototype.checkIfCastleMove = function(endPosition) {
  const castlingDirection = this.castlingDirection();
  if (this.color === "white" && Util._arrayEquals(endPosition, [7, 2]) && castlingDirection[0]) {
    return true;
  } else if (this.color === "white" && Util._arrayEquals(endPosition, [7, 6]) && castlingDirection[1]) {
    return true;
  } else if (this.color === "black" && Util._arrayEquals(endPosition, [0, 2]) && castlingDirection[0]) {
    return true;
  } else if (this.color === "black" && Util._arrayEquals(endPosition, [0, 6]) && castlingDirection[1]) {
    return true;
  }
  return false;
};

King.prototype.castlingDirection = function() {
  const [ rook1, rook2 ] = this.getRooks();

  return [ 
          (this.canCastle(rook1) && this.castlingCollisionCheck("left")),
          (this.canCastle(rook2) && this.castlingCollisionCheck("right")),
        ];
};

King.prototype.castlingCollisionCheck = function(direction) {
  for (let i = 0; i < 2; i++) {
    if (this.color === "white" && direction === "left") {
      if (this.board.getPiece([7, 3 - i]) !== null || this.inCheck([7, 3 - i])) {
        return false;
      }
    } else if (this.color === "white" && direction === "right") {
      if (this.board.getPiece([7, 5 + i]) !== null || this.inCheck([7, 5 + i])) {
        return false;
      }
    } else if (this.color === "black" && direction === "right") {
      if (this.board.getPiece([0, 5 + i]) !== null || this.inCheck([0, 5 + i])) {
        return false;
      }
    } else if (this.color === "black" && direction === "left") {
      if (this.board.getPiece([0, 3 - i]) !== null || this.inCheck([0, 3 - i])) {
        return false;
      }
    }
  }
  return true;
};

King.prototype.canCastle = function(rook) {
  if (this.moved > 0 || this.inCheck()) {
    return false;
  } else if (rook === null || rook.moved > 0) {
    return false;
  }
  return true;
};

King.prototype.getRooks = function() {
  if (this.color === "white") {
    return [this.board.getPiece([7, 0]), this.board.getPiece([7, 7])];
  } else if (this.color === "black") {
    return [this.board.getPiece([0, 0]), this.board.getPiece([0, 7])];
  }
};