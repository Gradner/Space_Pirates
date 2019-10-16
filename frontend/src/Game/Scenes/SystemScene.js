import GameScene from './GameScene';
import { System } from '../GameObjects'
import PlayerMGR from '../Managers/PlayerMGR'
import anime from 'animejs'
import * as HumanInput from 'humaninput'
import { 
  Raycaster,
  Vector3,
  Vector2,
  PerspectiveCamera
 } from 'three';

eval( 'window.__VERSION__ = 0' )


class SystemScene extends GameScene {
  constructor(options){
    super(options)
    this.socket = options.socket;
    this.players = [];
    this.target = '';
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      attack: false
    }
    this.socket.on('lobbyData', (data)=>{
      this.players = data.players
      this.myPlayer = this.players.filter(player => player.id === this.socket.id)[0];
      this.targetPlayer = this.players.filter(player=>player.id === this.keys.targetid)[0]
      if(!this.targetPlayer){
        this.keys.targetid = null
      }
      this.socket.emit('keyUpdate', this.keys, ()=> {})
      this.PlayerMGR.update({
        players: this.players
      })
    })
    this.mouse = new Vector2(0, 0);
    this.raycaster = new Raycaster();
    this.keyDownFunc = this.keyDown.bind(this);
    this.keyUpFunc = this.keyUp.bind(this);
    this.clickFunction = this.onMouseDown.bind(this);
    window.addEventListener('keydown', this.keyDownFunc, true);
    window.addEventListener('keyup', this.keyUpFunc, true);
    window.addEventListener('mousedown', this.clickFunction, true);
    this.camera = new PerspectiveCamera(45, this.width/this.height, 1, 10000)
    this.camera.position.set(0, 20, 45)
    this.camera.lookAt(0, 0, 0)
    this.PlayerMGR = new PlayerMGR({
      scene: this
    })
  }

  keyDown(e){
    if(e.keyCode == 27) {
      if(this.target){
        this.target = null
      }
    }
    if(e.keyCode == 81){
        this.keys.attack = !this.keys.attack;
        console.log(this.keys.attack)
    }
    if(e.keyCode == 65) {
        this.keys.left = true // Move ('left');
    } else if(e.keyCode == 68) {
        this.keys.right = true// Move ('right');
    } else if(e.keyCode == 87) {
        this.keys.forward = true// Move ('up');
    } else if(e.keyCode == 83) {
        this.keys.backward = true// Move ('down');
    }
  }

  keyUp(e){
    if(e.keyCode == 27) {
      if(this.target){
        this.target = null
      }
    }
    if(e.keyCode == 65) {
        this.keys.left = false // Move ('left');
    } else if(e.keyCode == 68) {
        this.keys.right = false// Move ('right');
    } else if(e.keyCode == 87) {
        this.keys.forward = false// Move ('up');
    } else if(e.keyCode == 83) {
        this.keys.backward = false// Move ('down');
    }
  }

  onMouseDown(e){
    this.mouse.x = (e.clientX / this.width) * 2 - 1;
    this.mouse.y =  - (e.clientY / this.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.children)
    if(intersects.length > 0){
      if(intersects[0].object.isTargetable){
        this.keys.targetid = intersects[0].object.userid
        this.target = this.players.filter((player)=>{ return player.id === this.keys.targetid })
      }
    }
  }

  animate(){
    if(this.myPlayer){
      //this.camera.position.set( this.myPlayer.position )
    }
    this.loop = requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this, this.camera);
    this.uiRenderer.render(this, this.camera);
  }

  destroyScene(){
    window.removeEventListener('keydown', this.keyDownFunc, true)
    window.removeEventListener('keyup', this.keyUpFunc, true)
    window.removeEventListener('mousedown', this.clickFunction, true)
    cancelAnimationFrame(this.loop);
    document.getElementById('labelContainer').innerHTML = ''
    this.dispose()
  } 
}

export default SystemScene;