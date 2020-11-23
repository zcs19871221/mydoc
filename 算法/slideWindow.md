# 什么题目用到
数组字符串的子元素问题。可以把多层循环转变为单循环。


# 原理
1. 使用两指针：左指针和右指针代表一个滑动窗口
2. 右指针右移直到左，右指针之内存在一个有效解
3. 移动左指针，缩小窗口直到发现最优解

# 模板
1. 根据子串生成计数hashMap map
2. 设置count = map.size
3. 右指针右移动直到结束，hashMap - 1，如果hashMap为0，count--
4. 当count === 0时候，左指针右移，这块操作和上面是镜像的。如果hashMap为0，count++。hashMap + 1.

const map = new Map();
for (const str of subStr) {
    if (map.has(str)) {
        map.set(str, map.get(str) + 1)
    } else {
        map.set(str, 1)
    }
}
const count = map.size;
let left = 0;
let right = 0;
while (right < target.length) {
    // 如果存在hashMap，计数 - 1.
    // 当计数为0时候，说明已经找到所有目标字符串，count+1，准备移动左指针来查找最优解
    const rightVal = target[right]
    if (map.has(rightVal)) {
        map.set(rightVal, map.get(rightVal) - 1)
        if (map.get(rightVal) === 0) {
            count--;
        }
    }
    right++;
    while (count === 0) {
        const leftVal = target[left];
        if (map.has(leftVal)) {
            if (map.get(leftVal) === 0) {
                count++;
            }
            map.set(leftVal, map.get(leftVal) + 1)
        }
        // 根据题目的查找模板
        left++
    }
}


# 例题
438