import { linkPrototype, Piece } from "./piece.js";

export const Bishop = function(color, board, position) {
  this.init(color, board, position);
  this.name = "Bishop";
};

linkPrototype(Bishop);

Bishop.prototype.validMove = function(startPosition, endPosition) {
  const [ startPositionX, startPositionY ] = startPosition;
  const [ endPositionX, endPositionY ] = endPosition;
  
  if (Math.abs(endPositionX - startPositionX) === Math.abs(endPositionY - startPositionY)) {
    return Piece.prototype.validMove.call(this, startPosition, endPosition);
  }
  return false;
};