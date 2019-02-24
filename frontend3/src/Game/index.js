import { WebGLRenderer } from 'three'
import IntroScene from './Scenes/IntroScene'
import MapScene from './Scenes/MapScene'
import SystemScene from './Scenes/SystemScene'

class Game {
	constructor(options){
		this.gameIsRunning = false;
		this.socket = options.socket || null;
		this.canvasAttached = false;
		this.sceneIsActive = false;
	}

	init(){
		
	}

	attachListeners(){
		this.socket.on('gameData', (data)=>{
			this.updateGameData(data);
		})

	}

	attachCanvas(canvas){
		this.canvas = canvas || document.querySelector('canvas');
		this.renderer = new WebGLRenderer({canvas: this.canvas});
		this.renderer.setClearColor(0xEEEEEE)
		this.canvasAttached = true;
		this.gameWidth = window.innerWidth;
		this.gameHeight = window.innerHeight;
		window.addEventListener('resize', this.resize())
		this.resize();
		this.loadDefaultScene()
	}

	resize(){
		console.log('resize')
		if(this.sceneIsActive){
			this.currentScene.width = window.innerWidth
			this.currentScene.height = window.innerHeight
			this.currentScene.camera.aspect = window.innerWidth / window.innerHeight;
			this.currentScene.camera.updateProjectionMatrix()
		}
		this.gameWidth = window.innerWidth;
		this.gameHeight = window.innerHeight;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	loadDefaultScene(){
		this.currentScene = new IntroScene({width: this.gameWidth, height: this.gameHeight, renderer: this.renderer})
		this.sceneIsActive = true;
	}

	loadScene(id){
		switch(id){
			case 1:
				this.currentScene = new MapScene({
					width: this.gameWidth,
					height: this.gameHeight,
					renderer: this.renderer,
					socket: this.socket
				});
				this.sceneIsActive = true;
				break;
			case 2:
				this.currentScene = new SystemScene({
					width: this.gameWidth,
					height: this.gameHeight,
					renderer: this.renderer,
					socket: this.socket
				})
				this.sceneIsActive = true;
				break;
		}
	}

	changeGameState(state){
		this.currentScene.destroyScene()
		this.sceneIsActive = false;
		this.loadScene(state)
		console.log('new scene loaded')
	}

	updateGameData(data){
		this.gameData = data;
	}

	updateGameState(state){

	}
}

export default Game;