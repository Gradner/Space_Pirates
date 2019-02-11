import React, { Component } from 'react';
import * as BABYLON from 'babylonjs'
import Game from '../Game/Game'
import ChatWindow from '../UI/ChatWindow'
import TargetWindow from '../UI/TargetWindow'

let game = new Game()

class Lobby extends Component {
  constructor(props){
    super(props)
  }

  state = {
    players: [],
    myPlayer: {x: 0, y: 0, z: 0},
    keys: {
      forward: false,
      backward: false,
      left: false,
      right: false,
      attack: false
    }
  }

  componentWillMount() {
    
  }

  componentDidMount() {
    let canvas = this.refs.gameCanvas
    game.canvasReady(canvas)
    this.props.socket.on('lobbyData', (data)=>{
      let players = data.players
      let actions = data.actions
      if(actions[0]){
        this.chatWindow.appendToHistory(actions)
      }
      let myPlayer = players.filter(player => player.id === this.props.socket.id)[0];
      let targetPlayer = players.filter(player=>player.id === this.state.keys.targetid)[0]
      this.setState({
        ...this.state,
        players: players,
        myPlayer: myPlayer,
        target: targetPlayer
      })
      game.update({myPlayer: myPlayer, players: players})
      this.props.socket.emit('keyUpdate', this.state.keys, ()=> {})
    })
    
    window.addEventListener('keydown', this.keyDown.bind(this));
    window.addEventListener('keyup', this.keyUp.bind(this));
    game.registerOnMeshSelectEvent((meshPicked)=>{
      let targetPlayer = this.state.players.filter((player)=> player.id === meshPicked.id)[0]
      this.setState({
        ...this.state,
        keys: {
          ...this.state.keys,
          targetid: targetPlayer.id
        }
      })
    })
    window.addEventListener("resize", function () { 
      if(game){game.resize();}
    });
  }

  keyDown = (e) => {
      if(e.keyCode == 27) {
        if(this.state.target){
          this.setState({
            target: null
          })
        }
      }
      let keys = this.state.keys;
      if(e.keyCode == 81){
          keys.attack = !keys.attack;
      }
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
      if(e.keyCode == 27) {
        if(this.state.target){
          this.setState({
            target: null
          })
        }
      }
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

  getTargetPlayer = (players) => {
    let targetPlayer = players.filter(player => player.id === this.state.keys.targetid)
    this.setState({
      ...this.state,
      target: targetPlayer
    })
  }

  render() {
    return(
      <div width={this.props.width} height={this.props.height} style={{overflow: 'hidden'}}>
        <TargetWindow target={this.state.target}/>
        <ChatWindow ref={(chatWindow)=> this.chatWindow = chatWindow}socket={this.props.socket}/>
        <canvas ref={'gameCanvas'} width={this.props.width} height={this.props.height}/>
      </div>
    );
  }

}

export default Lobby;