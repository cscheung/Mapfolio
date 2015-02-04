var acc_x, acc_y, pos_x, pos_y, velocity_x, velocity_y;

var prev_acc_x, prev_acc_y;

var interpolated_x, interpolated_y;

var compensate_acc_x = 0; 
var compensate_acc_y = 0;

//var time_start, time_finish;


function start_tracking()
{
    
    window.addEventListener("orientationchange", function() 
        {
            document.getElementById("orientation").innerHTML = "orientation: " + (window.orientation);
        },
                            
    false);
    
    
    gyro.frequency = 10; // 100 Hz sampling frequency
    
    acc_x = 0;
    acc_y = 0;

    prev_acc_x = 0;
    prev_acc_y = 0;

    pos_x = 0;
    pos_y = 0;

    velocity_x = 0;
    velocity_y = 0;

    var t = gyro.frequency * 0.001;


    gyro.startTracking(function(o) 
        {
             
            //document.getElementById("gyroscope_alpha").innerHTML = 
            //"gyroscope_alpha: " + Number((o.alpha).toFixed(1));
                        
            //document.getElementById("gyroscope_beta").innerHTML = 
            // "gyroscope_beta: " + Number((o.beta).toFixed(1));
            
            // document.getElementById("gyroscope_gamma").innerHTML = 
            // "gyroscope_gamma: " + Number((o.gamma).toFixed(1));

            acc_x = Math.round((o.x - compensate_acc_x)*100)/100;
            acc_y = Math.round((o.y - compensate_acc_y)*100)/100;

            document.getElementById("accelerometer_x").innerHTML = 
            "accelerometer_x: " + Number(acc_x);
            
            document.getElementById("accelerometer_y").innerHTML = 
            "accelerometer_y: " + Number(acc_y);
            
            document.getElementById("accelerometer_z").innerHTML = 
            "accelerometer_z: " + Number(o.z);

            interpolated_x = (prev_acc_x + acc_x) / 2;
            interpolated_y = (prev_acc_y + acc_y) / 2;

            pos_x += (0.5*interpolated_x*t*t) + velocity_x*t;
            pos_y += (0.5*interpolated_y*t*t) + velocity_y*t;

            velocity_x += interpolated_x * t;
            velocity_y += interpolated_y * t;

            prev_acc_x = acc_x;
            prev_acc_y = acc_y;

            document.getElementById("velocity_x").innerHTML = 
            "velocity_x: " + Number(velocity_x);
            document.getElementById("velocity_y").innerHTML = 
            "velocity_y: " + Number(velocity_y);
            document.getElementById("pos_x").innerHTML = 
            "pos_x: " + Number(pos_x);
            document.getElementById("pos_y").innerHTML = 
            "pos_y: " + Number(pos_y);
            document.getElementById("compensate_acc_x").innerHTML = 
            "compensate_acc_x: " + Number(compensate_acc_x);
            document.getElementById("compensate_acc_y").innerHTML = 
            "compensate_acc_y: " + Number(compensate_acc_y);
        }
    );
}

function stop_tracking()
{
    gyro.stopTracking();
}

function calibrate()
{
    gyro.frequency = 10; 
    gyro.startTracking(function(o) 
        {
            compensate_acc_x = o.x; 
            compensate_acc_y = o.y;
            document.getElementById("compensate_acc_x").innerHTML = 
            "compensate_acc_x: " + Number(compensate_acc_x);
            document.getElementById("compensate_acc_y").innerHTML = 
            "compensate_acc_y: " + Number(compensate_acc_y);    
        }
    );
}

