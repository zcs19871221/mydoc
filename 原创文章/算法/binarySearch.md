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