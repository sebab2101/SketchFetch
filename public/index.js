
var socket = io();

class canvasArea{
    canvas;
    canvasWidth;
    canvasHeight;
    ctx;
    prevX = 0;
    currX = 0;
    prevY = 0;
    currY = 0;
    drawColor = "black";
    drawSize = 2;
    dot_flag = false;
    flag = false;
    backgroundColor = "white";
    active = false;
    constructor(active){
        this.canvas = document.getElementById('canvasArea');
        this.mouseCircle = document.getElementById("mouseCircle");
        this.ctx = this.canvas.getContext("2d");
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.active = active;
        if(this.active){
            this.addMouseListeners();
        }
    }

    makeActive(){
        this.active=true;
        this.addMouseListeners();
    }

    makeUnactive(){
        this.active=false;
        this.removeMouseListeners();
    }

    addMouseListeners(){
        this.canvas.addEventListener("mousemove", e => {
            this.findxy('move', e.clientX, e.clientY)
            socket.emit('draw',{"move": 'move', "x": e.clientX, "y": e.clientY});
        }, false);
        this.canvas.addEventListener("mousedown", e  => {
            this.findxy('down', e.clientX, e.clientY)
            socket.emit('draw',{"move": 'down', "x": e.clientX, "y": e.clientY});
        }, false);
        this.canvas.addEventListener("mouseup", e =>{
            this.findxy('up', e.clientX, e.clientY)
            socket.emit('draw',{"move": 'up', "x": e.clientX, "y": e.clientY});
        }, false);
        this.canvas.addEventListener("mouseout", e =>{
            this.findxy('out', e.clientX, e.clientY)
            socket.emit('draw',{"move": 'out', "x": e.clientX, "y": e.clientY});
        }, false);
    }

    removeMouseListeners(){
        this.canvas.removeEventListener("mousemove", e => {
            this.findxy('move', e)
        }, false);
        this.canvas.removeEventListener("mousedown", e  => {
            this.findxy('down', e)
        }, false);
        this.canvas.removeEventListener("mouseup", e =>{
            this.findxy('up', e)
        }, false);
        this.canvas.removeEventListener("mouseout", e =>{
            this.findxy('out', e)
        }, false);
    }


    color(obj){
        switch (obj) {
            case "green-brush":
                this.drawColor = "green";
                break;
            case "blue-brush":
                this.drawColor = "blue";
                break;
            case "red-brush":
                this.drawColor = "red";
                break;
            case "yellow-brush":
                this.drawColor = "yellow";
                break;
            case "orange-brush":
                this.drawColor = "orange";
                break;
            case "black-brush":
                this.drawColor = "black";
                break;
            case "white-brush":
                this.drawColor = "white";
            case "eraser-brush":
                this.drawColor = this.backgroundColor;
                break;
        }
        if (this.drawColor == this.backgroundColor) this.drawSize = 14;
        else this.drawSize = 2;
        if(this.active){
            socket.emit('changeColor',{"color":obj});
        }
    }

    bgColor(obj){
        switch (obj) {
            case "green-bg":
                this.backgroundColor = "green";
                break;
            case "blue-bg":
                this.backgroundColor = "blue";
                break;
            case "red-bg":
                this.backgroundColor = "red";
                break;
            case "yellow-bg":
                this.backgroundColor = "yellow";
                break;
            case "orange-bg":
                this.backgroundColor = "orange";
                break;
            case "black-bg":
                this.backgroundColor = "black";
                break;
            case "white-bg":
                this.backgroundColor = "white";
        }
        
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        if(this.active){
            socket.emit('changeBgColor',{"backgroundColor":obj});
        }
    }

    draw(){
        this.ctx.beginPath();
        this.ctx.moveTo(this.prevX, this.prevY);
        this.ctx.lineTo(this.currX, this.currY);
        this.ctx.strokeStyle = this.drawColor;
        this.ctx.lineWidth = this.drawSize;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    erase() {
        var m = confirm("Want to clear the board?");
        if (m) {
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
    }

    findxy(move, clientX, clientY) {
        if (move == 'down') {
            this.prevX = this.currX;
            this.prevY = this.currY;
            this.currX = clientX - this.canvas.offsetLeft;
            this.currY = clientY - this.canvas.offsetTop;
    
            this.flag = true;

            this.dot_flag = true;
            if (this.dot_flag) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.drawColor;
                this.ctx.fillRect(this.currX, this.currY, 2, 2);
                this.ctx.closePath();
                this.dot_flag = false;
            }
        }
        if (move == 'up' || move == "out") {
            this.flag = false;
        }
        if (move == 'move') {
            if (this.flag) {
                this.prevX = this.currX;
                this.prevY = this.currY;
                this.currX = clientX - this.canvas.offsetLeft;
                this.currY = clientY - this.canvas.offsetTop;
                this.draw();
            }
        }
    }
}


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




