$( document ).ready(function() 
{
    document.getElementById("calibrate").onclick=function(){calibrate()};
    document.getElementById("start_tracking").onclick=function(){start_tracking()};
});

//Objects to store values
var accelerometer_active = {x:0, y:0, z:0};
var gyroscope_active = {alpha:0, beta:0, gamma:0}; 
//Tese will be set once to hold the origin position
var accelerometer_origin = {x:0, y:0, z:0};
var gyroscope_origin = {alpha:0, beta:0, gamma:0}; 

function start_tracking()
{
    gyro.frequency = 100;
    
    gyro.startTracking(function(o) 
    {
   		accelerometer_active.x = Number((o.x).toFixed(1));
        accelerometer_active.y = Number((o.y).toFixed(1));
        accelerometer_active.z = Number((o.z).toFixed(1));
   
        gyroscope_active.alpha = Number((o.alpha).toFixed(1));
        gyroscope_active.beta = Number((o.beta).toFixed(1));
        gyroscope_active.gamma = Number((o.gamma).toFixed(1));

		put_values_in_view();     
    });
}

function stop_tracking()
{
    gyro.stopTracking();
}

function calibrate()
{
    gyroscope_origin.alpha = gyroscope_active.alpha;
    gyroscope_origin.beta = gyroscope_active.beta;
    gyroscope_origin.gamma = gyroscope_active.gamma;
    
    accelerometer_origin.x = accelerometer_active.x;
    accelerometer_origin.y = accelerometer_active.y;
    accelerometer_origin.z = accelerometer_active.z;
}

function get_values()
{
	 return [accelerometer_active, gyroscope_active];	
}

function put_values_in_view()
{
	var current_values = get_values();
	document.getElementById("x").innerHTML=current_values[0].x;
	document.getElementById("y").innerHTML=current_values[0].y;
	document.getElementById("z").innerHTML=current_values[0].z;
	document.getElementById("alpha").innerHTML=current_values[1].alpha;
	document.getElementById("beta").innerHTML=current_values[1].beta;
	document.getElementById("gamma").innerHTML=current_values[1].gamma;
}
	
