class chatArea{
    chatBox;
    chatMessages;
    chatForm;
    chatInput;
    constructor(){
        chatBox = document.querySelector("#chatBox");
        chatMessages = chatBox.querySelector("#");
        chatInput = chatBox.querySelector("#");
        chatForm = chatBox.querySelector("#");
        this.addListeners();
    }

    addMessage(msg){
        var item = document.createElement('li');
        item.textContent = msg;
        this.chatMessages.appendChild(item);
        // window.scrollTo(0, document.body.scrollHeight);
    }
    addListeners(){
        this.chatF.addEventListener('submit', function(e) {
            e.preventDefault();
            if (input.value) {
              socket.emit('chat message', input.value);
              input.value = '';
            }
        });
    }
    
}