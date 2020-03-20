Chess.Board = function(grid) {
  if (typeof grid !== "undefined") {
    this.grid = grid;
  } else {
    this.init();
  }
  this.moves = [];
}

Chess.Board.prototype.init = function() {
  this.grid = [];
  for (let i = 0; i < 8; i++) {
    this.grid.push([]);
    for (let j = 0; j < 8; j++) {
      this.grid[i][j] = this.placePiece(i, j);
    }
  }
}

Chess.Board.prototype.move = function(startPosition, endPosition) {
  const piece1 = this.grid[startPosition[0]][startPosition[1]],
        piece2 = this.grid[endPosition[0]][endPosition[1]];

  if (piece1.validMove(startPosition, endPosition)) {
    this.movePiece(piece1, piece2, startPosition, endPosition);
    this.didKingCastle(piece1, startPosition);
    return true;
  }
  return false;
};

Chess.Board.prototype.movePiece = function(piece1, piece2, startPosition, endPosition) {
  this.grid[startPosition[0]][startPosition[1]] = null;
  this.grid[endPosition[0]][endPosition[1]] = piece1;
  piece1.currentPosition = endPosition;
  piece1.moved++;
  this.moves.push([startPosition, endPosition, piece1, piece2]);
};

Chess.Board.prototype.didKingCastle = function(piece, lastPosition) {
  if (piece instanceof Chess.King && piece.didCastle(lastPosition)) {
    this.findRook(piece, lastPosition);
  }
};

Chess.Board.prototype.findRook = function(king) {
  if (king.color === "white") {
    if (Chess.Util._arrayEquals(king.currentPosition, [7, 6])) {
      this.moveRook([7, 7], [7, 5]);
    } else if (Chess.Util._arrayEquals(king.currentPosition, [7, 2])) {
      this.moveRook([7, 0], [7, 3]);
    }
  } else if (king.color === "black") {
    if (Chess.Util._arrayEquals(king.currentPosition, [0, 6])) {
      this.moveRook([0, 7], [0, 5]);
    } else if (Chess.Util._arrayEquals(king.currentPosition, [0, 2])) {
      this.moveRook([0, 0], [0, 3]);
    }
  }
};

Chess.Board.prototype.moveRook = function(startPosition, endPosition) {
  const rook = this.getPiece(startPosition);
  this.movePiece(rook, null, startPosition, endPosition);
};

Chess.Board.prototype.reverseLastMove = function() {
  let lastMove = this.moves[this.moves.length - 1],
      startPosition = lastMove[0],
      endPosition = lastMove[1],
      piece1 = lastMove[2],
      piece2 = lastMove[3];
  piece1.moved--;

  this.grid[startPosition[0]][startPosition[1]] = piece1;
  piece1.currentPosition = startPosition;

  this.grid[endPosition[0]][endPosition[1]] = piece2;
  if (piece2 !== null) piece2.currentPosition = endPosition;

  this.moves.pop();
};

Chess.Board.prototype.getPiece = function(array) {
  return this.grid[array[0]][array[1]];
};

Chess.Board.prototype.placePiece = function(i, j) {
  const position = [i, j];
  if (i === 1) {
    return new Chess.Pawn("black", this, position);
  } else if (i === 6) {
    return new Chess.Pawn("white", this, position);
  } else if (i === 0 && (j === 0 || j === 7)) {
    return new Chess.Rook("black", this, position);
  } else if (i === 0 && (j === 1 || j === 6)) {
    return new Chess.Knight("black", this, position);
  } else if (i === 0 && (j === 2 || j === 5)) {
    return new Chess.Bishop("black", this, position);
  } else if (i === 0 && j === 4) {
    return new Chess.King("black", this, position);
  } else if (i === 0 && j === 3) {
    return new Chess.Queen("black", this, position);
  } else if (i === 7 && (j === 7 || j === 0)) {
    return new Chess.Rook("white", this, position);
  } else if (i === 7 && (j === 6 || j === 1)) {
    return new Chess.Knight("white", this, position);
  } else if (i === 7 && (j === 5 || j === 2)) {
    return new Chess.Bishop("white", this, position);
  } else if (i === 7 && j === 4) {
    return new Chess.King("white", this, position);
  } else if (i === 7 && j === 3) {
    return new Chess.Queen("white", this, position);
  } else {
    return null;
  }
};