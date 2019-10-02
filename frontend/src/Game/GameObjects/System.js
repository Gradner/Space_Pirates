import { TextureLoader, MeshPhongMaterial, DoubleSide, SphereGeometry, Mesh, PointLight } from 'three';

class System {
	constructor(options){
		this.x = options.x;
		this.y = options.y;
		this.id = options.gameID;
		this.texLoader = new TextureLoader()
		this.map = this.texLoader.load('game_assets/star.jpg');
		this.emissiveMap = this.texLoader.load('game_assets/star_emissive.jpg')
		this.material = new MeshPhongMaterial({
			map: this.map,
			side: DoubleSide,
			emissive: 0xffffff,
			emissiveMap: this.emissiveMap,
			emissiveIntensity: 0.5
		});
		this.geo = new SphereGeometry(1, 32, 32);
		this.mesh = new Mesh(this.geo, this.material)
		this.mesh.position.x = this.x;
		this.mesh.position.z = this.y;
		this.mesh.name = options.roomName;
	}
}

export default System;