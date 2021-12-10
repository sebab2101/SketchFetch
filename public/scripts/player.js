export class player{  // TESTED
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
  }

  resetScore() {
    this.#score = 0;
  }

  get getStatus() {
    return this.#status;
  }

  isDrawer(){
    return (this.#status == "drawer");
  }
  
  makeDrawer(){
    this.#status = "drawer";
  }

  changeStatus(newStatus) {
    this.#status = newStatus;
  }

  resetDrawStatus(){
    this.#status = "guesser";
  }

  get getParams(){
    return [this.#name,
            this.#playerId,
            this.#score,
            this.#status,
            this.#guessed,
            this.#place];
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