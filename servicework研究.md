# 简介
1. 浏览器后台独立线程
2. 不能访问dom
3. 可以控制web应用的网络请求
4. 只能在https或非https的localhost下使用
# 应用
1. 缓存静态文件
2. 离线可访问
3. 网络代理
4. 后台同步（离线或网络不好时保存用户操作，稍后稳定时候发送到服务器）
[更多场景](https://serviceworke.rs/)
# 状态
register -> [installing] -> oninstall watiUnit skipWaiting -> [installed] -> [activating] -> onactivate waitUntil -> [activated] 
 
