const isValidMatrix = (ar) => {
  let rowMap = Array.from({ length: 9 }, () => {});
  let colMap = Array.from({ length: 9 }, () => {});
  let squareMap = {};
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const num = ar[i][j];
      if (rowMap[i][num]) {
        return false;
      } else {
        rowMap[i][num] = true;
      }
      if (colMap[j][num]) {
        return false;
      } else {
        rowMap[j][num] = true;
      }
      const x = i / 3;
      const y = j / 3;
      const key = `${x}_${y}`;
      if (!squareMap[key]) {
        squareMap[key] = {};
      }
      if (squareMap[key][num]) {
        return false;
      } else {
        squareMap[key][num] = true;
      }
    }
  }
  return true;
};
