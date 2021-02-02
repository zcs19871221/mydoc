const createAd = (filters, max) => {
  if (!Array.isArray(filters) || !Number.isInteger(max)) {
    throw new Error('参数错误');
  }
  if (filters.length > max) {
    throw new Error('超出最大值' + max);
  }
  const pins = Array(3);
  const commons = [];
  const res = [];
  filters.forEach((filter) => {
    if (filter.pin > 0 && !pins[filter.pin - 1]) {
      pins[filter.pin - 1] = filter;
    }
    if (filter.pin === 0) {
      commons.push(filter);
    }
  });
  for (let i = 0; i < 3; i++) {
    res[i] = pins[i] || commons.shift() || '';
  }
  return res
    .filter((e) => e)
    .map((e) => e.name)
    .join('|');
};

console.log(
  createAd(
    [
      { name: 'headline1', pin: 1 },
      { name: 'headline2', pin: 0 },
      { name: 'headline3', pin: 1 },
      { name: 'headline4', pin: 2 },
      { name: 'headline5', pin: 1 },
    ],
    15,
  ) === 'headline1|headline4|headline2',
);

console.log(
  createAd(
    [
      { name: 'headline1', pin: 0 },
      { name: 'headline2', pin: 0 },
      { name: 'headline3', pin: 0 },
    ],
    15,
  ) === 'headline1|headline2|headline3',
);
console.log(
  createAd(
    [
      { name: 'headline1', pin: 1 },
      { name: 'headline2', pin: 1 },
      { name: 'headline3', pin: 1 },
    ],
    15,
  ) === 'headline1',
);
console.log(
  createAd(
    [
      { name: 'headline1', pin: 1 },
      { name: 'headline3', pin: 2 },
      { name: 'headline2', pin: 0 },
    ],
    15,
  ) === 'headline1|headline3|headline2',
);
