// OpenShift ===================================================================
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

// set up ======================================================================
var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    socket = require('./server/socket')
    mongoose = require('mongoose'),
    port = process.env.PORT || 8080,
    db = require('./config/configDB'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    jwt = require('express-jwt');

// config  ======================================================================
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(morgan());

// db config  ===================================================================
mongoose.connect(db.url);

// routes =======================================================================
require('./server/routes')(app, jwt);

//cors ==========================================================================
require('./server/cors')(app);

// listen (start app with node server.js) =======================================
io.sockets.on('connection', socket);
server.listen(server_port, server_ip_address, function () {
    console.log("Server listening on " + server_ip_address + ", server_port " + server_port);
});