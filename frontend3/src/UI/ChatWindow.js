import React, { Component } from 'react';
import ChatMessage from './ChatMessage'
import { FaComments } from 'react-icons/fa'
import anime from 'animejs'

const style = {
	container: {
		position: 'absolute',
		right: -400,
		bottom: 0,
		height: '150px',
		width: '400px',
	},
	button: {
		position: 'relative',
		top: 0,
		left: -41,
		width: '30px',
		height: '30px',
		borderRadius: '3px',
		backgroundColor: 'white',
		border: '1px solid black',
		fontSize: '30px',
		padding: '5px'
	},
	window: {
		position: 'relative',
		top: -42,
		height: '150px',
		width: '400px',
		backgroundColor: 'white',
		border: '1px solid black'
	},
	history: {
		height: '131px',
		overflowY: 'auto',
		overflowX: 'hidden',
		paddingRight: '17px'
	},
	inputContainer: {
		height: '19px'
	},
	input: {
		width: '100%',
		border: '0'
	}
}

class ChatWindow extends Component {
	constructor(props){
		super(props)
	}

	state = {
		chatDisplayed: false,
		canClick: true,
		chatFocused: false,
		chatMessage: '',
		history: []
	}

	componentDidMount() {
		window.addEventListener('keydown', this.keyDown.bind(this));
		this.props.socket.on('chatMessage', (data)=>{this.appendToHistory(data)})
		this.props.socket.on('action', (data)=>{this.appendToHistory(data)})
	}

	appendToHistory = (data) => {
		if(Array.isArray(data)){
			this.setState({
				history: [...this.state.history, ...data]
			})
		} else {
			this.setState({
				history: [...this.state.history, data]
			})
		}
		let historyDiv = this.refs.chatHistory;
		historyDiv.scrollTop = historyDiv.scrollHeight
	}

	keyDown = (e) => {
      if(e.keyCode === 13) {
      	if(!this.state.chatDisplayed){
      		this.chatButtonClicked()
      	}
      	if(this.state.chatFocused){
      		if(this.state.chatMessage !== ''){
      			this.props.socket.emit('chatMessage', this.state.chatMessage, ()=>{})
	      		this.setState({chatMessage: ''})
	      		this.chatInput.value = ''
	      	} else {
	      		this.chatInput.blur()
	      	}
      	} else {
      		this.chatButtonClicked()
      	}
      }
	}

	chatButtonClicked = () => {
		console.log('chatclicked')
		let newRight = (this.state.chatDisplayed) ? -400 : 0;
		let opposite = (!this.state.chatDisplayed)
		if(!opposite){
			this.chatBlurred()
		}
		this.setState({
			canClick: false
		})
		anime({
			targets: this.refs.chatContainer,
			right: newRight,
			duration: 400,
			complete: (anim)=>{
				if(opposite){
					this.chatInput.focus()
				}
				this.setState({
					chatDisplayed: opposite,
					canClick: true
				})
			}
		})
	}

	onSendMsg = () => {

	}

	chatFocused = () => {
		this.setState({chatFocused: true})
	}

	chatBlurred = () => {
		this.setState({chatFocused: false})
	}

	onChatChange = (e) => {
		this.setState({
			chatMessage: e.target.value,

		})
	}

	componentWillUnmount(){
		window.removeEventListener('keydown', this.keyDown.bind(this));
		this.props.socket.off('chatMessage')
		this.props.socket.off('action')
	}

	render(){
		const history = this.state.history
		return(
			<div ref={'chatContainer'} id={'chatContainer'}style={style.container}>
				<div id={'chatButton'} style={style.button} onClick={()=>{this.chatButtonClicked()}}>
					<FaComments onClick={()=>{this.chatButtonClicked()}}/>
				</div>
				<div id={'chatWindow'} style={style.window}>
					<div ref={'chatHistory'} id={'chatHistory'} style={style.history}>
						{history.map((message, index)=>(
							<ChatMessage key={index} message={message}/>
							))}
					</div>
					<div id={'chatInput'} style={style.inputContainer}>
						<input
							style={style.input}
							ref={(input)=>{this.chatInput = input}}
							onChange={(e)=>{this.onChatChange(e)}}
							onFocus={()=>{this.chatFocused()}}
							onBlur={()=>{this.chatBlurred()}}
						/>
					</div>
				</div>
			</div>
		)
	}

}

export default ChatWindow;