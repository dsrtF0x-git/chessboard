import { Piece, linkPrototype } from "./piece.js";
import { topPlayerColor, bottomPlayerColor, pawnPromotionsList } from "../constants/config.js"
import { Chess } from "../chess.js";

export const Pawn = function(color, board, position) {
  this.init(color, board, position);
  this.name = "Pawn";
  this.icon = "♙";
};

linkPrototype(Pawn);

Pawn.prototype.validMove = function(startPosition, endPosition) {
  const [ startPositionX, startPositionY ] = startPosition;
  const [ endPositionX, endPositionY ] = endPosition;

  if (this.board.grid[endPositionX][endPositionY] !== null && startPositionY === endPositionY) {
    return false;
  }

  const isDoubleStepPossible = (fromX, fromY, toX, toY) => {
    if (this.color === bottomPlayerColor && fromX === 6 && fromY === toY) {
      return Math.abs(toX - fromX) === 2 && this.board.getPiece([fromX - 1, fromY]) === null;
    } else if (this.color === topPlayerColor && fromX === 1 && fromY === toY) {
      return Math.abs(toX - fromX) === 2 && this.board.getPiece([fromX + 1, fromY]) === null;
    }
  }

  const isDiagonalStepPossible = (fromX, fromY, toX, toY) => {
    if (this.color === bottomPlayerColor && fromX - toX === 1 && Math.abs(fromY - toY) === 1) {
      return this.board.grid[toX][toY] !== null && this.board.grid[toX][toY].color !== this.color;
    } else if (this.color === topPlayerColor && fromX - toX === -1 && Math.abs(fromY - toY) === 1) {
      return this.board.grid[toX][toY] !== null && this.board.grid[toX][toY].color !== this.color;
    }
  }

  const isOneStepPossible = (fromX, fromY, toX, toY) => {
    return this.color === topPlayerColor
      ? toX - fromX === 1 && toY === fromY
      : toX - fromX === -1 && toY === fromY;
  };

  if (isDoubleStepPossible(startPositionX, startPositionY, endPositionX, endPositionY)) {
    return true;
  };

  if (isDiagonalStepPossible(startPositionX, startPositionY, endPositionX, endPositionY)) {
    return true;
  }

  if (isOneStepPossible(startPositionX, startPositionY, endPositionX, endPositionY)) {
    return Piece.prototype.validMove.call(this, startPosition, endPosition);
  }
};

Pawn.prototype.promotion = function() {
  if (this.color === bottomPlayerColor && this.currentPosition[0] === 0) {
    Chess.display.pawnPromotion(this);
  } else if (this.color === topPlayerColor && this.currentPosition[0] === 7) {
    Chess.display.pawnPromotion(this);
  }
};

Pawn.prototype.promoteTo = function(promoteToPiece) {
  const [ positionX, positionY ] = this.currentPosition;
  const pawnAfterPromote = pawnPromotionsList.get(promoteToPiece);
  this.board.grid[positionX][positionY] = new pawnAfterPromote.piece(this.color, this.board, this.currentPosition);
  Chess.display.clearPromotion();
};