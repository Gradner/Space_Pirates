const math3d = require('math3d');
let Player = require('./Player')

class Game {
  constructor(options){
    this.gameID = options.gameID || '0';
    this.roomName = options.roomName || 'Game';
    this.players = [];
    this.hostID = {};
    this.actions = [];
    this.maxPlayers = options.maxPlayers || 8;
    this.socketUrl = options.socketUrl;
    this.gameHasStarted = false;
    this.playersReady = false;
    this.status = 0;
    
    this.lastLoopEnd = Date.now()
  }

  addPlayer(io, socket, data) {
    let playerID = socket.userData.socketID;
    let username = socket.userData.username;
    if(this.players.length >= this.maxPlayers){
      console.log('error: could not add ' + socket.userData.username + ' to the game, game is full')
    } else if (this.players.includes(playerID)) {
      console.log('error: could not add ' + playerID + ' to the game, player is already in that game')
    } else {
      console.log(playerID + ' has joined game ' + this.roomName);
      if(this.players.length <= 0){
        this.hostID = playerID;
      }
      let newPlayer = new Player({
          username: username,
          id: playerID,
          x: 0,
          y: 0,
          z: 0,
          v: 0,
          rotY: 0,
          keys: {},
          maxHp: 1300,
          currentHp: 1300,
          attackDelay: 10,
          maxRange: 20,
          attackRating: 23
        });
      this.players.push(newPlayer)
      socket.userData.currentGameID = this.gameID;
      console.log(JSON.stringify(this))
      socket.emit('changeGameState', 2);
      socket.join(this.socketUrl)
    }
  }

  removePlayer(socket) {
    console.log('removing user ' + socket.id + ' from game ' + this.gameID)  
    let players = this.players.filter((player)=>{
      return player.id !== socket.id
    })
    this.players = players;
  }

  updatePlayerMovement(socket, keys) {
    let p = this.players.find((player)=>{
      return player.id === socket.id
    })
    if(p){
      p.keys = keys
    }
  }

  addToActions(actions) {
    this.actions.push(...actions)
  }

  updateGame(io) {
    for(var i = 0; i < this.players.length; i++){
      let player = this.players[i];
      let actions = player.update(this.players, io)
      this.addToActions(actions)      
      if(i === this.players.length - 1){
        io.to(this.socketUrl).emit('lobbyData', {players: this.players, actions: this.actions})
        this.actions = [];
      }
    }
  }
}

module.exports = Game;