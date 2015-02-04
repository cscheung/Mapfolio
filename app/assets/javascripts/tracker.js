var count, avg_x, avg_y, avg_z, distance_x, distance_y, time0, timeT;


function start_tracking()
{
    
    window.addEventListener("orientationchange", function() 
        {
            document.getElementById("orientation").innerHTML = "orientation: " + (window.orientation);
        },
                            
    false);
    
    
    gyro.frequency = 10;
    count = 0;
    avg_x = 0;
    avg_y = 0;
    avg_z = 0;
    distance_x = 0;
    distance_y = 0;
    var d = new Date();
    time0 = d.getTime();

    gyro.startTracking(function(o) 
        {
            document.getElementById("accelerometer_x").innerHTML = 
            "accelerometer_x: " + Number(o.x);
            
            document.getElementById("accelerometer_y").innerHTML = 
            "accelerometer_y: " + Number(o.y);
            
            document.getElementById("accelerometer_z").innerHTML = 
            "accelerometer_z: " + Number(o.z);
             
            document.getElementById("gyroscope_alpha").innerHTML = 
            "gyroscope_alpha: " + Number((o.alpha).toFixed(1));
                        
            document.getElementById("gyroscope_beta").innerHTML = 
            "gyroscope_beta: " + Number((o.beta).toFixed(1));
            
            document.getElementById("gyroscope_gamma").innerHTML = 
            "gyroscope_gamma: " + Number((o.gamma).toFixed(1));

            document.getElementById("avg_x").innerHTML = 
            "avg_x: " + Number(avg_x);
            document.getElementById("avg_y").innerHTML = 
            "avg_y: " + Number(avg_y);
            document.getElementById("avg_z").innerHTML = 
            "avg_z: " + Number(avg_z);

            avg_x = ((o.x + avg_x*count) / (count + 1)).toFixed(2);
            avg_y = ((o.y + avg_y*count) / (count + 1)).toFixed(2);
            avg_z = ((o.z + avg_z*count) / (count + 1)).toFixed(2);
            count++;
        }
    );
}

function stop_tracking()
{
    gyro.stopTracking();
    var d = new Date();
    timeT = d.getTime();
    timeT = (timeT - time0) / 1000
    distance_x = (0.5) * avg_x * timeT * timeT;
    distance_y = (0.5) * avg_y * timeT * timeT;
    document.getElementById("distance_x").innerHTML = 
            "distance_x: " + Number(distance_x);
    document.getElementById("distance_y").innerHTML = 
            "distance_y: " + Number(distance_y);
            document.getElementById("time").innerHTML = 
            "Time elapsed: " + Number(timeT);

}

function put_values_in_article()
{
    
    document.getElementById("article_title").value = get_date();
    
    document.getElementById("article_text").value = 
        document.getElementById("orientation").innerHTML +
        "\n" +
        document.getElementById("accelerometer_x").innerHTML +
        "\n" +
        document.getElementById("accelerometer_y").innerHTML +
        "\n" +
        document.getElementById("accelerometer_z").innerHTML +
        "\n" +
        document.getElementById("accelerometer_x").innerHTML +
        "\n" +
        document.getElementById("gyroscope_alpha").innerHTML +
        "\n" +
        document.getElementById("gyroscope_beta").innerHTML +
        "\n" +
        document.getElementById("gyroscope_gamma").innerHTML ;
   
}

function get_date() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

