# 什么题目用到
【连续】【子串】相关的，涉及【累计(计数，加减乘除)】计算的
可对【O(n*n)brute force】进行优化

# 原理

`sum [i，j] = sum [0，j]-sum [0，i-1]`

    问题：求连续子串s[i, j]中和为count的个数
    可转换为s[i] + s[i + 1] + .. s[j] === count 的个数
    可转换为(sum[j] = s[0] + ... s[j]) - (sum[i] = s[0] + ... s[i])  === count 的个数
    转换为sum[i] = sum[j] - count
    那么我们只需要记录map[i]的个数，当遍历求出sum的时候，求map[acc - count]的数量并累加即可。

# 如何做
1. 设置map map[0] = 1
2. 遍历数组，求得累加值
3. 使用map[acc - sum]查找数量，累加数量、
4. 最后map[acc] = (map[acc] || 0) + 1

# 模板

# 时间复杂度
o(n)

# 例题
930 525