// Require http, express and socket
var http = require('http');
var express = require('express');
var socket_io = require('socket.io');
var fs = require('fs');
const { SocketAddress } = require('net');

// Create app var from express, point it towards the public directory to serve up assets
var app = express();
app.use(express.static('public'));

var server = http.Server(app);   //how this happened?


console.log("Loaded index file");


var io = socket_io(server);
server.listen(process.env.PORT || 9020, function() {
	console.log('Server started at http://localhost:9020');
});


io.on('connection', (socket) => {

	console.log('A client is connected!');

	socket.on('changeColorCanvas', (data) => {
		console.log('changeColor: ', data);
		socket.broadcast.emit('changeColorCanvas',data);
	});

	socket.on('changeBgColorCanvas', (data) => {
		console.log('changeBgColor: ', data);
		socket.broadcast.emit('changeBgColorCanvas',data);
	});

	socket.on('drawCanvas', (data) => {
		console.log('Draw: ', data);
		socket.broadcast.emit('drawCanvas',data);
	});

	socket.on('clearCanvas', (data) => {
		console.log('Canvas Cleared: ');
		socket.broadcast.emit('clearCanvas');
	});

	socket.on('brushSizeCanvas', (data) => {
		console.log('Changing brush size: ', data);
		socket.broadcast.emit('brushSizeCanvas',data);
	});
});
