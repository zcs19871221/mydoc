/* eslint-disable id-length */
/* 两个人轮流取硬币,可以取1,2,4三个硬币.实现如果我先取,判断这个硬币总数是否能稳赢 */
/* 思路: */
const canWin = (n, map = new Map()) => {
  if (!Number.isInteger(n)) {
    throw new Error("参数错误");
  }
  if (n === 1) {
    return false;
  }
  if (n === 2) {
    return true;
  }
  if (n === 3) {
    return true;
  }
  if (n === 4) {
    return false;
  }
  if (map.has(n)) {
    return map.get(n);
  }
  const res = !canWin(n - 4, map) || !canWin(n - 2, map) || !canWin(n - 1, map);
  map.set(n, res);
  return res;
};


// const canWinDp = (n: number, map: Map<number, boolean> = new Map()): boolean => {
//   const dp: boolean[] = new Array(n + 1);
//   dp[1] = false;
//   dp[2] = true;
//   dp[3] = true;
//   dp[4] = false;
//   for (let i = 5; i <= n; i++) {
//       dp[i] = !dp[i - 1] || !dp[i - 2] || !dp[i - 4]
//   }
//   return dp[n];
// };

console.log(canWin(6));
