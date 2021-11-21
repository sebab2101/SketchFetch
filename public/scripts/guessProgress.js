class guessProgress{
    //Not the exact word, just a placeholder
    guessWord;
    guessWordLength;
    timer;
    guessProgressBox;
    guessWordArea;
    constructor(t){
        this.timer = t;
        this.guessProgressBox = document.querySelector("#guessProgressBox");
        this.guessWordArea = this.guessProgressBox.querySelector("#guessWord");
    }

    startGuessWord(wordLength){
        this.guessWordLength = wordLength;
        this.guessWord = '_'.repeat(this.guessWordLength);
        this.guessWordArea.innerText = this.guessWord;
    }

    updateLetter(pos,letter){
        this.guessWord = this.guessWord.substr(0,pos-1) + letter + this.guessWord.substr(pos);
        this.guessWordArea.innerText = this.guessWord;
    }

    updateGuessWord(word){
        this.guessWord = word
        this.guessWordArea.innerText = this.guessWord;
    }

    displayWord(){
        for (var i = 0; i < word.length; i++) {
            answerArray[i] = "_";
          }
    }
}