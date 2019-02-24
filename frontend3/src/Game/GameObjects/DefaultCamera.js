import { PerspectiveCamera } from 'three';

class DefaultCamera extends PerspectiveCamera {
	constructor(options){
		super(45, options.width / options.height, 1, 1000)
	}

	updateRatio(width, height){

	}
}

export default DefaultCamera;