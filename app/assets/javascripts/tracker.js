var acc_x, acc_y, acc_z, pos_x, pos_y, velocity_x, velocity_y;

var prev_acc_x, prev_acc_y, prev_z;

var interpolated_x, interpolated_y, interpolated_z;

var compensate_acc_x = 0; 
var compensate_acc_y = 0;
var compensate_acc_z = 0;

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
    acc_z = 0   

    prev_acc_x = 0;
    prev_acc_y = 0;
    prev_acc_z = 0;

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
            acc_z = Math.round((o.z - compensate_acc_z)*100)/100;

            interpolated_x = (prev_acc_x + acc_x) / 2;
            interpolated_y = (prev_acc_y + acc_y) / 2;
            interpolated_z = (prev_acc_z + acc_z) / 2;

            var reoriented_values = rotateVector (interpolated_x, interpolated_y, interpolated_z, -1.0*o.alpha, -1.0*o.beta, -1.0*o.gamma); 
            var r_acc_x = interpolated_x - reoriented_values[0]
            var r_acc_y = interpolated_y - reoriented_values[1]
            var r_acc_z = interpolated_z - reoriented_values[2]

            pos_x += (0.5*interpolated_x*t*t) + velocity_x*t;
            pos_y += (0.5*interpolated_y*t*t) + velocity_y*t;

            velocity_x += interpolated_x * t;
            velocity_y += interpolated_y * t;

            prev_acc_x = acc_x;
            prev_acc_y = acc_y;

            document.getElementById("accelerometer_x").innerHTML = 
            "accelerometer_x: " + Number(r_acc_x);
            document.getElementById("accelerometer_y").innerHTML = 
            "accelerometer_y: " + Number(r_acc_y);    
            document.getElementById("accelerometer_z").innerHTML = 
            "accelerometer_z: " + Number(r_acc_z);
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

function rotateVector(x, y, z, alpha, beta, gamma) {
    var s = Math.PI / 180;
    var cos_a = Math.cos(alpha*s);
    var sin_a = Math.sin(alpha*s);

    var cos_b = Math.cos(beta*s);
    var sin_b = Math.sin(beta*s);

    var cos_g = Math.cos(gamma*s);
    var sin_g = Math.sin(gamma*s);

    var new_x = x*(cos_a*cos_g) + y*(-1.0*sin_a*cos_g) + z*(sin_g);
    var new_y = x*(sin_b*sin_g*cos_a + cos_b*sin_a) + y*(-1*sin_a*sin_b*sin_g + cos_a*cos_b) + z*(-1.0*sin_b*cos_g);
    var new_z = x*(-1.0*cos_a*cos_b*sin_g + sin_a*sin_b) + y*(sin_a*cos_b*sin_g + sin_b*cos_a) + z*(cos_b*cos_g);

    return [new_x, new_y, new_z];
}

