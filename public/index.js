/*
Client-side js.
*/
import {game} from "./scripts/game.js"
import {splashscreen} from "./scripts/splashscreen.js"

var socket = io();
var g;
var splash = new splashscreen();
splash.loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (splash.name) {
        g = new game(splash.name,socket);
        splash.toggleSplash();
        splash.resetName();
        addSocketEvents();
    }
});

//Socket receive stuff here
function addSocketEvents(){
    socket.on('error', function (e) {
        console.error('Connection Error:', e);
    });

    socket.on('connected', function (data) {
        console.log('Socket connected (client side):', data);
    });

    socket.on('newPlayer', g.newPlayer);
    socket.on('removePlayer', g.removePlayer);
    socket.on('drawCanvas', g.drawCanvas);
    socket.on('changeColorCanvas', g.changeColorCanvas);
    socket.on('changeBgColorCanvas', g.changeBgColorCanvas);
    socket.on('clearCanvas', g.clearCanvas);
    socket.on('brushSizeCanvas', g.brushSizeCanvas);
    socket.on('canvasImage', g.loadCanvasImage);
    socket.on('chatMessage', g.newChatMessage);
    socket.on('correctGuess', g.processCorrectGuess);

    //server state-change events
    socket.on("server_idle",g.server_idle);
    socket.on("server_gameStart",g.server_gameStart);
    socket.on("server_roundBegin",g.server_roundBegin);
    socket.on("server_pickPlayer",g.server_pickPlayer);
    socket.on("server_pickWord",g.server_pickWord);
    socket.on("server_drawPhase", g.server_drawPhase);
    socket.on("server_drawEnd",g.server_drawEnd);
    socket.on("server_roundEnd",g.server_roundEnd);
    socket.on("server_gameEnd",g.server_gameEnd);
}
