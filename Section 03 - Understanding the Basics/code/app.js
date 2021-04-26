const http = require('http');

//the passed function will be executed for every incoming requests.
const server = http.createServer((req, res) => {
    console.log(req.url,req.headers,req.method);
    res.setHeader('Content-Type','text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my node.js server</h1></body>');
    res.write('</html>');
    res.end(); //sends response to client

    //calling write after calling end will throw error.
    res.write();
})

//stop executing the code on first incoming request.
// const server = http.createServer((req, res) => {
//     console.log(req);
//     process.exit();
// })

server.listen(3000);