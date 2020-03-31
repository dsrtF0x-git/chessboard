import { King } from "./pieces/king.js";
import {
  boardSize,
  topPlayerColor,
  bottomPlayerColor,
  whiteLeftSideRook,
  whiteRightSideRook,
  whiteKingCoordinates,
  blackKingCoordinates,
  blackRightSideRook,
  blackLeftSideRook,
  startPiecesLocation
} from "./constants/config.js";
import { Util } from "./util.js";

export const Board = function(initGame) {
  this.moves = [];
  this.blankBoard = initGame ? false : true;
  this.init();
}

Board.prototype.init = function() {
  this.grid = [];
  for (let i = 0; i < boardSize; i++) {
    this.grid.push([]);
    for (let j = 0; j < boardSize; j++) {
      this.grid[i][j] = this.blankBoard
        ? null
        : this.placePiece(i, j);
    }
  }
};

Board.prototype.findKing = function(kingStartingCoordinates) {
  return this.grid[kingStartingCoordinates.x][kingStartingCoordinates.y];
};

Board.prototype.move = function(startPosition, endPosition) {
  const piece1 = this.getPiece(startPosition),
        piece2 = this.getPiece(endPosition);

  if (piece1.validMove(startPosition, endPosition)) {
    this.movePiece(piece1, piece2, startPosition, endPosition);
    this.isCastlingCondition(piece1, startPosition);
    return true;
  }
  return false;
};

Board.prototype.movePiece = function(piece1, piece2, startPosition, endPosition) {
  this.grid[startPosition[0]][startPosition[1]] = null;
  this.grid[endPosition[0]][endPosition[1]] = piece1;
  piece1.currentPosition = endPosition;
  piece1.moved++;
  this.moves.push([startPosition, endPosition, piece1, piece2]);
};

Board.prototype.isCastlingCondition = function(piece, lastPosition) {
  if (piece instanceof King && piece.didCastle(lastPosition)) {
    this.findRook(piece);
  }
};

Board.prototype.findRook = function(king) {
  if (king.color === bottomPlayerColor) {
    if (Util._arrayEquals(king.currentPosition, whiteKingCoordinates.rightCastlePos)) {
      this.moveRook(whiteRightSideRook.startPos, whiteRightSideRook.afterCastlingPos);
    } else if (Util._arrayEquals(king.currentPosition, whiteKingCoordinates.leftCastlePos)) {
      this.moveRook(whiteLeftSideRook.startPos, whiteLeftSideRook.afterCastlingPos);
    }
  } else if (king.color === topPlayerColor) {
    if (Util._arrayEquals(king.currentPosition, blackKingCoordinates.rightCastlePos)) {
      this.moveRook(blackRightSideRook.startPos, blackRightSideRook.afterCastlingPos);
    } else if (Util._arrayEquals(king.currentPosition, blackKingCoordinates.leftCastlePos)) {
      this.moveRook(blackLeftSideRook.startPos, blackLeftSideRook.afterCastlingPos);
    }
  }
};

Board.prototype.moveRook = function(startPosition, endPosition) {
  const rook = this.getPiece(startPosition);
  this.movePiece(rook, null, startPosition, endPosition);
};

Board.prototype.reverseLastMove = function() {
  const [startPosition, endPosition, piece1, piece2] = this.moves.pop();
  piece1.moved--;

  this.grid[startPosition[0]][startPosition[1]] = piece1;
  piece1.currentPosition = startPosition;

  this.grid[endPosition[0]][endPosition[1]] = piece2;
  if (piece2 !== null) {
    piece2.currentPosition = endPosition;
  }
};

Board.prototype.isWayClear = function(coordinates) {
  return this.getPiece(coordinates) === null;
};

Board.prototype.getPiece = function(coordinates) {
  return this.grid[coordinates[0]][coordinates[1]];
};

Board.prototype.placePiece = function(i, j) {
  const position = [i, j];

  const config = startPiecesLocation.get(position.join(""));

  return config ? new config.piece(config.color, this, position) : null;
};