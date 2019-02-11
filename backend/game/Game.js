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
    this.playerAccel = 0.01;
    this.maxSpeed = 0.25;
    this.maxRot = 0.02;
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

  updateGame(io) {
    for(var i = 0; i < this.players.length; i++){
      let player = this.players[i];
      player.attackDelay--
      if(player.keys.attack){
        if(player.attackDelay <= 0){
          let target = this.players.filter((target)=> target.id === player.keys.targetid)[0]
          let playerv3 = new math3d.Vector3(player.x, player.y, player.z)
          let targetv3 = new math3d.Vector3(target.x, target.y, target.z)
          let distance = playerv3.distanceTo(targetv3)
          if(distance <= player.maxRange){
            let multiplier = 1
            let attackType = 'normal'
            let attackRoll = Math.round(Math.random() * 10)
            if(attackRoll >= 10){
              multiplier = 2
              attackType = 'critical'
            } else if(attackRoll < 10 && attackRoll > 5) {
              multiplier += (attackRoll/20)
              attackType = 'powerful'
            } else if(attackRoll <= 5 && attackRoll > 2) {
              multiplier = 1
              attackType = 'normal'
            } else {
              multiplier = 0
              attackType = 'miss'
            }
            let damage = Math.round(player.attackRating * multiplier)
            target.currentHp -= damage;
            let action = {
              player: player.username,
              target: target.username,
              datestamp: Date.now(),
              type: 'attack',
              ops: {
                type: attackType,
                damage: damage
              }
            }
            this.actions.push(action)
          } else {
            io.to(player.id).emit('action', {
              player: player.username,
              target: target.username,
              type: 'outOfRange',
              ops: {}
            })
          }
          player.attackDelay = 10
        }
      }
      if(player.keys.left){ player.rotY -= this.maxRot }
      if(player.keys.right){ player.rotY += this.maxRot }
      if(player.keys.forward && player.v < this.maxSpeed){ player.v += this.playerAccel }
      else if(player.keys.forward && player.v >= this.maxSpeed){ player.v = this.maxSpeed }
      else if(player.keys.backward && player.v >= (this.maxSpeed * -1)){ player.v -= this.playerAccel }
      else { if(Math.abs(player.v) > 0.02) { player.v = (player.v/1.25) } else { player.v = 0 } }
      player.x += player.v * Math.cos(-player.rotY);
      player.z += player.v * Math.sin(-player.rotY);
      if(i === this.players.length - 1){
        io.to(this.socketUrl).emit('lobbyData', {players: this.players, actions: this.actions})
        this.actions = [];
      }
    }
  }
}

module.exports = Game;