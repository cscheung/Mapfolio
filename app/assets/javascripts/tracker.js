var acc_x, acc_y, pos_x, pos_y, velocity_x, velocity_y;

var prev_acc_x, prev_acc_y;

var interpolated_x, interpolated_y, t, time0, timeT;

var deviceMotion;

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

	acc_x = 0;
    acc_y = 0;
    prev_acc_x = 0;
    prev_acc_y = 0;
    pos_x = 0;
    pos_y = 0;
    velocity_x = 0;
    velocity_y = 0;

	var d = new Date();
    time0 = d.getTime();

    deviceMotion = FULLTILT.getDeviceMotion();
	deviceMotion.then(function(motionData) {

		motionData.listen(function() {

			var d2 = new Date();
			timeT = d2.getTime();

			t = (timeT - time0) * 0.001;

			// Display calculated screen-adjusted devicemotion

			var screenAcc = motionData.getScreenAdjustedAcceleration() || {};

			acc_x = Math.round((screenAcc.x)*100)/100;
			acc_y = Math.round((screenAcc.y)*100)/100;

			interpolated_x = (prev_acc_x + acc_x) / 2;
            interpolated_y = (prev_acc_y + acc_y) / 2;

            pos_x += (0.5*interpolated_x*t*t) + velocity_x*t;
            pos_y += (0.5*interpolated_y*t*t) + velocity_y*t;

            velocity_x += interpolated_x * t;
            velocity_y += interpolated_y * t;

            prev_acc_x = acc_x;
            prev_acc_y = acc_y;

            time0 = timeT;

            document.getElementById("accelerometer_x").innerHTML = "acc X = " + printDataValue(screenAcc.x);
			document.getElementById("accelerometer_y").innerHTML = "acc Y = " + printDataValue(screenAcc.y);
			document.getElementById("accelerometer_z").innerHTML = "acc Z = " + printDataValue(screenAcc.z);
			document.getElementById("velocity_x").innerHTML = "Velocity X = " + velocity_x;
			document.getElementById("velocity_y").innerHTML = "Velocity Y = " + velocity_y;
            document.getElementById("pos_x").innerHTML = "Position x = " + pos_x;
			document.getElementById("pos_y").innerHTML = "Position y = " + pos_y;
			document.getElementById("t").innerHTML = "t = " + t;
		});

	});
}

function stop_tracking()
{
	deviceMotion.then(function(motionData) {

		motionData.stop();

	});
}

