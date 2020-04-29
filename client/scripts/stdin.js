import readline from "readline";

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
  return async () => (await getLineGen.next()).value;
})();
const main = async () => {
  let piece;
  while(!possiblePieceNameAfterPromotion.includes(piece)) {
    console.log("Enter desirable piece: ");
    piece = await getLine();
    if (possiblePieceNameAfterPromotion.includes(desirablePiece)) {
      break;
    }
  }
  rl.close();
  return piece;
};