import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'

class RenderableGLTF {
	constructor(options){
		this.meshUrl = options.meshUrl || 'game_assets/moa/'
		this.meshFileName = options.meshFileName || 'Moa.gltf'
		this.meshName = options.meshName || 'shape'
		this.position = options.position || new BABYLON.Vector3(0, 0, 0)
		this.scene = options.scene
		this.meshes = []
		this.isAddedToScene = false;
	}

	addToScene = () =>{
		BABYLON.SceneLoader.ImportMesh(this.meshName, this.meshUrl, this.meshFileName, this.scene, (newMeshes)=>{
				this.meshes = newMeshes
				this.rootMesh = newMeshes[0]
				this.modelMesh = newMeshes[1]
				this.modelMesh.isSelectable = true
			}
		)
	}

	removeFromScene = () =>{
		this.rootMesh.dispose();
		this.modelMesh.dispose();
	}

	update = (update) =>{
		if(this.isAddedToScene){
			this.position = new BABYLON.Vector3(update[0].x, update[0].y, update[0].z)
			this.rootMesh.position.x = this.position.x
			this.rootMesh.position.y = this.position.y
			this.rootMesh.position.z = this.position.z
		}
	}
}

export default RenderableGLTF