import { Mesh, CubeTextureLoader, CubeGeometry, MeshBasicMaterial, MeshFaceMaterial, ImageUtils, BackSide } from 'three'

class Skybox {
	constructor(options){
		this.imgPre = 'game_assets/skybox/';
		this.directions = [
			'skybox_px.jpg',
			'skybox_nx.jpg',
			'skybox_py.jpg',
			'skybox_ny.jpg',
			'skybox_pz.jpg',
			'skybox_nz.jpg'
		];
		this.texLoader = new CubeTextureLoader();
		this.texLoader.setPath(this.imgPre)
		this.texture = this.texLoader.load(this.directions)
	}

	addToScene(scene){
		scene.add(this.mesh)
	}
}

export default Skybox;