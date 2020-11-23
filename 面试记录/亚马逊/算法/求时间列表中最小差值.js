/* eslint-disable no-plusplus */
/* eslint-disable id-length */
const p1 = list => {
  if (!Array.isArray(list) || list.length === 0 || list.length === 1) {
    throw new Error("参数错误");
  }
  list = list
    .map(each => {
      const [hour, minute] = each.split(":");
      return Number(hour) * 60 + Number(minute);
    })
    .sort((a, b) => a - b);
  let min = Infinity;
  let res = [];
  const number2String = num => {
    const h = Math.floor(num / 60);
    return `${h < 10 ? `0${h}` : h}:${
      num % 60 < 10 ? `0${num % 60}` : num % 60
    }`;
  };
  for (let i = 1, len = list.length; i < len; i++) {
    if (list[i] - list[i - 1] < min) {
      min = list[i] - list[i - 1];
      res = [list[i], list[i - 1]];
    }
  }
  return [min].concat(res.map(each => number2String(each)));
};
console.log(p1(["14:03", "00:05", "14:04", "15:07"]));
