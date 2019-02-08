

module.exports = function(io, games){
  io.on('connection', (socket)=>{
    socket.on('keyUpdate', (data)=>{
		let connectedGame = games.list.find((game)=>{
			console.log(game.gameID)
			return game.gameID === socket.userData.currentGameID;
		})
		if(!connectedGame){
			console.log('player ' + socket.userData.username + ' does not have a game ID, but is updating keys in game')
			socket.disconnect(true)
		} else {
			connectedGame.updatePlayerMovement(socket, data)
		}
    })
  })

  let gamelist = games.list
  setInterval((games)=>{
  	for(var i = 0; i < gamelist.length; i++){
  		gamelist[i].updateGame(io)
  	}
  }, 60)
}