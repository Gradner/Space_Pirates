import React, { Component } from 'react';
import { Scene, FreeCamera, HemisphericLight, Model, Ground, Skybox } from 'react-babylonjs'
import { Vector3 } from 'babylonjs'

class Lobby extends Component {
  constructor(props){
    super(props)
  }

  state = {
    players: [],
    myPlayer: {
      x: 0,
      y: 0,
      z: 0
    },
    keys: {
      forward: false,
      backward: false,
      left: false,
      right: false
    }
  }

  componentWillMount() {
    
  }

  componentDidMount() {
    this.props.socket.on('lobbyData', (players)=>{
      let myPlayer = players.filter(player => player.id === this.props.socket.id)[0];
      this.setState({
        ...this.state,
        players: players,
        myPlayer: myPlayer
      })

      this.props.socket.emit('keyUpdate', this.state.keys, ()=> {})
    })
    
    window.addEventListener('keydown', this.keyDown.bind(this));

    window.addEventListener('keyup', this.keyUp.bind(this));
  }

  keyDown = (e) => {
      let keys = this.state.keys;
      if(e.keyCode == 65) {
          keys.left = true // Move ('left');
      } else if(e.keyCode == 68) {
          keys.right = true// Move ('right');
      } else if(e.keyCode == 87) {
          keys.forward = true// Move ('up');
      } else if(e.keyCode == 83) {
          keys.backward = true// Move ('down');
      }
      this.setState({
        ...this.state,
        keys: keys
      })
    }

  keyUp = (e) => {
      let keys = this.state.keys;
      if(e.keyCode == 65) {
          keys.left = false // Move ('left');
      } else if(e.keyCode == 68) {
          keys.right = false// Move ('right');
      } else if(e.keyCode == 87) {
          keys.forward = false// Move ('up');
      } else if(e.keyCode == 83) {
          keys.backward = false// Move ('down');
      }
      this.setState({
        ...this.state,
        keys: keys
      })
    }

  getMyPlayer = (players) => {
    let myPlayer = players.filter(player => player.id === this.props.socket.id)
    this.setState({
      ...this.state,
      myPlayer: myPlayer
    })
  }

  render() {
    const players = this.state.players;
    const camera = {
      x: this.state.myPlayer.x,
      z: this.state.myPlayer.z
    }
    return(
      <Scene width={this.props.width} height={this.props.height}>
        <Skybox texture={'/game_assets/skybox/skybox'} infiniteDistance={false}/>
        <FreeCamera name="camera1" minZ={0.1} maxZ={20000} x={camera.x-3} y={1} z={camera.z-3} target={new Vector3(camera.x, 0, camera.z)}/>
        <HemisphericLight name="light1" intensity={1} direction={Vector3.Up()} />
        {players.map((player, index)=>(
          <Model key={index}
            rotation={new Vector3(0, player.rotY, 0)} position={new Vector3(player.x, 0, player.z)}
            rootUrl={'/game_assets/moa/'} sceneFilename="Moa.gltf"
            scaleToDimension={1}
          />
          ))}
      </Scene>
    );
  }

}

export default Lobby;