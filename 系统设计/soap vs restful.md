https://raygun.com/blog/soap-vs-rest-vs-json/
https://www.cs.tufts.edu/comp/150IDS/final_papers/tstras01.1/FinalReport/FinalReport.html#xml-advantages xmlvs json

# 一个是协议,另一个是一种准则的名称

soap 是一种协议,他通过 http,smtp,tcp,udp 等协议传输资源.
而

# 载体

# 特性

soap 是官方协议,具有严格的规则和高级安全功能( ACID compliance. ),需要占用更多带宽和资源,可能导致页面变慢
restful 比较松散,性能更高

# 格式

soap 只支持 xml,有固定的结构
resftful 可以自定义

# 性能

restful 高
soap 低

# 适用场景

## soap

1. 高安全性,复杂事务的企业级应用.
2. 兼容旧的 api

需要高安全性和复杂事务的企业级 web 服务。用于金融服务、支付网关、CRM 软件、身份管理和电信服务的 api 是 SOAP 的常用示例。或者兼容旧的 api.因为以前都是用的 soap

# restful 准则

要创建 REST API，您需要遵循六个体系结构约束：

1. 统一接口 – 来自不同客户端的请求应看起来相同，例如，同一资源不应有多个 URI。
2. 客户端-服务器分离 – 客户端和服务器应独立操作。它们只能通过请求和响应相互交互。
3. 请求无状态 不应有任何服务器端会话。每个请求应包含服务器需要知道的所有信息。
4. 可缓存资源 – 服务器响应应包含有关其发送的数据是否可缓存的信息。可缓存的资源应带有版本号，以便客户端可以避免多次请求相同的数据。
5. 分层系统 – 客户端和服务器之间可能有多个服务器返回响应。这不应影响请求或响应。
6. 按需代码 [可选] = 必要时，响应可以包含客户端可以执行的可执行代码（例如，HTML 响应中的 JavaScript）。
