import { Pawn } from "./pieces/pawn.js";
import { pieceIcons, bottomPlayerColor, topPlayerColor } from "./constants/config.js";
let readline;
(async () => {
  await import("../node_modules/readline-sync/lib/readline-sync.js").then(res => readline = res.default.question);
 })();

const possiblePieceNameAfterPromotion = ["Queen", "Bishop", "Rook", "Knight"];

export const DisplayCLI = function(board) {
  this.board = board;
  this.currentState = 1;
  this.states = {
    Game: 1,
    End: 0
  };
  this.winner = "";
};

DisplayCLI.prototype.renderToCLI = function(turn) {
  const getPieceIcon = ({color, name}) => {
    return pieceIcons.get(`${color}${name}`);
  }
  console.log("\x1b[32m%s\x1b[0m", `${turn === topPlayerColor ? "Turn black" : ""}`);
  let stringifiedBoard = ``;
  for (let i = 0; i < this.board.grid.length; i++) {
    for (let j = 0; j < this.board.grid[i].length; j++) {
      const piece = this.board.getPiece([i, j]);
      if (piece === null) {
        stringifiedBoard += " _ ";
      } else {
        if (piece instanceof Pawn && piece.promotion()) {
          let desirablePiece = readline(
            "Enter desirable piece: queen OR rook OR bishop OR knight] "
          )
            .trim()
            .toLowerCase()
            .replace(/./, (char) => char.toUpperCase());
          while (!possiblePieceNameAfterPromotion.includes(desirablePiece)) {
            desirablePiece = readline("Wrong name for desirable piece ")
              .trim()
              .toLowerCase()
              .replace(/./, (char) => char.toUpperCase());
            if (possiblePieceNameAfterPromotion.includes(desirablePiece)) {
              break;
            }
          }
          process.openStdin();
          stringifiedBoard += `${getPieceIcon(piece.promotion(desirablePiece))}`;
        } else {
          stringifiedBoard += ` ${getPieceIcon(piece)} `;
        }
      }
    }
    stringifiedBoard += `  ${8 - i}\n`;
  }
  console.log(`${stringifiedBoard} a  b  c  d  e  f  g  h \n`);
  console.log("\x1b[32m%s\x1b[0m", `${turn === bottomPlayerColor ? "White turn" : ""}`);
};

DisplayCLI.prototype.showWinnerCLI = function(color) {
  this.currentState = this.states.End;
  switch(color) {
    case bottomPlayerColor: console.log(`Black won!`); break;
    case topPlayerColor: console.log("White won"); break;
    default: return console.log("Draw");
  }
  process.exit(0);
};