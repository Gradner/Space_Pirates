import React, { Component } from 'react';
import moment from 'moment'

let style = {
	width: '400px',
	display: 'block',
	wordWrap: 'break-word'
}

class ChatMessage extends Component {
	constructor(props){
		super(props)
	}

	getSystemString = () =>{
		let msg = this.props.message
		switch(msg.type){
			case 'attack':
				return this.attackToString(msg)
			case 'outOfRange':
				return this.formatDate(msg.datestamp) + 'Your Target is Out of Range!'
			case 'selfAttack':
				return this.formatDate(msg.datestamp) + 'You cannot attack yourself!'
			case 'kill':
				return this.killToString(msg)
		}
	}

	formatDate = (date) => {
		return '[' + moment(date).format('YYYY-MM-DD h:mm:ss a') + '] '
	}

	attackToString = (msg) => {
		let string = ''
		string += this.formatDate(msg.datestamp)
		string += msg.player + ' '
		string += this.getAttackDesc(msg.ops.type)
		string += msg.target + ' '
		string += 'for ' + msg.ops.damage + ' Hit Points'
		return string
	}

	killToString = (msg) => {
		let string = ''
		string += this.formatDate(msg.datestamp)
		string += msg.player + ' '
		string += 'has killed '
		string += msg.target + ' '
		return string
	}

	getAttackDesc = (type) => {
		switch(type){
			case 'critical':
				return 'Critically Hits '
			case 'powerful':
				return 'Wrecks '
			case 'normal':
				return 'Hits '
			case 'miss':
				return 'Misses '
		}
	}

	getColor = () => {
		switch(this.props.message.type){
			case 'playerMsg':
				return 'black';
			case 'attack':
				return 'red'
		}
	}

	getChatString = () =>{
		let msg = this.props.message
		let string = ''
		string += this.formatDate(msg.datestamp)
		string += msg.username + ': '
		string += msg.message
		return string;
	}

	render(){
		const string = (this.props.message.type === 'playerMsg') ? this.getChatString() : this.getSystemString();
		const color = this.getColor()
		return(
			<span
				ref={(messageSpan)=>{this.messageSpan = messageSpan}}
				style={{...style, color: color}}
			>
				{string}
			</span>
		)
	}
}

export default ChatMessage