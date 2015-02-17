function stop_tracking()
{
	var screenAccX = document.getElementById("accelerometer_x");
	var screenAccY = document.getElementById("accelerometer_y");
	var screenAccZ = document.getElementById("accelerometer_z");

	screenAccX.innerHTML = "Stopped";
	screenAccY.innerHTML = "Stopped";
	screenAccZ.innerHTML = "Stopped";
}

function printDataValue(input) {
	if( input === undefined )
		return "undefined";
	if( input === null )
		return "null";
	if( input === true )
		return "true";
	if( input === false )
		return "false";
	if( Object.prototype.toString.call(input) === "[object Number]" )
		return Math.round((input + 0.00001) * 100) / 100; // return to 2 decimal places

	return (input + ""); // force stringify
}

function start_tracking() {

	var screenAccX = document.getElementById("accelerometer_x");
	var screenAccY = document.getElementById("accelerometer_y");
	var screenAccZ = document.getElementById("accelerometer_z");

	// Start FULLTILT DeviceMotion listeners and register our callback
	var deviceMotion = FULLTILT.getDeviceMotion();
	deviceMotion.then(function(motionData) {

		// Checking availability
	//	accXAvl.textContent = (motionData.isAvailable(motionData.ACCELERATION_X)) ? '+' : '-' ;
	//	accYAvl.textContent = (motionData.isAvailable(motionData.ACCELERATION_Y)) ? '+' : '-' ;
	//	accZAvl.textContent = (motionData.isAvailable(motionData.ACCELERATION_Z)) ? '+' : '-' ;

	//	rotRateAlphaAvl.textContent = (motionData.isAvailable(motionData.ROTATION_RATE_ALPHA)) ? '+' : '-' ;
	//	rotRateBetaAvl.textContent = (motionData.isAvailable(motionData.ROTATION_RATE_BETA)) ? '+' : '-' ;
	//	rotRateGammaAvl.textContent = (motionData.isAvailable(motionData.ROTATION_RATE_GAMMA)) ? '+' : '-' ;

		motionData.listen(function() {

			// Display calculated screen-adjusted devicemotion

			var screenAcc = motionData.getScreenAdjustedAcceleration() || {};

			screenAccX.innerHTML = "acc X = " + printDataValue(screenAcc.x);
			screenAccY.innerHTML = "acc Y = " + printDataValue(screenAcc.y);
			screenAccZ.innerHTML = "acc Z = " + printDataValue(screenAcc.z);

		});

	});

}

