import React, { Component } from 'react';
import moment from 'moment'

const style = {
	width: '400px',
	display: 'block',
	wordWrap: 'break-word'
}

class ChatMessage extends Component {
	constructor(props){
		super(props)
	}

	getChatString = () =>{
		let msg = this.props.message
		let string = ''
		string += '[' + moment(msg.datestamp).format('YYYY-MM-DD h:mm:ss a') + '] '
		string += msg.username + ': '
		string += msg.message
		return string;
	}

	render(){
		const chatString = this.getChatString();
		return(
			<span
				style={style}
			>
				{chatString}
			</span>
		)
	}
}

export default ChatMessage