var deviceMotion, deviceOrientation;
var rawEvent, acc; //motion data passed by fulltilt
var rawAcc; //motion data passed by fulltilt

var acc_x, acc_y, acc_z, pos_x, pos_y, velocity_x, velocity_y; 

var t, time0, timeT;

var alpha, beta, gamma;

var consec_stopsX, consec_stopsY;

var recentX = [];
var recentY = [];

var medianX, medianY;

var MedianBufferLength = 21;

var name;
var points = [];
var startFlag = 0;

$( window ).load(function() { start_up();})

function start_up()
{
  $('#helpModal').modal('show');
  start_tracking();
}
function start_tracking() {

	pos_x=0;
	pos_y=0;
	velocity_x = 0;
    velocity_y = 0;
    consec_stopsX = 0;
    consec_stopsY = 0;
    position_time = 0;
	
	deviceOrientation = FULLTILT.getDeviceOrientation({'type': 'world'});
	deviceOrientation.then(function(orientationData) {	


		orientationData.listen(function() {

			var rawEvent = orientationData.getFixedFrameEuler();

			alpha = rawEvent.alpha;

			beta = rawEvent.beta;

			gamma = rawEvent.gamma;

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

			rawEvent = motionData.getLastRawEventData();

			rawAcc = rawEvent.accelerationIncludingGravity || {};

			var quat = new FULLTILT.Quaternion();
 			quat.rotateX((360-beta) * (Math.PI / 180));
 			quat.rotateY((360-gamma) * (Math.PI / 180));
 			quat.rotateZ((360-alpha) * (Math.PI / 180));
 			var matrix = new FULLTILT.RotationMatrix();
 			matrix.setFromQuaternion(quat);
			var new_x = matrix.elements[0]*rawAcc.x + matrix.elements[3]*rawAcc.y + matrix.elements[6]*rawAcc.z;
 			var new_y = matrix.elements[1]*rawAcc.x + matrix.elements[4]*rawAcc.y + matrix.elements[7]*rawAcc.z;
 			var new_z = matrix.elements[2]*rawAcc.x + matrix.elements[5]*rawAcc.y + matrix.elements[8]*rawAcc.z;

 			acc_z = new_z;

			if (Math.abs(new_x) > 0.1) {
				acc_x = new_x;
				consec_stopsX = 0;
			}
			else {
				acc_x = 0; 
				consec_stopsX++;
			} 
			
			if (Math.abs(new_y) > 0.1) { 
				acc_y = new_y;
				consec_stopsX = 0;
			}
			else {
				acc_y = 0; 
				consec_stopsY++;
			} 

			if ((consec_stopsX == 5) || (consec_stopsY == 5)) {
				velocity_x = 0;
				consec_stopsX = 0;
				velocity_y = 0;
				consec_stopsY = 0;
			}

			recentX.push(acc_x);
			recentY.push(acc_y);
			
			if (recentX.length > MedianBufferLength) recentX.shift();
			if (recentY.length > MedianBufferLength) recentY.shift();

			var tempRecentX = recentX.slice(0);
			var tempRecentY = recentY.slice(0);	//clone array to preserve unsorted values

			medianX = tempRecentX.sort(compareNumbers)[Math.floor(recentX.length/2)];
    		medianY = tempRecentY.sort(compareNumbers)[Math.floor(recentY.length/2)];
 
			velocity_x += medianX*t;
			velocity_y += medianY*t;

			pos_x += (0.5*medianX*t*t) + velocity_x*t;
			pos_y += (0.5*medianY*t*t) + velocity_y*t;

            time0 = timeT;

            //put_values_in_view();
            //show_tracking_text();
            
		});

	});
}

function stop_tracking()
{
	if (startFlag) 
	{
		deviceMotion.then(function(motionData) {
			motionData.stop();
		});
	}
	startFlag = 0;
}

function compareNumbers(a, b) {
  return a - b;
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
	document.getElementById("t").innerHTML = "t = " + t;
}


function show_tracking_text()
{
  document.getElementById("tracking").innerHTML = "Currently Tracking...";
}

var save = function save()
{
  //If this is the first save, call
  //start_tracking()
    //clear arrays between points 
    if (startFlag == 0)	{
		pos_x = 0;
		pos_y = 0;
		velocity_x = 0;
    velocity_y = 0;
    consec_stopsX = 0;
    consec_stopsY = 0;
    
    startFlag = 1;
    
    document.getElementById("secondinst").style.visibility="visible";
    }


    recentX = [];
    recentY = [];

    var new_point = 
    {
        angle: 90-alpha, 
        x: pos_x*100, 
        y: pos_y*100
    };
        
    points.push(new_point);
    //document.getElementById("lasta").innerHTML = "lasta= " + alpha;
    //document.getElementById("lastx").innerHTML = "lastx = " + pos_x;
	//document.getElementById("lasty").innerHTML = "lasty= " + pos_y;
    window.setTimeout(function () {
      $("#myAlert2").addClass("in");
    }, 0);
    
    window.setTimeout(function () {
      $("#myAlert2").removeClass("in");
    }, 3000);
}


function done()
{
	stop_tracking();
    var $inputs = $('#new_floorplan :input');
    var values = {};
    $inputs.each(function() {
        values[this.name] = $(this).val();
    });
    
    var name = values["floorplan[name]"];
    make_floorplan(name, points);
    points = [];
}
