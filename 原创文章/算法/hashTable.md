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

2. 
