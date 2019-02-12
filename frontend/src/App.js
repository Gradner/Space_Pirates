///////////////////////////////////////////////////////////////////
//  Libraries
///////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import io from 'socket.io-client'

///////////////////////////////////////////////////////////////////
//  Components
///////////////////////////////////////////////////////////////////

import Login from './Screens/Login'
import GameList from './Screens/GameList'
import Lobby from './Screens/Lobby'

///////////////////////////////////////////////////////////////////
//  Intialization
///////////////////////////////////////////////////////////////////

const socket = io('http://localhost:5999')

///////////////////////////////////////////////////////////////////
//  Class Definition
///////////////////////////////////////////////////////////////////

class App extends Component {
  constructor(props){
    super(props);
  }

  state = {
    currentUser: {},
    users: [],
    activeGame: {},
    gameState: 0,
  }

  componentWillMount = () => {

    socket.on('connect', () => {
      console.log('Connected to Game Servers on port 5999')
    })

    socket.on('changeGameState', (requestedState)=>{
      console.log('Server has requested change to gamestate ' + requestedState)
      this.changeGameState(requestedState);
    })

  }

  componentWillMount() {
    
  }

  componentDidMount () {
    this.resizeClient()
    window.addEventListener("resize", this.resizeClient.bind(this) );
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeClient.bind(this) );
  }

  changeGameState = (requestedState) => {
    if(this.state.gameState === 2){
      this.setState({activeGame: {}, gameState: 1})
    } else {
      this.setState({
        gameState: requestedState,
      })
    }
    
  }

  userLogin = (data) => {
    console.log('trying to login using: ' + JSON.stringify(data))
    socket.emit('login', data)
  }

  resizeClient(){
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.setState({
      ...this.state,
      windowWidth: width,
      windowHeight: height
    })
  }

  getScreen = (gamestate) => {
    switch(gamestate){
      default:
        return (<Login
          socket={socket}
          onStateChange={ this.changeGameState }
          onLogin={ this.userLogin }
          />)
      case 0:
        return (<Login
          socket={socket}
          onStateChange={ this.changeGameState }
          onLogin={ this.userLogin }
          />)
      case 1:
        return (<GameList
          socket={socket}
          onStateChange={ this.changeGameState }
          />)
      case 2:
        return (<Lobby
          socket={socket}
          onStateChange={ this.changeGameState }
          width={this.state.windowWidth}
          height={this.state.windowHeight}
          />)
    }
  }

  render() {
    return (
      <div>
        {this.getScreen(this.state.gameState)}
      </div>
    );
  }
}

export default App;