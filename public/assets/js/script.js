$(function() {
	
	// local - be sure to add port :8080 on mobile
	// Connect to the socket
	var socket = io();
	// Variable initialization
	//http://10.1.10.195:8080
	//https://guarded-mesa-11997.herokuapp.com/

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
			
			var w = window.innerWidth;
			
			if(w>1000){
				
			}
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
			//animate();
			
			function fullInit(){
				
				var w = window.innerWidth;
			
				if(w>1000){
					document.getElementById('road').play();
				}
				
				
				var timeArray = [8000, 11200, 19000, 15000, 15000, 13000, 13000, 17000, 18000, 10000, 13000, 25000, 9000000];
				var rotateArray = [110, 170, 240, 60, 10, 170, 60, 190, 190, 150, 120, 90, 0]
				var currVideo = 0;
				var switchTimer = setInterval(myTimer, timeArray[currVideo]);
				// congo 110: 8000
				// moosehead1 170: 16000
				// pemaquid 240: 20000
				// sebago1 60: 23000
				// moosehead2 10: 20000
				// rosier 170: 13000
				// sand 60: 13000
				// sebago2 190: 17000
				// cadillac 190: 18000
				// bakeman 150: 10000
				// kitten 120 : 13000
				// house 90: 25000
				function myTimer(){
					currVideo++;
					switchVideo();
				}
				function myTimer(){
					currVideo++;
					switchVideo();
				}

				var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
				// invert the geometry on the x-axis so that all of the faces point inward
				geometry.scale( - 1, 1, 1 );
				geometry.center();
			
				var ran = Math.round(Math.random()*3);
				
				var srcArray = ['congo1.mp4', 'moosehead_1.mp4', 'pemaquid1.MP4', 'sebago1.mp4', 'moosehead2_1.mp4', 'rosier.mp4', 'sand.mp4', 'sebago2.mp4', 'cadillac.mp4', 'bakeman.mp4', 'kitten.mp4', 'house.mp4']
				//var srcArray = ['congo.MP4', 'moosehead_1.MP4', 'moosehead2_1.MP4', 'pemaquid.MP4', 'kitten.mp4', 'house.mp4', 'rosier.mp4', 'sebago1.mp4', 'sand.mp4', 'cadillac.mp4', 'bakeman.mp4', 'kitten.mp4', 'sebago2.mp4'];
				var vidsrc = 'assets/textures/' + srcArray[currVideo];
			
				//alert(vidsrc + "revision1");

				var video = document.createElement( 'video' );
				video.crossOrigin = 'anonymous';
				video.width = 640;
				video.height = 360;
				video.loop = true;
				video.muted = true;
				video.src = vidsrc;
				video.setAttribute( 'playsinline', '' );
				//video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
				video.play();

				//var texture = new THREE.TextureLoader().load( "assets/textures/monson.JPG" );

				var texture = new THREE.VideoTexture( video );
				texture.minFilter = THREE.LinearFilter;
				texture.format = THREE.RGBFormat;

				var material   = new THREE.MeshBasicMaterial( { map : texture } );

				mesh = new THREE.Mesh( geometry, material );

				scene.add( mesh );
				
				var radians = THREE.Math.degToRad( rotateArray[currVideo] );
				mesh.rotation.y = radians;
				
				controls = new THREE.OrbitControls( camera );
				camera.position.set( 0, 20, 100 );
				controls.update();

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );
				
				function switchVideo(){
					
					$("#container").fadeOut(200);
					$("#container").delay(1000).fadeIn(500);
					
					$("#div2").fadeIn("slow");

					clearInterval(switchTimer);
					switchTimer = setInterval(myTimer, timeArray[currVideo]);
					vidsrc = 'assets/textures/' + srcArray[currVideo];
					video.src = vidsrc;
					video.play();
					var radians = THREE.Math.degToRad( rotateArray[currVideo] );
					//console.log(radians)
					//mesh.center();
					mesh.rotation.y = radians;
					//geometry.rotation.set(new THREE.Vector3( 0, 0, radians));
					
				}
			}
			

			function init() {
				texture_placeholder = document.getElementById( 'container' );
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
				camera.target = new THREE.Vector3( 0, 0, 0 );
				
				$("#startbutton").show();
				
				var w = window.innerWidth;
			
				if(w>800){
					$("#prompt").show();
				}
				
				
			    
				
				
				scene = new THREE.Scene();
				
				
			}
			
			function animate()  {

					requestAnimationFrame( animate );
					update();

			}


			function update() {
					
				var alphaBetaGamma = {a:1, b:2, g:3, o:0};
				controls.update();
				renderer.render( scene, camera );

			}

			var check = false;
			var numberTest = 1;
			form.hide();
			var ignore = false;
			
		    $("#startbutton").on('click', function () {
				socket.emit('clickedstart', {
					blah: ''
				});
				
		    });
			
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
					var alphaBetaGamma = {a:alpha, b:beta, g:gamma, o:orient};
					// main control to send to socket
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
			
			socket.on('sendControls', function(data){

				$("#startbutton").hide();
				fullInit();
				animate();
				
				/*document.dispatchEvent(new CustomEvent("getCoords", {
					    detail: { coords: _motionAngleObject }
				}));*/
				
				// PROD
				//cameraUpdate();

			});

		}
		else {

			clearTimeout(animationTimeout);
			secretTextBox.addClass('denied animation');
			animationTimeout = setTimeout(function(){
				secretTextBox.removeClass('animation');
			}, 1000);

			form.show();
		}

	});

});