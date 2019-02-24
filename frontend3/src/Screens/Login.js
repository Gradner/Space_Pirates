import React, { Component } from 'react';

const style = {
  loginBox: {
    padding: '10px',
    margin: 'auto',
    width: '250px',
    borderRadius: '5px',
    border: '2px solid black',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0px 0px 10px #70a6ff'
  },
  input: {
    display: 'block',
    width: '100%',
    border: '0px',
    borderBottom: '1px solid #000000',
    marginBottom: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: '5px',
    boxSizing: 'border-box',
    color: '#ffffff',
    textShadow: '0px 0px 10px #70a6ff',
    outline: 'none',
    focus: {
      borderBottom: '1px solid #70a6ff'
    }
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

class Login extends Component {
  constructor(props){
    super(props)
  }

  state = {
    username: '',
    password: '',
  }

  _handleLogin = () => {
    this.props.onLogin({username: this.state.username, password: this.state.password});
  }

  usernameChanged = (e) => {
    this.setState({
      username: e.target.value,
    })
  }

  passwordChanged = (e) => {
    this.setState({
      password: e.target.value,
    })
  }

  render() {
    return(
        <div>
          <h1 style={style.gameLogo}>Space Pirate Game Thing</h1>
          <div style={style.loginBox}>
            <h2 style={style.boxTitle}>Please Login</h2>
            <input style={style.input} type={'text'} placeholder={'Username'} value={this.state.username} onChange={this.usernameChanged}></input>
            <input style={style.input} type={'text'} placeholder={'Password'} value={this.state.password} onChange={this.passwordChanged}></input>
            <button style={style.button} onClick={this._handleLogin}>Login</button>
            <button style={style.button}>Create Account</button>
          </div>
        </div>
      );
  }

}

export default Login;