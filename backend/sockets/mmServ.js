var Game = require('../game/Game.js');

module.exports = function(io, users, games){
  io.on('connection', (socket)=>{

    socket.on('fetchGames', ()=>{
      console.log('game list requested by ' + socket.userData.username)
      socket.emit('gameList', games.list);
    })

    socket.on('createGame', (data)=>{
      games.createGame(io, socket, data)
    });

    socket.on('deleteGame', (data) =>{
      games.deleteGame(io, socket, data);
    })

    socket.on('joinGame', (data)=>{
      games.addPlayer(io, socket, data)
    });

  })
}