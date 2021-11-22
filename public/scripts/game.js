class game{
  rankList;
  canvas;
  timer;
  guessProgress;
  chat;
  player;
  constructor(userName) {
    socket.emit("newPlayer",userName,(response)=>{
      console.log(userName, response['gameId']);
      this.canvas = new canvasArea(false);
      this.timer = new timer();
      this.rankList = new rankList();
      this.guessProgress = new guessProgress(this.timer);
      this.player = new player(userName,response['gameId']);
      this.rankList.addPlayer(this.player);
      this.chat = new chatArea(response['gameId']);
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
