import React, { Component } from 'react';
import anime from 'animejs'

const style = {
  systemBox: {
    padding: '10px',
    margin: 'auto',
    width: '200px',
    borderRadius: '5px',
    border: '2px solid black',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0px 0px 10px #70a6ff',
    position: 'absolute',
    top: '10px',
    left: '10px',
    opacity: 0
  },
  button: {
    height: '30px',
    width: '50%',
  },
  gameLogo: {
    textAlign: 'center',
    fontSize: '50px',
    color: '#ffffff',
    textShadow: '0px 0px 20px #70a6ff'
  },
  boxTitle: {
    color: '#ffffff',
    textShadow: '0px 0px 10px #70a6ff'
  }
}

class GameList extends Component {
  constructor(props){
    super(props);
  }

  state = {
    games: [],
    selectedGame: {
      name: '',
      players: ''
    },
    joinedGame: false,
    gameState: 0,
  }

  componentWillMount = () => {
    
  }

  componentDidMount = () => {
    this.fetchGames();
    this.props.socket.on('gameList', (games)=>{
      this.setState({
        games: games
      })
    })

    this.props.socket.on('userList', (users)=>{
      this.setState({
        users: users,
      })
    })

    window.addEventListener('systemSelected', function(e){
      console.log(e)
      this.setState({
        selectedGame: e.detail.system
      })
      anime({
        targets: this.refs.systemBox,
        opacity: 1,
        easing: 'linear',
        complete: function(){
          console.log(this.state.selectedGame)
        }.bind(this)
      })
    }.bind(this))
  }

  selectSystem = () => {

  }

  componentWillUnmount(){
    this.props.socket.off('gameList')
    this.props.socket.off('userList')
  }

  fetchGames = () => {
    this.props.socket.emit('fetchGames', ()=> { console.log('Requested Games') })
  }

  _joinGame = () => {
    let data = {gameid: this.state.selectedGame.gameID}
    console.log(data)
    this.props.socket.emit('joinGame', data, ()=> { console.log('Attempting to join game') })
  }

  render() {
    return (
      <div>
        <div ref={'systemBox'} style={style.systemBox}>
          <h2 style={style.boxTitle}>{this.state.selectedGame.roomName}</h2>
          <p style={style.boxText}>{this.state.selectedGame.players.length} Players in System</p>
          <button style={style.button} onClick={this._joinGame}>Warp to System</button>
        </div>
      </div>
    );
  }
}

export default GameList;
