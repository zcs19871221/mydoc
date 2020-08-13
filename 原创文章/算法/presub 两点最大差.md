数组[a0,a1,a2,a3];
求任意两点最大值。

累差数组b
b0 = 0
b1 = a1 - a0
b2 = a2 - a1
b3 = a3 - a2

b2 + b3 =  a2 - a1 + a3 - a2 = a3 - a1

所以问题转化为求bi + ...bj 的最大值

当累减值为负时候，令累减为0.

var maxProfit = function(prices) {
    let sub = 0;
    let res = 0;
    for (let i = 1; i < prices.length; i++) {
        sub += prices[i] - prices[i - 1];
        sub = Math.max(0, sub)
        res = Math.max(res, sub)
    }
    return res;
};

题目 121