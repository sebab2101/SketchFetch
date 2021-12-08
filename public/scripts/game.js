class game{
  rankList;
  rankListDisplay;
  canvas;
  timer;
  guessProgress;
  chat;
  player;
  constructor(userName) {
    socket.emit("newPlayer",userName,(response)=>{
      console.log(response);
      this.canvas = new canvasArea(false);
      this.timer = new timer();
      this.rankList = new rankList(response["rankList"]);
      this.rankListDisplay = new rankListDisplay(this.rankList);
      this.guessProgress = new guessProgress(this.timer);
      this.player = this.rankList.getPlayer(response['gameId']);
      this.chat = new chatArea(response['gameId'],this.rankList);
      this.chat.addServerMessage("You have joined.");
      this.rankListDisplay.updateRankDisplay()
      //force a window redraw event
      window.dispatchEvent(new Event('resize'));
    });
  }

  startGame() {
    // TBD
  }

  resetGame() {
    this.canvas.eraseImmediate();
    this.timer.resetTimer();
    this.rankList.resetRankList();
  }

  displayFinalScores() {
    this.rankList.displayRankList();
  }


}
