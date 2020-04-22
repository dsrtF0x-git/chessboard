import {
  boardSize,
  topPlayerColor,
  bottomPlayerColor,
  whiteLeftSideRook,
  whiteRightSideRook,
  whiteKingCoordinates,
  blackKingCoordinates,
  blackRightSideRook,
  blackLeftSideRook
} from "./constants/config.js";
import { Pawn } from "./pieces/pawn.js";
import { Rook } from "./pieces/rook.js";
import { Queen } from "./pieces/queen.js";
import { Bishop } from "./pieces/bishop.js";
import { King } from "./pieces/king.js";
import { Knight } from "./pieces/knight.js";
import { Util } from "./util.js";

const startPiecesLocation = new Map([
  ["00", {piece: Rook, color: topPlayerColor}],
  ["01", {piece: Knight, color: topPlayerColor}],
  ["02", {piece: Bishop, color: topPlayerColor}],
  ["03", {piece: Queen, color: topPlayerColor}],
  ["04", {piece: King, color: topPlayerColor}],
  ["05", {piece: Bishop, color: topPlayerColor}],
  ["06", {piece: Knight, color: topPlayerColor}],
  ["07", {piece: Rook, color: topPlayerColor}],
  ["10", {piece: Pawn, color: topPlayerColor}],
  ["11", {piece: Pawn, color: topPlayerColor}],
  ["12", {piece: Pawn, color: topPlayerColor}],
  ["13", {piece: Pawn, color: topPlayerColor}],
  ["14", {piece: Pawn, color: topPlayerColor}],
  ["15", {piece: Pawn, color: topPlayerColor}],
  ["16", {piece: Pawn, color: topPlayerColor}],
  ["17", {piece: Pawn, color: topPlayerColor}],
  ["70", {piece: Rook, color: bottomPlayerColor}],
  ["71", {piece: Knight, color: bottomPlayerColor}],
  ["72", {piece: Bishop, color: bottomPlayerColor}],
  ["73", {piece: Queen, color: bottomPlayerColor}],
  ["74", {piece: King, color: bottomPlayerColor}],
  ["75", {piece: Bishop, color: bottomPlayerColor}],
  ["76", {piece: Knight, color: bottomPlayerColor}],
  ["77", {piece: Rook, color: bottomPlayerColor}],
  ["60", {piece: Pawn, color: bottomPlayerColor}],
  ["61", {piece: Pawn, color: bottomPlayerColor}],
  ["62", {piece: Pawn, color: bottomPlayerColor}],
  ["63", {piece: Pawn, color: bottomPlayerColor}],
  ["64", {piece: Pawn, color: bottomPlayerColor}],
  ["65", {piece: Pawn, color: bottomPlayerColor}],
  ["66", {piece: Pawn, color: bottomPlayerColor}],
  ["67", {piece: Pawn, color: bottomPlayerColor}],
]);

export const Board = function(initGame) {
  this.moves = [];
  this.blankBoard = !initGame;
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

Board.prototype.setPieceOnGrid = function(position, piece) {
  const [ positionX, positionY ] = position;
  this.grid[positionX][positionY] = piece;
}

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
  this.setPieceOnGrid(startPosition, null);
  this.setPieceOnGrid(endPosition, piece1);
  piece1.currentPosition = endPosition;
  piece1.moved++;
  this.moves.push([startPosition, endPosition, piece1, piece2]);
};

Board.prototype.isCastlingCondition = function(piece, lastPosition) {
  if (piece.name === "King" && piece.didCastle(lastPosition)) {
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

  this.setPieceOnGrid(startPosition, piece1);

  piece1.currentPosition = startPosition;
  
  this.setPieceOnGrid(endPosition, piece2);
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