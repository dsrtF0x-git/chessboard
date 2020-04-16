import { linkPrototype, Piece } from "./piece.js";
import { Util } from "../util.js";
import { topPlayerColor, bottomPlayerColor, moveDirections } from "../constants/config.js";

export const King = function(color, board, position) {
  this.init(color, board, position);
  this.name = "King";
};

linkPrototype(King);

King.prototype.findEnemyKing = function(color) {
  for (let i = 0; i < this.board.grid.length; i++) {
    for (let j = 0; j < this.board.grid[i].length; j++) {
      const piece = this.board.grid[i][j];
      if (piece !== null && piece.name === "King" && piece.color !== color) {
        return piece;
      } 
    }
  }
};

King.prototype.validMove = function(startPosition, endPosition) {
  const [ startPositionX, startPositionY ] = startPosition;
  const [ endPositionX, endPositionY ] = endPosition;

  if (this.checkIfCastleMove(endPosition)) {
    return true;
  }

  const isEnemyKingClose = (fromX, fromY, toX, toY) => {
    if (Math.abs(toX - fromX) < 2 && Math.abs(toY - fromY) < 2) {
      const enemyKing = this.findEnemyKing(this.color);
      const [ enemyKingPositionX, enemyKingPositionY ] = enemyKing.currentPosition;
      if (Math.abs(toX - enemyKingPositionX) <= 1 && Math.abs(toY - enemyKingPositionY) <= 1) {
        return false;
      }
      return true;
    }
    return false;
  }

  if (isEnemyKingClose(startPositionX, startPositionY, endPositionX, endPositionY)) {
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

King.prototype.didCastle = function(lastPosition) {

  const canWhiteKingDidCastle = position => {
    return Util._arrayEquals(position, [7, 4]) &&
           (Util._arrayEquals(this.currentPosition, [7, 6]) || 
           Util._arrayEquals(this.currentPosition, [7, 2]));
  }

  const canBlackKingDidCastle = position => {
    return Util._arrayEquals(position, [0, 4]) &&
           (Util._arrayEquals(this.currentPosition, [0, 6]) ||
           Util._arrayEquals(this.currentPosition, [0, 2]));
  }

  if (this.moved === 1) {
    switch (this.color) {
      case bottomPlayerColor: return canWhiteKingDidCastle(lastPosition);
      case topPlayerColor: return canBlackKingDidCastle(lastPosition);
      default: return false;
    }
  }
};

King.prototype.checkIfCastleMove = function(endPosition) {
  const [castlingDirectionX, castlingDirectionY] = this.castlingDirection();
  if (this.color === bottomPlayerColor) {
    return (
      (Util._arrayEquals(endPosition, [7, 2]) && castlingDirectionX) ||
      (Util._arrayEquals(endPosition, [7, 6]) && castlingDirectionY)
    );
  } else if (this.color === topPlayerColor) {
    return (
      (Util._arrayEquals(endPosition, [0, 2]) && castlingDirectionX) ||
      (Util._arrayEquals(endPosition, [0, 6]) && castlingDirectionY)
    );
  }
};

King.prototype.castlingDirection = function() {
  const [ rook1, rook2 ] = this.getRooks();

  return [ 
          (this.canCastle(rook1) && this.castlingCollisionCheck(moveDirections.left)),
          (this.canCastle(rook2) && this.castlingCollisionCheck(moveDirections.right)),
        ];
};

King.prototype.castlingCollisionCheck = function(direction) {
  for (let i = 0; i < 2; i++) {
    if (this.color === bottomPlayerColor && direction === moveDirections.left) {
      if (this.board.getPiece([7, 3 - i]) !== null || this.inCheck([7, 3 - i])) {
        return false;
      }
    } else if (this.color === bottomPlayerColor && direction === moveDirections.right) {
      if (this.board.getPiece([7, 5 + i]) !== null || this.inCheck([7, 5 + i])) {
        return false;
      }
    } else if (this.color === topPlayerColor && direction === moveDirections.right) {
      if (this.board.getPiece([0, 5 + i]) !== null || this.inCheck([0, 5 + i])) {
        return false;
      }
    } else if (this.color === topPlayerColor && direction === moveDirections.left) {
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
  if (this.color === bottomPlayerColor) {
    return [this.board.getPiece([7, 0]), this.board.getPiece([7, 7])];
  } else if (this.color === topPlayerColor) {
    return [this.board.getPiece([0, 0]), this.board.getPiece([0, 7])];
  }
};