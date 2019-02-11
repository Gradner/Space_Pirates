import React, { Component } from 'react';
import anime from 'animejs';

const style = {
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		margin: '0 auto',
		padding: '5px',
		width: '200px',
		height: '20px',
		backgroundColor: 'white'
	},
	emptyBar: {
		position: 'relative',
		backgroundColor: 'black',
		width: '100%',
		height: '100%',
		textAlign: 'center',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis'
	},
	targText: {
		position: 'relative',
		top: -20,
		color: 'white',
		zIndex: 10
	},
	currentBar: {
		position: 'relative',
		top: 0,
		backgroundColor: 'red',
		height: '20px'
	}
}

class TargetWindow extends Component {
	constructor(props){
		super(props)
	}

	state = {
		oldHp: 0,
		percent: ''
	}

	animateToNewPct = (newPct) => {
		anime({
			targets: this.currentBar,
			width: newPct + '%',
			duration: 20
		})
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.target){
			if(nextProps.target.currentHp !== this.state.oldHp){
				let newHp = nextProps.target.currentHp
				let maxHp = nextProps.target.maxHp
				let hpPct = Math.round(newHp/maxHp * 100)
				this.animateToNewPct(hpPct)
				this.setState({oldHp: newHp, percent: hpPct})
			} else {
				return
			}
		} else {
			if(this.state.oldHp !== 0){
				this.animateToNewPct(0)
				this.setState({oldHp: 0})
			}
		}
	}

	render(){
		return(
			<div style={style.container}>
				<div style={style.emptyBar}>
					<div ref={(currentBar)=>{this.currentBar = currentBar}}style={style.currentBar}/>
					<span style={style.targText}>Target: {(this.props.target) ? this.props.target.username + ' - ' + this.state.percent + '%' : 'No Target'}</span>
				</div>
			</div>
		)
	}

}

export default TargetWindow;