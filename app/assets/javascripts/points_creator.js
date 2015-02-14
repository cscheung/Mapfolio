
var accelerometer_x = 30;
var accelerometer_y = 30;
var accelerometer_z = 30;
var gyroscope_alpha = 30;
var gyroscope_beta = 30;
var gyroscope_gamma = 30;

function start_tracking()
{
    gyro.frequency = 100;
    
    gyro.startTracking(function(o) 
    {
   		accelerometer_x = Number((o.x).toFixed(1));
        accelerometer_y = Number((o.y).toFixed(1));
        accelerometer_z = Number((o.z).toFixed(1));
   
        gyroscope_alpha = Number((o.alpha).toFixed(1));
        gyroscope_beta = Number((o.beta).toFixed(1));
        gyroscope_gamma = Number((o.gamma).toFixed(1));

		put_values_in_view();     
    });
}

function stop_tracking()
{
    gyro.stopTracking();
}

function put_values_in_view()
{
	document.getElementById("accelerometer_x").innerHTML = accelerometer_x;
	document.getElementById("accelerometer_y").innerHTML = accelerometer_y;
	document.getElementById("accelerometer_z").innerHTML = accelerometer_z;
	document.getElementById("gyroscope_alpha").innerHTML = gyroscope_alpha;
	document.getElementById("gyroscope_beta").innerHTML = gyroscope_beta;
	document.getElementById("gyroscope_gamma").innerHTML = gyroscope_gamma;
}

var save = function save()
{
    //DO fancy math to convert this into x, y, angle
    enter_into_database(gyroscope_alpha, gyroscope_beta, gyroscope_gamma);
}

function enter_into_database(x_in, y_in, angle_in)
{
    $.ajax({
           type:'POST', 
           url: '/points', 
           data: $.param({ point: {x: x_in, y: y_in, angle: angle_in}})
      });
 
}