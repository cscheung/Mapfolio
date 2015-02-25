var HEIGHT = 500;
var WIDTH = 500;
var SCALING_FACTOR = 1;
var X_TRANSLATION = 100;
var Y_TRANSLATION = 100;	
    
points_array = [];
intersections_array = [];
var canvas;

$(document).ready(function(){
    
	canvas = new fabric.Canvas('c');
	canvas.setDimensions({
		width: WIDTH,
		height:HEIGHT
	})
});

function load_points()
{
    points = $('.points_class').data('points');
    for(i=0; i < points.length; i++)
    {
        var new_point = 
        {
            angle: 90 - points[i].angle, 
            x: points[i].x, 
            y: points[i].y
        };
            
        points_array.push(new_point);
    }

}

function find_intersection(p0, p1)
{
	var x_intersection;
	var y_intersection;
	
	m0 = Math.tan(p0.angle*Math.PI/180); 
	m1 = Math.tan(p1.angle*Math.PI/180);
	
	//find the y intercepts for each 
	b0 = p0.y - m0*p0.x;
	b1 = p1.y - m1*p1.x;
	
	//Cannot do tan(p0.angle)
	if(p0.angle == 90)
	{
		//x = value for all y
		x_intersection = p0.x; 
		y_intersection = m1 * x_intersection + b1;
	}
	//Cannot do tan(p1.angle)
	else if(p1.angle == 90)
	{
		//x = value for all y
		x_intersection = p1.x; 
        	y_intersection = m0 * x_intersection + b0;
	}
	//Both tan are ok, so can use either eq.
	else
	{	
        	x_intersection = (b1 - b0)/(m0 - m1); 
        	y_intersection = m0 * x_intersection + b0;
	}

    return {x: x_intersection, y: y_intersection};
}
	
function draw_walls()
{
    for (i = 0; i < points_array.length; i++) 
    {
        var p0 = points_array[i];
        var p1 = points_array[(i+1)%points_array.length];
        var p2 = find_intersection(p0, p1);

        intersections_array.push(p2);
    }
    
    for (i = 0; i < intersections_array.length; i++) 
    {
        var a = intersections_array[i];
        var b = intersections_array[(i+1)%intersections_array.length];
        var line = draw_line_from_points(a.x, a.y, b.x, b.y);
        canvas.add(line);
    }
}

function draw_line_from_points(x1, y1, x2, y2) 
{    
	var line = new fabric.Line(
	[
	x1*SCALING_FACTOR + X_TRANSLATION, 
	(WIDTH - y1)*SCALING_FACTOR - Y_TRANSLATION, 
	x2*SCALING_FACTOR + X_TRANSLATION, 
	(WIDTH - y2)*SCALING_FACTOR - Y_TRANSLATION
	], 
	{
		strokeWidth: '1',
		stroke: 'black', 
    });
    
	return line;
}


