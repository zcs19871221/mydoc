var http = require("http");
var server = http.createServer( (req, res) => {
	console.log(req.headers);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');
});
server.listen(9981);
