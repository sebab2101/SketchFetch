class timer {
  #defaultTime=30;
  #seconds;
  #interval;
  #counter;

  constructor() {
      this.#seconds = this.#defaultTime;
      this.#interval = null;
      this.#counter = false;
      document.getElementById("timer").innerText = this.#defaultTime;
   }

   runTimer() {

     this.#seconds--;
     document.getElementById("timer").innerText = this.#seconds;

     if(this.#seconds<1) {
       window.clearInterval(this.#interval);
       this.#counter = false;
       document.getElementById("timer").innerText = "Time's up";
     }

   }

   startTimer() {

     if (this.#counter === false) {
       this.#interval = window.setInterval(() => this.runTimer(),1000);
       document.getElementById("startTimer").innerText = "Stop";
       this.#counter = true;

     } else {
       window.clearInterval(this.#interval);
       document.getElementById("startTimer").innerText = "Start";
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
