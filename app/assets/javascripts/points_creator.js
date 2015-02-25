var screenAcc;
var acc_x, acc_y, pos_x, pos_y, velocity_x, velocity_y;

var prev_acc_x, prev_acc_y;

var interpolated_x, interpolated_y, t, time0, timeT;

var alpha;

var deviceMotion, deviceOrientation;

var rate = 0.1;
var consec_stops = 0;


function start_tracking() {

	acc_x = 0;
    acc_y = 0;
    prev_acc_x = 0;
    prev_acc_y = 0;
    pos_x = 0;
    pos_y = 0;
    velocity_x = 0;
    velocity_y = 0;


	deviceOrientation = FULLTILT.getDeviceOrientation({'type': 'world'});
	deviceOrientation.then(function(orientationData) {	


		orientationData.listen(function() {

			// Display calculated screen-adjusted deviceorientation

			var screenAdjustedEvent = orientationData.getFixedFrameEuler();

			alpha = screenAdjustedEvent.alpha;

		});

	});


	var d = new Date();
    time0 = d.getTime();

    deviceMotion = FULLTILT.getDeviceMotion();
	deviceMotion.then(function(motionData) {

		motionData.listen(function() {

			var d2 = new Date();
			timeT = d2.getTime();

			t = (timeT - time0) * 0.001;

			screenAcc = motionData.getScreenAdjustedAcceleration() || {};

			acc_x = Math.round((screenAcc.x)*100)/100;
			acc_y = Math.round((screenAcc.y)*100)/100;
			//acc_x = (prev_acc_x * rate) + (acc_x * (1 - rate));

			//interpolated_x = (prev_acc_x + acc_x) / 2;
            //interpolated_y = (prev_acc_y + acc_y) / 2;

			if (acc_x > 0.005) {
				consec_stops = 0;
				//velocity_x += interpolated_x * t;
				//velocity_y += interpolated_y * t;
				velocity_x += acc_x*t;
				velocity_y += acc_x*t;
				//if (acc_x < prev_acc_x) {
					//velocity_x *= (1-rate);
				//}
			}
			else {
				consec_stops += 1;
				if (consec_stops > 5) {
					velocity_x = 0;
				}
				acc_x = 0;
			}

			if (velocity_x > 0.001) {
				//pos_x += (0.5*interpolated_x*t*t) + velocity_x*t;
				//pos_y += (0.5*interpolated_y*t*t) + velocity_y*t;
				pos_x += (0.5*acc_x*t*t) + velocity_x*t;
				pos_y += (0.5*acc_y*t*t) + velocity_y*t;
			}
			else {
				velocity_x = 0;
			}

/*
			if (acc_x > 0.1) {
				velocity_x += interpolated_x * t;
				velocity_y += interpolated_y * t;
			}
			else {
				acc_x = 0;
			}
*/

            prev_acc_x = acc_x;
            prev_acc_y = acc_y;

            time0 = timeT;

            put_values_in_view();
            
		});

	});
}

function stop_tracking()
{
	deviceMotion.then(function(motionData) {

		motionData.stop();

	});
}



function put_values_in_view()
{
	//document.getElementById("accelerometer_x").innerHTML = "acc X = " + interpolated_x;
    document.getElementById("accelerometer_x").innerHTML = "acc X = " + acc_x;
	document.getElementById("accelerometer_y").innerHTML = "acc Y = " + acc_y;
	//document.getElementById("accelerometer_y").innerHTML = "acc Y = " + interpolated_y;
	document.getElementById("accelerometer_z").innerHTML = "acc Z = " + screenAcc.z;
	document.getElementById("velocity_x").innerHTML = "Velocity X = " + velocity_x;
	document.getElementById("velocity_y").innerHTML = "Velocity Y = " + velocity_y;
    document.getElementById("pos_x").innerHTML = "Position x = " + pos_x;
	document.getElementById("pos_y").innerHTML = "Position y = " + pos_y;
	document.getElementById("t").innerHTML = "t = " + t;
}


var save = function save()
{
    //DO fancy math to convert this into x, y, angle
    enter_into_database(pos_x, pos_y, alpha);
}

function enter_into_database(x_in, y_in, angle_in)
{
    $.ajax({
           type:'POST', 
           url: '/points', 
           data: $.param({ point: {x: x_in, y: y_in, angle: angle_in}})
      });
 
}