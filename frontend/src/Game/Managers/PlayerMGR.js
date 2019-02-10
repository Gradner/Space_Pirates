import * as BABYLON from 'babylonjs'
import Player from '../Objects/Player'

class PlayerMGR {
	constructor(options){
		this.scene = options.scene
		this.playerData = [];
		this.players = [];
	}

	checkForNewPlayers = (newPlayerData) =>{
		if(this.playerData === []){
			newPlayerData.forEach((player)=>{
				this.createNewPlayer(player)
			})
		} else if(this.playerData === newPlayerData){
			return
		} else {
			let newPlayers = [];
			newPlayerData.forEach((newPlayer)=>{
				let p2a = this.playerData.filter((player)=> player.id === newPlayer.id);
				if(!p2a[0]){
					newPlayers.push(newPlayer)
				}
			})
			newPlayerData.filter((player)=> !this.playerData.includes(player))
			newPlayers.forEach((player)=>{
				this.createNewPlayer(player)
			})
		}
	}

	createNewPlayer = (player) =>{
		let newPlayer = new Player({
			...player,
			scene: this.scene
		});
		newPlayer.addToScene()
		this.players.push(newPlayer)
	}

	removeDisconnectedPlayers = (newPlayerData) =>{
		if(newPlayerData === []){
			newPlayerData.forEach((player)=>{
				this.removePlayer(player)
			})
		} else if(newPlayerData === this.playerData){
			return
		} else {
			this.playerData.forEach((oldPlayer)=>{
				let p2r = newPlayerData.filter((player)=> player.id === oldPlayer.id);
				if(!p2r[0]){
					this.removePlayer(oldPlayer)
				}
			})
		}
	}

	removePlayer = (p2r) =>{
		let playerToRemove = this.players.filter((player)=> player.id === p2r.id)
		playerToRemove[0].removeFromScene()
		let newPlayerArray = this.players.filter((player)=> player.id !== p2r.id)
		this.players = newPlayerArray
	}

	update = (update) =>{
		this.checkForNewPlayers(update.players)
		this.removeDisconnectedPlayers(update.players)
		this.players.forEach((player)=>{
			let playerData = this.playerData.filter((data)=> data.id === player.id)
			player.update(playerData);
		})
		this.playerData = update.players;
	}
}

export default PlayerMGR;