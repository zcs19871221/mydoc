// const ar = [-1, 2, 3, -9, 5, 7];
//最大值是 5 + 7 = 12
//

const maxSubArraySum = (ar) => {
  // dp[i]从0到i
  // dp[i] = i > 0 ? dp[i - 1] + ar[i] : Math.max(dp[i - 1],dp[i - 1] + ar[i] + ar[i + 1])
  // for (let i = 0; )
};
console.log(maxSubArraySum());
