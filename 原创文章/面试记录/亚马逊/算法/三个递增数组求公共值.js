/* 两个方案: 
  1. 使用map映射
  2. 使用三指针法
*/
const second = (ar1, ar2, ar3) => {
  if (!Array.isArray(ar1) || !Array.isArray(ar2) || !Array.isArray(ar3)) {
    throw new Error("参数错误");
  }
  const map = new Map();
  const res = [];
  ar1
    .concat(ar2)
    .concat(ar3)
    .forEach(each => {
      if (map.has(each)) {
        map.set(each, map.get(each) + 1);
        if (map.get(each) === 3) {
          res.push(each);
        }
      } else {
        map.set(each, 1);
      }
    });
  return res;
};

const secondUsePointer = (ar1, ar2, ar3) => {
  if (!Array.isArray(ar1) || !Array.isArray(ar2) || !Array.isArray(ar3)) {
    throw new Error("参数错误");
  }
  const res = new Set();
  let p1 = 0;
  let p2 = 0;
  let p3 = 0;
  while (p1 < ar1.length && p2 < ar2.length && p3 < ar3.length) {
    if (ar1[p1] === ar2[p2] && ar2[p2] === ar3[p3]) {
      res.add(ar1[p1]);
      p1++;
      p2++;
      p3++;
    } else {
      const min = Math.min(ar1[p1], ar2[p2], ar3[p3]);
      if (min === ar1[p1]) {
        p1++;
      }
      if (min === ar2[p2]) {
        p2++;
      }
      if (min === ar3[p3]) {
        p3++;
      }
    }
  }
  return [...res];
};

console.log(second([1, 2, 3, 4, 5], [1, 2, 5, 7, 9], [1, 3, 4, 5, 8]));
console.log(
  secondUsePointer([1, 2, 3, 4, 5], [1, 2, 5, 7, 9], [1, 3, 4, 5, 8])
);
console.log(secondUsePointer([1, 3, 4, 5], [1, 5, 7, 9], [1, 3, 4, 5, 8]));
