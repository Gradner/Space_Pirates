import * as BABYLON from 'babylonjs'

class SkyBox {
	constructor(options){
		this.scene = options.scene
		this.mesh = BABYLON.MeshBuilder.CreateBox(
			options.name,
			options.ops,
			options.scene
		)
		this.material = new BABYLON.StandardMaterial("skyBox", options.scene);
		this.material.backFaceCulling = false;
		this.material.reflectionTexture = new BABYLON.CubeTexture('game_assets/skybox/skybox', options.scene);
		this.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		this.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
		this.material.specularColor = new BABYLON.Color3(0, 0, 0);
		this.mesh.material = this.material;
	}
}

export default SkyBox;