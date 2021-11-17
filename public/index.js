/*
Client-side js.

Requires all scripts in ./scripts loaded beforehand.
*/
var socket = io();

var playerCanvas = new canvasArea(false);
beginDraw = () => {
    console.log("Beginning canvas drawing!");
    playerCanvas.makeActive();
}


//Socket receive stuff here
socket.on('draw', function(data) {
    console.log("Draw (Client):", data);
    playerCanvas.findxy(data["move"],data["x"],data["y"]);
});

socket.on('changeColor', function(data) {
    console.log("changeColor (Client):", data);
    playerCanvas.color(data["color"]);
});

socket.on('changeBgColor', function(data) {
    console.log("changeBgColor (Client):", data);
    playerCanvas.bgColor(data["backgroundColor"]);
});

socket.on('clearCanvas', function(data) {
    playerCanvas.eraseImmediate();
});



