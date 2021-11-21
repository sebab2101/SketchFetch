class rankList{  //TESTED
  #players;

  constructor(){
    this.#players  = [];
  }

  addPlayer(player) {
    this.#players.push(player);
  }

  removePlayer(playerId_par) {
    var position = this.#players.findIndex(function(player) {
      return player.getPlayerId == playerId_par
    });

    if ( ~position ) this.#players.splice(position, 1); //check if the player with given id exists
  }

  sortRankList() {
      this.#players.sort(function (a, b) {
        return a.getScore - b.getScore;
        });
  }

  displayRankList(){ //used for testing
    var ranking="";
    for (var i=0;i<this.#players.length;i++)
    {
      ranking+=(this.#players[i].getName + "\t" + this.#players[i].getScore + "\n");
    }
    return ranking;
  }

  resetRankList() {
    for (var i=0;i<this.#players.length;i++)
    {
      this.#players[i].resetScore();
    }
  }

}
