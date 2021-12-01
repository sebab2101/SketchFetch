class player{  // TESTED
  #name;
  #playerId;
  #score;
  #status;
  #guessed;
  #place;

  constructor(name_par, playerId_par, score = 0, status = "guesser", guessed = false, place=0) {

    this.#name=name_par;
    this.#playerId=playerId_par;
    this.#score=score;
    this.#status=status;
    this.#guessed=guessed;
    this.#place=place;
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

  get getPlace() {
    return this.#place;
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
            this.#guessed,
            this.#place];
  }

  changeStatus(newStatus) {
    this.#status = newStatus;
  }

  changePlace(newPlace) {
    this.#place = newPlace;
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
