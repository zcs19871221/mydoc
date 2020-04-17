1. 求连续数想加得特定值的个数:
比如有a,b,c三个数
a,b,c,
a = val0
a + b = val1
a + b + c = val2

累加d,如果a + b + c + d - sum的值等于a + b === a + b + c
那么等价于c + d === sum d === sum.结果加2.
a + b + c + d - sum  === [value] => [a + b, a + b + c]
sum = c + d
sum = d

2. 遍历两个字符串,求相等个数,可以用一个hash表示
list1: a,b,c
list2: c,a,b

hash的value表示个数

list1命中,个数加1
list2命中,个数减1

如果hash[list1[index]] < 0,说明list2已经有对应的数存在,数量加一
如果hash[list2[index]] > 0,说明list1已经有对应存在,数量加1
if (hash[list1[index]] < 0) {
    count++
}
if (hash[list2[index]] > 0) {
    count++;
}
hash[list1[index]]++;
hash[list2[index]]--;

3. n个数组,包含1-n的数字,其中有一个重复了,求重复的数字和缺少的数字.

在原数组遍历,把值 - 1的index设置成负数.如果发现已经是负数,说明重复.
最后再遍历一遍,找出非负数的数字就是缺少数字.
