import * as BABYLON from 'babylonjs'

class SoundMGR {
	constructor(options){
		this.soundsToLoad = options.sounds
		this.scene = options.scene
		this.sounds = [];
	}
}

export default SoundMGR