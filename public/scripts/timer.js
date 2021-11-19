class timer {
  #defaultTime=10;
  #seconds;
  #timerSeconds;
  #interval;
  #counter;

  constructor() {
      this.#seconds = this.#defaultTime;
      this.#interval = null;
      this.#counter = false;
      document.getElementById("timer").innerHTML = this.#defaultTime;
   }

   runTimer() {

     this.#seconds--;
     document.getElementById("timer").innerHTML = this.#seconds;

     if(this.#seconds<1) {
       window.clearInterval(this.#interval);
       this.#counter = false;
       document.getElementById("timer").innerHTML = "Time's up";
     }

   }

   startTimer() {

     if (this.#counter === false) {
       this.#interval = window.setInterval(() => this.runTimer(),1000);
       document.getElementById("startTimer").innerHTML = "Stop";
       this.#counter = true;

     } else {
       window.clearInterval(this.#interval);
       document.getElementById("startTimer").innerHTML = "Start";
       this.#counter = false;
     }

     this.runTimer();
   }

    resetTimer() {
      window.clearInterval(this.#interval);
      this.#seconds = this.#defaultTime;
      document.getElementById("timer").innerHTML = this.#defaultTime;
      document.getElementById("startTimer").innerHTML = "Start"
  }

}
