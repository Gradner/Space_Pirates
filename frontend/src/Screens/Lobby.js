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
      this.setState({players: players})
    })
  }

  componentWillUnmount(){
    this.props.socket.off('lobbyData')
  }

  render() {
    return(
      <div width={this.props.width} height={this.props.height} style={{overflow: 'hidden'}}>
        <TargetWindow target={this.state.target}/>
        <ChatWindow ref={(chatWindow)=> this.chatWindow = chatWindow}socket={this.props.socket}/>
      </div>
    );
  }

}

export default Lobby;