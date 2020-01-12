# 什么题目用到？
1. 有序数组搜索 - 明显。
2. **结果->条件**有线性关系(预估一个结果值，有一个固定方法根据这个结果值可计算出一个条件值)。

# 如何做？
## 有序的数组
**start和end对应索引**

## 无序的但**结果->条件**有线性关系
**start和end对应一个范围**
题型：378,1011



# 算法模板

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
