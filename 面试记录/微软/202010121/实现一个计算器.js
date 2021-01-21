const calculator = (input) => {
  return eval(input);
};
const calculator2 = (input) => {
  if (!input || typeof input !== 'string') {
    return 0;
  }
  const stack = [];
  for (const str of input) {
    if (Number.isInteger(Number(str))) {
      if (stack[stack.length - 1] === '*') {
        stack.pop();
        const num = stack.pop();
        stack.push(num * Number(str));
      } else if (stack[stack.length - 1] === '/') {
        stack.pop();
        const num = stack.pop();
        stack.push(num / Number(str));
      } else {
        stack.push(Number(str));
      }
    } else {
      stack.push(str);
    }
  }
  while (stack.length > 1) {
    const num = stack.shift();
    const operator = stack.shift();
    const num2 = stack.shift();
    if (operator === '+') {
      stack.unshift(num + num2);
    } else {
      stack.unshift(num - num2);
    }
  }
  return stack[0];
};
// const calculator3 = (input) => {
//   const stack = [Number(input[0])];
//   for ()
//   while (stack.length > 1) {

//   }

// }
console.log(calculator2('1*2') === 2);
console.log(calculator2('1+1*3') === 4);
console.log(calculator2('1+3') === 4);
console.log(calculator2('1+2*3-4') === 3);
console.log(calculator2('2*3+2*4-1*2') === 12);
console.log(calculator2('2*3+1*2-2*4') === 0);
