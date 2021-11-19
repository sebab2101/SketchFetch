class player{  // TESTED
  #name;
  #playerId;
  #score;
  #status;
  #guessed;

  constructor(name_par, playerId_par) {
    this.#name=name_par;
    this.#playerId=playerId_par;
    this.#score=0;
    this.#status="guesser";
    this.#guessed=false;
  }

  get getName() {
    return this.#name;
  }

  get getPlayerId() {
    return this.#playerId;
  }

  get getScore() {
    return this.#score;
  }

  changeScore(points) {
    this.#score = this.#score + points;
    return this.#score;
  }

  resetScore() {
    this.#score = 0;
  }

  get getStatus() {
    return this.#status;
  }

  changeStatus(newStatus) {
    this.#status = newStatus;
  }

  get getGuessed() {
    return this.#guessed;
  }

  resetGuessed() {
    this.#guessed=false;
  }

  rightGuessed() {
    this.#guessed=true;
  }

}
