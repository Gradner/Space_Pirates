import Renderable from './Renderable'
import anime from 'animejs'
import {
	Vector3,
	Quaternion,

} from 'three'

class Player extends Renderable {
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
			targets: this.mesh.position,
			x: this.position.x,
			y: this.position.y,
			z: this.position.z,
			easing: 'linear',
			duration: 60
		})
	}

	updateRotation = () => {
		let axis = new Vector3(0, 1, 0);
		let angle = this.rotation - Math.PI;
		let quaternion = new Quaternion.setFromAxisAngle(axis, angle);
		this.mesh.rotationQuaternion = quaternion
	}

	update = (update) => {
		if(this.isAddedToScene){
			this.position = new Vector3(update[0].x, update[0].y, update[0].z)
			this.rotation = update[0].rotY
			this.updatePosition()
			this.updateRotation()
		}
	}
}

export default Player;