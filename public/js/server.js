var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );

var app = express();
var server = http.createServer( app );

var io = socket.listen( server );
var loggedInUsers = [];

io.sockets.on( 'connection', function( client ) {
	console.log('new client');

	client.on('product', function(data){
		io.sockets.emit('product', {product: data.product, pusher: data.pusher});
	});

	client.on('new-user', function(data){
		io.sockets.username = data.email;
		console.log(`The user by ${io.sockets.username} has logged in.`);
		loggedInUsers.push(io.sockets.username);
		console.log(loggedInUsers);
	});

	client.on('disconnect', function(){
		loggedInUsers.splice(loggedInUsers.indexOf(io.sockets.username), 1);
		console.log(`The user by ${io.sockets.username} has been disconnected`);
		console.log(loggedInUsers);
	});
});

server.listen(8080);