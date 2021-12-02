class chatArea{
    chatBox;
    chatMessages;
    chatForm;
    chatInput;
    gameId;
    rankList;
    constructor(myId,myList){
        this.chatBox = document.querySelector("#chatBox");
        this.chatMessages = chatBox.querySelector("#chatMessages");
        this.chatMessageArea = chatBox.querySelector("#chatMessageArea");
        this.chatInput = chatBox.querySelector("#chatInput");
        this.chatForm = chatBox.querySelector("#chatForm");
        this.gameId = myId;
        this.rankList = myList;
        this.addListeners();
    }

    addMessage(userName, msg){
        var item = document.createElement('li');
        item.innerHTML = "<b>" +userName+ ": </b> " + msg;
        this.chatMessages.appendChild(item);
        this.scroll();
    }

    addServerMessage(msg){
        var item = document.createElement('li');
        item.innerHTML = "<b>" + msg + "</b> ";
        item.className = "serverMessage";
        this.chatMessages.appendChild(item);
        this.scroll();
    }

    scroll(){
        let shouldScroll = (this.chatMessageArea.scrollTop + this.chatMessageArea.clientHeight + 50 ) >= this.chatMessageArea.scrollHeight;
        console.log((this.chatMessageArea.scrollTop + this.chatMessageArea.clientHeight ), this.chatMessageArea.scrollHeight);
        if (shouldScroll) {
            this.chatMessageArea.scrollTop = this.chatMessageArea.scrollHeight;
        }
    }

    addListeners(){
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.chatInput.value) {
              this.addMessage(this.rankList.getUsername(this.gameId),this.chatInput.value);
              socket.emit('chatMessage', {"gameId":this.gameId, "message":this.chatInput.value});
              this.chatInput.value = '';
            }
        });
    }
    
}