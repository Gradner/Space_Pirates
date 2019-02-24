import React, { Component } from 'react';
import ChatWindow from '../UI/ChatWindow'
import TargetWindow from '../UI/TargetWindow'

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
    this.props.socket.on('lobbyData', (data)=>{
      let players = data.players
      let actions = data.actions
      if(actions[0]){
        this.chatWindow.appendToHistory(actions)
      }
      let myPlayer = players.filter(player => player.id === this.props.socket.id)[0];
      let targetPlayer = players.filter(player=>player.id === this.state.keys.targetid)[0]
      if(!targetPlayer){targetPlayer = null}
      this.setState({
        ...this.state,
        players: players,
        myPlayer: myPlayer,
        target: targetPlayer
      })
      this.props.socket.emit('keyUpdate', this.state.keys, ()=> {})
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

  componentWillUnmount(){
    this.props.socket.off('lobbyData')
    window.removeEventListener('keydown', this.keyDown.bind(this));
    window.removeEventListener('keyup', this.keyUp.bind(this));
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