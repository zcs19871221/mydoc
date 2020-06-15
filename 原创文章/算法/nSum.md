# 什么题目用到
在数组内求n个数相加等于特定值。

# 原理
0. 数组升序排列
1. 循环（从0开始，以目标长度为截至nums.length - length + 1）递归(start + 1，length - 1， target - nums[i])直到问题变成two sum，循环时跳过和当前元素相等的下一个元素。（if (i > start && nums[i] === nums[i - 1]) continue
2. two sum：两指针指向两头，两指针和和target对比，同时移动指针。如果target === sum时，注意要多次移动两边指针来跳过相等值。

# 模板

    const helper = (nums, start, length, target) => {
        const res = []
        if (length === 2) {
            let left = start;
            let right = nums.length - 1;
            while (left < right) {
                const sum = nums[left] + nums[right];
                if (sum === target) {
                    res.push([nums[left], nums[right]]);
                    while (left < right && nums[left] === nums[left + 1]) {
                        left++;
                    }
                    while (left < right && nums[right] === nums[right - 1]) {
                        right--
                    }
                    left++;
                    right--;
                } else if (sum > target) {
                    right--
                } else {
                    left++;
                }
            }
        } else {
            for (let i = start; i < nums.length - length + 1; i++) {
                if (i > start && nums[i] === nums[i - 1]) {
                    continue;
                }
                const tmp = helper(nums, i + 1, length - 1, target - nums[i]);
                tmp.forEach(each => {
                    each.push(nums[i])
                })
                res.push(...tmp)
            }
        }
        return res;
    }
    var fourSum = function(nums, target) {
        nums.sort((a,b) => a - b)
        return helper(nums, 0, 4, target)
    };
