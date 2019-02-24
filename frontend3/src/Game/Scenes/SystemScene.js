import GameScene from './GameScene';
import { System } from '../GameObjects'
//import PlayerMGR from '../Managers/PlayerMGR'
import anime from 'animejs'
import * as HumanInput from 'humaninput'
import { Raycaster, Vector3, Vector2 } from 'three';
eval( 'window.__VERSION__ = 0' )


class SystemScene extends GameScene {
	constructor(options){
		super(options)
		this.socket = options.socket;
		this.players = [];
		this.target = {};
		this.keys = {
	      forward: false,
	      backward: false,
	      left: false,
	      right: false,
	      attack: false
	    }
		this.socket.on('lobbyData', (data)=>{
	      this.players = data.players
	      this.myPlayer = this.players.filter(player => player.id === this.socket.id)[0];
	      this.targetPlayer = this.players.filter(player=>player.id === this.keys.targetid)[0]
	      this.socket.emit('keyUpdate', this.keys, ()=> {})
	    })
		this.moveCameraToTopview();
		this.mouse = new Vector2(0, 0);
		this.raycaster = new Raycaster();
		this.keyDownFunc = this.keyDown.bind(this);
		this.keyUpFunc = this.keyUp.bind(this);
		this.clickFunction = this.onMouseDown.bind(this);
		window.addEventListener('keydown', this.keyDownFunc, true);
		window.addEventListener('keyup', this.keyUpFunc, true);
		window.addEventListener('mousedown', this.clickFunction, true);
	}

	keyDown(e){
      if(e.keyCode == 27) {
        if(this.target){
        	this.target = null
        }
      }
      if(e.keyCode == 81){
          this.keys.attack = !this.keys.attack;
      }
      if(e.keyCode == 65) {
          this.keys.left = true // Move ('left');
      } else if(e.keyCode == 68) {
          this.keys.right = true// Move ('right');
      } else if(e.keyCode == 87) {
          this.keys.forward = true// Move ('up');
      } else if(e.keyCode == 83) {
          this.keys.backward = true// Move ('down');
      }
    }

	keyUp(e){
      if(e.keyCode == 27) {
        if(this.target){
        	this.target = null
        }
      }
      if(e.keyCode == 81){
          this.keys.attack = !this.keys.attack;
      }
      if(e.keyCode == 65) {
          this.keys.left = false // Move ('left');
      } else if(e.keyCode == 68) {
          this.keys.right = false// Move ('right');
      } else if(e.keyCode == 87) {
          this.keys.forward = false// Move ('up');
      } else if(e.keyCode == 83) {
          this.keys.backward = false// Move ('down');
      }
    }

	onMouseDown(e){
		this.mouse.x = (e.clientX / this.width) * 2 - 1;
        this.mouse.y =  - (e.clientY / this.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera)
        let intersects = this.raycaster.intersectObjects(this.children)
        console.log(intersects)
        if(intersects.length > 0){
        	console.log(intersects[0].object.name)
        	this.updateCameraPos(intersects[0].object, this.selectSystem, this)
        }
	}

	selectSystem(system, scene){
		console.log(scene.games)
		console.log(system.name)
		let selectedGame = scene.games.find((game) =>{return game.roomName === system.name})
		console.log(selectedGame)
		let systemSelect = new CustomEvent('systemSelected', {
			detail: {
				system: selectedGame
			}
		})
		window.dispatchEvent(systemSelect)
	}

	updateCameraPos(system, callback, scene){
		anime({
			targets: this.camera.position,
			x: system.position.x,
			z: system.position.z,
			easing: 'linear',
			complete: function(){
				if(typeof callback === 'function'){
					callback(system, scene)
				}
			}
		})
	}

	updateGameList(games){
		console.log(games)
		this.checkForNewGames(games)
		this.removeDisconnectedGames(games)
		this.games = games;
	}

	moveCameraToTopview(){
		let camera = this.camera;
		let scene = this;
		camera.lookAt(0, -1, 0)
		anime({
			targets: camera.position,
			y: 50,
			easing: 'linear',
			update: function(){
				console.log(scene)
			},
			complete: function(){
				camera.lookAt(0, 0, 0)
			}
		})
	}

	checkForNewGames(newGameData){
		if(this.games === []){
			newGameData.forEach((game)=>{
				this.addGameToScene(game)
			})
		} else if (this.games === newGameData){
			return
		} else {
			let newGames = [];
			newGameData.forEach((newGame)=>{
				let g2a = this.games.filter((game)=> game.gameID === newGame.gameID);
				if(!g2a[0]){
					newGames.push(newGame)
				}
			})
			newGameData.filter((game)=> !this.games.includes(game))
			newGames.forEach((game)=>{
				this.addGameToScene(game)
			})
		}
	}

	addGameToScene(newGame){
		let game = new System(newGame);
		this.add(game.mesh)
	}

	removeDisconnectedGames(newGameData){
		if(newGameData === []){
			this.games.forEach((game)=>{
				this.removeGameFromScene(game)
			})
		} else if (newGameData === this.games) {
			return
		} else {
			this.games.forEach((oldGame)=>{
				let g2r = newGameData.filter((game)=> game.gameID === oldGame.gameID);
				if(!g2r[0]){
					this.removeGameFromScene(oldGame)
				}
			})
		}
	}

	removeGameFromScene(oldGame){
		let game = this.children.find((game)=> game.name === oldGame.name)
		if(game){
			this.remove(game)
		}
	}

	animate(){
		this.loop = requestAnimationFrame(this.animate.bind(this));
		this.renderer.render(this, this.camera);
	}

	destroyScene(){
		window.removeEventListener('keydown', this.keyDownFunc, true)
		window.removeEventListener('keyup', this.keyUpFunc, true)
		window.removeEventListener('mousedown', this.clickFunction, true)
		cancelAnimationFrame(this.loop);
		this.dispose()
	}	
}

export default SystemScene;