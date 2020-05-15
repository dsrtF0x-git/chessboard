import { Piece, linkPrototype } from "./piece.js";
import { topPlayerColor, bottomPlayerColor, environments } from "../constants/config.js"
import { browserCurrentGame } from "../browserLauncher.js";
import { env } from "../helpers/determine-environment.js";
import { Queen } from "./queen.js";
import { Bishop } from "./bishop.js";
import { Rook } from "./rook.js";
import { Knight } from "./knight.js";

const pawnPromotionsList = new Map([
  ["Queen", {piece: Queen}],
  ["Knight", {piece: Knight}],
  ["Rook", {piece: Rook}],
  ["Bishop", {piece: Bishop}],
]);

export const Pawn = function(color, board, position, moved) {
  this.init(color, board, position, moved);
  this.name = "Pawn";
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

Pawn.prototype.promotion = function(toPiece) {
  if (this.color === bottomPlayerColor && this.currentPosition[0] === 0) {
    if (environments.browser === env) {
      browserCurrentGame.display.pawnPromotion(this);
    } else {
      if (!toPiece) {
        return true;
      } else {
        const desirablePiece = pawnPromotionsList.get(toPiece);
        return this.promoteTo(desirablePiece.piece);   
      }
    }
  } else if (this.color === topPlayerColor && this.currentPosition[0] === 7) {
    if (environments.browser === env) {
      browserCurrentGame.display.pawnPromotion(this);
    } else {
      if (!toPiece) {
        return true;
      } else {
        const desirablePiece = pawnPromotionsList.get(toPiece);
        return this.promoteTo(desirablePiece.piece);
      }
    }
  }
};

Pawn.prototype.promoteTo = function(promoteToPiece) {
  const [ positionX, positionY ] = this.currentPosition;
  let pawnAfterPromote;
  if (environments.browser === env) {
    pawnAfterPromote = pawnPromotionsList.get(promoteToPiece);
    this.board.grid[positionX][positionY] = new pawnAfterPromote.piece(this.color, this.board, this.currentPosition);
    browserCurrentGame.display.clearPromotion()
  } else {
    pawnAfterPromote = new promoteToPiece(this.color, this.board, this.currentPosition);
    this.board.grid[positionX][positionY] = pawnAfterPromote;
    return pawnAfterPromote;
  }
};