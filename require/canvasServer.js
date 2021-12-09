const {createCanvas} = require('canvas')
const CANVAS_WIDTH = 1000;

module.exports = class canvasArea{
    canvas;
    canvasWidth=CANVAS_WIDTH;
    canvasHeight= CANVAS_WIDTH *(3/4);
    ctx;
    canvasOffsetLeft;
    canvasOffsetTop;
    drawBox;
    drawSizeSelector;
    prevX = 0;
    currX = 0;
    prevY = 0;
    currY = 0;
    drawColor = "black";
    drawSize= 2;
    drawSizeBuffer = 2;
    static eraserSize = 14;
    dot_flag = false;
    //Captures is player is drawing or not.
    flag = false;
    backgroundColor = "white";
    active = false;
    controller = new AbortController();
    constructor(active){
        this.canvas = createCanvas(this.canvasWidth, this.canvasHeight);
        this.ctx = this.canvas.getContext("2d");
        this.active = active;
    }

    changeDrawSize(value){
        this.drawSize = value;
        this.drawSizeBuffer = value;
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
                break;
            case "eraser-brush":
                this.drawColor = this.backgroundColor;
                break;
        }
        if (this.drawColor == this.backgroundColor) this.drawSize = canvasArea.eraserSize;
        else this.drawSize = this.drawSizeBuffer;
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
                break;
        }

        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
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
            this.eraseImmediate();
        }
    }

    eraseImmediate(){
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    isActive(){
        return this.active;
    }

    findxy(move, pageX, pageY,orgWidth) {
        if (move == 'down') {
            this.prevX = this.currX;
            this.prevY = this.currY;
            this.currX = pageX * (this.canvasWidth/orgWidth);
            this.currY = pageY * (this.canvasWidth/orgWidth);

            this.flag = true;

            this.dot_flag = true;
            if (this.dot_flag) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.drawColor;
                //make pixel wrt to the brushsize and color
                let halfPix = -this.drawSize/2;
                this.ctx.fillRect(this.currX-halfPix, this.currY-halfPix, halfPix, halfPix);
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
                this.currX = pageX * (this.canvasWidth/orgWidth);
                this.currY = pageY * (this.canvasWidth/orgWidth);
                this.draw();
            }
        }
    }

    sendImage(){
        let imageObject= this.canvas.toBuffer('image/png');
        console.log(imageObject);
        return imageObject;
    }

    loadImage(imageObject){
        imageObject.onload= ()=>{
            this.ctx.drawImage(imageObject,0,0,this.canvasWidth,this.canvasHeight);
        }   
    }   
}

