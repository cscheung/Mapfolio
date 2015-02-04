$( document ).ready(function() 
{
    document.getElementById("calibrate").onclick=function(){calibrate()};
    document.getElementById("start_tracking").onclick=function(){start_tracking()};
});

//Objects to store values
var accelerometer_active = {x:0, y:0, z:0};
var gyroscope_active = {alpha:0, beta:0, gamma:0}; 
//These will be set once to hold the origin position
var accelerometer_origin = {x:0, y:0, z:0};
var gyroscope_origin = {alpha:0, beta:0, gamma:0}; 

//Simple tracking function that outputs values to the js
//variables instead of directly shoing onto HTML page
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

//Take a 'snapshot', save current values as origin
//ment to be done once at beginning
function calibrate()
{
    gyroscope_origin.alpha = gyroscope_active.alpha;
    gyroscope_origin.beta = gyroscope_active.beta;
    gyroscope_origin.gamma = gyroscope_active.gamma;
    
    accelerometer_origin.x = accelerometer_active.x;
    accelerometer_origin.y = accelerometer_active.y;
    accelerometer_origin.z = accelerometer_active.z;
}

//Getter for th js variables of gyro and acc.
function get_values()
{
	 return [accelerometer_active, gyroscope_active];	
}

//Simple output, will eventually put everythign into a MODEL
//Note that its output is the current values subtrated from the origin
function put_values_in_view()
{

	put_single_value_in_view(0, "x");
	put_single_value_in_view(0, "y");
	put_single_value_in_view(0, "z");

	put_single_value_in_view(1, "alpha");
	put_single_value_in_view(1, "beta");
	put_single_value_in_view(1, "gamma");
}

//Helper function for put_values_in_view, but both of these are
//just for output unti we figure out a more ruby-esque way to
//make the elements and talk to them
function put_single_value_in_view(gyro_or_acc, element_name)
{

	var current_values = get_values();
	var difference = accelerometer_origin.x - current_values[gyro_or_acc][element_name];
	
	if (-.3 < difference < .3)
	{
		difference = 0;
	}

	document.getElementById(element_name).innerHTML = difference;
}
	
