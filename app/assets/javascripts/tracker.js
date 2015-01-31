function start_tracking()
{
    
	var accelerometer_x;  
	var accelerometer_y;
	var accelerometer_z;

	var gyro_alpha;  
	var gyro_beta;
	var gyro_gamma; 
    
    gyro.frequency = 100;
    
    gyro.startTracking(function(o) 
    {
   		accelerometer_x = Number((o.x).toFixed(1));
        accelerometer_y = Number((o.y).toFixed(1));
        accelerometer_z = Number((o.z).toFixed(1));
   
        gyro_alpha = Number((o.alpha).toFixed(1));
        gyro_beta = Number((o.beta).toFixed(1));
        gyro_gamma = Number((o.gamma).toFixed(1)); 
        
        console.log(accelerometer_x);
        console.log(accelerometer_y);
        console.log(accelerometer_z);
        console.log(gyro_alpha);
        console.log(gyro_alpha);
        console.log(gyro_alpha);
    });
}

function stop_tracking()
{
    gyro.stopTracking();
}

function average_measurement()
{
    
}

