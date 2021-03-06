var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );
var app = express();
var server = http.createServer( app );
var io = socket.listen( server );
var cookie = require('cookie');



io.sockets.on( 'connection', function( client ) {
	console.log('new client');
	

	client.on('product', function(data){
		io.sockets.emit('product', {product: data.product, pusher: data.pusher, action: data.action});
	});

	client.on('new-user', function(data){
		io.sockets[data.email] = 'loggedIn';
		console.log(`The user by ${data.email} has logged in.`);
		var usernameCookie = cookie.parse(client.handshake.headers.cookie).username;
		if(usernameCookie != data.email){
			let date = new Date();
			let days = 10;
			date.setTime(date.getTime()+(days*24*60*60*1000));
			let expires = "; expires="+date.toGMTString();
			client.handshake.headers.cookie = "username="+data.email+expires+"; path=/";
		}

		let loggedInUsers = Object.keys(io.sockets).filter(function(item){
			return (item.indexOf('@') !== -1);
		});

		io.sockets.emit('loggedin-users', {loggedInUsers: loggedInUsers});
	});

	client.on('disconnect', function(){
		/*var cookies = client.handshake.headers.cookie;*/
		var username  = cookie.parse(client.handshake.headers.cookie).username;
		delete io.sockets[username];

		let loggedInUsers = Object.keys(io.sockets).filter(function(item){
			return (item.indexOf('@') !== -1);
		});

		io.sockets.emit('loggedin-users', {loggedInUsers: loggedInUsers});
	});
});

server.listen(8080);