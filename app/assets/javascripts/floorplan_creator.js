var x1 = 0; 
var y1 = 0;

var x2 = 300;
var y2 = 200;
points_array = [];
var canvas;

$(document).ready(function(){
    
	canvas = new fabric.Canvas('c');
	canvas.setDimensions({
		width: 500,
		height:500
	})
});

function show_plan()
{
	var line = draw_line_from_points(x1, y1, x2, y1);
	canvas.add(line);
	line = draw_line_from_points(x2, y1, x2, y2);
	canvas.add(line);
	line = draw_line_from_points(x2, y2, x1, y2);
	canvas.add(line);
	line = draw_line_from_points(x1, y2, x1, y1);
	canvas.add(line);
}

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

function show_points()
{
   console.log(points_array); 
}

function find_intersection()
{
	var x_intersection;
	var y_intersection;
	
	if(points_array[0].angle == 90)
	{
		//x = value for all y
		x_intersection = points_array[0].x;
		y_intersection = points_array[1].y; 
	}
	else if(points_array[1].angle == 90)
	{
		//x = value for all y
		x_intersection = points_array[1].x;
		y_intersection = points_array[0].y; 
	}
	else
	{	
		//find the slopes for the two points
		m0 = Math.tan(points_array[0].angle*Math.PI/180); 
		m1 = Math.tan(points_array[1].angle*Math.PI/180);
		
		//find the y intercepts for each 
		b0 = points_array[0].y - m0*points_array[0].x;
		b1 = points_array[1].y - m1*points_array[1].x;
		
		//now solve for the x intersection 
		x_intersection = (b1 - b0)/(m0 - m1);
		
		//now solve for the y intersection 
		y_intersection = m0 * x_intersection + b0;
	}

	console.log((x_intersection).toFixed(2), (y_intersection).toFixed(2)); 
    
    var wall = draw_line_from_points(points_array[0].x*10, points_array[0].y*10, x_intersection*10, y_intersection*10);
	canvas.add(wall);
	
	var wall2 = draw_line_from_points(points_array[1].x*10, points_array[1].y*10, x_intersection*10, y_intersection*10);
	canvas.add(wall2);
}

function draw_line_from_points(x1, y1, x2, y2) {
	
	//Implicit translation of OUR points to FABRIC'S points
	var line = new fabric.Line([x1, y1, x2, y2], {
		strokeWidth: '5',
		stroke: 'black', });
	return line;
}


