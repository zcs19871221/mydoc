/**
 * @param {string} s
 * @return {number}
 */

/* 要点：
 * 1. num记录当前数字，循环到数字就num * 10 + char.charCodeAt(0) - '0'.charCodeAt(0)
 * 2. sign记录上一个操作符，遍历到操作符或者到最后一位时候，拿出当前数字num和上一个操作符做处理。当sign为正，num入站。当sign为负，-num入站。当sign为*或/，stack.pop()  num入站。
 * 3. 当遇到（，寻找到匹配右括号。然后递归调用算出num后入站。寻找右括号技巧用cur记录遇到的左右括号，当遇到(，cur+1，遇到)，cur - 1,cur为0，退出。 
*/


var calculate = function (s) {
    let num = 0;
    const stack = [];
    let sign = '+';
    for (let i = 0, len = s.length; i < len; i++) {
        const char = s[i];
        if (!char.trim()) {
            continue;
        }
        if (!Number.isNaN(Number(char))) {
            num = num * 10 + char.charCodeAt(0) - '0'.charCodeAt(0)
        } else if (char === '(') {
            let count = 0;
            let j = i;
            for (; i < s.length; i++) {
                if (s[i] === ')') {
                    count--;
                } else if (s[i] === '(') {
                    count++
                }
                if (count === 0) {
                    break;
                }
            }
            num = calculate(s.slice(j + 1, i))
        }
        if (["+", '-', '*', '/'].includes(char) || i === s.length - 1) {
            if (sign === '-') {
                num = -num;
                stack.push(num)
            } else if (sign === '+') {
                stack.push(num)
            } else if (sign === '*') {
                stack.push(stack.pop() * num)
            } else if (sign === '/') {
                stack.push(stack.pop() / num)
            }
            sign = char;
            num = 0
        }
    }
    return stack.reduce((a, b) => a + b, 0)
};

console.log(calculate('3 * (2 + 3)') === 15)
console.log(calculate("1 + 1") === 2)
console.log(calculate("1 + 2 * 3") === 7)
console.log(calculate("(1+(4+5+2)-3)+(6+8)") === 23)
console.log(calculate("(1+(4+5+2)-3)*(6+8)") === 126)
console.log(calculate("-2+ 1") === -1)
console.log(calculate("12344") === 12344)
