/*
Client-side js.
*/
var socket = io();


var g = new game();
//var playerCanvas = new canvasArea(false);
//var t = new timer();

let toggleDraw = () => {
    console.log("Toggling canvas drawing to ",!g.canvas.isActive());
    if(!g.canvas.isActive()){
        g.canvas.makeActive();
    }else{
        g.canvas.makeUnactive();
    }
}
//Socket receive stuff here
socket.on('drawCanvas', function(data) {
    console.log("Draw (Client):", data);
    g.canvas.findxy(data["move"],data["x"],data["y"],data["orgWidth"]);
});

socket.on('changeColorCanvas', function(data) {
    console.log("changeColor (Client):", data);
    g.canvas.color(data["color"]);
});

socket.on('changeBgColorCanvas', function(data) {
    console.log("changeBgColor (Client):", data);
    g.canvas.bgColor(data["backgroundColor"]);
});

socket.on('clearCanvas', function(data) {
    console.log("Canvas cleared (Client)");
    g.canvas.eraseImmediate();
});

socket.on('brushSizeCanvas', function(data) {
    console.log("Change Brush size (Client):", data);
    g.canvas.changeDrawSize(data["brushSize"]);
});



startTimer = ()=>g.timer.startTimer();
resetTimer = ()=>g.timer.resetTimer();


//window resize event
window.addEventListener('resize', ()=>{
    console.log("resizing window!");
    g.canvas.dimensionSet();
});
