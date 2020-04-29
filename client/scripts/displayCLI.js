import { Pawn } from "./pieces/pawn.js";
import { pieceIcons, bottomPlayerColor, topPlayerColor, boardSize } from "./constants/config.js";
let readline;
(async () => {
  await import("readline").then(lib => readline = lib);
 })();

const possiblePieceNameAfterPromotion = ["Queen", "Bishop", "Rook", "Knight"];

function readPiecePromotion() {
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const getLine = (function () {
    const getLineGen = (async function* () {
      for await (const line of rl) {
        yield line;
      }
    })();
    return async () =>
      (await getLineGen.next()).value
        .trim()
        .toLowerCase()
        .replace(/./, firstChar => firstChar.toUpperCase());
  })();

  const askDesirablePiece = async () => {
    let piece;
    while(!possiblePieceNameAfterPromotion.includes(piece)) {
      console.log("Enter desirable piece: queen OR rook OR bishop OR knight  :");
      piece = await getLine();
      if (possiblePieceNameAfterPromotion.includes(piece)) {
        break;
      }
    }
    rl.close();
    return piece;
  };
  return askDesirablePiece;
}

export const DisplayCLI = function(board) {
  this.board = board;
  this.currentState = 1;
  this.states = {
    Game: 1,
    End: 0
  };
  this.winner = "";
};

DisplayCLI.prototype.render = async function(turn) {
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
          let desirablePiece = await readPiecePromotion()();
          process.openStdin();
          stringifiedBoard += `${getPieceIcon(piece.promotion(desirablePiece))}`;
        } else {
          stringifiedBoard += ` ${getPieceIcon(piece)} `;
        }
      }
    }
    stringifiedBoard += `  ${boardSize - i}\n`;
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