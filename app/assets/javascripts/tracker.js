$( document ).ready(function() 
{
    document.getElementById("calibrate").onclick=function(){calibrate()};
    document.getElementById("start_tracking").onclick=function(){start_tracking()};
});

var accelerometer_active = {x:0, y:0, z:0};
var gyroscope_active = {alpha:0, beta:0, gamma:0}; 

var accelerometer_origin = {x:0, y:0, z:0};
var gyroscope_origin = {alpha:0, beta:0, gamma:0}; 

function start_tracking()
{
    gyro.frequency = 100;
    
    console.log("tracking!!");
    gyro.startTracking(function(o) 
    {
   		accelerometer_active.x = Number((o.x).toFixed(1));
        accelerometer_active.y = Number((o.y).toFixed(1));
        accelerometer_active.z = Number((o.z).toFixed(1));
   
        gyroscope_active.alpha = Number((o.alpha).toFixed(1));
        gyroscope_active.beta = Number((o.beta).toFixed(1));
        gyroscope_active.gamma = Number((o.gamma).toFixed(1));     
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
    
    alert(accelerometer_origin.y);
}
function average_measurement()
{
    
}

