var HEIGHT = 500;
var WIDTH = 500;
var SCALING_FACTOR = 1;	
    
points_array = [];
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
        var new_point = {
            angle: points[i].angle, 
            x: points[i].x, 
            y: points[i].y};
            
        points_array.push(new_point);
    }

}

function find_intersection(p1, p2)
{
	var x_intersection;
	var y_intersection;
	
	//Reorganization so I can better understand the angle
	p1.angle = 90 - p1.angle;
	p2.angle = 90 - p2.angle;
	
	
	m0 = Math.tan(p1.angle*Math.PI/180); 
	m1 = Math.tan(p2.angle*Math.PI/180);
	
	//find the y intercepts for each 
	b0 = p1.y - m0*p1.x;
	b1 = p2.y - m1*p2.x;
	
	if(p1.angle == 90)
	{
		//x = value for all y
		x_intersection = p1.x; 
		y_intersection = m1 * x_intersection + b1;
	}
	
	if(p2.angle == 90)
	{
		//x = value for all y
		x_intersection = p2.x; 
        	y_intersection = m0 * x_intersection + b0;
	}
	
	else
	{	
        	x_intersection = (b1 - b0)/(m0 - m1); 
        	y_intersection = m0 * x_intersection + b0;
	}

    return {x: x_intersection, y: y_intersection};
}
	
function draw_walls()
{
    /*
    console.log("All of the points in order:");
    for (i = 0; i < points_array.length; i++) 
    {
        console.log(points_array[i]);
    }
    */
    for (i = 0; i < points_array.length; i++) 
    {
        var p1 = points_array[i];
        var p2 = points_array[(i+1)%points_array.length];
        var p3 = find_intersection(p1, p2);

        console.log(p1.x,p1.y, "and", p2.x,p2.y, "meet at", p3.x, p3.y);
        /*
        var p1_wall = draw_line_from_points(p1.x, p1.y, p3.x, p3.y);
        canvas.add(p1_wall);
        var p2_wall = draw_line_from_points(p2.x, p2.y, p3.x, p3.y);
        canvas.add(p2_wall);
        */
    }
}

function draw_line_from_points(x1, y1, x2, y2) 
{    
	var line = new fabric.Line([(HEIGHT-x1)*SCALING_FACTOR, 
	y1*SCALING_FACTOR, 
	x2*SCALING_FACTOR, 
	y2*SCALING_FACTOR], 
	{
		strokeWidth: '1',
		stroke: 'black', 
    });
    
	return line;
}


