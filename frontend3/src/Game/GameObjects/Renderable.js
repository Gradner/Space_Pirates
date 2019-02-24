import {
	TextureLoader,
	MeshPhongMaterial,
	DoubleSide,
	SphereGeometry,
	Mesh,
	Vector3
} from 'three';

class Renderable {
	constructor(options){
		this.x = options.x;
		this.y = options.y;
		this.texLoader = new TextureLoader()
		this.mesh.position.x = this.x;
		this.mesh.position.z = this.y;
		this.mesh.name = options.name || 'mesh_000';
	}

	setMaterial = (options) => {
		this.map = this.texLoader.load(options.texture);
		this.emissiveMap = this.texLoader.load(options.emissiveMap)
		this.emissiveIntensity = options.emissiveIntensity
		this.material = new MeshPhongMaterial({
			map: this.map,
			side: DoubleSide,
			emissive: 0xffffff,
			emissiveMap: this.emissiveMap,
			emissiveIntensity: 0.5
		});
	}

	setMesh = (options) => {
		this.geo = new SphereGeometry(1, 32, 32);
		this.mesh = new Mesh(this.geo, this.material)
	}

	addToScene = () =>{
		
	}

	removeFromScene = () =>{

	}

	update = (update) =>{
		if(this.isAddedToScene){
			this.position = new Vector3(update[0].x, update[0].y, update[0].z)
			this.mesh.position.x = this.position.x
			this.mesh.position.y = this.position.y
			this.mesh.position.z = this.position.z
		}
	}
}

export default Renderable