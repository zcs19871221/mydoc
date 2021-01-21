const kaiGen = (input) => {
  let closet = Infinity;
  let res;
  for (let i = 1; i < input; i *= 2) {
    const t = i * i;
    if (Math.abs(input - t) < closet) {
      res = i;
      closet = Math.abs(input - t);
    }
  }
  return res;
};

console.log(kaiGen(9));
console.log(kaiGen(10));
console.log(kaiGen(999));
