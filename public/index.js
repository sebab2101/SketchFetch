/*
Client-side js.
*/
var socket = io();
var g;
var splash = new splashscreen();
function addListeners(){

    splash.loginForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        if (splash.nameInput.value) {
            g = new game(splash.nameInput.value)
            splash.splashZone.style.display = "none";
            splash.unsplashZone.style.display = "block";
            splash.nameInput.value = '';

            //window resize event
            window.addEventListener('resize', ()=>{
                console.log("resizing window!");
                g.canvas.dimensionSet();
            });

        }
    });
}
addListeners();

let toggleDraw = () => {
    console.log("Toggling canvas drawing to ",!g.canvas.isActive());
    if(!g.canvas.isActive()){
        g.canvas.makeActive();
    }else{
        g.canvas.makeUnactive();
    }
}
//Socket receive stuff here
socket.on('error', function (e) {
    console.error('Connection Error:', e);
});

socket.on('connected', function (data) {
    console.log('Socket connected (client side):', data);
});

socket.on('newPlayer',function (data){
    console.log('New player! (Client): ', data);
    p = new player(data['userName'],data['gameId']);
    g.rankList.addPlayer(p);
    g.rankListDisplay.updateRankDisplay()
});

socket.on('removePlayer',function (gameId){
    console.log('A player Left! (Client): ', g.rankList.getUsername(gameId), gameId);
    g.rankList.removePlayer(gameId);
    g.rankListDisplay.updateRankDisplay()
});

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

socket.on('chatMessage', function(data){
    console.log("Message received (Client):", data);
    let userName = g.rankList.getUsername(data['gameId']);
    if(userName != null){
        g.chat.addMessage(userName,data['message']);
    }
});

startTimer = ()=>g.timer.startTimer();
resetTimer = ()=>g.timer.resetTimer();
