const http = require('http'); // Import Node.js core module
const zlib = require('zlib');
const data = {
  firstName: 'Fred',
  lastName: 'Flintstone',
  emailAddr: 'fred@example.com'
};

var server = http.createServer(function (req, res) {
  //create web server
  if (req.url.startsWith('/api/text')) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><body><h2>This is http function.</h2></body></html>');
    res.end();
  } else if (req.url.startsWith('/api/json')) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  } else if (req.url.startsWith('/api/json-bom')) {
    res.setHeader('Content-Type', 'application/json');
    var bomBuffer = Buffer.from([0xef, 0xbb, 0xbf]);
    var jsonBuffer = Buffer.from(JSON.stringify(data));
    res.end(Buffer.concat([bomBuffer, jsonBuffer]));
  } else if (req.url.startsWith('/api/timeout')) {
    setTimeout(function () {
      res.end();
    }, 1000);
  } else if (req.url.startsWith('/api/redirect')) {
    res.setHeader('Location', '/api/text');
    res.statusCode = 302;
    res.end();
  } else if (req.url.startsWith('/api/zip-json')) {
    zlib.gzip(JSON.stringify(data), function (err, zipped) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Encoding', 'gzip');
      res.end(zipped);
    });
  } else if (req.url.startsWith('/api/zip-text')) {
    zlib.gzip('Test data', function (err, zipped) {
      res.setHeader('Content-Type', 'text/html;charset=utf-8');
      res.setHeader('Content-Encoding', 'gzip');
      res.end(zipped);
    });
  } else if (req.url.startsWith('/api/utf8')) {
    const str = Array(100000).join('ж');
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.end(str);
  } else if (req.url.startsWith('/api/binary')) {
    const input = new Int8Array(2);
    input[0] = 1;
    input[1] = 2;
    res.end();
  } else {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Default Response.');
  }
});

server.listen(8000, '127.0.0.1'); //6 - listen for any incoming requests

console.log('Node.js web server at port 8000 is running..');
