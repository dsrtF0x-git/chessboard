import { Chess } from "./chess.js";
import { Util } from "./util.js";

const inheritsFromPiece = function(child) {
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
  if (this.board.getPiece(endPosition) !== null && this.color === this.board.getPiece(endPosition).color) return false;
  if (this.board.getPiece(startPosition) instanceof Knight) return true;
  if (this.collisionCheck(startPosition, endPosition) === false) return false;
  return true;
};

Piece.prototype.pieceDirection = function(startPosition, endPosition) {
  let a = startPosition[0],
      b = startPosition[1],
      x = endPosition[0],
      y = endPosition[1];
  
  if (x < a && y == b) {
    return "up";
  } else if (x > a && y == b) {
    return "down";
  } else if (x == a && y < b) {
    return "left";
  } else if (x == a && y > b) {
    return "right";
  } else if (x < a && y > b) {
    return "upright";
  } else if (x < a && y < b) {
    return "upleft";
  } else if (x > a && y > b) {
    return "downright";
  } else if (x > a && y < b) {
    return "downleft";
  }
};

Piece.prototype.collisionCheck = function(startPosition, endPosition) {
  let a = startPosition[0],
      b = startPosition[1],
      x = endPosition[0],
      y = endPosition[1],
      start,
      end,
      pathLength;

  pathLength = Math.abs(y - b);

  switch(this.pieceDirection(startPosition, endPosition)) {
    case "up":
      start = a - 1;
      end = x;
      for (let i = start; i > end; i--) {
        if (this.board.getPiece([i, y]) !== null) return false;
      }
      break;

    case "down":
      start = a + 1;
      end = x;
      for (let i = start; i < end; i++) {
        if (this.board.getPiece([i, y]) !== null) return false;
      }
      break;
    
    case "left":
      start = b - 1;
      end = y;
      for (let i = start; i > end; i--) {
        if (this.board.getPiece([x, i]) !== null) return false;
      }
      break;

    case "right":
      start = b + 1;
      end = y;
      for (let i = start; i < end; i++) {
        if (this.board.getPiece([x, i]) !== null) return false;
      }
      break;

    case "upright":
      for (let i = 1; i < pathLength; i++) {
        if (this.board.getPiece([a - i, b + i]) !== null) return false;
      }
      break;

    case "downright":
      for (let i = 1; i < pathLength; i++) {
        if (this.board.getPiece([a + i, b + i]) !== null) return false;
      }
      break;

    case "downleft":
      for (let i = 1; i < pathLength; i++) {
        if (this.board.getPiece([a + i, b - i]) !== null) return false;
      }
      break;

    case "upleft":
      for (let i = 1; i < pathLength; i++) {
        if (this.board.getPiece([a - i, b - i]) !== null) return false;
      }
      break;
  }
  return true;
};

export const Queen = function(color, board, position) {
  this.init(color, board, position);
  this.show = this.color === "black" ? "<div><img src='./images/qd.svg'></div>" : "<div><img src='./images/ql.svg'></div>";
  this.name = "Queen";
  this.icon = "♕";
};

inheritsFromPiece(Queen);

Queen.prototype.validMove = function(startPosition, endPosition) {
  const a = startPosition[0],
        b = startPosition[1],
        x = endPosition[0],
        y = endPosition[1];

  if (Math.abs(x - a) === Math.abs(y - b) || x === a || y === b) {
    return Piece.prototype.validMove.call(this, startPosition, endPosition);
  }
  return false;
};

export const King = function(color, board, position) {
  this.init(color, board, position);
  this.show = this.color === "black" ? "<div><img src='./images/kd.svg'></div>" : "<div><img src='./images/kl.svg'></div>";
  this.name = "King";
  this.icon = "♔";
};

inheritsFromPiece(King);
King.prototype.validMove = function(startPosition, endPosition) {
  const a = startPosition[0],
        b = startPosition[1],
        x = endPosition[0],
        y = endPosition[1];

  if (this.checkIfCastleMove(endPosition)) return true;

  if (Math.abs(x - a) < 2 && Math.abs(y - b) < 2) {
    const enemyKing = this.color === "white" ? Chess.bKing : Chess.wKing;
    let enemyKingPositionX = enemyKing.currentPosition[0],
        enemyKingPositionY = enemyKing.currentPosition[1];
    if (Math.abs(x - enemyKingPositionX) <= 1 && Math.abs(y - enemyKingPositionY) <= 1) {
      return false;
    }
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
  console.log("check")
  let piece;
  if (typeof position === "undefined") position = this.currentPosition;

  for (let i = 0; i < this.board.grid.length; i++) {
    for (let j = 0; j < this.board.grid[i].length; j++) {
      piece = this.board.getPiece([i, j]);
      if (piece !== null && piece.color !== this.color && !(piece instanceof King)) {
        if (Util._includesSubArray(piece.availableMoves(), position)) return true;
      }
    }
  }
  return false;
};

King.prototype.didCastle = function(lastPosition) {
  if (
    this.color === "white" &&
    Util._arrayEquals(lastPosition, [7, 4]) &&
    this.moved === 1 && 
    (Util._arrayEquals(this.currentPosition, [7, 6]) || Util._arrayEquals(this.currentPosition, [7, 2]))
  ) {
    return true;
  } else if (
    this.color === "black" &&
    Util._arrayEquals(lastPosition, [0, 4]) &&
    this.moved === 1 &&
    (Util._arrayEquals(this.currentPosition, [0, 6]) || Util._arrayEquals(this.currentPosition, [0, 2]))
  ) {
    return true;
  }
  return false;
};

King.prototype.checkIfCastleMove = function(endPosition) {
  const castlingDirection = this.castlingDirection();
  if (this.color === "white" && Util._arrayEquals(endPosition, [7, 2]) && castlingDirection[0]) {
    return true;
  } else if (this.color === "white" && Util._arrayEquals(endPosition, [7, 6]) && castlingDirection[1]) {
    return true;
  } else if (this.color === "black" && Util._arrayEquals(endPosition, [0, 2]) && castlingDirection[0]) {
    return true;
  } else if (this.color === "black" && Util._arrayEquals(endPosition, [0, 6]) && castlingDirection[1]) {
    return true;
  }
  return false;
};

King.prototype.castlingDirection = function() {
  const rooks = this.getRooks();
  const result = [];

  result[0] = this.canCastle(rooks[0]) && this.castlingCollisionCheck("left");
  result[1] = this.canCastle(rooks[1]) && this.castlingCollisionCheck("right");

  return result;
};

King.prototype.castlingCollisionCheck = function(direction) {
  for (let i = 0; i < 2; i++) {
    if (this.color === "white" && direction === "left") {
      if (this.board.getPiece([7, 3 - i]) !== null || this.inCheck([7, 3 - i])) return false;
    } else if (this.color === "white" && direction === "right") {
      if (this.board.getPiece([7, 5 + i]) !== null || this.inCheck([7, 5 + i])) return false;
    } else if (this.color === "black" && direction === "right") {
      if (this.board.getPiece([0, 5 + i]) !== null || this.inCheck([0, 5 + i])) return false;
    } else if (this.color === "black" && direction === "left") {
      if (this.board.getPiece([0, 3 - i]) !== null || this.inCheck([0, 3 - i])) return false;
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
  if (this.color === "white") {
    return [this.board.getPiece([7, 0]), this.board.getPiece([7, 7])];
  } else if (this.color === "black") {
    return [this.board.getPiece([0, 0]), this.board.getPiece([0, 7])];
  }
};

export const Knight = function(color, board, position) {
  this.init(color, board, position);
  this.show = this.color === "black" ? "<div><img src='./images/nd.svg'></div>" : "<div><img src='./images/nl.svg'></div>";
  this.name = "Knight";
  this.icon = "♘";
};

inheritsFromPiece(Knight);

Knight.prototype.validMove = function(startPosition, endPosition) {
  const a = startPosition[0],
        b = startPosition[1],
        x = endPosition[0],
        y = endPosition[1];

  if ((Math.abs(x - a) === 1 && Math.abs(y - b) === 2) || (Math.abs(x - a) === 2 && Math.abs(y - b) === 1)) {
    return Piece.prototype.validMove.call(this, startPosition, endPosition);
  }
  return false;
};

export const Bishop = function(color, board, position) {
  this.init(color, board, position);
  this.show = this.color === "black" ? "<div><img src='./images/bd.svg'></div>" : "<div><img src='./images/bl.svg'></div>";
  this.name = "Bishop";
  this.icon = "♗";
};

inheritsFromPiece(Bishop);

Bishop.prototype.validMove = function(startPosition, endPosition) {
  const a = startPosition[0],
        b = startPosition[1],
        x = endPosition[0],
        y = endPosition[1];
  
  if (Math.abs(x - a) === Math.abs(y - b)) {
    return Piece.prototype.validMove.call(this, startPosition, endPosition);
  }
  return false;
};

export const Rook = function(color, board, position) {
  this.init(color, board, position);
  this.show = this.color === "black" ? "<div><img src='./images/rd.svg'></div>" : "<div><img src='./images/rl.svg'></div>";
  this.name = "Rook";
  this.icon = "♖";
};

inheritsFromPiece(Rook);

Rook.prototype.validMove = function(startPosition, endPosition) {
  const a = startPosition[0],
        b = startPosition[1],
        x = endPosition[0],
        y = endPosition[1];

  if (x === a || y === b) {
    return Piece.prototype.validMove.call(this, startPosition, endPosition);
  }
  return false;
};

export const Pawn = function(color, board, position) {
  this.init(color, board, position);
  this.show = this.color === "black" ? "<div><img src='./images/pd.svg'></div>" : "<div><img src='./images/pl.svg'></div>";
  this.name = "Pawn";
  this.icon = "♙";
};

inheritsFromPiece(Pawn);

Pawn.prototype.validMove = function(startPosition, endPosition) {
  const a = startPosition[0],
        b = startPosition[1],
        x = endPosition[0],
        y = endPosition[1];
  if (this.board.grid[x][y] !== null && b === y) return false;

  if (this.color === "white" && a === 6 && y === b && Math.abs(x - a) === 2 && this.board.getPiece([a - 1, b]) === null) {
    return true;
  } else if (this.color === "black" && a === 1 && y === b && Math.abs(x - a) === 2 && this.board.getPiece([a + 1, b]) === null) {
    return true;
  }

  if (this.color === "white" && a - x === 1 && Math.abs(b - y) === 1 && this.board.grid[x][y] !== null && this.board.grid[x][y].color !== this.color) {
    return true;
  } else if (this.color === "black" && a - x === -1 && Math.abs(b - y) === 1 && this.board.grid[x][y] !== null && this.board.grid[x][y].color !== this.color) {
    return true;
  }

  let expression = this.color === "black" ? x - a === 1 && y === b : x - a === -1 && y === b;
  if (expression) return Piece.prototype.validMove.call(this, startPosition, endPosition);
};

Pawn.prototype.promotion = function() {
  if (this.color === "white" && this.currentPosition[0] === 0) {
    Chess.display.pawnPromotion(this);
  } else if (this.color === "black" && this.currentPosition[0] === 7) {
    Chess.display.pawnPromotion(this);
  }
};

Pawn.prototype.toQueen = function() {
  const x = this.currentPosition[0];
  const y = this.currentPosition[1];
  this.board.grid[x][y] = new Queen(this.color, this.board, this.currentPosition);

  if (typeof Chess.display !== "undefined") Chess.display.clearPromotion();
};

Pawn.prototype.toBishop = function() {
  const x = this.currentPosition[0];
  const y = this.currentPosition[1];
  this.board.grid[x][y] = new Bishop(this.color, this.board, this.currentPosition);

  if (typeof Chess.display !== "undefined") Chess.display.clearPromotion();
};

Pawn.prototype.toRook = function() {
  const x = this.currentPosition[0];
  const y = this.currentPosition[1];
  this.board.grid[x][y] = new Rook(this.color, this.board, this.currentPosition);

  if (typeof Chess.display !== "undefined") Chess.display.clearPromotion();
};

Pawn.prototype.toKnight = function() {
  const x = this.currentPosition[0];
  const y = this.currentPosition[1];
  this.board.grid[x][y] = new Knight(this.color, this.board, this.currentPosition);

  if (typeof Chess.display !== "undefined") Chess.display.clearPromotion();
};