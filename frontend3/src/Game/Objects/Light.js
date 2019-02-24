import * as BABYLON from 'babylonjs'

class Light {
  constructor(options){
    this.babLight = new BABYLON.HemisphericLight(
      options.name,
      options.position,
      options.scene
    )
  }
}

export default Light;