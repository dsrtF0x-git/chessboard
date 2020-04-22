import { moveDirections } from "../constants/config.js";

export const linkPrototype = function(child) {
  child.prototype = Object.create(Piece.prototype);
};

export const Piece = function(color, board, position) {
  this.init(color, board, position);
};

Piece.prototype.init = function(color, board, position) {
  this.color = color;
  this.board = board;
  this.currentPosition = position;
  this.moved = 0;
  this.moves = [];
};

Piece.prototype.availableMoves = function() {
  this.moves = [];
  for (let i = 0; i < this.board.grid.length; i++) {
    for (let j = 0; j < this.board.grid[i].length; j++) {
      if (this.validMove(this.currentPosition, [i, j])) {
        this.moves.push([i, j]);
      }
    }
  }
  return this.moves;
};

Piece.prototype.validMove = function(startPosition, endPosition) {
  const pieceAtEndPosition = this.board.getPiece(endPosition);

  if (pieceAtEndPosition !== null && this.color === pieceAtEndPosition.color) {
    return false;
  }
  if (this.board.getPiece(startPosition).name === "Knight") {
    return true;
  }
  if (!this.collisionCheck(startPosition, endPosition)) {
    return false;
  }
  return true;
};

Piece.prototype.moveDirection = function(startPosition, endPosition) {
  const [ startPositionX, startPositionY ] = startPosition;
  const [ endPositionX, endPositionY ] = endPosition;
  
  if (endPositionX < startPositionX && endPositionY == startPositionY) {
    return moveDirections.up;
  } else if (endPositionX > startPositionX && endPositionY == startPositionY) {
    return moveDirections.down;
  } else if (endPositionX == startPositionX && endPositionY < startPositionY) {
    return moveDirections.left;
  } else if (endPositionX == startPositionX && endPositionY > startPositionY) {
    return moveDirections.right;
  } else if (endPositionX < startPositionX && endPositionY > startPositionY) {
    return moveDirections.upright;
  } else if (endPositionX < startPositionX && endPositionY < startPositionY) {
    return moveDirections.upleft;
  } else if (endPositionX > startPositionX && endPositionY > startPositionY) {
    return moveDirections.downright;
  } else if (endPositionX > startPositionX && endPositionY < startPositionY) {
    return moveDirections.downleft;
  }
};

Piece.prototype.collisionCheck = function(startPosition, endPosition) {
  const [ startPositionX, startPositionY ] = startPosition;
  const [ endPositionX, endPositionY ] = endPosition;
  const pathLength = Math.abs(endPositionY - startPositionY);
  let start, end;  

  switch(this.moveDirection(startPosition, endPosition)) {
    case moveDirections.up:
      start = startPositionX - 1;
      end = endPositionX;
      for (let i = start; i > end; i--) {
        if (!this.board.isWayClear([i, endPositionY])) return false;
      }
      break;

    case moveDirections.down:
      start = startPositionX + 1;
      end = endPositionX;
      for (let i = start; i < end; i++) {
        if (!this.board.isWayClear([i, endPositionY])) return false;
      }
      break;
    
    case moveDirections.left:
      start = startPositionY - 1;
      end = endPositionY;
      for (let i = start; i > end; i--) {
        if (!this.board.isWayClear([endPositionX, i])) return false;
      }
      break;

    case moveDirections.right:
      start = startPositionY + 1;
      end = endPositionY;
      for (let i = start; i < end; i++) {
        if (!this.board.isWayClear([endPositionX, i])) return false;
      }
      break;

    case moveDirections.upright:
      for (let i = 1; i < pathLength; i++) {
        if (!this.board.isWayClear([startPositionX - i, startPositionY + i])) return false;
      }
      break;

    case moveDirections.downright:
      for (let i = 1; i < pathLength; i++) {
        if (!this.board.isWayClear([startPositionX + i, startPositionY + i])) return false;
      }
      break;

    case moveDirections.downleft:
      for (let i = 1; i < pathLength; i++) {
        if (!this.board.isWayClear([startPositionX + i, startPositionY - i])) return false;
      }
      break;

    case moveDirections.upleft:
      for (let i = 1; i < pathLength; i++) {
        if (!this.board.isWayClear([startPositionX - i, startPositionY - i])) return false;
      }
      break;
  }
  return true;
};