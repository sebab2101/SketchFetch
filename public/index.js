/*
Client-side js.
*/
var socket = io();
var g;
var splash = new splashscreen();
var drawTime = 30;
var choiceTime = 10;
var gameStartTime = 10;
function addListeners(){

    splash.loginForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        if (splash.nameInput.value) {
            g = new game(splash.nameInput.value);
            splash.splashZone.style.display = "none";
            splash.unsplashZone.style.display = "block";
            splash.nameInput.value = '';
            //window resize event
            window.addEventListener('resize', ()=>{
                console.log("redrawing window!");
                g.canvas.dimensionSet();
                let height = g.canvas.canvas.height;
                g.chat.chatBox.style.height = height;
                g.rankListDisplay.rankingBox.style.height = height;
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
    g.rankListDisplay.updateRankDisplay();
    g.chat.addServerMessage(data['userName']+" has joined.");
});

socket.on('removePlayer',function (gameId){
    let uName = g.rankList.getUsername(gameId);
    console.log('A player Left! (Client): ', uName, gameId);
    g.rankList.removePlayer(gameId);
    g.rankListDisplay.updateRankDisplay();
    g.chat.addServerMessage(uName+" has left.");
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

socket.on("server_idle",function(){
    g.chat.addServerMessage("Waiting for more players..");
});

socket.on("server_gameStart",function(){
    g.timer.startTimer(gameStartTime);
    g.chat.addServerMessage("Starting game soon..");
});

socket.on("server_roundBegin",function(num){
    g.timer.startTimer(drawTime);
    console.log("round", num, "begins");
    g.chat.addServerMessage("Round " + (num+1) + " begins!");
});

socket.on("server_pickPlayer",function(id){
    console.log("player", g.rankList.getUsername(id), "is choosing a word");
    g.chat.addServerMessage(g.rankList.getUsername(id) + " is choosing a word!");
});

socket.on ("server_startDraw", (data,callback) =>{

    g.timer.startTimer(choiceTime);
    g.canvas.makeActive();
    console.log(data);
    callback(data["wordChoices"][0]);
});


socket.on("server_roundEnd",function(num){
  console.log("round", num, "ended");
  g.chat.addServerMessage("Round " + num + " ended!");

});

socket.on("server_gameEnd",function(){
    g.chat.addServerMessage("Game Over! Thanks for playing!");
});

//startTimer = (time)=>g.timer.startTimer(time);
//resetTimer = (time)=>g.timer.resetTimer(time);
