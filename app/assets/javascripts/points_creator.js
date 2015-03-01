var rawEvent, acc; //motion data passed by fulltilt

var acc_x, acc_y, pos_x, pos_y, velocity_x, velocity_y; 

var t, time0, timeT;


var alpha;

var deviceMotion, deviceOrientation;

var rate = 0.1;
var consec_stops = 0;


var recentX = [];
var recentY = [];

var medianX, medianY;

var MedianBufferLength = 7;

var distance;

function start_tracking() {

	acc_x = 0;
    acc_y = 0;
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

			var d = new Date();
			timeT = d.getTime();
			t = (timeT - time0) * 0.001;

			rawEvent = motionData.getLastRawEventData();

			acc = rawEvent.acceleration || {};

			acc_x = (Math.abs(acc.x) > 0.1) ? acc.x : 0;
			acc_y = (Math.abs(acc.y) > 0.1) ? acc.y : 0;

			recentX.push(acc_x);
			recentY.push(acc_y);
			
			if (recentX.length > MedianBufferLength) recentX.shift();
			if (recentY.length > MedianBufferLength) recentY.shift();

			var tempRecentX = recentX.slice(0);
			var tempRecentY = recentY.slice(0);	//clone array to preserve unsorted values

			medianX = tempRecentX.sort(compareNumbers)[Math.floor(recentX.length/2)];
    		medianY = tempRecentY.sort(compareNumbers)[Math.floor(recentY.length/2)];

    		if ((medianX == 0) && (medianY == 0)) { //at least MedianBufferLength/2 + 1 consequtive values of acceleration in x and y direction are 0 - the phone is still?
    			velocity_x = 0;
    			velocity_y = 0;
    		}
 
			velocity_x += medianX*t;
			velocity_y += medianY*t;

			pos_x += (0.5*medianX*t*t) + velocity_x*t;
			pos_y += (0.5*medianY*t*t) + velocity_y*t;

			distance = Math.sqrt(pos_x*pos_x+pos_y*pos_y);

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

function compareNumbers(a, b) {
  return b - a;
}


function put_values_in_view()
{
    document.getElementById("alpha").innerHTML = "Alpha = " + alpha;
    document.getElementById("accelerometer_x").innerHTML = "Acc X = " + acc_x;
	document.getElementById("accelerometer_y").innerHTML = "Acc Y = " + acc_y;
	document.getElementById("velocity_x").innerHTML = "Velocity X = " + velocity_x;
	document.getElementById("velocity_y").innerHTML = "Velocity Y = " + velocity_y;
    document.getElementById("pos_x").innerHTML = "Position x = " + pos_x;
	document.getElementById("pos_y").innerHTML = "Position y = " + pos_y;
	document.getElementById("t").innerHTML = "Distance = " + distance;
}


var save = function save()
{
    //DO fancy math to convert this into x, y, angle
    enter_into_database(pos_x*100, pos_y*100, alpha);
}

function enter_into_database(x_in, y_in, angle_in)
{
    $.ajax({
           type:'POST', 
           url: '/points', 
           data: $.param({ point: {x: x_in, y: y_in, angle: angle_in}})
      });
 
}