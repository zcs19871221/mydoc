// 给一个括号对数, 求所有有效的括号组合:

// ex: n = 2()()(())

const fn = n => {
  const res = [];
  const helper = (index = 0, acc = "", l = 0, r = 0) => {
    if (l > n) {
      return;
    }
    if (r > n) {
      return;
    }
    if (index === 2 * n) {
      res.push(acc);
      return;
    }
    if (l > r) {
      helper(index + 1, acc + "(", l + 1, r);
      helper(index + 1, acc + ")", l, r + 1);
      return;
    }
    if (l === r) {
      helper(index + 1, acc + "(", l + 1, r);
    }
  };
  helper();
  return res;
};

console.log(fn(4));
阿;
