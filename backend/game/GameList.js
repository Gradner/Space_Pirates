var Game = require('./Game.js');

class GameList {
  constructor(options){
    this.idCount = options.idCount || 0;
    this.list = options.list || [];
    this.maxGames = options.maxGames || 12;
    this.readyForPlayers = options.ready || true;
  }

  getNewGameID(){
    this.idCount += 1;
    return this.idCount
  }

  createGame(io, socket, data){
    console.log('create new game requested')
    var newgame = new Game({
      gameID: this.getNewGameID(),
      host: socket.userData.username,
      roomName: 'new created room ' + this.idCount,
      socketUrl: 'game' + this.idCount
    })
    if(!this.list.includes(newgame)){
      this.list.push(newgame);
      this.addPlayer(io, socket, {gameid: newgame.gameID})
    } else {
      console.log('Could not create game, ' + newgame.roomName + ' already exists')
    }
    io.emit('gameList', this.list);
  }

  addPlayer(io, socket, data){
    let gameID = data.gameid;
    let gameToJoin = this.list.find((game)=>{
      return game.gameID === gameID;
    })
    gameToJoin.addPlayer(io, socket, data)
  }

  deleteGame(io, socket, data){
    var game = this.list[data.gameid];
    console.log(socket.userData.username + ' has requested deletion of game ' + game.roomName);
    if(data.game.host !== socket.userData.username){
      console.log('error: ' + socket.userData.username + ' is unable to delete ' + game.roomName + ' because they are not the host');
    } else {
      var newGameArray = games.filter((game)=>{
        game.gameID !== data.game.gameID
      })
      console.log(data.game.roomName + ' has been deleted by ' + socket.userData.username);
      socket.emit('gameList', games.list);
    }
  }

  getList(){
    return this.list;
  }

}

module.exports = GameList;