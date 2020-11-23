# 适用情况

    和字符前缀相关（比如相同前缀）
    按词典序枚举

# 应用

最长ip前缀

自动补全

拼写检查

# 模板

    // 只包含小写字母
    class Trie {
        constructor() {
            this.val = '';
            this.child = new Array(26).fill(null)
        }

        insert(str) {
            let node = this;
            for (const char of str) {
                const index = char.charCodeAt(0) - 'a'.charCodeAt(0);
                if (!node[index]) {
                    node[index] = new Trie();
                }
                node = node[index]
            }
            node.val = str;
        }
    }

# 题目