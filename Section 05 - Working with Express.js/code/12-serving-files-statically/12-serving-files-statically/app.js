const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));

//Whenever browser requests something with an extension , e.g .css,.png etc it will be considered as a route, but will 
//be served from the static folders we added
//we can add multiple folders. The contents of  these folders will be placed at the root of server
//e.g main.css in public/css folder will be accessed from browser using the link http:localhost:3000/css/main.css
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
