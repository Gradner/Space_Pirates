var Game = require('./Game.js');

const systems = [
  {name: 'Procyon', x: 19, y: 38},
  {name: 'Kleirs', x: -41, y: 32},
  {name: 'Yuen', x: -11, y: 6},
  {name: 'Urantuas', x: -13, y: 5},
  {name: 'Vrias', x: 41, y: 48},
  {name: 'Sol', x: -25, y: 1},
  {name: 'Kith', x: 22, y: 29},
  {name: 'Trax', x: -30, y: 23},
  {name: 'Ago', x: -31, y: -20},
  {name: 'Atheizla', x: -14, y: 8},
  {name: 'Greuth', x: 22, y: 49},
  {name: 'Xei', x: 0, y: 26},
  {name: 'Lukkor', x: -16, y: 47},
  {name: 'Exel', x: 8, y: 39},
  {name: 'Thaed', x: -28, y: 45}
]


class GameList {
  constructor(options){
    this.idCount = options.idCount || 0;
    this.list = options.list || [];
    this.maxGames = options.maxGames || 12;
    this.readyForPlayers = options.ready || true;
    systems.forEach((system)=>{this.createGame(system)})
  }

  getNewGameID(){
    this.idCount += 1;
    return this.idCount
  }

  createGame(gameData){
    console.log('create new game requested')
    var newgame = new Game({
      gameID: this.getNewGameID(),
      roomName: gameData.name,
      socketUrl: 'zone' + this.idCount,
      x: gameData.x,
      y: gameData.y
    })
    if(!this.list.includes(newgame)){
      this.list.push(newgame);
    } else {
      console.log('Could not create game, ' + newgame.roomName + ' already exists')
    }
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