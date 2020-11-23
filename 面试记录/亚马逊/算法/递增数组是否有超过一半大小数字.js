/* 优化方案:搜索1/2 index上的数值 */

const bs = (ar, target) => {
  let start = 0;
  let end = ar.length;
  while (start < end) {
    const mid = start + Math.floor((end - start) / 2);
    if (target > ar[mid]) {
      start = mid + 1;
    } else {
      end = mid;
    }
  }
  return start;
};

const main = (list, target) => {
  if (!Array.isArray(list) || !Number.isInteger(target)) {
    throw new Error("参数错误");
  }
  if (target < list[0] || target > list[list.length - 1]) {
    return false;
  }
  return bs(list, target) - bs(list, target + 1) > Math.floor(list.length / 2);
};

console.log(main([2, 4, 5, 5, 5, 5, 5, 6, 6], 4));
console.log(main([2], 2));
console.log(bs([2, 2, 2, 7], 3));
