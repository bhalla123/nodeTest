var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

global.app = express();
global.moment = require('moment');

// Required module 
app.use(expressValidator());

const db = require('./models');
db.sequelize.sync({ alter: true })

// Constants 
global.nodeSiteUrl = 'http://localhost:8082'; // node  
global.nodeAdminUrl = 'http://localhost:8082/api/admin'; // node  

/* Admin section code */
app.set('view engine', 'ejs');
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
var flash = require('express-flash-messages')
app.use(flash())

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
app.use(cookieParser());
app.use(expressSession({ secret: 'D%$*&^lk32', cookie: { maxAge: 600000 } }));

app.use(function (req, res, next) {
    res.header('Content-Type', 'text/html');
    next();
});
app.use(bodyParser.urlencoded({
    extended: true
}));
var apiRouter = require('./routes/api');
app.use('/api', apiRouter);

var server = app.listen(8082, function () {
    "http://localhost:8082/api/admin/Users/list";
    console.log("Example app listening at http://localhost:%s", server.address().port);
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});


