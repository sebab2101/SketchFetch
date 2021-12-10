export class chatArea{
    chatBox;
    chatMessages;
    chatForm;
    chatInput;
    gameId;
    player;
    rankList;
    constructor(myId,myList,socket){
        this.chatBox = document.querySelector("#chatBox");
        this.chatMessages = chatBox.querySelector("#chatMessages");
        this.chatMessageArea = chatBox.querySelector("#chatMessageArea");
        this.chatInput = chatBox.querySelector("#chatInput");
        this.chatForm = chatBox.querySelector("#chatForm");
        this.gameId = myId;
        this.rankList = myList;
        this.socket = socket;
        this.player = this.rankList.getPlayer(this.gameId);
        this.addListeners();
    }

    addMessage(userName, msg,type = "allRoom"){
        var item = document.createElement('li');
        item.innerHTML = "<b>" +userName+ ": </b> " + msg;
        if(type == "correctRoom"){
            item.classList.add("correctRoom");
        }
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
        if (shouldScroll) {
            this.chatMessageArea.scrollTop = this.chatMessageArea.scrollHeight;
        }
    }

    addListeners(){
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.chatInput.value) {
              if(this.player.isDrawer() || this.player.getGuessed){
                this.addMessage(this.player.getName,this.chatInput.value, "correctRoom");
              }else{
                this.addMessage(this.player.getName,this.chatInput.value);
              }
              this.socket.emit('chatMessage', {"gameId":this.gameId, "message":this.chatInput.value});
              this.chatInput.value = '';
            }
        });
    }
    
}