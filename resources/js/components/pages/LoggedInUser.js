import React, { Component } from 'react';

class LoggedInUser extends Component{
	constructor(props){
		super(props);
	}

	render(){
		let buttonStyle = {
			margin: 2
		};
		return (
			<button className="btn btn-primary" style={buttonStyle}>{this.props.name}</button>
		);
	}
}

export default LoggedInUser;