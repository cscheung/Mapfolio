var count, avg_x, avg_y, avg_z, distance_x, distance_y, time0, timeT;


function start_tracking()
{
    
    window.addEventListener("orientationchange", function() 
        {
            document.getElementById("orientation").innerHTML = "orientation: " + (window.orientation);
        },
                            
    false);
    
    
    
    gyro.frequency = 5;
    count = 0;
    avg_x = 0;
    avg_y = 0;
    avg_z = 0;
    a_x=0;
    a_y=0;
    a_z=0;
    distance_x = 0;
    distance_y = 0;
    var d = new Date();
    time0 = d.getTime();
    vel2_x = 0;vel2_y = 0;vel2_z = 0; dist2_x=0; dist2_y=0; dist2_z=0;
    dist3_x=dist3_y=dist3_z=0; vel3_x = 0;vel3_y = 0;vel3_z = 0; a3_x=a3_y=a3_z=0;
    dist4_x=dist4_y=dist4_z=0; vel4_x = 0;vel4_y = 0;vel4_z = 0; a4_x=a4_y=a4_z=0;
    dist5_x=dist5_y=dist5_z=0; vel5_x = 0;vel5_y = 0;vel5_z = 0; a5_x=a5_y=a5_z=0;
    first =0;
    f1_x=0;
    f1_y=0;
    f1_z=0;
    totaccel=0;
    avg_a=0;
    avga3x=avga3y=avga3z=0;
    cal_x=0;
    cal_y=0;
    cal_z=0;
    tota3=0;
    rv = 0.1;

    divfactor=1000/gyro.frequency;
    gyro.startTracking(function(o) 
        {
            if (first<10)    {
                f1_x=Number(o.x);
                f1_y=Number(o.y);
                f1_z=Number(o.z);
                first=first+1;
            }
            document.getElementById("f1_x").innerHTML = 
            "f1_x: " + Number(f1_x);
            document.getElementById("f1_y").innerHTML = 
                    "f1_y: " + Number(f1_y);
            document.getElementById("f1_z").innerHTML = 
                    "f1_z: " + Number(f1_z);
            f_x=Number(o.x);
            f_y=Number(o.y);
            f_z=Number(o.z);
            totaccel=Math.pow(f_x,2)+Math.pow(f_y,2)+Math.pow(f_z,2);
            totaccel=Math.sqrt(totaccel);
            avg_a = ((totaccel + avg_a*count) / (count + 1)).toFixed(7);
            document.getElementById("totaccel").innerHTML = 
            "totaccel: " + totaccel;
            document.getElementById("avg_a").innerHTML = 
            "avg_a: " + avg_a;
            document.getElementById("accelerometer_x").innerHTML = 
            "accelerometer_x: " + f_x;
            
            document.getElementById("accelerometer_y").innerHTML = 
            "accelerometer_y: " + f_y;
            
            document.getElementById("accelerometer_z").innerHTML = 
            "accelerometer_z: " + f_z;
            gyr_x=o.alpha;
            gyr_y=o.beta;
            gyr_z=o.gamma;
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

            avg_x = ((o.x + avg_x*count) / (count + 1)).toFixed(7);
            a_x=avg_x-f_x;
            avg_y = ((o.y + avg_y*count) / (count + 1)).toFixed(7);
            a_y=avg_y-f_y;
            avg_z = ((o.z + avg_z*count) / (count + 1)).toFixed(7);
            a_z=avg_z-f_z;
            a2_x=f_x-f1_x;
            a2_y=f_y-f1_y;
            a2_z=f_z-f1_z;
            count++;
            
            vel2_x = a2_x/divfactor + vel2_x;
            vel2_y = a2_y/divfactor + vel2_y;
            vel2_z = a2_z/divfactor + vel2_z;
            dist2_x = vel2_x/divfactor + dist2_x;
            dist2_y = vel2_y/divfactor + dist2_y;
            dist2_z = vel2_z/divfactor + dist2_z;
            
            document.getElementById("a_x").innerHTML = 
            "a_x: " + Number(a_x);
            document.getElementById("a_y").innerHTML = 
                    "a_y: " + Number(a_y);
            document.getElementById("a_z").innerHTML = 
                    "a_z: " + Number(a_z);
                    document.getElementById("a2_x").innerHTML = 
            "a2_x: " + Number(a2_x);
            document.getElementById("a2_y").innerHTML = 
                    "a2_y: " + Number(a2_y);
            document.getElementById("a2_z").innerHTML = 
                    "a2_z: " + Number(a2_z);
            document.getElementById("vel2_x").innerHTML = 
                    "vel2_x: " + Number(vel2_x);
            document.getElementById("vel2_y").innerHTML = 
                    "vel2_y: " + Number(vel2_y);
            document.getElementById("vel2_z").innerHTML = 
                    "vel2_z: " + Number(vel2_z);

            document.getElementById("dist2_x").innerHTML = 
                    "dist2_x: " + Number(dist2_x);
            document.getElementById("dist2_y").innerHTML = 
                    "dist2_y: " + Number(dist2_y);
            document.getElementById("dist2_z").innerHTML = 
                    "dist2_z: " + Number(dist2_z);
            document.getElementById("count").innerHTML = 
                    "count " + Number(count);
            //f = 0.5;
            //a2_x=f*Math.round((avg_x-f_x)/f);
            document.getElementById("a2_x").innerHTML = 
                    "a2_x " + Number(a2_x);
            new_values = rotateVector(f_x,f_y,f_z, -1.0*gyr_x, -1.0*gyr_y, -1.0*gyr_z);
gr_x = new_values[0];
gr_y = new_values[1];
gr_z = new_values[2];
new_values2 = rotateVector(0,0,10, -1.0*gyr_x, -1.0*gyr_y, -1.0*gyr_z);
gr2_x = new_values2[0];
gr2_y = new_values2[1];
gr2_z = new_values2[2];
document.getElementById("gr_x").innerHTML = 
                    "gr_x " + Number(gr_x);
                    document.getElementById("gr_y").innerHTML = 
                    "gr_y " + Number(gr_y);
                    document.getElementById("gr_z").innerHTML = 
                    "gr_z " + Number(gr_z);
                    document.getElementById("gr2_x").innerHTML = 
                    "gr2_x " + Number(gr2_x);
                    document.getElementById("gr2_y").innerHTML = 
                    "gr2_y " + Number(gr2_y);
                    document.getElementById("gr2_z").innerHTML = 
                    "gr2_z " + Number(gr2_z);
                    dif_agx=f_x+gr2_x;
                    dif_agy=f_y+gr2_y;
                    dif_agz=f_z+gr2_z;
                    new_values3 = rotateVector(dif_agx,dif_agy,dif_agz, -1.0*gyr_x, -1.0*gyr_y, -1.0*gyr_z);
                    a3_x=new_values3[0];
                    a3_y=new_values3[1];
                    a3_z=new_values3[2];
                    tota3=Math.pow(a3_x,2)+Math.pow(a3_y,2)+Math.pow(a3_z,2);
                    tota3=Math.sqrt(tota3);
                    document.getElementById("dif_agx").innerHTML = 
                    "dif_agx " + Number(dif_agx);
                    document.getElementById("dif_agy").innerHTML = 
                    "dif_agy " + Number(dif_agy);
                    document.getElementById("dif_agz").innerHTML = 
                    "dif_agz " + Number(dif_agz);
                    document.getElementById("a3_x").innerHTML = 
                    "a3_x " + Number(a3_x);
                    document.getElementById("a3_y").innerHTML = 
                    "a3_y " + Number(a3_y);
                    document.getElementById("a3_z").innerHTML = 
                    "a3_z " + Number(a3_z);
                    vel3_x = a3_x/divfactor + vel3_x;
                    vel3_y = a3_y/divfactor + vel3_y;
                    vel3_z = a3_z/divfactor + vel3_z;
                    dist3_x = vel3_x/divfactor + dist3_x;
                    dist3_y = vel3_y/divfactor + dist3_y;
                    dist3_z = vel3_z/divfactor + dist3_z;
                    document.getElementById("vel3_x").innerHTML = 
                            "vel3_x: " + Number(vel3_x);
                    document.getElementById("vel3_y").innerHTML = 
                            "vel3_y: " + Number(vel3_y);
                    document.getElementById("vel3_z").innerHTML = 
                            "vel3_z: " + Number(vel3_z);

                    document.getElementById("dist3_x").innerHTML = 
                            "dist3_x: " + Number(dist3_x);
                    document.getElementById("dist3_y").innerHTML = 
                            "dist3_y: " + Number(dist3_y);
                    document.getElementById("dist3_z").innerHTML = 
                            "dist3_z: " + Number(dist3_z);
                    avga3x = ((Math.abs(a3_x) + avga3x*count) / (count + 1)).toFixed(7);
                    document.getElementById("avga3x").innerHTML = 
                            "avga3x: " + Number(avga3x);
                    a4_x = rv * Math.round(a3_x/rv);
                    a4_y = rv * Math.round(a3_y/rv);
                    a4_z = rv * Math.round(a3_z/rv);
                    document.getElementById("a4_x").innerHTML = 
                    "a4_x " + Number(a4_x);
                    document.getElementById("a4_y").innerHTML = 
                    "a4_y " + Number(a4_y);
                    document.getElementById("a4_z").innerHTML = 
                    "a4_z " + Number(a4_z);
                    
                    vel4_x = a4_x/divfactor + vel4_x;
                    vel4_y = a4_y/divfactor + vel4_y;
                    vel4_z = a4_z/divfactor + vel4_z;
                    dist4_x = vel4_x/divfactor + dist4_x;
                    dist4_y = vel4_y/divfactor + dist4_y;
                    dist4_z = vel4_z/divfactor + dist4_z;
                    document.getElementById("vel4_x").innerHTML = 
                            "vel4_x: " + Number(vel4_x);
                    document.getElementById("vel4_y").innerHTML = 
                            "vel4_y: " + Number(vel4_y);
                    document.getElementById("vel4_z").innerHTML = 
                            "vel4_z: " + Number(vel4_z);

                    document.getElementById("dist4_x").innerHTML = 
                            "dist4_x: " + Number(dist4_x);
                    document.getElementById("dist4_y").innerHTML = 
                            "dist4_y: " + Number(dist4_y);
                    document.getElementById("dist4_z").innerHTML = 
                            "dist4_z: " + Number(dist4_z);

                    
                    document.getElementById("tota3").innerHTML = 
                    "tota3 " + Number(tota3);
                    //if(tota3>0.5)   {
                        tota3xyz=Math.pow(a3_x,2)+Math.pow(a3_y,2);
                    tota3xyz=Math.sqrt(tota3xyz);
                        a5_x=a3_x;
                        a5_y=a3_y;
                        a5_z=a3_z;
                    //}
                    //else{
                     //   a5_x=a5_y=a5_z=0;
                    //}
                            document.getElementById("a5_x").innerHTML = 
                    "a5_x " + Number(a5_x);
                    document.getElementById("a5_y").innerHTML = 
                    "a5_y " + Number(a5_y);
                    document.getElementById("a5_z").innerHTML = 
                    "a5_z " + Number(a5_z);
                    
                    vel5_x = a5_x/divfactor + vel5_x;
                    vel5_y = a5_y/divfactor + vel5_y;
                    vel5_z = a5_z/divfactor + vel5_z;
                    if(tota3xyz<0.13)   {
                        vel5_x=vel5_y=vel5_z=0;
                    }
                    dist5_x = vel5_x/divfactor + dist5_x;
                    dist5_y = vel5_y/divfactor + dist5_y;
                    dist5_z = vel5_z/divfactor + dist5_z;
                    document.getElementById("vel5_x").innerHTML = 
                            "vel5_x: " + Number(vel5_x);
                    document.getElementById("vel5_y").innerHTML = 
                            "vel5_y: " + Number(vel5_y);
                    document.getElementById("vel5_z").innerHTML = 
                            "vel5_z: " + Number(vel5_z);

                    document.getElementById("dist5_x").innerHTML = 
                            "dist5_x: " + Number(dist5_x);
                    document.getElementById("dist5_y").innerHTML = 
                            "dist5_y: " + Number(dist5_y);
                    document.getElementById("dist5_z").innerHTML = 
                            "dist5_z: " + Number(dist5_z);
                            dist5xy=Math.pow(dist5_x,2)+Math.pow(dist5_y,2);
            dist5xy=Math.sqrt(dist5xy);
            document.getElementById("dist5xy").innerHTML = 
                            "dist5xy: " + Number(dist5xy);
                            dist5xyz=Math.pow(dist5_x,2)+Math.pow(dist5_y,2)+Math.pow(dist5_z,2);
            dist5xyz=Math.sqrt(dist5xyz);
            document.getElementById("dist5xyz").innerHTML = 
                            "dist5xyz: " + Number(dist5xyz);
            

        }
    );
}

function stop_tracking()
{
    gyro.stopTracking();

    document.getElementById("f_x").innerHTML = 
            "f_x: " + Number(f_x);
    document.getElementById("f_y").innerHTML = 
            "f_y: " + Number(f_y);
    document.getElementById("f_z").innerHTML = 
            "f_z: " + Number(f_z);
    
    var d = new Date();
    timeT = d.getTime();
    timeT = (timeT - time0) / 1000
    vel_x = a_x * timeT;
    vel_y = a_y * timeT;
    vel_z = a_z * timeT;
    distance_x = (0.5) * a_x * timeT * timeT;
    distance_y = (0.5) * a_y * timeT * timeT;
    distance_z = (0.5) * a_z * timeT * timeT;
    document.getElementById("vel_x").innerHTML = 
            "vel_x: " + Number(vel_x);
    document.getElementById("vel_y").innerHTML = 
            "vel_y: " + Number(vel_y);
    document.getElementById("vel_z").innerHTML = 
            "vel_z: " + Number(vel_z);
    document.getElementById("distance_x").innerHTML = 
            "distance_x: " + Number(distance_x);
    document.getElementById("distance_y").innerHTML = 
            "distance_y: " + Number(distance_y);
    document.getElementById("distance_z").innerHTML = 
            "distance_z: " + Number(distance_z);
    document.getElementById("time").innerHTML = 
            "Time elapsed: " + Number(timeT);

}
function rotateVector(x, y, z, alpha, beta, gamma){
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

