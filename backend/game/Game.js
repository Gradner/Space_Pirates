class Game {
  constructor(options){
    this.gameID = options.gameID || '0';
    this.roomName = options.roomName || 'Game';
    this.players = [];
    this.hostID = {};
    this.maxPlayers = options.maxPlayers || 8;
    this.socketUrl = options.socketUrl;
    this.gameHasStarted = false;
    this.playersReady = false;
    this.status = 0;
    this.playerAccel = 0.01;
    this.maxSpeed = 0.25;
    this.maxRot = 0.02;
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
      this.players.push({
          username: username,
          id: playerID,
          x: 0,
          z: 0,
          v: 0,
          rotY: 0,
          keys: {}
        });
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
    console.log(socket.userData.currentGameID)
    let p = this.players.find((player)=>{
      return player.id === socket.id
    })
    p.keys = keys
    console.log(this.players)
  }

  updateGame(io) {
    for(var i = 0; i < this.players.length; i++){
      let player = this.players[i];
      if(player.keys.left){ player.rotY -= this.maxRot }
      if(player.keys.right){ player.rotY += this.maxRot }
      if(player.keys.forward && player.v <= this.maxSpeed){ player.v += this.playerAccel }
      else if(player.keys.backward && player.v >= (this.maxSpeed * -1)){ player.v -= this.playerAccel }
      else { if(Math.abs(player.v) > 0.02) { player.v = (player.v/1.25) } else { player.v = 0 } }
      player.x += player.v * Math.cos(-player.rotY);
      player.z += player.v * Math.sin(-player.rotY);
      if(i === this.players.length - 1){
        io.to(this.socketUrl).emit('lobbyData', this.players)
      }
    }
  }
}

module.exports = Game;