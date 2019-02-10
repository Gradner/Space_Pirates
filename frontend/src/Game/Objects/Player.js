import * as BABYLON from 'babylonjs'
import RenderableGLTF from './RenderableGLTF'
import anime from 'animejs'

class Player extends RenderableGLTF {
	constructor(options){
		super(options)
		this.username = options.username
		this.id = options.id
		this.x = options.x
		this.y = options.y
		this.z = options.z
		this.rotY = options.rotY
		this.keys = options.keys
	}

	updatePosition = () => {
		anime({
			targets: this.rootMesh.position,
			x: this.position.x,
			y: this.position.y,
			z: this.position.z,
			easing: 'linear',
			duration: 60
		})
	}

	updateRotation = () => {
		let axis = new BABYLON.Vector3(0, 1, 0);
		let angle = this.rotation - Math.PI;
		let quaternion = new BABYLON.Quaternion.RotationAxis(axis, angle);
		this.rootMesh.rotationQuaternion = quaternion
	}

	update = (update) => {
		if(this.isAddedToScene){
			this.position = new BABYLON.Vector3(update[0].x, update[0].y, update[0].z)
			this.rotation = update[0].rotY
			this.updatePosition()
			this.updateRotation()
		}
		if(this.modelMesh){
			this.modelMesh.id = this.id
			this.modelMesh.name = this.username
			this.isAddedToScene = true;
		}	
	}
}

export default Player;