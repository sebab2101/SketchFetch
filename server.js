// Require http, express and socket
var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

// Create app var from express, point it towards the public directory to serve up assets
var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
server.listen(process.env.PORT || 9020, function() {
	console.log('Server started at http://localhost:9020');
});


io.on('connection', (socket) => {
	socket.on('changeColor', (data) => {
		console.log('changeColor: ', data);
		socket.broadcast.emit('changeColor',data);
	});

	socket.on('changeBgColor', (data) => {
		console.log('changeBgColor: ', data);
		socket.broadcast.emit('changeBgColor',data);
	});

	socket.on('draw', (data) => {
		console.log('Draw: ', data);
		socket.broadcast.emit('draw',data);
	});

	socket.on('clearCanvas', (data) => {
		console.log('Canvas Cleared: ');
		socket.broadcast.emit('clearCanvas');
	});
});


