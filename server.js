// Require http, express and socket
var http = require('http');
var express = require('express');
var socket_io = require('socket.io');
var fs = require('fs');
const { SocketAddress } = require('net');
const wordListClass = require('./wordList.js');

// Create app var from express, point it towards the public directory to serve up assets
var app = express();
app.use(express.static('public'));
var server = http.Server(app);
const wordList = new wordListClass();
console.log(wordList.randomWordPick());
console.log("Loaded index file");




var io = socket_io(server);
server.listen(process.env.PORT || 9020, function() {
	console.log('Server started at http://localhost:9020');
});



io.on('connection', (socket) => {
	console.log('A client is connected!');
	socket.on('newPlayer',(userName,callback) =>{
		let gameId = Math.random().toString(16).slice(2);
		console.log('Name: ', userName, "; Id: ", gameId);
		socket.broadcast.emit('newPlayer',{'userName':userName,'gameId':gameId});
		callback({
			"gameId": gameId
		});
	});
	
	socket.on('disconnect', ()=>{
		console.log('A client disconnected!');
	})

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

	socket.on('chatMessage',(data)=>{
		console.log('Sending chat message: ', data);
		socket.broadcast.emit('chatMessage',data);
	});
});
