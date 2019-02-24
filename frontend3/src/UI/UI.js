import React, { Component } from 'react';

class UI extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return(
			<div style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0}}>
				{this.props.children}
			</div>
		)
	}
}

export default UI;