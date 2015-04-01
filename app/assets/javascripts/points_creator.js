var rawEvent, acc; //motion data passed by fulltilt
var screenAcc; //motion data passed by fulltilt

var acc_x, acc_y, pos_x, pos_y, velocity_x, velocity_y; 

var accel = [];
var vel = [];
var pos = [];
//var times = [0];
var times = new Array();

var t, time0, timeT;


var alpha;

var deviceMotion, deviceOrientation;

//var rate = 0.1;
var consec_stopsX, consec_stopsY;


var recentX = [];
var recentY = [];

var medianX, medianY;

var MedianBufferLength = 3;

function start_tracking() {

	acc_x = 0;
    acc_y = 0;
    pos_x = 0;
    pos_y = 0;
    velocity_x = 0;
    velocity_y = 0;
    consec_stopsX = 0;
    consec_stopsY = 0;

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

			//rawEvent = motionData.getLastRawEventData();

			//acc = rawEvent.acceleration || {};

			screenAcc = motionData.getScreenAdjustedAcceleration() || {};
			times.push(timeT);

			if (Math.abs(screenAcc.x) > 0.1) 
				acc_x = screenAcc.x;
			else {
				acc_x = 0; 
				consec_stopsX++;
			} 
			
			if (Math.abs(screenAcc.y) > 0.1) 
				acc_y = screenAcc.y;
			else {
				acc_y = 0; 
				consec_stopsY++;
			} 

			var a = {x:acc_x, y:acc_y};
			accel.push(a);

			if (consec_stopsX == 5) {
				velocity_x = 0;
				consec_stopsX = 0;
			}
			
			if (consec_stopsY == 5) {
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

			var v = {x:velocity_x, y:velocity_y};
			vel.push(v);

			pos_x += (0.5*medianX*t*t) + velocity_x*t;
			pos_y += (0.5*medianY*t*t) + velocity_y*t;
			var p = {x:pos_x, y:pos_y};
			vel.push(p);

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
	//draw_chart();
}

function draw_chart() {

	var ctx = document.getElementById("myChart").getContext("2d");


	var data = {
		//labels: ["January", "February", "March", "April", "May", "June", "July"],
		labels: times,
		datasets: [
			{
				label: "My First dataset",
				fillColor: "rgba(220,220,220,0.2)",
				strokeColor: "rgba(220,220,220,1)",
				pointColor: "rgba(220,220,220,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				//data: [65, 59, 80, 81, 56, 55, 40]
				data: accel
			},
			{
				label: "My Second dataset",
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(151,187,205,1)",
				//data: [28, 48, 40, 19, 86, 27, 90]
				data: vel
			}
		]
	};
	var myLineChart = new Chart(ctx).Line(data);

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


var save = function save()
{
    //clear arrays between points 
    recentX = [];
    recentY = [];

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

