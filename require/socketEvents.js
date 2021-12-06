const serverGameClass = require('./serverGame.js');
const game = new serverGameClass;

class socketEvents{
    static io;
    static setIo(io){
        this.io = io;
    }

    static newPlayer = (socket)=>{
        socket.on('newPlayer',(userName,callback) =>{
            let gameId = game.generateGameId();
            socket.to("activePlayers").emit('newPlayer',{'userName':userName,'gameId':gameId});
            socket.join("activePlayers");
            callback({
                "gameId": gameId,
                "rankList":game.getRankList()
            });
    
            game.addClient(socket.id, userName, gameId);
            game.processState("newPlayer",gameId);
        });
    };
    
    static disconnectPlayer = (socket)=>{
        socket.on('disconnect', ()=>{
            let gameId = game.getGameId(socket.id);
            if(gameId != undefined){
                socket.to("activePlayers").emit('removePlayer',gameId);
                game.processState("disconnectPlayer",gameId);
                game.removeClient(socket.id,gameId);
            }
        });
    };
    
    static changeColorCanvas = (socket)=>{
        socket.on('changeColorCanvas', (data) => {
            console.log('changeColor: ', data);
            socket.to("activePlayers").emit('changeColorCanvas',data);
            if(game.canvasAvailable){
                game.canvas.color(data["color"]);
            }
        });
    };
    
    static changeBgColorCanvas = (socket)=>{
        socket.on('changeBgColorCanvas', (data) => {
            console.log('changeBgColor: ', data);
            socket.to("activePlayers").emit('changeBgColorCanvas',data);
            if(game.canvasAvailable){
                game.canvas.bgColor(data["backgroundColor"]);
            }
        });
    };
    
    static drawCanvas = (socket)=>{
        socket.on('drawCanvas', (data) => {
            console.log('Draw: ', data);
            socket.to("activePlayers").emit('drawCanvas',data);
            if(game.canvasAvailable){
                game.canvas.findxy(data["move"],data["x"],data["y"],data["orgWidth"]);
            }
        });
    };
    
    static clearCanvas = (socket)=>{
        socket.on('clearCanvas', () => {
            console.log('Canvas Cleared: ');
            socket.to("activePlayers").emit('clearCanvas');
            if(game.canvasAvailable){
                game.canvas.eraseImmediate();
            }
        });
    };
    
    static brushSizeCanvas = (socket)=>{
        socket.on('brushSizeCanvas', (data) => {
            console.log('Changing brush size: ', data);
            socket.to("activePlayers").emit('brushSizeCanvas',data);
            if(game.canvasAvailable){
                game.canvas.changeDrawSize(data["brushSize"]);
            }
        });
    };
    
    static chatMessage = (socket)=>{
        socket.on('chatMessage',(data)=>{
            console.log('Got chat message: ', data);
            if(socket.rooms.has('correctPlayers')){
                socket.to("correctPlayers").emit('chatMessage',data);
            }else{
                if(game.hasGuessWord(data['message'])){
                    console.log("Player SocketId:", socket.id, " guessed correctly!");
                    game.someoneGuessedRight();
                    socket.join("correctPlayers");
                    this.io.to("activePlayers").emit('correctGuess',data['gameId']);
                    game.rankList.getPlayer(data['gameId']).rightGuessed();
                }else{
                    socket.to("activePlayers").emit('chatMessage',data);
                }
            }
        });
    };
    
    static ranking = (socket)=>{
        socket.on('ranking',(data)=>{
            console.log('Sending new ranking: ', data);
            socket.to("activePlayers").emit('ranking',data);
        });
    };    
}
module.exports  =  {socketEvents, game};