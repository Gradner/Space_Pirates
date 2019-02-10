import React, { Component } from 'react';

const style = {
	position: 'absolute',
	left: 0,
	right: 0,
	margin: '0 auto',
	width: '200px',
	height: '20px',
	backgroundColor: 'white'
}

class TargetWindow extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return(
			<div style={style}>
				<span>Target: {(this.props.target) ? this.props.target.username : 'No Target'}</span>
			</div>
		)
	}

}

export default TargetWindow;