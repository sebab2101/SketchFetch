/*
Client-side js.

Requires all scripts in ./scripts loaded beforehand.
*/
var socket = io();

var playerCanvas = new canvasArea(false);
toggleDraw = () => {
    console.log("Toggling canvas drawing to ",!playerCanvas.isActive());
    if(!playerCanvas.isActive()){
        playerCanvas.makeActive();
    }else{
        playerCanvas.makeUnactive();
    }
}


//Socket receive stuff here
socket.on('drawCanvas', function(data) {
    console.log("Draw (Client):", data);
    playerCanvas.findxy(data["move"],data["x"],data["y"]);
});

socket.on('changeColorCanvas', function(data) {
    console.log("changeColor (Client):", data);
    playerCanvas.color(data["color"]);
});

socket.on('changeBgColorCanvas', function(data) {
    console.log("changeBgColor (Client):", data);
    playerCanvas.bgColor(data["backgroundColor"]);
});

socket.on('clearCanvas', function(data) {
    console.log("Canvas cleared (Client)");
    playerCanvas.eraseImmediate();
});

socket.on('brushSizeCanvas', function(data) {
    console.log("Change Brush size (Client):", data);
    playerCanvas.changeDrawSize(data["brushSize"]);
});




