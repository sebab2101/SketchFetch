const serverGameClass = require('./serverGame.js');
const game = new serverGameClass;

class socketEvents{
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
            game.processState();
        });
    };
    
    static disconnectPlayer = (socket)=>{
        socket.on('disconnect', ()=>{
            let gameId = game.getGameId(socket.id);
            if(gameId != undefined){
                socket.to("activePlayers").emit('removePlayer',gameId);
                game.removeClient(socket.id,gameId);
                game.processState();
            }
        });
    };
    
    static changeColorCanvas = (socket)=>{
        socket.on('changeColorCanvas', (data) => {
            console.log('changeColor: ', data);
            socket.to("activePlayers").emit('changeColorCanvas',data);
        });
    };
    
    static changeBgColorCanvas = (socket)=>{
        socket.on('changeBgColorCanvas', (data) => {
            console.log('changeBgColor: ', data);
            socket.to("activePlayers").emit('changeBgColorCanvas',data);
        });
    };
    
    static drawCanvas = (socket)=>{
        socket.on('drawCanvas', (data) => {
            console.log('Draw: ', data);
            socket.to("activePlayers").emit('drawCanvas',data);
        });
    };
    
    static clearCanvas = (socket)=>{
        socket.on('clearCanvas', () => {
            console.log('Canvas Cleared: ');
            socket.to("activePlayers").emit('clearCanvas');
        });
    };
    
    static brushSizeCanvas = (socket)=>{
        socket.on('brushSizeCanvas', (data) => {
            console.log('Changing brush size: ', data);
            socket.to("activePlayers").emit('brushSizeCanvas',data);
        });
    };
    
    static chatMessage = (socket)=>{
        socket.on('chatMessage',(data)=>{
            console.log('Sending chat message: ', data);
            socket.to("activePlayers").emit('chatMessage',data);
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