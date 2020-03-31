import { Pawn } from "../pieces/pawn.js";
import { Bishop } from "../pieces/bishop.js";
import { Queen } from "../pieces/queen.js";
import { Rook } from "../pieces/rook.js";
import { Knight } from "../pieces/knight.js";
import { King } from "../pieces/king.js";

export const isFirstGameSetup = true;
export const topPlayerColor = "black";
export const bottomPlayerColor = "white";
export const boardSize = 8;
export const blackKingCoordinates = { x: 0, y: 4, rightCastlePos: [0, 6], leftCastlePos: [0, 2] };
export const whiteKingCoordinates = { x: 7, y: 4, rightCastlePos: [7, 6], leftCastlePos: [7, 2] };
export const blackLeftSideRook = { startPos: [0, 0], afterCastlingPos: [0, 3] };
export const blackRightSideRook = { startPos: [0, 7], afterCastlingPos: [0, 5] };
export const whiteLeftSideRook = { startPos: [7, 0], afterCastlingPos: [7, 3] };
export const whiteRightSideRook = { startPos: [7, 7], afterCastlingPos: [7, 5] };
export const piecesImage = new Map([
  ["blackPawn", "<div><img src='./images/pd.svg'></div>"],
  ["blackQueen", "<div><img src='./images/qd.svg'></div>"],
  ["blackKing", "<div><img src='./images/kd.svg'></div>"],
  ["blackBishop", "<div><img src='./images/bd.svg'></div>"],
  ["blackKnight", "<div><img src='./images/nd.svg'></div>"],
  ["blackRook", "<div><img src='./images/rd.svg'></div>"],
  ["whitePawn", "<div><img src='./images/pl.svg'></div>"],
  ["whiteQueen", "<div><img src='./images/ql.svg'></div>"],
  ["whiteKing", "<div><img src='./images/kl.svg'></div>"],
  ["whiteBishop", "<div><img src='./images/bl.svg'></div>"],
  ["whiteKnight", "<div><img src='./images/nl.svg'></div>"],
  ["whiteRook", "<div><img src='./images/rl.svg'></div>"],
])
export const startPiecesLocation = new Map([
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
export const pawnPromotionsList = new Map([
  ["Queen", {piece: Queen}],
  ["Knight", {piece: Knight}],
  ["Rook", {piece: Rook}],
  ["Bishop", {piece: Bishop}],
]);