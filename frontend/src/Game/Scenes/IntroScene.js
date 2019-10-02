import GameScene from './GameScene';

class IntroScene extends GameScene {
	constructor(options){
		super(options)
	}

	animate(){
		this.loop = requestAnimationFrame(this.animate.bind(this));
		this.camera.rotateY(0.0001)
		this.renderer.render(this, this.camera);
	}
}

export default IntroScene;