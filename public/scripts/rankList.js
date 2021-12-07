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

    this.sortRankList();
  }

  removePlayer(playerId_par) {
    var position = this.#players.findIndex(function(player) {
      return player.getPlayerId == playerId_par;
    });

    if ( ~position ) this.#players.splice(position, 1); //check if the player with given id exists
  }

  getPlayer(playerId){
    for (var i=0;i<this.#players.length;i++)
    {
      if(this.#players[i].getPlayerId == playerId){
        return this.#players[i];
      }
    }
    return null;
  }

  sortRankList() {
      this.#players.sort(function (a, b) {
        return a.getScore - b.getScore;
        });

      for (var i=0;i<this.#players.length;i++)
      {
        this.#players[i].changePlace(i+1);
        if(i>0 && this.#players[i].getScore == this.#players[i-1].getScore){
          this.#players[i].changePlace(this.#players[i-1].getPlace);
        }

      }
  }

  get allPlayers(){
    return this.#players;
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

  processScoresMap(scoreMap){
    scoreMap.forEach((value,key)=>{
      this.getPlayer(key).changeScore(value);
    });
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
/*
  isDrawer(gameId){
    for (var i=0;i<this.#players.length;i++)
    {
      if(this.#players[i].getPlayerId == gameId){
        if(this.#players[i].getStatus == "drawer"){
          return true;
        }
      }
    }
    return false;
  }
*/
  get getNumOfPlayers(){
    return this.#players.length;
  }

  atIndex(i){
    if(i < this.#players.length && i>=0)
      return this.#players[i];
    return null;
  }

  getIndex(gameId){
    for (var i=0;i<this.#players.length;i++)
    {
      if(this.#players[i].getPlayerId == gameId){
        return i;
      }
    }
    return null;
  }

  resetAllStatus(){
    for (var i=0;i<this.#players.length;i++)
    {
      this.#players[i].resetGuessed();
      this.#players[i].resetDrawStatus();
    }
  }
}

try {
  module.exports = rankList;
} catch (e) {}
