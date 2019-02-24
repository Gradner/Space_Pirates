import * as BABYLON from 'babylonjs'
import anime from 'animejs'

class Camera {
  constructor(options){
  	this.scene = options.scene
    this.babCam = new BABYLON.ArcRotateCamera(
  		options.name,
  		options.alpha,
  		options.beta,
  		options.radius,
  		options.target,
  		options.scene
  	)

  }

  attachControl = (canvas) => {
    this.babCam.attachControl(canvas, true)
  }

  updatePosition = () => {
    anime({
      targets: this.babCam.target,
      x: this.targetPos.x,
      y: this.targetPos.y,
      z: this.targetPos.z,
      easing: 'linear',
      duration: 400
    })
  }

  update = (update) =>{
    this.targetPos = new BABYLON.Vector3(update.myPlayer.x, update.myPlayer.y, update.myPlayer.z)
    this.updatePosition()
  }
}

export default Camera;