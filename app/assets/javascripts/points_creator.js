var rawEvent, acc; //motion data passed by fulltilt
var screenAcc; //motion data passed by fulltilt

var acc_x, acc_y, acc_z, pos_x, pos_y, velocity_x, velocity_y; 

var accel = [];
var vel = [];
var pos = [];
//var times = [0];
var times = new Array();

var point_num; //used in data file name creation 
var filedata = []; //array for the data file

var t, time0, timeT;


var alpha;

var deviceMotion, deviceOrientation;

//var rate = 0.1;
var consec_stopsX, consec_stopsY, consec_stopsZ;


var recentX = [];
var recentY = [];
var recentZ = [];

var medianX, medianY;

var MedianBufferLength = 3;

function start_tracking() {

	point_num = 1; //used in data file name creation
	count=0;
	totx=0;
	toty=0;
	totz=0;
	acc_x = 0;
    acc_y = 0;
    acc_z = 0;
    pos_x = 0;
    pos_y = 0;
    velocity_x = 0;
    velocity_y = 0;
    consec_stopsX = 0;
    consec_stopsY = 0;
    consec_stopsZ = 0;

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
    time00 = d.getTime(); 
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
				acc_x = screenAcc.x;
				//acc_x = 0; 
				consec_stopsX++;
			} 
			
			if (Math.abs(screenAcc.y) > 0.1) 
				acc_y = screenAcc.y;
				
			else {
				//acc_y = 0; 
				acc_y = screenAcc.y;
				consec_stopsY++;
			} 
			if (Math.abs(screenAcc.z) > 0.1) 
				acc_z = screenAcc.z;
			else {
				//acc_z = 0; 
				acc_z = screenAcc.z;
				consec_stopsZ++;
			} 
			var a = {x:acc_x, y:acc_y};
			accel.push(a);

			if (consec_stopsX == 15) {
				velocity_x = 0;
				consec_stopsX = 0;
			}
			
			if (consec_stopsY == 15) {
				velocity_y = 0;
				consec_stopsY = 0;
			}
			if (consec_stopsZ == 15) {
				velocity_Z = 0;
				consec_stopsZ = 0;
			}

			recentX.push(acc_x);
			recentY.push(acc_y);
			recentZ.push(acc_z);
			
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
			distxy=Math.pow(pos_x,2)+Math.pow(pos_y,2);
            distxy=Math.sqrt(distxy);
			var p = {x:pos_x, y:pos_y};
			vel.push(p);
			count++;
			toty = toty+acc_y;
			avgy=toty/count;
            time0 = timeT;

            filedata.push({acc_x: acc_x, acc_y: acc_y, velocity_x: velocity_x, velocity_y: velocity_y, t: t})

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
	var d = new Date();
    timeTot = d.getTime();
    timeTot = (timeTot - time00) / 1000;
    avgTime=timeTot/count;
    document.getElementById("alpha").innerHTML = "Alpha = " + alpha;
    //document.getElementById("accelerometer_x").innerHTML = "Acc X = " + acc_x;
	//document.getElementById("accelerometer_y").innerHTML = "Acc Y = " + acc_y;
	document.getElementById("accelerometer_x").innerHTML = "accelerometer_x: " + acc_x;
    document.getElementById("accelerometer_y").innerHTML = "accelerometer_y: " + acc_y;
    document.getElementById("accelerometer_z").innerHTML = "accelerometer_z: " + acc_z;
	document.getElementById("velocity_x").innerHTML = "Velocity X = " + velocity_x;
	document.getElementById("velocity_y").innerHTML = "Velocity Y = " + velocity_y;
	//document.getElementById("velocity_z").innerHTML = "Velocity Z = " + velocity_z;
    document.getElementById("pos_x").innerHTML = "Position x = " + pos_x;
	document.getElementById("pos_y").innerHTML = "Position y = " + pos_y;
	document.getElementById("t").innerHTML = "t = " + t;
	document.getElementById("time").innerHTML = "Time elapsed: " + timeTot;
    document.getElementById("toty").innerHTML = "toty = " + toty;
    document.getElementById("avgy").innerHTML = "avgy = " + avgy;
    document.getElementById("count").innerHTML = "count = " + count;
    document.getElementById("avgTime").innerHTML = "avgTime = " + avgTime;
    yshould=avgy*timeTot;
    document.getElementById("yshould").innerHTML = "yshould = " + yshould;
    document.getElementById("distxy").innerHTML = "distxy = " + distxy;

}


filedata.toString = function()
{
    var dataArray = new Array();
    for (var i in this) {
        dataArray[i] = this[i].acc_x + ", " + this[i].acc_y + "," + this[i].velocity_x + "," + this[i].velocity_y + "," + this[i].t;
    }
    return dataArray.join('\n');
}

// create a new instance of the Mandrill class with your API key
var m = new mandrill.Mandrill('eVDNliTXRLG4XfxZhYKjDQ');

var params;
//<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
var save = function save()
{
    //clear arrays between points 
    recentX = [];
    recentY = [];

    enter_into_database(pos_x*100, pos_y*100, alpha);

	//download(filedata.toString(), "point" + point_num + ".csv", "text/plain");
	//filedata.length = 0; //clear array

	//send an email
/*
    window.onload = function() {
      var txt = document.getElementById('txt');
      txt.value = window.onload + '';
      document.getElementById('link').onclick = function(code) {
        this.href = 'data:text/plain;charset=utf-8,'
          + encodeURIComponent(txt.value);
      };
    };
*/
	var sub = "subject"
	params = {
		"message": {
			"from_email":"mzq.qiu@gmail.com",
			"to":[{"email":"mzq.qiu@gmail.com"}],
			"subject": sub,
			"text": filedata.toString()
/*
			"attachments": [
			{
				"type": "text/plain",
				"name": "point" + point_num + ".csv",
				"content": "ZXhhbXBsZSBmaWxl"
			}
			],
*/
		}
	};
	filedata.length = 0;

	point_num++;
	sendTheMail();
}

// Create a function to log the response from the Mandrill API
function log(obj) {
    $('#response').text(JSON.stringify(obj));
}
// create a variable for the API call parameters
function sendTheMail() {
// Send the email!

    m.messages.send(params, function(res) {
        log(res);
    }, function(err) {
        log(err);
    });
}
// end

function enter_into_database(x_in, y_in, angle_in)
{
    $.ajax({
           type:'POST', 
           url: '/points', 
           data: $.param({ point: {x: x_in, y: y_in, angle: angle_in}})
      });
 
}

function download(strData, strFileName, strMimeType) {
    var D = document,
        A = arguments,
        a = D.createElement("a"),
        d = A[0],
        n = A[1],
        t = A[2] || "text/plain";

    //build download link:
    a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


    if (window.MSBlobBuilder) { // IE10
        var bb = new MSBlobBuilder();
        bb.append(strData);
        return navigator.msSaveBlob(bb, strFileName);
    } /* end if(window.MSBlobBuilder) */



    if ('download' in a) { //FF20, CH19
        a.setAttribute("download", n);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function() {
            var e = D.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    }; /* end if('download' in a) */



    //do iframe dataURL download: (older W3)
    var f = D.createElement("iframe");
    f.setAttribute('selectable', 1);
    D.body.appendChild(f);
    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    // setTimeout(function() {
    //     D.body.removeChild(f);
    // }, 333);
    return true;
}



