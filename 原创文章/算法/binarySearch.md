# 什么题目用到？
1. 有序数组搜索 - 明显。
2. **结果->条件**有线性关系(预估一个结果值，有一个固定方法根据这个结果值可计算出一个条件值)。

# 如何做？
固定套路：
1. 找到start和end，end需要为不可用的边界。(模板需要)
2. 找到中间值和条件的关系。(计算函数)
3. 条件关系套用正确：calcResult > condition or condition > calcResult
    注意===一定在end = mid条件中。
4. return start;

## 有序的数组
**start和end对应索引**
start = 0
end = ar.length;
中间值和条件关系为:ar[mid];

## 无序的但**结果->条件**有线性关系
**start和end对应一个范围**
start = 最小值
end = 最大值 + 1;
中间值和条件关系需要找出来。
题型：378,1011



# 模板

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
