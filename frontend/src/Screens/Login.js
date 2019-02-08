import React, { Component } from 'react';

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
          <h3>Please Login</h3>
          <input type={'text'} placeholder={'Username'} value={this.state.username} onChange={this.usernameChanged}></input>
          <input type={'text'} placeholder={'Password'} value={this.state.password} onChange={this.passwordChanged}></input>
          <button onClick={this._handleLogin}>Login</button>
        </div>
      );
  }

}

export default Login;