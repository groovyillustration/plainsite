import React, { Component } from 'react';
import LoggedInUser from './LoggedInUser';

class Home extends Component {
	constructor(props){
		super(props);
	}

	render() {
		console.log(this.props.loggedInUsers.toString());
		return (
		    <div className="container">
		      	<h2>Home</h2>
				<div className="card">
				  <div className="card-body">{
				  		this.props.loggedInUsers.map((user, i) => {
				  			return <LoggedInUser name={user} key={i}/>
				  		})
					}</div>
				</div>
		    </div>
		);
	}
}

export default Home;