export const Util = {
  _includesSubArray(array, subArray) {
    for (let i = 0; i < array.length; i++) {
      if (this._arrayEquals(array[i], subArray) === true) return true;
    }
    return false;
  },

  _arrayEquals(array1, array2) {
    for (let i = 0; i < array2.length; i++) {
      if (array1[i] !== array2[i]) return false;
    }
    return true;
  },

  _trackMove(from, to) {
    const fromRow = from[0],
          fromCol = from[1],
          toRow = to[0],
          toCol = to[1];
    const matchRowMatrix = { 0: 8, 1: 7, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1 };
    const matchColumnMatrix = { 0: "a", 1: "b", 2: "c", 3: "d", 4: "e", 5: "f", 6: "g", 7: "h" };
    return `${matchColumnMatrix[fromCol]}${matchRowMatrix[fromRow]}:${matchColumnMatrix[toCol]}${matchRowMatrix[toRow]}`;
  }
};