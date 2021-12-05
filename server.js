// Require http, express and socket
var http = require('http');
var express = require('express');
var socket_io = require('socket.io');
const {socketEvents,game} = require('./require/socketEvents.js')

// Create app var from express, point it towards the public directory to serve up assets
var app = express();
app.use(express.static('public'));
var server = http.Server(app);
console.log("Loaded index file");

var io = socket_io(server);
server.listen(process.env.PORT || 9020, function() {
	console.log('Server started at http://localhost:9020');
});

socketEvents.setIo(io);
game.setIo(io);

io.on('connection', (socket) => {
	console.log('A client is connected to the login screen!');
	socketEvents.newPlayer(socket);
	socketEvents.disconnectPlayer(socket);
	socketEvents.changeColorCanvas(socket);
	socketEvents.changeBgColorCanvas(socket);
	socketEvents.drawCanvas(socket);
	socketEvents.clearCanvas(socket);
	socketEvents.brushSizeCanvas(socket);
	socketEvents.chatMessage(socket);
	socketEvents.ranking(socket);
});
