
$( document ).ready(function() 
{
    document.getElementById("save").onclick=function(){save()};
});


var accelerometer_x = 30;
var accelerometer_y = 30;
var accelerometer_z = 30;
var gyroscope_alpha = 30;
var gyroscope_beta = 30;
var gyroscope_gamma = 30;

function save()
{
    //DO fancy math to convert this into x, y, angle
    enter_into_database(accelerometer_x, accelerometer_y, gyroscope_alpha);
}

function enter_into_database(x_in, y_in, angle_in)
{
    alert("checked the button - worked");
    alert(x_in);
    $.ajax({
           type:'POST', 
           url: '/points', 
           data: $.param({ point: {x: x_in, y: y_in, angle: angle_in}})
      });
 
}