import GameScene from './GameScene';
import { System } from '../GameObjects'
import anime from 'animejs'
import * as HumanInput from 'humaninput'
import { Raycaster, Vector3, Vector2 } from 'three';
eval( 'window.__VERSION__ = 0' )


class MapScene extends GameScene {
	constructor(options){
		super(options)
		this.socket = options.socket;
		this.games = [];
		this.socket.on('gameList', (games)=>{
			this.updateGameList(games)
		});
		this.moveCameraToTopview();
		this.mouse = new Vector2(0, 0);
		this.raycaster = new Raycaster();
		this.clickFunction = this.onMouseDown.bind(this);
		window.addEventListener('mousedown', this.clickFunction, true)
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
		window.removeEventListener('mousedown', this.clickFunction, true)
		cancelAnimationFrame(this.loop);
		this.dispose()
	}	
}

export default MapScene;