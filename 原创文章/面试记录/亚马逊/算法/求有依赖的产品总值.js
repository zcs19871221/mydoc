/* 更复杂的算法是解一个图 */
class Product {
  constructor(cost) {
    this.cost = cost;
    this.depend = null;
  }
}
const acc = (product, map) => {
  if (map.has(product)) {
    return map.get(product);
  }
  let sum = 0;
  const stack = [product];
  while (stack.length > 0) {
    const each = stack.shift();
    if (each) {
      sum += each.cost;
      stack.push(each.depend);
    }
  }
  map.set(product, sum);
  return sum;
};
const p2 = list => {
  let max = -Infinity;
  const map = new Map();
  for (let i = 0, len = list.length; i < len; i++) {
    const each = list[i];
    max = Math.max(acc(each, map), max);
  }
  return max;
};
const a = new Product(3);
const b = new Product(4);
const c = new Product(5);
a.depend = b;
b.depend = c;
console.log(p2([a, b, c]));
