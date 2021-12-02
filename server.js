// Require http, express and socket
var http = require('http');
var express = require('express');
var socket_io = require('socket.io');
var fs = require('fs');
const { SocketAddress } = require('net');
const wordListClass = require('./wordList.js');
const playerClass = require('./public/scripts/player.js');
const rankListClass = require('./public/scripts/rankList.js');
const canvasClass = require('./public/scripts/canvasArea.js');


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


let rankList = new rankListClass;
let clientMap = new Map;

io.on('connection', (socket) => {
	console.log('A client is connected!');
	socket.on('newPlayer',(userName,callback) =>{
		let gameId = Math.random().toString(16).slice(2);
		console.log('Name: ', userName, "; Id: ", gameId);
		socket.to("activePlayers").emit('newPlayer',{'userName':userName,'gameId':gameId});
		socket.join("activePlayers");
		callback({
			"gameId": gameId,
			"rankList":rankList.makeList()
		});
		let p = new playerClass(userName,gameId);
    	rankList.addPlayer(p);
		clientMap.set(socket.id, gameId);
	});

	socket.on('disconnect', ()=>{
		console.log('A client disconnected!');
		let gameId = clientMap.get(socket.id);
		if(gameId != undefined){
			socket.to("activePlayers").emit('removePlayer',gameId);
			clientMap.delete(socket.id);
			console.log(socket.id, gameId);
			rankList.removePlayer(gameId);
		}
	})

	socket.on('changeColorCanvas', (data) => {
		console.log('changeColor: ', data);
		socket.to("activePlayers").emit('changeColorCanvas',data);
	});

	socket.on('changeBgColorCanvas', (data) => {
		console.log('changeBgColor: ', data);
		socket.to("activePlayers").emit('changeBgColorCanvas',data);
	});

	socket.on('drawCanvas', (data) => {
		console.log('Draw: ', data);
		socket.to("activePlayers").emit('drawCanvas',data);
	});

	socket.on('clearCanvas', (data) => {
		console.log('Canvas Cleared: ');
		socket.to("activePlayers").emit('clearCanvas');
	});

	socket.on('brushSizeCanvas', (data) => {
		console.log('Changing brush size: ', data);
		socket.to("activePlayers").emit('brushSizeCanvas',data);
	});

	socket.on('chatMessage',(data)=>{
		console.log('Sending chat message: ', data);
		socket.to("activePlayers").emit('chatMessage',data);
	});

	socket.on('ranking',(data)=>{
		console.log('Sending new ranking: ', data);
		socket.to("activePlayers").emit('ranking',data);
	});
});
