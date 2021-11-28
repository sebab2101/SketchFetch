class rankList{  //TESTED
  #players = [];

  constructor(oldPlayers = []){
    for (var i=0;i<oldPlayers.length;i++){
      let pl= oldPlayers[i];
      let p = new player(pl[0],pl[1],pl[2],pl[3],pl[4]);
      this.#players.push(p);
    }
  }

  addPlayer(player) {
    this.#players.push(player);
  }

  removePlayer(playerId_par) {
    var position = this.#players.findIndex(function(player) {
      return player.getPlayerId == playerId_par;
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

  makeList(){
    var rList = [];
    for (var i=0;i<this.#players.length;i++)
    {
      rList.push(this.#players[i].getParams);
    }
    return rList;
  }

  resetRankList() {
    for (var i=0;i<this.#players.length;i++)
    {
      this.#players[i].resetScore();
    }
  }

  getUsername(gameId){
    for (var i=0;i<this.#players.length;i++)
    {
      if(this.#players[i].getPlayerId == gameId){
        return this.#players[i].getName;
      }
    }
    return null;
  }
}

try {
  module.exports = rankList;
} catch (e) {}