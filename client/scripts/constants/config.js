export const topPlayerColor = "black";
export const bottomPlayerColor = "white";
export const boardSize = 8;
export const BASE_URL = "http://localhost:4444";
export const blackKingCoordinates = { x: 0, y: 4, rightCastlePos: [0, 6], leftCastlePos: [0, 2] };
export const whiteKingCoordinates = { x: 7, y: 4, rightCastlePos: [7, 6], leftCastlePos: [7, 2] };
export const blackLeftSideRook = { startPos: [0, 0], afterCastlingPos: [0, 3] };
export const blackRightSideRook = { startPos: [0, 7], afterCastlingPos: [0, 5] };
export const whiteLeftSideRook = { startPos: [7, 0], afterCastlingPos: [7, 3] };
export const whiteRightSideRook = { startPos: [7, 7], afterCastlingPos: [7, 5] };
export const piecesImage = new Map([
  ["blackPawn", "./images/pd.svg"],
  ["blackQueen", "./images/qd.svg"],
  ["blackKing", "./images/kd.svg"],
  ["blackBishop", "./images/bd.svg"],
  ["blackKnight", "./images/nd.svg"],
  ["blackRook", "./images/rd.svg"],
  ["whitePawn", "./images/pl.svg"],
  ["whiteQueen", "./images/ql.svg"],
  ["whiteKing", "./images/kl.svg"],
  ["whiteBishop", "./images/bl.svg"],
  ["whiteKnight", "./images/nl.svg"],
  ["whiteRook", "./images/rl.svg"],
]);
export const pieceIcons = new Map([
  ["blackPawn", "♟"],
  ["blackQueen", "♛"],
  ["blackKing", "♚"],
  ["blackBishop", "♝"],
  ["blackKnight", "♞"],
  ["blackRook", "♜"],
  ["whitePawn", "♙"],
  ["whiteQueen", "♕"],
  ["whiteKing", "♔"],
  ["whiteBishop", "♗"],
  ["whiteKnight", "♘"],
  ["whiteRook", "♖"],
]);
export const moveDirections = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
  upright: "upright",
  upleft: "upleft",
  downright: "downright",
  downleft: "downleft"
};
export const environments = {
  node: "process",
  browser: "window"
};
export const commands = {
  save: {
    hostname: "localhost",
    port: 4444,
    path: "/save-state",
    method: "POST",
  },
  load: {
    hostname: "localhost",
    port: 4444,
    path: "/load-state",
    method: "GET",
  },
};