import * as BABYLON from 'babylonjs'
import Camera from './Objects/Camera'
import Light from './Objects/Light'
import SkyBox from './Objects/SkyBox'
import PlayerMGR from './Managers/PlayerMGR'

class Game {
	constructor(options){
		this.gameIsRunning = false;
	}

	canvasReady = (canvas) =>{
		this.canvas = canvas;
		this.initializeEngine(this.canvas)
		this.spawnCamera({scene: this.scene});
		this.spawnLight({scene: this.scene});
		this.createSkybox({scene: this.scene});
		this.PlayerMGR = new PlayerMGR({scene: this.scene})
		this.engine.runRenderLoop(()=>{
			this.scene.render();
		})
		this.gameIsRunning = true;
		this.scene.onPointerDown = (evt, pickResult) =>{
			if(pickResult.hit){
				let pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, (mesh)=>{return mesh;})
				if(typeof this.onMeshSelect === 'function'){
					this.onMeshSelect(pickInfo.pickedMesh)
				}
			}
		}
	}

	resize = () =>{
		console.log('resizefired')
		this.engine.resize();
	}

	registerOnMeshSelectEvent = (onMeshSelect) => {
		if(typeof onMeshSelect === 'function'){
			this.onMeshSelect = onMeshSelect
		}
	}

	initializeEngine = (canvas) =>{
		this.engine = new BABYLON.Engine(this.canvas, true);
		this.scene = new BABYLON.Scene(this.engine);
	}

	spawnCamera = (settings) =>{
		this.camera = new Camera({
			name: "camera1",
			alpha: 0,
			beta: 0,
			radius: 10,
			target: new BABYLON.Vector3(0, 0, 0),
			scene: settings.scene
		})
		this.camera.attachControl(this.canvas)
	}

	spawnLight = (settings) =>{
		this.light = new Light({
			name: "light1",
			position: new BABYLON.Vector3(1, 1, 0),
			scene: settings.scene
		})
	}

	createSkybox = (settings) =>{
		this.skyBox = new SkyBox({
			name: 'skyBox',
			ops: {
				size: 1000
			},
			scene: settings.scene
		})
	}

	update = (update) => {
		this.PlayerMGR.update({
			myPlayer: update.myPlayer,
			players: update.players,
		});
		this.camera.update({
			myPlayer: update.myPlayer
		})
	}

}

export default Game;