// create two-dimensional field
function getTable(cells, boardSize) {
  const result = [];
  for (
    let s = 0, e = boardSize;
    s < cells.length;
    s += boardSize, e += boardSize
  ) {
    result.push(cells.slice(s, e));
  }
  return result;
}

function getAttackCells(cells, index, maxRange) {
  const allowedCells = [];
  let findIndex;
  let row;
  for (let i = 0; i < cells.length; i += 1) {
    row = i;
    findIndex = cells[i].findIndex((el) => el === index);
    if (findIndex !== -1) break;
  }
  for (let i = -maxRange; i <= maxRange; i += 1) {
    for (let j = -maxRange; j <= maxRange; j += 1) {
      if (
        row + i >= 0
        && findIndex + j >= 0
        && row + i < cells.length
        && findIndex + j < cells.length
        && cells[row + i][findIndex + j] !== index
      ) {
        allowedCells.push(cells[row + i][findIndex + j]);
      }
    }
  }
  return allowedCells;
}

function getTransitionCells(cells, index, maxRange) {
  const transitCells = [];
  let findIndex;
  let row;
  for (let i = 0; i < cells.length; i += 1) {
    row = i;
    findIndex = cells[i].findIndex((el) => el === index);
    if (findIndex !== -1) break;
  }

  for (let i = 1; i <= maxRange; i += 1) {
    if (findIndex - i >= 0) {
      transitCells.push(cells[row][findIndex - i]);
    }

    if (findIndex + i < cells.length) {
      transitCells.push(cells[row][findIndex + i]);
    }
    if (row + i < cells.length && findIndex - i >= 0) {
      transitCells.push(cells[row + i][findIndex - i]);
    }

    if (row + i < cells.length && findIndex + i < cells.length) {
      transitCells.push(cells[row + i][findIndex + i]);
    }

    if (row - i >= 0 && findIndex - i >= 0) {
      transitCells.push(cells[row - i][findIndex - i]);
    }

    if (row - i >= 0 && findIndex + i < cells.length) {
      transitCells.push(cells[row - i][findIndex + i]);
    }

    if (row - i >= 0) {
      transitCells.push(cells[row - i][findIndex]);
    }

    if (row + i < cells.length) {
      transitCells.push(cells[row + i][findIndex]);
    }
  }
  return transitCells;
}

// returns cells allowed for action
export default function getTransitionAttackCells(
  index,
  boardSize,
  maxRange,
  attack = false,
) {
  const arrayCells = [];
  for (let i = 0; i < boardSize ** 2; i += 1) {
    arrayCells.push(i);
  }

  const tableCells = getTable(arrayCells, boardSize);
  if (attack) {
    return getAttackCells(tableCells, index, maxRange);
  }
  return getTransitionCells(tableCells, index, maxRange);
}
