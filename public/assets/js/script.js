$(function() {
	
	// local - be sure to add port :8080 on mobile
	// Connect to the socket
	var socket = io();
	// Variable initialization

	var form = $('form.login');
	var secretTextBox = form.find('input[type=text]');
	var key = "", animationTimeout;
	// When the page is loaded it asks you for a key and sends it to the server

	form.submit(function(e){

		e.preventDefault();
		key = secretTextBox.val().trim();
		// If there is a key, send it to the server-side
		// through the socket.io channel with a 'load' event.
		if(key.length) {
			socket.emit('load', {
				key: key
			});
		}

	});

	// The server will either grant or deny access, depending on the secret key
	socket.on('access', function(data){
		
		// Check if we have "granted" access.
		// If we do, we can continue with the presentation.
		//
		//https://stackoverflow.com/questions/37844612/socket-io-with-three-js-sphere-orbitcontrols
		//https://stackoverflow.com/questions/45652502/three-js-socket-io-multiplayer-system
		//look at phone sketch js

		if(data.access === "granted") {
		
			var scope = this;
			var camera, scene, renderer, controls, savedControls, disMobile;
			
			var _motionAngleObject = {a:0, b:0, g:0, o:0};

			var texture_placeholder,
			isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 0, onMouseDownLon = 0,
			lat = 0, onMouseDownLat = 0,
			phi = 0, theta = 0,
			distance = 50,
			onPointerDownPointerX = 0,
			onPointerDownPointerY = 0,
			onPointerDownLon = 0,
			onPointerDownLat = 0;
			disMobile = false;
			
			var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
			if (isMobile) {
				//check = true;
				/*console.log(socket);
				//document.getElementById('numba').innerHTML = "num" + socket;
				socket.emit('devchanged', {
					myalpha: 5
				})*/
				disMobile = true;
			}

			init();
			animate();
			
		
			

			function init() {
				texture_placeholder = document.getElementById( 'container' );
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
				camera.target = new THREE.Vector3( 0, 0, 0 );
				
				
				scene = new THREE.Scene();

				var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
				// invert the geometry on the x-axis so that all of the faces point inward
				geometry.scale( - 1, 1, 1 );
			
				var ran = Math.round(Math.random()*3);
			
				var srcArray = ['congo.MP4', 'moosehead_1.MP4', 'moosehead_1.MP4', 'pemaquid.MP4'];
				var vidsrc = 'assets/textures/' + srcArray[ran];
			
				alert(vidsrc + "revision1");

				var video = document.createElement( 'video' );
				video.crossOrigin = 'anonymous';
				video.width = 640;
				video.height = 360;
				video.loop = true;
				video.muted = true;
				video.src = vidsrc;
				video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
				video.play();
			
				var texture = new THREE.TextureLoader().load( "assets/textures/monson.JPG" );

				//var texture = new THREE.VideoTexture( video );
				//texture.minFilter = THREE.LinearFilter;
				//texture.format = THREE.RGBFormat;

				var material   = new THREE.MeshBasicMaterial( { map : texture } );

				mesh = new THREE.Mesh( geometry, material );

				scene.add( mesh );
				
				controls = new THREE.OrbitControls( camera );
				camera.position.set( 0, 20, 100 );
				controls.update();

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );
				
				
				
				//window.addEventListener( 'resize', onWindowResize, false );
				/*if(disMobile){
					alert('dismobile');
					socket.emit('setcontrol', {
						camerapass: camera,
						thecontrols: controls
					});
				}*/
					
					//update();
			}
			
			function animate()  {

					requestAnimationFrame( animate );
					update();

			}


			function update() {

				/*lat = Math.max( - 85, Math.min( 85, lat ) );
				phi = THREE.Math.degToRad( 90 - lat );
				theta = THREE.Math.degToRad( lon );
				camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
				camera.position.y = distance * Math.cos( phi );
				camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );
				camera.lookAt( camera.target );*/
				
				//DEV
				
				//controls.update();
				//socket.emit('cameraControls', {controls: controls});
				
				/*socket.on('sendControls', function(data){
				    controls = data.controls
				    console.log("got EVENT");
					controls.update();
				});*/
					
					
				var alphaBetaGamma = {a:1, b:2, g:3, o:0};

				//console.log(camera);
				//camera.lookAt( vector );
				
				/*socket.emit('devchanged', {
					mynewvector: alphaBetaGamma
				});*/
				
				controls.update();
				renderer.render( scene, camera );

			}

			var check = false;
			var numberTest = 1;
			form.hide();
			var ignore = false;
			
			window.addEventListener("deviceorientation", handleOrientation, true);
			
			function handleOrientation(event) {
					var absolute = event.absolute;
					var alpha    = event.alpha;
					var beta     = event.beta;
					var gamma    = event.gamma;
					
					var screenOrientation = window.orientation || 0;

					var alpha = event.alpha ? THREE.Math.degToRad(event.alpha) : 0;
					var beta = event.beta ? THREE.Math.degToRad(event.beta) : 0;
					var gamma = event.gamma ? THREE.Math.degToRad(event.gamma) : 0;
					var orient = screenOrientation ? THREE.Math.degToRad(screenOrientation) : 0;
					
					//document.getElementById('numba').innerHTML = "alpha" + Math.round(alpha) + "beta " + Math.round(beta) + "gamma " + Math.round(gamma);
					
					//camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
					//camera.position.y = distance * Math.cos( phi );
					//camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );
					
					var alphaBetaGamma = {a:alpha, b:beta, g:gamma, o:orient};

					//console.log(camera);
					//camera.lookAt( vector );
					
					socket.emit('devchanged', {
						mynewvector: alphaBetaGamma
					});

			  // Do stuff with the new orientation data
			}

			
			
			socket.on('device-changed', function(data){

				
				//console.log(data.univector);
				var alpha = data.univector.a;
				var beta = data.univector.b;
				var gamma = data.univector.g;
				
				
				_motionAngleObject = data.univector;
				
				document.dispatchEvent(new CustomEvent("getCoords", {
					    detail: { coords: _motionAngleObject }
				}));
				
				// PROD
				//cameraUpdate();

			});

		}
		else {

			// Wrong secret key

			clearTimeout(animationTimeout);

			// Addding the "animation" class triggers the CSS keyframe
			// animation that shakes the text input.

			secretTextBox.addClass('denied animation');
			
			animationTimeout = setTimeout(function(){
				secretTextBox.removeClass('animation');
			}, 1000);

			form.show();
		}

	});

});