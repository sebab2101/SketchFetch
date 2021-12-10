/*
Client-side js.
*/
import {game} from "./scripts/game.js"
import {splashscreen} from "./scripts/splashscreen.js"

var socket = io();
var g;
var splash = new splashscreen();
splash.loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (splash.name) {
        g = new game(splash.name,socket);
        splash.toggleSplash();
        splash.resetName();
        addSocketEvents();
    }
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
    let userName = g.rankList.getUsername(id);
    document.getElementById("rankingOverlay").style.display = "none";
    document.getElementById("pickingOverlay").style.display = "initial";
    document.getElementById("pickingPlayerText").innerText ="Player " + userName + " is choosing a word!";

    g.canvas.makeUnactive();
    g.rankList.resetAllStatus();
    g.timer.startTimer(PICK_TIME);
    g.chat.addServerMessage("Player " + userName + " is choosing a word!");
});

socket.on("server_pickWord",(data,callback) =>{
    console.log(data);
    document.getElementById("overlay").style.display = "initial";
    document.getElementById("pickingOverlay").style.display = "none";
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
    document.getElementById("pickingOverlay").style.display = "none";
    document.getElementById("rankingOverlay").style.display = "none";
    let t1 = document.getElementById("rankingTable");
    for(var i = t1.rows.length - 1; i > 0; i--)
    {
      t1.deleteRow(i);
    }
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
    g.canvas.eraseImmediate();
    g.canvas.makeUnactive();
    document.getElementById("theWord").innerHTML = "";
    document.getElementById("theWord").innerHTML += data["guessWord"];
    let scoreMap = new Map(data["scoreMap"]);
    console.log(data["scoreMap"],scoreMap);
    document.getElementById("rankingOverlay").style.display = "initial";
    let t = document.getElementById("rankingTable").getElementsByTagName('tbody')[0];
    g.timer.startTimer(DRAW_END_TIME);
    const iterator1 = scoreMap.keys();
    for (var i=0;i<scoreMap.size;i++){
      var row = t.insertRow();
      let s = iterator1.next().value;
      if(i == scoreMap.size-1){
        row.insertCell().innerHTML = "&#9999;&#65039;";
      }else{
        row.insertCell().innerText = i+1;
      }
      row.insertCell().innerText = g.rankList.getUsername(s);
      row.insertCell().innerText = "+"+scoreMap.get(s);
    }


    g.rankList.processScoresMap(scoreMap);
    g.rankList.changeRankings();
    g.rankListDisplay.updateRankDisplay();
});

socket.on("server_roundEnd",function(data){

    console.log("round", data["roundNumber"], "ended");
    g.rankListDisplay.updateRankDisplay();
    g.chat.addServerMessage("Round " + data["roundNumber"] + " ended!");
=======
//Socket receive stuff here
function addSocketEvents(){
    socket.on('error', function (e) {
        console.error('Connection Error:', e);
    });


    socket.on('connected', function (data) {
        console.log('Socket connected (client side):', data);
    });

    socket.on('newPlayer', g.newPlayer);
    socket.on('removePlayer', g.removePlayer);
    socket.on('drawCanvas', g.drawCanvas);
    socket.on('changeColorCanvas', g.changeColorCanvas);
    socket.on('changeBgColorCanvas', g.changeBgColorCanvas);
    socket.on('clearCanvas', g.clearCanvas);
    socket.on('brushSizeCanvas', g.brushSizeCanvas);
    socket.on('canvasImage', g.loadCanvasImage);
    socket.on('chatMessage', g.newChatMessage);
    socket.on('correctGuess', g.processCorrectGuess);

    //server state-change events
    socket.on("server_idle",g.server_idle);
    socket.on("server_gameStart",g.server_gameStart);
    socket.on("server_roundBegin",g.server_roundBegin);
    socket.on("server_pickPlayer",g.server_pickPlayer);
    socket.on("server_pickWord",g.server_pickWord);
    socket.on("server_drawPhase", g.server_drawPhase);
    socket.on("server_drawEnd",g.server_drawEnd);
    socket.on("server_roundEnd",g.server_roundEnd);
    socket.on("server_gameEnd",g.addSocketEventsserver_gameEnd);
}
