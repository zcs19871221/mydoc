/**
 * @param {string[]} words
 * @return {number}
 */
var longestStrChain = function (words) {
    const map = new Array(16).fill(null);
    words.forEach(word => {
        const len = word.length;
        if (!map[len]) {
            map[len] = []
        }
        map[len].push(word);
    })
    const helper = (len, word) => {
        if (!map[len]) {
            return len;
        }
        const words = map[len];
        let tmp = len
        for (let each of words) {
            if (!word || [...each].every(str => word.includes(str))) {
                tmp = Math.min(tmp, helper(len - 1, each));
            }
        }
        return tmp;
    }
    let res = 0;
    for (i = 16; i > 0; i--) {
        console.log(i, helper(i))
        res = Math.max(res, i - helper(i))
    }
    return res;
};
longestStrChain(["msnq", "klcbjhjm", "znui", "gy", "msntlq", "klcbqjhjm", "zi", "hwhzjgxzd", "whzgxzd", "zui", "rmnqxy", "msntzlq", "jri", "rbmnqxy", "gqvbytgny", "xh", "wxkhyb", "gqvbtgy", "ctl", "klcbqjhbjm", "gbgy", "klbh", "erbmnqxy", "mka", "gvbtgy", "klcbjhj", "klbjh", "zlnuci", "gqvbytgy", "mk", "whzjgxzd", "bgy", "wxkhb", "xkh", "gvbgy", "rmnxy", "wxkh", "msnlq", "ct", "hwhhzjgxzd", "zlnui", "klbjhj", "jr", "jrvi", "rmny"])