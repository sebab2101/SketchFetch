class game{
  rankList;
  canvas;
  timer;
  guessProgress;
  chat;
  constructor() {
    this.canvas = new canvasArea(false);
    this.timer = new timer();
    this.rankList = new rankList();
    this.guessProgress = new guessProgress(this.timer);
    this.chat = new chatArea();
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
