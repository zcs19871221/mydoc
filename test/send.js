var send = require("./request.js");
process.setMaxListeners(0);
var interval = 5 * 60 * 1000,
	times = 5;
function realSend(time) {
	for (var i = 0; i < times; i++) {
		send({
			url: "http://localhost:9981",
			afterHandle: function(str) {
			}
		})	
	}
	setTimeout(realSend, interval);
}
realSend();