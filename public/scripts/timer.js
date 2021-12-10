export class timer{
  #defaultTime;
  #seconds;
  #interval;
  #counter;
  timerBox;
  timer;
  constructor() {
      this.timerBox= document.querySelector("#timerBox");
      this.timer= this.timerBox.querySelector("#timer");
      this.#seconds = this.#defaultTime;
      this.#interval = null;
      this.#counter = false;
      //this.timer.innerText = this.#defaultTime;
   }

   runTimer() {
     this.#seconds--;
     if(this.#seconds<1) {
       window.clearInterval(this.#interval);
       this.#counter = false;
       this.timer.innerText = "Time's up";
       this.timerBox.style.background = `yellow`;
     }else{
       this.timer.innerText = this.#seconds;
       this.timerBox.style.background = `linear-gradient(
          to right,
          green ` + this.#seconds*100/this.#defaultTime +`%,
          transparent 0%,
          transparent 100%
        )`;
     }

   }

   startTimer(time) {
     time /= 1000;
     this.#defaultTime = time;
     this.#seconds = time;
     window.clearInterval(this.#interval);
     this.#interval = window.setInterval(() => this.runTimer(),1000);
     this.#counter = true;
     this.runTimer();
   }

    resetTimer() {
      window.clearInterval(this.#interval);
      this.timer.innerHTML = "";
      this.timerBox.style.background = `green`;
  }

  getTime(){
    return this.#seconds;
  }

  getDefaultTime(){
    return this.#defaultTime;
  }

}
