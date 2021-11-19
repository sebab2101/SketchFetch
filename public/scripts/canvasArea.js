
class canvasArea{
    canvas;
    canvasWidth;
    canvasHeight;
    ctx;
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
    flag = false;
    backgroundColor = "white";
    active = false;
    controller = new AbortController();
    constructor(active){
        this.drawBox = document.querySelector("#drawBox");
        this.drawSizeSelector = this.drawBox.querySelector("#brushSizeRange");
        this.drawBox.style.display = "none";
        this.canvas = document.querySelector("#canvasArea");
        this.mouseCircle = document.querySelector("#mouseCircle");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.translate(0.5, 0.5);

        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.active = active;
        if(this.active){
            this.addMouseListeners();
        }
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
            this.findxy('move', e.pageX, e.pageY)
            socket.emit('drawCanvas',{"move": 'move', "x": e.pageX, "y": e.pageY});
        }, { signal: this.controller.signal });
        this.canvas.addEventListener("mousedown", e  => {
            this.findxy('down', e.pageX, e.pageY)
            socket.emit('drawCanvas',{"move": 'down', "x": e.pageX, "y": e.pageY});
        }, { signal: this.controller.signal });
        this.canvas.addEventListener("mouseup", e =>{
            this.findxy('up', e.pageX, e.pageY)
            socket.emit('drawCanvas',{"move": 'up', "x": e.pageX, "y": e.pageY});
        }, { signal: this.controller.signal });
        this.canvas.addEventListener("mouseout", e =>{
            this.findxy('out', e.pageX, e.pageY)
            socket.emit('drawCanvas',{"move": 'out', "x": e.pageX, "y": e.pageY});
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

    findxy(move, pageX, pageY) {
        if (move == 'down') {
            this.prevX = this.currX;
            this.prevY = this.currY;
            this.currX = pageX - this.canvas.offsetLeft;
            this.currY = pageY - this.canvas.offsetTop;

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
                this.currX = pageX - this.canvas.offsetLeft;
                this.currY = pageY - this.canvas.offsetTop;
                this.draw();
            }
        }
    }

    sendImage(){
        if(this.active){
            var image = this.ctx.getImageData(0,0,this.canvasWidth,this.canvasHeight);
            socket.emit('imageSend',{"image":image});
        }
    }

    loadImage(){
        socket.emit('imageRequest',(image)=>{
            if(!this.active){
                this.ctx.getImageData(image,0,0);
            }
        });
    }
}
