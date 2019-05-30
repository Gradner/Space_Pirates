import {
	TextureLoader,
	MeshPhongMaterial,
	MeshBasicMaterial,
	DoubleSide,
	SphereGeometry,
	Mesh,
	Vector3
} from 'three';
import OBJLoader from 'three-react-obj-loader'
import { CSS2DObject } from 'three-css2drender'

class Renderable {
	constructor(options){
		this.x = options.x;
		this.y = options.y;
		this.texLoader = new TextureLoader()
		this.meshLoader = new OBJLoader()
		this.scene = options.scene;
		this.material = new MeshBasicMaterial({ wireframe: true })
		this.geo = new SphereGeometry(1, 32, 32);
		this.mesh = new Mesh(this.geo, this.material)
		this.mesh.position.x = this.x;
		this.mesh.position.z = this.y;
		this.mesh.name = options.name || 'mesh_000';
		this.isAddedToScene = false;
		this.setMesh()
	}

	attachLabel = () => {
		let labelBox = document.createElement('div');
		labelBox.textContent = this.username
		labelBox.style.marginTop = '-1em'
		labelBox.style.color = '#fff'
		labelBox.style.padding = '2px'
		labelBox.style.background = 'rgba(0, 0, 0, 0.6)'
		let playerLabel = new CSS2DObject(labelBox);
		playerLabel.position.set(0, 10, 0);
		this.mesh.add(playerLabel)
	}

	setMaterial = (options) => {
		let materialOpts = {};
		materialOpts.map = this.texLoader.load(options.diffuseMap);
		materialOpts.side = DoubleSide
		if(options.emissiveMap){
			materialOpts.emissiveMap = this.texLoader.load(options.emissiveMap)
			materialOpts.emissive = options.emissiveColor
			materialOpts.emissiveIntensity = options.emissiveIntensity
		}
		if(options.normalMap){
			materialOpts.normalMap = this.texLoader.load(options.normalMap)
			if(options.normalScale){
				materialOpts.normalScale = options.normalScale
			}
		}
		if(options.specularMap){
			materialOpts.specularMap = this.texLoader.load(options.specularMap)
			if(options.specularColor){
				materialOpts.specular = options.specularColor
			}
		}
		this.material = new MeshPhongMaterial(materialOpts);
	}



	setMesh = (options) => {
		this.meshLoader.load('game_assets/frig/angf1.obj', (object)=>{
			this.removeFromScene()
			this.setMaterial({
				skinning: true,
				diffuseMap: 'game_assets/frig/angf1_diffuse.png',
				emissiveMap: 'game_assets/frig/angf1_glow.png',
				emissive: 0xffffff,
				emissiveIntensity: 3,
				normalMap: 'game_assets/frig/angf1_normal.png',
				specularMap: 'game_assets/frig/angf1_specular.png'
			})
			this.mesh = new Mesh(object.children[0].geometry, this.material)
			this.mesh.position.x = this.x;
			this.mesh.position.z = this.y;
			this.mesh.position.y = 0;
			this.mesh.scale.set(1, 1, 1)
			this.mesh.isTargetable = true;
			this.mesh.userid = this.id
			this.mesh.name = this.username
			this.attachLabel()
			this.addToScene()
		}, (xhr)=>{
			console.log(xhr.loaded)
		}, (error)=>{
			console.log(error)
		})
	}

	addToScene = () =>{
		this.scene.add(this.mesh)
		this.isAddedToScene = true;
	}

	removeFromScene = () =>{
		for (var i = this.mesh.children.length - 1; i >= 0; i--) {
		    this.mesh.remove(this.mesh.children[i]);
		}
		this.scene.remove(this.mesh)
		this.isAddedToScene = false;
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