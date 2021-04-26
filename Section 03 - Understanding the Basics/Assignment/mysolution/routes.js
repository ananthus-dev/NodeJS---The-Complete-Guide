const routesHandler = (req,res)=>{
if(req.url === '/'){
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title><head>');
    res.write(
        `<body>
        <h1>Hello from my Node.js Server!</h1>
        <form action='/create-user' method="POST">
        <input type="text" name="username"/><button type="submit">Submit</button>
        </form>
        </body>`
        );
    res.write('</html>');
    res.end();
}

if(req.url === '/users'){
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title><head>');
    res.write(
        `<body>
        <ul>
        <li>User 1</li>
        <li>User 2</li>
        <li>User 3</li>
        </ul>
        </body>`
        );
    res.write('</html>');
    res.end();
}

if(req.url === '/create-user' && req.method === "POST"){
    const body=[];

    req.on('data',(chunk)=>{
        body.push(chunk)
    })

    req.on('end',(chunk)=>{
        const parsedBody = Buffer.concat(body).toString();
        const message = parsedBody.split('=')[1];
        console.log('userName',message);
        res.statusCode = 302;
        res.setHeader('Location','/users');
        return res.end()
    })
}
}

module.exports = routesHandler;