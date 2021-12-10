import * as constants from "../constants.js"
import {canvasArea} from "./canvasArea.js"
import {chatArea} from "./chatArea.js"
import {guessProgress} from "./guessProgress.js"
import {player} from "./player.js"
import {rankList} from "./rankList.js"
import {rankListDisplay} from "./rankListDisplay.js"
import {timer} from "./timer.js"

export class game{
  rankList;
  rankListDisplay;
  canvas;
  timer;
  guessProgress;
  chat;
  player;
  constructor(userName,socket) {
      socket.emit("newPlayer",userName,(response)=>{
      console.log(response);
      this.canvas = new canvasArea(false,socket);
      this.timer = new timer();
      console.log(this.timer);
      this.rankList = new rankList(response["rankList"]);
      this.rankListDisplay = new rankListDisplay(this.rankList);
      this.guessProgress = new guessProgress(this.timer);
      this.player = this.rankList.getPlayer(response['gameId']);
      this.chat = new chatArea(response['gameId'],this.rankList,socket);
      this.chat.addServerMessage("You have joined.");
      this.rankListDisplay.updateRankDisplay()
      //window redraw adjustments
      window.addEventListener('resize', ()=>{
        console.log("redrawing window!");
        this.canvas.dimensionSet();
        let height = this.canvas.canvas.height;
        this.chat.chatBox.style.height = height;
        this.rankListDisplay.rankingBox.style.height = height;
      });
      //force a window redraw event
      window.dispatchEvent(new Event('resize'));
    });
  }

  newPlayer=(data)=>{
    console.log('New player! (Client): ', data);
    let p = new player(data['userName'],data['gameId']);
    this.rankList.addPlayer(p);
    this.rankList.changeRankings();
    this.rankListDisplay.updateRankDisplay();
    this.chat.addServerMessage(data['userName']+" has joined.");
  }

  removePlayer=(gameId)=>{
    let uName = this.rankList.getUsername(gameId);
    console.log('A player Left! (Client): ', uName, gameId);
    this.rankList.removePlayer(gameId);
    this.rankList.changeRankings();
    this.rankListDisplay.updateRankDisplay();
    this.chat.addServerMessage(uName+" has left.");
  }

  drawCanvas=(data)=>{
    console.log("Draw (Client):", data);
    this.canvas.findxy(data["move"],data["x"],data["y"],data["orgWidth"]);
  }

  changeColorCanvas=(data)=>{
    console.log("changeColor (Client):", data);
    this.canvas.color(data["color"]);
  }

  changeBgColorCanvas=(data)=>{
    console.log("changeBgColor (Client):", data);
    this.canvas.bgColor(data["backgroundColor"]);
  }

  clearCanvas=(data)=>{
    console.log("Canvas cleared (Client)");
    this.canvas.eraseImmediate();
  }

  brushSizeCanvas=(data)=>{
    console.log("Change Brush size (Client):", data);
    this.canvas.changeDrawSize(data["brushSize"]);
  }

  loadCanvasImage=(data)=>{
    let image = data["image"];
    console.log("receiving image: ", image);
    this.canvas.serverImage(image);
    this.canvas.color(data["brushColor"]);
  }

  newChatMessage=(data)=>{
    console.log("Message received (Client):", data);
    let gameId =data['gameId'];
    let player = this.rankList.getPlayer(gameId);
    if(player != null){
        let userName = player.getName ,type = "allRoom";
        if(player.getGuessed){
            type = "correctRoom";
        }
        this.chat.addMessage(userName,data['message'],type);
    }
  }

  processCorrectGuess=(data)=>{
    let player = this.rankList.getPlayer(data['gameId']);
    let userName = player.getName;
    console.log(userName, "guessed correctly.");
    if(userName != null){
        this.chat.addServerMessage(userName + " guessed correctly!");
    }
    player.rightGuessed();
    this.rankListDisplay.updateRankDisplay();
  }

  server_idle=()=>{
    this.timer.resetTimer();
    this.chat.addServerMessage("Waiting for more players..");
}

  server_gameStart=()=>{
    this.resetGame();
    this.rankListDisplay.updateRankDisplay();
    this.timer.startTimer(constants.START_TIME);
    this.chat.addServerMessage("Starting game soon..");
}

  server_roundBegin=(num)=>{
    this.timer.resetTimer();
    console.log("round", num, "begins");
    this.chat.addServerMessage("Round " + num + " begins!");
    if(num==1)
      document.getElementById("theWordWas").style.display = "initial";
}

  server_pickPlayer=(id)=>{
    let userName = this.rankList.getUsername(id);
    document.getElementById("rankingOverlay").style.display = "none";
    document.getElementById("pickingOverlay").style.display = "initial";
    document.getElementById("pickingPlayerText").innerText ="Player " + userName + " is choosing a word!";

    this.canvas.makeUnactive();
    this.rankList.resetAllStatus();
    this.timer.startTimer(constants.PICK_TIME);
    this.chat.addServerMessage("Player " + userName + " is choosing a word!");
}

  server_pickWord=(data,callback)=>{
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
    this.guessProgress.updateGuessWord(choice);
    callback(choice);
    }, constants.PICK_TIME*0.9); //automatically chooses after 90% of pick-time elapses


    document.getElementById('word1').addEventListener('click', ()=> {
        choice = data["wordChoices"][0];
        document.getElementById("overlay").style.display = "none";
        callback(choice);
        clearTimeout(timeId);
        this.guessProgress.updateGuessWord(choice);
    });

    document.getElementById('word2').addEventListener('click', ()=> {
        choice = data["wordChoices"][1];
        document.getElementById("overlay").style.display = "none";
        callback(choice);
        clearTimeout(timeId);
        this.guessProgress.updateGuessWord(choice);
    });

    document.getElementById('word3').addEventListener('click', ()=> {
        choice = data["wordChoices"][2];
        document.getElementById("overlay").style.display = "none";
        callback(choice);
        clearTimeout(timeId);
        this.guessProgress.updateGuessWord(choice);
    });

    this.canvas.eraseImmediate();
}

  server_drawPhase=(data)=>{
    let gameId = data["drawer"], wordLength = data["wordLength"];
    let player = this.rankList.getPlayer(gameId);
    let userName = player.getName;
    document.getElementById("pickingOverlay").style.display = "none";
    document.getElementById("rankingOverlay").style.display = "none";
    let t1 = document.getElementById("rankingTable");
    for(var i = t1.rows.length - 1; i > 0; i--)
    {
    t1.deleteRow(i);
    }
    console.log("Receiving draw data from", userName);
    this.timer.startTimer(constants.DRAW_TIME);
    this.chat.addServerMessage(userName + " is drawing.");
    player.rightGuessed();
    player.makeDrawer();
    if(this.player.getPlayerId == gameId)
    {
        this.canvas.makeActive();
    }
    else {
    this.guessProgress.startGuessWord(wordLength);
    }

    this.rankListDisplay.updateRankDisplay();
}

  server_drawEnd=(data)=>{
    this.chat.addServerMessage("Drawing ended");
    this.canvas.makeUnactive();
    document.getElementById("theWord").innerText = data["guessWord"];
    let scoreMap = new Map(data["scoreMap"]);
    console.log(data["scoreMap"],scoreMap);
    document.getElementById("rankingOverlay").style.display = "initial";
    let t = document.getElementById("rankingTable").getElementsByTagName('tbody')[0];
    this.timer.startTimer(constants.DRAW_END_TIME);
    const iterator1 = scoreMap.keys();
    for (var i=0;i<scoreMap.size;i++){
    var row = t.insertRow();
    let s = iterator1.next().value;
    if(i == scoreMap.size-1){
        row.insertCell().innerHTML = "&#9999;&#65039;";
    }else{
        row.insertCell().innerText = i+1;
    }
    row.insertCell().innerText = this.rankList.getUsername(s);
    row.insertCell().innerText = "+"+scoreMap.get(s);
    }

    this.guessProgress.clearGuessWord();
    this.rankList.processScoresMap(scoreMap);
    this.rankList.changeRankings();
    this.rankListDisplay.updateRankDisplay();
}

  server_roundEnd=(data)=>{
    console.log("round", data["roundCount"], "ended");
    this.rankListDisplay.updateRankDisplay();
    this.chat.addServerMessage("Round " + data["roundCount"] + " ended!");
    this.rankList.sortRankList();
    this.rankListDisplay.updateRankDisplay();
}

  server_gameEnd=()=>{
    var ranking = this.rankList.allPlayers;
    document.getElementById("rankingOverlay").style.display = "initial";
    document.getElementById("theWordWas").style.display = "none";
    document.getElementById("theWord").innerText = "Final Ranking";
    let t1 = document.getElementById("rankingTable");
    for(var i = t1.rows.length - 1; i > 0; i--)
    {
    t1.deleteRow(i);
    }

    let t = document.getElementById("rankingTable").getElementsByTagName('tbody')[0];
    for (var i=0; i<ranking.length; i++){
      var row = t.insertRow();
      row.insertCell().innerText = i+1;
      row.insertCell().innerText = ranking[i].getName;
      row.insertCell().innerText = ranking[i].getScore;
    }

    this.guessProgress.clearGuessWord();
    this.chat.addServerMessage("Game Over! Thanks for playing!");
  }

  resetGame(){
    this.canvas.eraseImmediate();
    this.timer.resetTimer();
    this.rankList.resetRankList();
  }
}
