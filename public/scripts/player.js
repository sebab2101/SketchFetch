class player{  // TESTED
  #name;
  #playerId;
  #score;
  #status;
  #guessed;

  constructor(name_par, playerId_par, score = 0, status = "guesser", guessed = false) {

    this.#name=name_par;
    this.#playerId=playerId_par;
    this.#score=score;
    this.#status=status;
    this.#guessed=guessed;
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

  get getParams(){
    return [this.#name,
            this.#playerId,
            this.#score,
            this.#status,
            this.#guessed];
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

try {
  module.exports = player;
} catch (e) {}