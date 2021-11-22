class chatArea{
    chatBox;
    chatMessages;
    chatForm;
    chatInput;
    gameId;
    constructor(myId){
        this.chatBox = document.querySelector("#chatBox");
        this.chatMessages = chatBox.querySelector("#chatMessages");
        this.chatInput = chatBox.querySelector("#chatInput");
        this.chatForm = chatBox.querySelector("#chatForm");
        this.gameId = myId;
        this.addListeners();
    }

    addMessage(userName, msg){
        var item = document.createElement('li');
        item.textContent = userName +": " + msg;
        this.chatMessages.appendChild(item);
        // window.scrollTo(0, document.body.scrollHeight);
    }
    addListeners(){
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.chatInput.value) {
              this.addMessage("boi",this.chatInput.value);
              socket.emit('chatMessage', {"gameId":this.gameId, "message":this.chatInput.value});
              this.chatInput.value = '';
            }
        });
    }
    
}