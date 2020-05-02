import { Chess } from "./chess.js";
import { Util } from "./helpers/util.js";
import { commands, bottomPlayerColor, topPlayerColor } from "./constants/config.js";
let http;
(async () => {
  await import("http").then((lib) => (http = lib));
})();

let nodeCurrentGame;

export function launchCLIGame(isFirstGameSetup) {
  const stdin = process.openStdin();
  nodeCurrentGame = new Chess(isFirstGameSetup);

  console.log(`Please, enter coordinates for move in format:
             ColumnRow ColumnRow . (e.g: e2 e4). [save] - for saving game, [load] - for loading last game.`);
  nodeCurrentGame.display.render(nodeCurrentGame.currentTurn);

  stdin.addListener("data", async function(input) {
    try {
      input = input.toString().trim();
      if (commands.hasOwnProperty(input)) {
        switch(input) {
          case "save": await saveCurrentState(input, nodeCurrentGame); break;
          case "load": await getStoredState(input); break;
          default: throw new Error("Wrong request command.");
        }
      } else {
        const [moveFrom, moveTo] = input.split(/\s+/g);
        nodeCurrentGame.selectPosition(
          Util._convertToNumbersCoordinate(moveFrom)
        );
        nodeCurrentGame.selectPosition(Util._convertToNumbersCoordinate(moveTo));
        nodeCurrentGame.display.render(nodeCurrentGame.currentTurn);
      }
    } catch (error) {}
  });
};

async function saveCurrentState(input) {
  const boardState = nodeCurrentGame.board;

  const fullState = {
    savedTurn: nodeCurrentGame.currentTurn,
    blankBoard: boardState.blankBoard,
    grid: Util._optimizeBoardGrid(boardState.grid),
    moves: boardState.moves.map(move => move.map(item => {
      if (Util._isObject(item)) {
        return { name: item.name, color: item.color }
      }
      return item;
    })),
  };

  const req = http.request(commands[input], () => {
    console.log("Successfully saved.");
  });

  req.on("error", (error) => {
    console.log(error);
  });

  req.write(JSON.stringify(fullState));
  req.end();
};

async function getStoredState(input) {

  const req = http.request(commands[input], res => {
    let storedState = ``;
    res.on("data", chunk => {
      storedState += chunk;
    });

    res.on("end", () => {
      const { blankBoard, grid, moves, savedTurn } = JSON.parse(storedState);
      nodeCurrentGame = new Chess(true);
      const boardState = nodeCurrentGame.board;

      boardState.grid.map((row, i) => {
        row.map((_piece, j) => {
          boardState.grid[i][j] = boardState.replacePiece(grid[i][j]);
        });
      });

      nodeCurrentGame.whiteKing = nodeCurrentGame.board.findKing(bottomPlayerColor);
      nodeCurrentGame.blackKing = nodeCurrentGame.board.findKing(topPlayerColor);
      nodeCurrentGame.board.moves = moves;
      boardState.blankBoard = blankBoard;

     if (nodeCurrentGame.currentTurn !== savedTurn) {
       nodeCurrentGame.changeTurns();
     }
     nodeCurrentGame.display.render(nodeCurrentGame.currentTurn);
    });
  });

  req.on("error", (error) => {
    console.log(error);
  });

  req.end();
};