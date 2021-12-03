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
const min_players= 2;
//time before game starts with sufficient players
const start_time = 10000;
//time before game restarts after game ends
const end_time = 10000;
//time for selecting a word
const pick_time = 10000;
//time for drawing
const draw_time = 35000;
const total_rounds = 3;

module.exports = class serverGame{
    rankList = new rankListClass;
    //socket id to game id map
    clientMap = new Map;
    //game id to socket id map
    clientRevMap = new Map;
    state = 0;
    wordList = new wordListClass();
    io;
    roundCount = 1;
    currentPlayerIndex;
    currentGameId;
    currentSocketId;
    currentSocket;
    currentTimerId;
    //initial state
    state = states['idle'];
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

    getRankList(){
        return this.rankList.makeList()
    }

    pickRandomWords(){
        return (wordList.randomWordPick());
    }

    get numPlayers(){
        return this.rankList.getNumOfPlayers;
    }

    removeTimeout(){
        if(this.currentTimerId){
            clearTimeout(this.currentTimerId);
            this.currentTimerId = null;
        }
    }

    processState = ()=>{
        switch(this.state){
            case states['idle']:
                if(this.numPlayers >= min_players){
                    this.state = states['gameStart'];
                    this.io.emit('server_gameStart');
                    this.processState();
                    return;
                }
                break;
            case states['gameStart']:
                this.removeTimeout();
                this.currentTimerId = setTimeout(() => {
                    this.state = states['roundBegin'];
                    this.roundCount = 0;
                    this.io.emit('server_roundBegin',this.roundCount);
                    this.processState();
                }, start_time);

                if(this.numPlayers < min_players){
                    clearTimeout(this.currentTimerId);
                    this.state = states['idle'];
                    this.io.emit('server_idle');
                    this.processState();
                    return;
                }
                break;
            case states['roundBegin']:
                this.roundCount++;
                this.currentPlayerIndex = this.numPlayers-1;
                this.state = states['pickPlayer'];
                this.currentGameId = this.rankList.atIndex(this.currentPlayerIndex).getPlayerId;
                this.io.emit('server_pickPlayer', this.currentGameId);
                this.processState();
                break;
            case states['pickPlayer']:
                this.removeTimeout();
                this.currentTimerId = setTimeout(() => {
                    this.state = states['pickPlayer'];
                    this.currentPlayerIndex--;
                    this.currentGameId = this.rankList.atIndex(this.currentPlayerIndex).getPlayerId;
                    this.io.emit('server_pickPlayer', this.currentGameId);
                    this.processState();
                }, pick_time);

                this.currentGameId = this.rankList.atIndex(this.currentPlayerIndex).getPlayerId;
                this.currentSocketId = this.getSocketId(this.currentGameId);
                this.currentSocket = this.io.sockets.sockets.get(this.currentSocketId);
                console.log("Player picked:", this.currentGameId,this.currentSocketId);
                let wordChoices = this.wordList.randomWordPick(3);
                this.currentSocket.emit("server_startDraw",{"wordChoices":wordChoices},(response)=>{
                    if(wordChoices.includes(response)){
                        clearTimeout(this.currentTimerId);
                        console.log("Player picked: ", response);
                        this.state = states['drawPhase'];
                        this.currentWord = response;
                        this.io.emit("server_receiveDraw", {"wordLength": this.currentWord.length, "drawer":this.currentGameId});
                        this.processState();
                        return;
                    }
                });

                break;
            case states['drawPhase']:
                this.removeTimeout();
                this.currentTimerId = setTimeout(() => {
                    if(this.currentPlayerIndex == 0){
                        this.state = states['roundEnd'];
												this.io.emit('server_roundEnd', this.roundCount);
                    }else{
                        this.state = states['pickPlayer'];
                        this.currentPlayerIndex--;
                        this.currentGameId = this.rankList.atIndex(this.currentPlayerIndex).getPlayerId;
                        this.io.emit('server_pickPlayer', this.currentGameId);
                    }
                    this.processState();
                }, draw_time);
                break;
            case states['roundEnd']:
                if(this.numPlayers < min_players || this.roundCount > total_rounds){
                    this.state = states['gameEnd'];
                    this.io.emit('server_gameEnd');
                }else{
                    this.state = states['roundBegin'];
                    this.io.emit('server_roundBegin', this.roundCount);
                }
                this.processState();
                break;
            case states['gameEnd']:
                setTimeout(()=>{
                    this.state = states['gameStart'];
                    this.io.emit('server_gameStart',this.roundCount);
                    this.processState();
                }, end_time)
                break;
        }

        console.log("Server state:" , this.state);
    }
}
