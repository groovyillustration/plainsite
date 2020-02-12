import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';

class Router extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn: false,
            user: {},
            loggedInUsers: []
        }
        this.handleLoggedInStat = this.handleLoggedInStat.bind(this);
        this.handleRedirectNotLoggedIn = this.handleRedirectNotLoggedIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handleLoggedInUsers = this.handleLoggedInUsers.bind(this);
        this.handleLoggedInUsers();
    }

    handleLoggedInStat(data, historyObj){
        this.setState({
            isLoggedIn: (data.name !== undefined) ? true : false,
            user: (Object.keys(data).length > 0) ? data : {}
        });
        this.props.socket.emit('new-user', {email: data.email});
        historyObj.push('/products');
    }

    handleLoggedInUsers(){
        var selfObj = this;
        this.props.socket.on('loggedin-users', function(data){
            if(data.loggedInUsers.length > 0){
                selfObj.setState({
                    loggedInUsers: data.loggedInUsers
                });
            }
        });
    }

    handleRedirectNotLoggedIn(isLoggedIn, historyObj){
        if(!isLoggedIn){
            historyObj.push('/login');
        }
    }

    handleLogOut(){
        let accessToken = Cookies.get('access_token');
        axios.post('/api/logout', {}, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+accessToken
            }
        })
        .then(response => {
            if(response.data.logout === 'success'){
                this.setState({
                    isLoggedIn: false,
                    user: {}
                });
                Cookies.remove('access_token', { path: '/' });
                Cookies.remove('username', { path: '/' });
                window.location.replace('/login');
            }
        })
        .catch(error => {
            console.log(error.response);
        });
    }

    render() {
        
        return (
            <BrowserRouter>
                <div>
                    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm mb-3">
                        <div className="container">
                            <Link to={'/'} className="navbar-brand">Plainsite</Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item">
                                        <Link to={'/home'} className="nav-link">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={'/about'} className="nav-link">About</Link>
                                    </li>
                                    <li className="nav-item" style={ (this.state.isLoggedIn) ? {} : {'display': 'none'} }>
                                        <Link to={'/products'} className="nav-link">Products</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={'/contact'} className="nav-link">Contact</Link>
                                    </li>
                                </ul>

                                
                                <ul className="navbar-nav ml-auto" style={ (!this.state.isLoggedIn) ? {} : {'display': 'none'} }>
                                    <li className="nav-item">
                                        <Link to={'/login'} className="nav-link">Login</Link>
                                    </li>
                                    
                                    <li className="nav-item">
                                        <Link to={'/register'} className="nav-link">Register</Link>
                                    </li>
                                </ul>


                                <ul className="navbar-nav ml-auto" style={ (this.state.isLoggedIn) ? {} : {'display': 'none'} }>
                                    <li className="nav-item">
                                        <span>{this.state.user.name}</span>
                                    </li>
                                    
                                    <li className="nav-item ml-3">
                                        <span onClick={() => (this.handleLogOut())}>Logout</span>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </nav>
                    <Switch>
                        <Route exact path='/home' render={props => (<Home {...props} loggedInUsers={this.state.loggedInUsers}/>)} />
                        <Route exact path='/products' render={props => (<Products {...props} socket={this.props.socket} username={this.state.user.name} isLoggedIn={this.state.isLoggedIn} handleRedirectNotLoggedIn={this.handleRedirectNotLoggedIn}/>)} />
                        <Route exact path='/about' component={About} />
                        <Route exact path='/contact' component={Contact} />
                        <Route exact path='/login' render={props => (<Login {...props} handleLoggedInStat={this.handleLoggedInStat} />)} />
                        <Route exact path='/register' render={props => (<Register {...props} handleLoggedInStat={this.handleLoggedInStat} />)} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default Router;
