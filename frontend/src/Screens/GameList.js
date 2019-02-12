import React, { Component } from 'react';

class GameList extends Component {
  constructor(props){
    super(props);
  }

  state = {
    games: [],
    activeGame: {},
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
  }

  componentWillUnmount(){
    this.props.socket.off('gameList')
    this.props.socket.off('userList')
  }

  displayGames = (games) => {
    if(games.length < 1){
      return(<div>No Games Currently Available</div>)
    } else {
      return(
        <div>
        {games.map((game, index)=>(
          <div key={index}>
            <h3>{game.roomName}</h3>
            <span>Current Players: {game.players.length}</span>
            <button onClick={() => this.joinGame({gameid: game.gameID})}>Join Game</button>
            <button onClick={() => this.gameInfo()}>Game Details</button>
            <button onClick={() => this.deleteGame({gameid: game.gameID})}>Delete Game</button>
          </div>
          ))}
        </div>
      )
    }
  }

  fetchGames = () => {
    this.props.socket.emit('fetchGames', ()=> { console.log('Requested Games') })
  }

  createGame = () => {
    this.props.socket.emit('createGame', ()=> { console.log('Created New Game') })
  }

  deleteGame = (data) => {
    this.props.socket.emit('deleteGame', data, ()=> { console.log('Requesting Game Deletion') })
  }

  joinGame = (data) => {
    this.props.socket.emit('joinGame', data, ()=> { console.log('Attempting to join game') })
  }

  render() {
    return (
      <div>
        {this.displayGames(this.state.games)}
        <button onClick={() => this.fetchGames()}>Refresh Game List</button>
        <button onClick={() => this.createGame()}>Create New Game</button>
      </div>
    );
  }
}

export default GameList;
