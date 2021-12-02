
class canvasArea{
    canvas;
    canvasWidth=0;
    canvasHeight=0;
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
    constructor(active, drawBox, canvasArea){
        this.drawBox = drawBox;
        this.drawSizeSelector = this.drawBox.querySelector("#brushSizeRange");
        this.canvas = canvasArea;
        this.ctx = this.canvas.getContext("2d");
        this.drawBox.style.display = "none";
        this.active = active;
        this.dimensionSet();
        if(this.active){
            this.addMouseListeners();
        }
    }

    dimensionSet(){
        //setting up dimensions and co-ordinate system 

        let imageObject = this.sendImage();
        this.canvasOffsetLeft=this.canvas.offsetParent.offsetLeft;
        this.canvasOffsetTop=this.canvas.offsetParent.offsetTop;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;

        this.loadImage(imageObject);
    }

    makeActive(){
        this.drawBox.style.display = "block";
        this.active=true;
        this.bgColor("white-bg");
        this.color("black-brush");
        this.addMouseListeners();
    }

    makeUnactive(){
        this.drawBox.style.display = "none";
        this.active=false;
        this.removeMouseListeners();
    }

    addMouseListeners(){
        delete(this.controller);
        this.controller = new AbortController();
        this.canvas.addEventListener("mousemove", e => {
            let pageX = e.pageX-this.canvasOffsetLeft;
            let pageY = e.pageY-this.canvasOffsetTop;
            this.findxy('move', pageX, pageY,this.canvasWidth)
            if(this.flag)
                socket.emit('drawCanvas',{"move": 'move', "x": pageX, "y": pageY, "orgWidth": this.canvasWidth});
        }, { signal: this.controller.signal });
        this.canvas.addEventListener("mousedown", e  => {
            let pageX = e.pageX-this.canvasOffsetLeft;
            let pageY = e.pageY-this.canvasOffsetTop;
            this.findxy('down', pageX, pageY,this.canvasWidth)
            socket.emit('drawCanvas',{"move": 'down', "x": pageX, "y": pageY, "orgWidth": this.canvasWidth});
        }, { signal: this.controller.signal });
        this.canvas.addEventListener("mouseup", e =>{
            let pageX = e.pageX-this.canvasOffsetLeft;
            let pageY = e.pageY-this.canvasOffsetTop;
            this.findxy('up', pageX, pageY,this.canvasWidth)
            socket.emit('drawCanvas',{"move": 'up', "x": pageX, "y": pageY, "orgWidth": this.canvasWidth});
        }, { signal: this.controller.signal });
        this.canvas.addEventListener("mouseout", e =>{
            let pageX = e.pageX-this.canvasOffsetLeft;
            let pageY = e.pageY-this.canvasOffsetTop;
            this.findxy('out', pageX, pageY,this.canvasWidth)
            if(this.flag)
                socket.emit('drawCanvas',{"move": 'out', "x": pageX, "y": pageY, "orgWidth": this.canvasWidth});
        }, { signal: this.controller.signal });


        var brushBoxes = this.drawBox.querySelector("#brushColorSelect").children;
        var bgBoxes = this.drawBox.querySelector("#backgroundColorSelect").children;
        var btnBox = this.drawBox.querySelector("#drawButtonBox");

        for (var i = 0; i < brushBoxes.length; i++) {
            let temp =brushBoxes[i].id;
            if(temp!=""){
                brushBoxes[i].addEventListener("click",()=>{
                    this.color(temp);
                }, {signal:this.controller.signal});
            }
        }
        this.drawBox.querySelector("#eraser-brush").addEventListener("click",()=>{
            this.color("eraser-brush");
        },{signal:this.controller.signal});
        

        for (var i = 0; i < bgBoxes.length; i++) {
            let temp =bgBoxes[i].id;
            if(temp!=""){
                bgBoxes[i].addEventListener("click",()=>{
                    this.bgColor(temp);
                }, {signal:this.controller.signal});
            }
        }
        var clearButton = btnBox.querySelector("#clearCanvasButton");
        clearButton.addEventListener("click",()=>{
            this.erase();
        }, {signal:this.controller.signal});

        this.drawSizeSelector.addEventListener("mouseup",()=>{
            this.drawSize = this.drawSizeSelector.value;
            this.drawSizeBuffer = this.drawSize;
            socket.emit("brushSizeCanvas",{"brushSize":this.drawSize});
        },{signal:this.controller.signal});
    }

    removeMouseListeners(){
        this.controller.abort();
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
        if(this.active){
            socket.emit('changeColorCanvas',{"color":obj});
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
                break;
        }

        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        if(this.active){
            socket.emit('changeBgColorCanvas',{"backgroundColor":obj});
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
            this.eraseImmediate();
            socket.emit('clearCanvas');
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
        let imageObject=new Image();
        imageObject.src= this.canvas.toDataURL();
        return imageObject;
    }

    loadImage(imageObject){
        imageObject.onload= ()=>{
            this.ctx.drawImage(imageObject,0,0,this.canvasWidth,this.canvasHeight);
        }   
    }
}

