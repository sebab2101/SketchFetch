export class player{  // TESTED
  #name;
  #playerId;
  #score;
  #status;
  #guessed;

  constructor(name_par, playerId_par) {
    this.name=name_par;
    this.playerId=playerId_par;
    this.score=0;
    this.status="guesser";
    this.guessed=false;
  }

  get getName() {
    return this.name;
  }

  get getPlayerId() {
    return this.playerId;
  }

  get getScore() {
    return this.score;
  }

  changeScore(points) {
    this.score = this.score + points;
    return this.score;
  }

  resetScore() {
    this.score = 0;
  }

  get getStatus() {
    return this.status;
  }

  changeStatus(newStatus) {
    this.status = newStatus;
  }

  get getGuessed() {
    return this.guessed;
  }

  resetGuessed() {
    this.guessed=false;
  }

  rightGuessed() {
    this.guessed=true;
  }

}

export class rankList{  //TESTED
  #players;

  constructor(){
    this.players  = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(playerId_par) {
    var position = this.players.findIndex(function(player) {
      return player.playerId == playerId_par
    });

    if ( ~position ) this.players.splice(position, 1); //check if the player with given id exists
  }

  sortRankList() {
      this.players.sort(function (a, b) {
        return b.score - a.score;
        });
  }

  displayRankList(){ //used for testing
    var ranking="";
    for (var i=0;i<this.players.length;i++)
    {
      ranking+=(this.players[i].getName + "\t" + this.players[i].getScore + "\n");
    }
    return ranking;
  }

}

export class timer {

}
