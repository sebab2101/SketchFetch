class game{
  rankList;
  canvas;
  timer;

  constructor() {
    this.canvas = new canvasArea(false);
    this.timer = new timer();
    this.rankList = new rankList();
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
