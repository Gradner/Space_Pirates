var User = require('../game/User.js');

module.exports = function(io, users, games){
  let uidInt = 0;
  io.on('connection', (socket)=>{

    console.log(socket.id + ' has connected to the server')
    io.emit('userList', users);

    socket.on('login', (data)=>{
      uidInt++
      var newUser = new User({
        username: data.username,
        uid: uidInt,
        socketID: socket.id
      })
      console.log(socket.id + ' identified as ' + newUser.username)
      console.log('full user data: ' + JSON.stringify(newUser))
      users.push(newUser)
      socket.userData = newUser;
      socket.emit('changeGameState', 1)
      io.emit('userList', users);
    });

    socket.on('disconnect', ()=>{
      console.log('user disconnected')
      if(socket.userData){
        if(socket.userData.currentGameID){
          let connectedGame = games.list.find((game)=>{
            return game.gameID === socket.userData.currentGameID;
          })
          if(connectedGame){
            socket.leave(connectedGame.socketUrl)
            connectedGame.removePlayer(socket)
            console.log(connectedGame.players)
          }
        }
        users = users.filter((user)=>{
          return user.socketID == socket.id;
        })
        io.emit('userList', users);
      }
    })

  })
}