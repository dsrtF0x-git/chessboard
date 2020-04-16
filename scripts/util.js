export const Util = {
  _includesSubArray(array, subArray) {
    return array.some(item => this._arrayEquals(item, subArray));
  },

  _arrayEquals(array1, array2) {
    return array1.every((item, i) => item === array2[i]);
  },

  _trackMove([fromX, fromY], [toX, toY]) {
    const moveToRow = { 0: 8, 1: 7, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1 };
    const moveToColumn = { 0: "a", 1: "b", 2: "c", 3: "d", 4: "e", 5: "f", 6: "g", 7: "h" };
    return `${moveToColumn[fromY]}${moveToRow[fromX]}:${moveToColumn[toY]}${moveToRow[toX]}`;
  },

  _convertToNumbersCoordinate(coordinateString) {
    const [ column, row ] = coordinateString.split("");
    const moveToRow = ["8", "7", "6", "5", "4", "3", "2", "1"];
    const moveToColumn = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return [moveToRow.indexOf(row), moveToColumn.indexOf(column)];
  },

  _getLast(array) {
    return array[array.length - 1];
  },
};