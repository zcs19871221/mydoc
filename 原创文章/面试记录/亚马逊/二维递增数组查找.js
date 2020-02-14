//  leetCode原题
const input = [
  [1, 4, 7, 11, 15],
  [2, 5, 8, 12, 19],
  [3, 6, 9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
];

const findNum = (target, list) => {
  if (!Number.isInteger(target) || !Array.isArray(list) || list.length === 0) {
    throw new Error("参数错误");
  }
  const row = list.length;
  const col = list[0].length;
  let i = 0;
  let j = col - 1;
  while (i < row && j >= 0) {
    const each = list[i][j];
    if (each === target) {
      return [i, j];
    }
    if (each < target) {
      i++;
    } else {
      j--;
    }
  }
  return [-1, -1];
};
console.log(findNum(3, input));
