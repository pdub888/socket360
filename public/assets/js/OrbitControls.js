/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */

THREE.OrbitControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	
	var coordinates = {};
	console.log(coordinates);
	console.log("COORDINATES");
	  
	this.domElement.addEventListener("getCoords", function(event) {
		coordinates = event.detail.coords;
		console.log(event.detail.coords.a + "A");
		//data.univector.a;
		/*document.getElementById('numba').innerHTML = "alpha" + Math.round(alpha) + "beta " + Math.round(beta) + "gamma " + Math.round(gamma);*/
	});

	// Set to false to disable this control
	this.enabled = true;

	// "target" sets the location of focus, where the object orbits around
	this.target = new THREE.Vector3();

	// How far you can dolly in and out ( PerspectiveCamera only )
	this.minDistance = 22;
	this.maxDistance = 26;
	//this.minDistance = 2;
	//this.maxDistance = 5;

	// How far you can zoom in and out ( OrthographicCamera only )
	this.minZoom = 0;
	this.maxZoom = Infinity;

	// How far you can orbit vertically, upper and lower limits.
	// Range is 0 to Math.PI radians.
	//this.minPolarAngle = 1.27; // radians
	//this.maxPolarAngle = 1.97; // radians
	this.minPolarAngle = 1.41; // radians
	this.maxPolarAngle = 1.67; // radians

	// How far you can orbit horizontally, upper and lower limits.
	// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
	this.minAzimuthAngle = - Infinity; // radians
	this.maxAzimuthAngle = Infinity; // radians

	// Set to true to enable damping (inertia)
	// If damping is enabled, you must call controls.update() in your animation loop
	this.enableDamping = false;
	this.dampingFactor = 0.25;

	// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
	// Set to false to disable zooming
	this.enableZoom = true;
	this.zoomSpeed = 1.0;

	// Set to false to disable rotating
	this.enableRotate = true;
	this.rotateSpeed = 1.0;

	// Set to false to disable panning
	this.enablePan = true;
	this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

	// Set to true to automatically rotate around the target
	// If auto-rotate is enabled, you must call controls.update() in your animation loop
	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	// Set to false to disable use of the keys
	this.enableKeys = true;

	// The four arrow keys
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	// Mouse buttons
	this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

	// for reset
	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.zoom0 = this.object.zoom;

	//
	// public methods
	//

	this.getPolarAngle = function () {

		return phi;

	};

	this.getAzimuthalAngle = function () {

		return theta;

	};

	// this method is exposed, but perhaps it would be better if we can make it private...
	this.update = function() {
		
		

		var offset = new THREE.Vector3();
		
		var lastGamma = 0,
	    lastBeta = 0;

		// so camera.up is the orbit axis
		var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
		var quatInverse = quat.clone().inverse();

		var lastPosition = new THREE.Vector3();
		var lastQuaternion = new THREE.Quaternion();

		return function () {

			var position = scope.object.position;

			offset.copy( position ).sub( scope.target );

			// rotate offset to "y-axis-is-up" space
			offset.applyQuaternion( quat );

			// angle from z-axis around y-axis
			spherical.setFromVector3( offset );

			if ( scope.autoRotate && state === STATE.NONE ) {

				rotateLeft( getAutoRotationAngle() );

			}

			spherical.theta += sphericalDelta.theta;
			spherical.phi += sphericalDelta.phi;

			// restrict theta to be between desired limits
			spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );

			// restrict phi to be between desired limits
			spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

			spherical.makeSafe();


			spherical.radius *= scale;

			// restrict radius to be between desired limits
			spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

			// move target to panned location
			scope.target.add( panOffset );

			offset.setFromSpherical( spherical );

			// rotate offset back to "camera-up-vector-is-up" space
			offset.applyQuaternion( quatInverse );

			position.copy( scope.target ).add( offset );
			
			// pdub
			scope.object.lookAt( scope.target );

			if ( scope.enableDamping === true ) {

				sphericalDelta.theta *= ( 1 - scope.dampingFactor );
				sphericalDelta.phi *= ( 1 - scope.dampingFactor );

			} else {

				sphericalDelta.set( 0, 0, 0 );

			}

			scale = 1;
			panOffset.set( 0, 0, 0 );

			// update condition is:
			// min(camera displacement, camera rotation in radians)^2 > EPS
			// using small-angle approximation cos(x/2) = 1 - x^2 / 8

			if ( zoomChanged ||
				lastPosition.distanceToSquared( scope.object.position ) > EPS ||
				8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

				scope.dispatchEvent( changeEvent );

				lastPosition.copy( scope.object.position );
				lastQuaternion.copy( scope.object.quaternion );
				zoomChanged = false;

				return true;

			}
			
	// Gyroscope Additions
			/*if ('undefined' === typeof scope.deviceOrientation) {
				return false;
			}*/
 
			/*var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad(scope.deviceOrientation.alpha) : 0;
			var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad(scope.deviceOrientation.beta) : 0;
			var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad(scope.deviceOrientation.gamma) : 0;
			var orient = scope.screenOrientation ? THREE.Math.degToRad(scope.screenOrientation) : 0;*/
			
			//console.log(coordinates.a + "AAAAA");
			
			//coordinates
			/*var alpha = coordinates.a ? THREE.Math.degToRad(coordinates.a) : 0;
			var beta = coordinates.b ? THREE.Math.degToRad(coordinates.b) : 0;
			var gamma = coordinates.g ? THREE.Math.degToRad(coordinates.g) : 0;
			var orient = coordinates.o ? THREE.Math.degToRad(coordinates.o) : 0;*/
			
			var alpha = coordinates.a;
			var beta = coordinates.b;
			var gamma = coordinates.g;
			var orient = coordinates.o;
 
			var currentQ = new THREE.Quaternion().copy(scope.object.quaternion);
 
			setObjectQuaternion(currentQ, alpha, beta, gamma, orient);
			var currentAngle = Quat2Angle(currentQ.x, currentQ.y, currentQ.z, currentQ.w);
			var radDeg = 180 / Math.PI;
 
			rotateLeft(lastGamma - currentAngle.z);
			lastGamma = currentAngle.z;
 
			rotateUp(lastBeta - currentAngle.y);
			lastBeta = currentAngle.y;
			

			return false;

		};

	}();

	this.dispose = function() {



	};

	//
	// internals
	//

	var scope = this;

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };

	var STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };

	var state = STATE.NONE;

	var EPS = 0.000001;

	// current position in spherical coordinates
	var spherical = new THREE.Spherical();
	var sphericalDelta = new THREE.Spherical();

	var scale = 1;
	var panOffset = new THREE.Vector3();
	var zoomChanged = false;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var panStart = new THREE.Vector2();
	var panEnd = new THREE.Vector2();
	var panDelta = new THREE.Vector2();

	var dollyStart = new THREE.Vector2();
	var dollyEnd = new THREE.Vector2();
	var dollyDelta = new THREE.Vector2();
	
	var setObjectQuaternion = function () {
 
	    var zee = new THREE.Vector3( 0, 0, 1 );
 
	    var euler = new THREE.Euler();
 
	    var q0 = new THREE.Quaternion();
 
	    var q1 = new THREE.Quaternion(  - Math.sqrt( 0.5 ), 0, 0,  Math.sqrt( 0.5 ) );
 
	    return function ( quaternion, alpha, beta, gamma, orient ) {
 
	        euler.set( beta, alpha, - gamma, 'YXZ' );
 
	        quaternion.setFromEuler( euler );
 
	        quaternion.multiply( q1 );
 
	        quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );
 
	    }
 
	}();
	
	function Quat2Angle( x, y, z, w ) {
 
	    var pitch, roll, yaw;
 
	    var test = x * y + z * w;
 
	    if (test > 0.499) {
	        yaw = 2 * Math.atan2(x, w);
	        pitch = Math.PI / 2;
	        roll = 0;
 
	        var euler = new THREE.Vector3( pitch, roll, yaw);
	        return euler;
	    }
 
	    if (test < -0.499) {
	        yaw = -2 * Math.atan2(x, w);
	        pitch = -Math.PI / 2;
	        roll = 0;
	        var euler = new THREE.Vector3( pitch, roll, yaw);
	        return euler;
	    }
 
	    var sqx = x * x;
	    var sqy = y * y;
	    var sqz = z * z;
	    yaw = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz);
	    pitch = Math.asin(2 * test);
	    roll = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz);
 
	    var euler = new THREE.Vector3( pitch, roll, yaw);
 
	    return euler;
	}
	
	function onDeviceOrientationChangeEvent( event ) {
 
	    scope.deviceOrientation = event;
 
	}
 
	function onScreenOrientationChangeEvent( event ) {
 
	    scope.screenOrientation = window.orientation || 0;
 
	}


	function rotateLeft( angle ) {

		sphericalDelta.theta -= angle;

	}

	function rotateUp( angle ) {

		sphericalDelta.phi -= angle;

	}





	//

	
	window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );


};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;


