import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

class Register extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			email: '',
			password: '',
			status: 200,
			message: ''
		}

		this.nameHandler = this.nameHandler.bind(this);
		this.emailHandler = this.emailHandler.bind(this);
		this.passwordHander = this.passwordHander.bind(this);
		this.handleSignUp = this.handleSignUp.bind(this);
	}

	nameHandler(event){
		this.setState({
			name: event.target.value
		});
	}

	emailHandler(event){
		this.setState({
			email: event.target.value
		});
	}

	passwordHander(event){
		this.setState({
			password: event.target.value
		});
	}

	handleSignUp(){
		axios.post('/api/register', {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password
		}).then(response => {
			let rtnData = response.data;
			let accessToken = rtnData.access_token;
			let name = rtnData.name;

			if(accessToken !== undefined){
				Cookies.set('access_token', accessToken, { path: '/' });
				let userData = {
					name: name
				};

				this.props.handleLoggedInStat(userData, this.props.history);
			}
		}).catch(error => {
			if((error.response !== undefined) && (error.response.status !== 200)){
				this.setState({
					status: error.response.status,
					message: 'Woops! Something went wrong. Please try it again.' 
				});
			}
		})
	}

	render() {
		let messageColor = (this.state.status === 200) ? '#2b2b2b' : '#ff4a4a';
		let messageStyle = {
			padding:'10px 20px',
			color: messageColor
		}

		return (
			<div className="container">
				<div className="card">
				  	<h5 className="card-header">Register</h5>
				  	<div id="loginMessage" style={messageStyle}>{this.state.message}</div>
				  	<div className="card-body">
						<div className="form-group">
							<label htmlFor="name">Full Name</label>
							<input type="text" className="form-control" id="name" placeholder="Enter Full Name" onChange={this.nameHandler} value={this.state.name} />
						</div>

						<div className="form-group">
							<label htmlFor="email">Email address</label>
							<input type="email" className="form-control" id="email" placeholder="Enter email Address" onChange={this.emailHandler} value={this.state.email} />
						</div>

						<div className="form-group">
							<label htmlFor="password">Password</label>
							<input type="password" className="form-control" id="password" placeholder="Enter Password" onChange={this.passwordHander} value={this.state.password} />
						</div>

						<div className="form-group">
							<button className="btn btn-primary" onClick={this.handleSignUp}>Submit</button>
						</div>
				  	</div>
				</div>
			</div>
		);
	}
}

export default Register;