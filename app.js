// This is the server-side file of our mobile remote controller app.
// It initializes socket.io and a new express instance.
// Start it by running 'node app.js' from your terminal.

//https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment
//http://peaceful-meadow-47202.herokuapp.com/

// Creating an express server

var express = require('express'),
	app = express();

// This is needed if the app is run on heroku and other cloud providers:

var port = process.env.PORT || 8080;

// Initialize a new socket.io object. It is bound to 
// the express app, which allows them to coexist.

var io = require('socket.io').listen(app.listen(port));


// App Configuration

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public'));


// This is a secret key that prevents others from opening your presentation
// and controlling it. Change it to something that only you know.

var secret = 'W';

// Initialize a new socket.io application

var presentation = io.on('connection', function (socket) {

	// A new client has come online. Check the secret key and 
	// emit a "granted" or "denied" message.
	
	//alert("FLOWERS");

	socket.on('load', function(data){

		socket.emit('access', {
			access: (data.key === secret ? "granted" : "denied")
		});

	});
	
	socket.on('cameraControls', function(data){
		console.log("camera controls");
		socket.emit('sendControls', {controls: data.controls});
	});
	
	socket.on('devchanged', function(data){
		console.log("DEVe CHANGED" + data.mynewvector.a);
		presentation.emit('device-changed', {
			univector: data.mynewvector
		});
	})
	
	socket.on('setcontrol', function(data){
		presentation.emit('set-orbit-up', {
			passedcamera: data.camerapass,
			newcontrols: data.thecontrols
		});
	})
	
	socket.on('updatecontrols', function(data){
		presentation.emit('update-control-server', {
			passedcamera: data.camerapass,
			newcontrols: data.thecontrols,
			newtarget: data.myTarget
		});
	})

	// Clients send the 'slide-changed' message whenever they navigate to a new slide.

	socket.on('slide-changed', function(data){

		// Check the secret key again

		if(data.key === secret) {
			// Tell all connected clients to navigate to the new slide
			presentation.emit('navigate', {
				hash: data.hash
			});
		}

	});

});

console.log('Your presentation is now running on http://localhost:' + port);