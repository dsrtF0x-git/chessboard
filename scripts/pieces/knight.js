import { linkPrototype, Piece } from "./piece.js";

export const Knight = function(color, board, position) {
  this.init(color, board, position);
  this.name = "Knight";
};

linkPrototype(Knight);

Knight.prototype.validMove = function(startPosition, endPosition) {
  const [ startPositionX, startPositionY ] = startPosition;
  const [ endPositionX, endPositionY ] = endPosition;

  if (
    (Math.abs(endPositionX - startPositionX) === 1 &&
      Math.abs(endPositionY - startPositionY) === 2) ||
    (Math.abs(endPositionX - startPositionX) === 2 &&
      Math.abs(endPositionY - startPositionY) === 1)
  ) {
    return Piece.prototype.validMove.call(this, startPosition, endPosition);
  }
  return false;
};