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

const states = createEnum(['idle', 'gameStart', 'roundBegin', 'roundOngoing', 'roundEnd', 'gameEnd']);
const min_players= 2;
//time before game starts with sufficient players
const start_time = 10000;
//time before game restarts after game ends
const end_time = 10000;
const total_rounds = 3;

module.exports = class serverGame{
    rankList = new rankListClass;
    clientMap = new Map;
    state = 0;
    wordList = new wordListClass();
    io;
    roundCount = 1;
    //initial state
    state = states['idle'];
    constructor(){

    }

    setIo(io){
        this.io = io;
    }

    addClient(socketId, userName,gameId){
		console.log('A player joined. UserName: ', userName, "; Id: ", gameId);
        let p = new playerClass(userName,gameId);
    	this.rankList.addPlayer(p);
		this.clientMap.set(socketId, gameId);
    }

    removeClient(socketId,gameId){
        this.clientMap.delete(socketId);
        this.rankList.removePlayer(gameId);
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

    getRankList(){
        return this.rankList.makeList()
    }

    pickRandomWords(){
        return (wordList.randomWordPick());
    }

    get numPlayers(){
        return this.rankList.getNumOfPlayers;
    }

    processState = ()=>{
        switch(this.state){
            case states['idle']:
                if(this.numPlayers >= min_players){
                    this.state = states['gameStart'];
                    this.io.emit('server_gameStart');
                    console.log(this.state);
                    this.processState();
                }
                break;
            case states['gameStart']:
                if(this.numPlayers < min_players){
                    this.state = states['idle'];
                    this.io.emit('server_idle');
                    this.processState();
                }
                setTimeout(() => {
                    if(this.state == states['gameStart']){
                        this.state = states['roundBegin'];
                        this.io.emit('server_roundBegin',this.roundCount);
                        console.log(this.state);
                        this.processState();
                    }
                }, start_time);
                break;
            case states['roundBegin']:
                this.roundCount++;
                this.state = states['roundOngoing'];
                this.io.emit('server_roundOngoing',this.roundCount);
                this.processState();
                break;
            case states['roundOngoing']:
                break;
            case states['roundEnd']:
                if(this.numPlayers < min_players || this.roundCount > total_rounds){
                    this.state = states['gameEnd'];
                    this.io.emit('server_gameEnd');
                    this.processState();
                }else{
                    this.state = states['roundBegin'];
                    this.io.emit('server_roundBegin');
                    this.processState();
                }
                break;
            case states['gameEnd']:
                setTimeout(()=>{
                    this.state = states['gameStart'];
                    this.io.emit('server_gameStart',this.roundCount);
                    this.processState();
                }, end_time)
                break;
        }
    }
}