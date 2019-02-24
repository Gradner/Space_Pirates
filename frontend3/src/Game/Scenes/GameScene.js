import { Scene, AmbientLight } from 'three';
import { Skybox, DefaultCamera } from '../GameObjects'

class GameScene extends Scene {
	constructor(options){
		super(options)
		this.width = options.width;
		this.height = options.height;
		this.renderer = options.renderer;
		this.camera = options.camera || new DefaultCamera({width: this.width, height: this.height});
		this.add(this.camera)
		this.skybox = options.skybox || new Skybox;
		this.light = new AmbientLight(0xffffff)
		this.add(this.light)
		console.log(this)
		this.background = this.skybox.texture;
		this.animate()
	}

	animate(){
		this.loop = requestAnimationFrame(this.animate.bind(this));
		this.renderer.render(this, this.camera);
	}

	destroyScene(){
		cancelAnimationFrame(this.loop);
		this.dispose()
	}
}

export default GameScene;