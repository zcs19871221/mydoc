1. 最好的写法：左闭右开 .

    const bs = (ar, target) => {
    let start = 0; 
    let end = ar.length;
    while (start < end) {
            const mid = start + Math.floor((end - start) / 2);
            if (target > ar[mid]) {
                start = mid + 1;
            } else {
                end = mid
            }
        } 
        return start
    }
    console.log(bs([1,2,3,4,5, 6],6) === 5)
    console.log(bs([1,2,4,5],3) === 2)
    console.log(bs([1,2,2,2,2],2) === 1)


可以找到所有>=target的起始点的索引。如果target有重复的，会找到第一个位置：
当target <= midvalue时候，不是直接返回，而是设置end = mid;目的就是能够往前搜索，覆盖到所有重复情况。

2. bs的使用思路：
    1. 有序数组
    2. 结果和条件存在线性关系（当结果改变时候，条件对应改变）
    3. 经常要根据你猜测的结果(mid值)，根据这个mid值，求出给定条件的可能解。根据这个解和给定条件进行比对，然后调整你的猜测结果，直到求出最终值。
    4. 根据3条，通过猜测结果反推可能的条件很重要。

3. bs的两种使用方法：
  1. 索引 - 一般常见于排序数组
  2. 范围 - 非排序数组，查找特点值