import {linkPrototype, Piece } from "./piece.js";

export const Rook = function(color, board, position) {
  this.init(color, board, position);
  this.name = "Rook";
  this.icon = "♖";
};

linkPrototype(Rook);

Rook.prototype.validMove = function(startPosition, endPosition) {
  const [ startPositionX, startPositionY ] = startPosition;
  const [ endPositionX, endPositionY ] = endPosition;

  if (endPositionX === startPositionX || endPositionY === startPositionY) {
    return Piece.prototype.validMove.call(this, startPosition, endPosition);
  }
  return false;
};