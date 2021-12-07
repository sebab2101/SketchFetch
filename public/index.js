/*
Client-side js.
*/
//time before game starts with sufficient players
const START_TIME = 10000 / 1000;
//time before game restarts after game ends
const END_TIME = 10000 / 1000;
//time for selecting a word
const PICK_TIME = 10000 / 1000;
//time for drawing
const DRAW_TIME = 35000 / 1000;
//time to show results after drawing;
const DRAW_END_TIME = 5000 / 1000;
//total rounds
const TOTAL_ROUNDS = 3;


var socket = io();
var g;
var splash = new splashscreen();
document.getElementById("overlay").style.display = "none";
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
            addSocketEvents();
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


function addSocketEvents(){
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

socket.on('canvasImage', function(data){
    let image = data["image"];
    console.log("receiving image: ", image);
    g.canvas.serverImage(image);
    g.canvas.color(data["brushColor"]);
});

socket.on('chatMessage', function(data){
    console.log("Message received (Client):", data);
    let gameId =data['gameId'];
    let player = g.rankList.getPlayer(gameId);
    if(player != null){
        let userName = player.getName ,type = "allRoom";
        if(player.getGuessed){
            type = "correctRoom";
        }
        g.chat.addMessage(userName,data['message'],type);
    }
});

socket.on('correctGuess',function(data){
    let player = g.rankList.getPlayer(data['gameId']);
    let userName = player.getName;
    console.log(userName, "guessed correctly.");
    if(userName != null){
        g.chat.addServerMessage(userName + " guessed correctly!");
    }
    player.rightGuessed();
    g.rankListDisplay.updateRankDisplay();
});

socket.on("server_idle",function(){
    g.timer.resetTimer();
    g.chat.addServerMessage("Waiting for more players..");
});

socket.on("server_gameStart",function(){
    g.timer.startTimer(START_TIME);
    g.chat.addServerMessage("Starting game soon..");
});

socket.on("server_roundBegin",function(num){
    g.timer.resetTimer();
    console.log("round", num, "begins");
    g.chat.addServerMessage("Round " + num + " begins!");
});

socket.on("server_pickPlayer",function(id){
    g.canvas.makeUnactive();
    g.rankList.resetAllStatus();
    g.timer.startTimer(PICK_TIME);
    g.chat.addServerMessage("Player " + g.rankList.getUsername(id) + " is choosing a word!");
});

socket.on("server_pickWord",(data,callback) =>{
    console.log(data);
    document.getElementById("overlay").style.display = "initial";
    var choice = "";
    document.getElementById('word1').innerText = data["wordChoices"][0];
    document.getElementById('word2').innerText = data["wordChoices"][1];
    document.getElementById('word3').innerText = data["wordChoices"][2];

    let timeId = setTimeout(()=>{
      console.log(data["wordChoices"][0]);
      choice = data["wordChoices"][0];
      document.getElementById("overlay").style.display = "none";
      g.guessProgress.updateGuessWord(choice);
      callback(choice);
    }, PICK_TIME*900); //automatically chooses after 9 seconds


    document.getElementById('word1').addEventListener('click', function() {
        choice = data["wordChoices"][0];
        document.getElementById("overlay").style.display = "none";
        callback(choice);
        clearTimeout(timeId);
        g.guessProgress.updateGuessWord(choice);
      });
  
      document.getElementById('word2').addEventListener('click', function() {
        choice = data["wordChoices"][1];
        document.getElementById("overlay").style.display = "none";
        callback(choice);
        clearTimeout(timeId);
        g.guessProgress.updateGuessWord(choice);
      });
  
      document.getElementById('word3').addEventListener('click', function() {
        choice = data["wordChoices"][2];
        document.getElementById("overlay").style.display = "none";
        callback(choice);
        clearTimeout(timeId);
        g.guessProgress.updateGuessWord(choice);
      });
});

socket.on("server_drawPhase", function(data){
    let gameId = data["drawer"], wordLength = data["wordLength"];
    let player = g.rankList.getPlayer(gameId);
    let userName = player.getName;
    console.log("Receiving draw data from", userName);
    g.timer.startTimer(DRAW_TIME);
    g.chat.addServerMessage(userName + " is drawing.");
    player.rightGuessed();
    player.makeDrawer();
    if(g.player.getPlayerId == gameId)
    {
        g.canvas.makeActive();
    }
    else {
      g.guessProgress.startGuessWord(wordLength);
    }

    g.rankListDisplay.updateRankDisplay();

});

socket.on("server_drawEnd",function(data){
    g.rankList.processScoresMap(data["scoreMap"]);
});

socket.on("server_roundEnd",function(data){
    g.timer.startTimer(DRAW_END_TIME);
    console.log("round", data["roundNumber"], "ended");
    g.rankListDisplay.updateRankDisplay();
    g.chat.addServerMessage("Round " + data["roundNumber"] + " ended!");
});

socket.on("server_gameEnd",function(){
    g.chat.addServerMessage("Game Over! Thanks for playing!");
});
}
//startTimer = (time)=>g.timer.startTimer(time);
//resetTimer = (time)=>g.timer.resetTimer(time);
