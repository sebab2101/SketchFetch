const wordListClass = require('./wordList.js');
const playerClass = require('../public/scripts/player.js');
const rankListClass = require('../public/scripts/rankList.js');

function createEnum(values) {
	const enumObject = {};
	for (const val of values) {
	  enumObject[val] = val;
	}
	return Object.freeze(enumObject);
}

const states = createEnum(['idle', 'gameStart', 'roundBegin', 'pickPlayer', 'drawPhase', 'roundEnd', 'gameEnd']);
const MIN_PLAYERS= 2;
//time before game starts with sufficient players
const START_TIME = 10000;
//time before game restarts after game ends
const END_TIME = 10000;
//time for selecting a word
const PICK_TIME = 10000;
//time for drawing
const DRAW_TIME = 35000;
const TOTAL_ROUNDS = 3;
//number of choices drawer gets to pick from
const NUM_RANDWORDS = 3;

module.exports = class serverGame{
    rankList = new rankListClass;
    //socket id to game id map
    clientMap = new Map;
    //game id to socket id map
    clientRevMap = new Map;
    wordList = new wordListClass();
    io;
    roundCount = 1;
    currentPlayerIndex;
    currentGameId;
    currentSocketId;
    currentSocket;
    currentTimerId;
    rightGuesses=1;
    //initial state
    state = states['idle'];
    oldState = states['idle'];
    constructor(){
    }

    setIo(io){
        this.io = io;
    }

    addClient(socketId, userName,gameId){
		console.log('A player joined. UserName: ', userName, "; Id: ", gameId);
        let p = new playerClass(userName,gameId );
    	this.rankList.addPlayer(p);
		this.clientMap.set(socketId, gameId);
        this.clientRevMap.set(gameId, socketId);
    }

    removeClient(socketId,gameId){
        this.clientMap.delete(socketId);
        this.rankList.removePlayer(gameId);
        this.clientRevMap.delete(gameId);
		console.log('A player left. ', gameId);
    }

    generateGameId(){
        let gameId = Math.random().toString(16).slice(2);
        while(Array.from(this.clientMap.values()).includes(gameId)){
            gameId = Math.random().toString(16).slice(2);
        }
        return gameId;
    }

    getGameId(socketId){
        return this.clientMap.get(socketId);
    }

    getSocketId(gameId){
        return this.clientRevMap.get(gameId);
    }

    getSocket(socketId){
        return this.io.sockets.sockets.get(socketId);
    }

    getRankList(){
        return this.rankList.makeList()
    }

    pickRandomWords(){
        return (wordList.randomWordPick());
    }

    get numPlayers(){
        return this.rankList.getNumOfPlayers;
    }

    resetChatRooms(){
        Array.from(this.clientMap.keys()).forEach(socketId => {
            let socket = this.getSocket(socketId);
            socket.leave("correctPlayers");
        });
    }

    hasGuessWord(chatMessage){
        if(this.state != states['drawPhase']){
            return false;
        }
        let words = chatMessage.split(" ");
        if(words.includes(this.currentWord)){
            return true;
        }
        return false;
    }

    //destroy inbound setTimeout function
    removeTimeout(){
        if(this.currentTimerId){
            clearTimeout(this.currentTimerId);
            this.currentTimerId = null;
        }
    }

    //If player guesses right
    someoneGuessedRight(){
        this.rightGuesses++;
        this.processState();
    }

    processState = (event = null, eventGameId = null)=>{
        let firstEntry = !(this.oldState == this.state);

        if(firstEntry){
            console.log("Server state:" , this.state);
        }

        this.oldState = this.state;
        switch(this.state){
            case states['idle']:
                if(firstEntry){
                    this.removeTimeout();
                    this.io.emit('server_idle');
                }

                if(event == "newPlayer"){
                    if(this.numPlayers >= MIN_PLAYERS){
                        this.io.emit('server_idle');
                        this.state = states['gameStart'];
                        this.processState();
                        return;
                    }
                }
                break;  
            case states['gameStart']:
                if(firstEntry){
                    this.removeTimeout();
                    this.io.emit('server_gameStart');

                    this.currentTimerId = setTimeout(() => {
                        this.state = states['roundBegin'];
                        this.roundCount = 1;
                        this.processState();
                    }, START_TIME);
                }

                if(this.numPlayers < MIN_PLAYERS){
                    this.state = states['idle'];
                    this.processState();
                    return;
                }
                
                break;
            case states['roundBegin']:
                if(firstEntry){
                    this.removeTimeout();
                    this.io.emit('server_roundBegin',this.roundCount);
                    this.currentPlayerIndex = this.numPlayers-1;
                    this.state = states['pickPlayer'];
                    this.currentGameId = this.rankList.atIndex(this.currentPlayerIndex).getPlayerId;
                    this.processState();
                    return;
                }
                break;
            case states['pickPlayer']:
                if(firstEntry){
                    this.removeTimeout();
                    this.io.emit('server_pickPlayer', this.currentGameId);
                    this.currentGameId = this.rankList.atIndex(this.currentPlayerIndex).getPlayerId;
                    this.currentSocketId = this.getSocketId(this.currentGameId);
                    this.currentSocket = this.getSocket(this.currentSocketId);
                    console.log("Drawer GameId:", this.currentGameId, ", SocketId",this.currentSocketId);
                    let wordChoices = this.wordList.randomWordPick(NUM_RANDWORDS);
                    this.currentSocket.emit("server_pickWord",{"wordChoices":wordChoices},(response)=>{
                        if(wordChoices.includes(response)){
                            clearTimeout(this.currentTimerId);
                            console.log("Player picked: ", response);
                            this.state = states['drawPhase'];
                            this.currentWord = response;
                            this.processState();
                            return;
                        }
                    });

                    this.currentTimerId = setTimeout(() => {
                        if(this.currentPlayerIndex == 0){
                            this.state = states['roundEnd'];
                            this.processState();
                            return;
                        }
                        this.currentPlayerIndex--;
                        this.currentGameId = this.rankList.atIndex(this.currentPlayerIndex).getPlayerId;
                        this.oldState = null;
                        this.state = states['pickPlayer'];
                        this.processState();
                        return;
                    }, PICK_TIME);
                }

                if(event == "disconnectPlayer"){
                    //If player picking the word leaves
                    if(this.currentGameId == eventGameId){
                        if(this.currentPlayerIndex == 0){
                            this.state = states['roundEnd'];
                            this.processState();
                            return;
                        }
                        this.currentPlayerIndex--;
                        this.currentGameId = this.rankList.atIndex(this.currentPlayerIndex).getPlayerId;
                        this.oldState = null;
                        this.state = states['pickPlayer'];
                        this.processState();
                        return;
                    }

                    //Check if someone who hasn't drawn yet leaves
                    let newIndex= this.rankList.getIndex(eventGameId);
                    if(newIndex != null){
                        if(newIndex < this.currentPlayerIndex){
                            this.currentPlayerIndex--;
                        }
                    }
                }
                
                break;
            case states['drawPhase']:
                if(firstEntry){
                    this.removeTimeout();
                    this.io.emit("server_drawPhase", {"wordLength": this.currentWord.length, "drawer":this.currentGameId});
                    this.currentSocket.join("correctPlayers");
                    this.rightGuesses = 1;
                    this.currentTimerId = setTimeout(() => {
                        if(this.currentPlayerIndex == 0){
                            this.state = states['roundEnd'];
                        }else{
                            this.state = states['pickPlayer'];
                            this.currentPlayerIndex--;
                            this.currentGameId = this.rankList.atIndex(this.currentPlayerIndex).getPlayerId;
                        }
                        this.resetChatRooms();
                        this.processState();
                        return;
                    }, DRAW_TIME);
                }

                if(event == "disconnectPlayer"){
                    if(this.currentGameId == eventGameId){
                        if(this.currentPlayerIndex == 0){
                            this.state = states['roundEnd'];
                        }else{
                            this.state = states['pickPlayer'];
                            this.currentPlayerIndex--;
                        }
                        this.resetChatRooms();
                        this.processState();
                        return;
                    }
                }

                if(this.rightGuesses == this.numPlayers){
                    if(this.currentPlayerIndex == 0){
                        this.state = states['roundEnd'];
                    }else{
                        this.state = states['pickPlayer'];
                        this.currentPlayerIndex--;
                    }
                    this.resetChatRooms();
                    this.processState();
                    return;
                }
                break;
            case states['roundEnd']:
                if(firstEntry){
                    this.removeTimeout();
                    this.io.emit('server_roundEnd', this.roundCount);
                    this.roundCount++;
                }

                if(this.numPlayers < MIN_PLAYERS || this.roundCount > TOTAL_ROUNDS){
                    this.state = states['gameEnd'];
                }else{
                    this.state = states['roundBegin'];
                }
                this.processState();
                return;
                break;
            case states['gameEnd']:
                if(firstEntry){
                    this.removeTimeout();
                    this.io.emit('server_gameEnd');
                
                    this.currentTimerId = setTimeout(()=>{
                        this.state = states['gameStart'];
                        this.processState();
                        return;
                    }, END_TIME)
                }
                break;
            default:
                console.error("UNKNOWN STATE REACHED! SHUTTING SERVER DOWN");
                process.exit();
        }

    }
}
