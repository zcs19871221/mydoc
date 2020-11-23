求最大递增序列

耐心算法，详见普林斯顿大学讲义，真心好：https://www.cs.princeton.edu/courses/archive/spring13/cos423/lectures/LongestIncreasingSubsequence.pdf

堆纸牌，原则：
大数不能放到小数下面，可以开新的堆。
小数要从最左放到大数下面。
这样堆的数量就是最长递增子序列长度。
[1,3,5,2,8,4,6]
1   3   5  8
    2   4  6
		 
	1 -> 2 -> 4 -> 6
	每一个堆的尾部一定小于下一个堆的首部。
    每个堆的首部一定大于它的尾部。