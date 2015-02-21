var points_array = [];

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
		m0 = Math.tan(points_array[0].angle); 
		m1 = Math.tan(points_array[1].angle);
		
		//find the y intercepts for each 
		b0 = points_array[0].y - m0*points_array[0].x;
		b1 = points_array[1].y - m1*points_array[0].x;
		
		//now solve for the x intersection 
		x_intersection = (b1 - b0)/(m1 - m0);
		
		//now solve for the y intersection 
		y_intersection = m0 * x_intersection + b0;
	}

	console.log(x_intersection, y_intersection); 
	
}

/*//Farthest left origin
var x1 = 0; 
var y1 = 0;

var x2 = 300;
var y2 = 200;
//////


$(document).ready(function(){
    
        
    //document.getElementById('intake_points').onclick=function(){intake_points()};
        
	var canvas = new fabric.Canvas('c');
	canvas.setDimensions({
		width: 500,
		height:500
	})

	var line = draw_line_from_points(x1, y1, x2, y1);
	canvas.add(line);
	line = draw_line_from_points(x2, y1, x2, y2);
	canvas.add(line);
	line = draw_line_from_points(x2, y2, x1, y2);
	canvas.add(line);
	line = draw_line_from_points(x1, y2, x1, y1);
	canvas.add(line);
});


function draw_line_from_points(x1, y1, x2, y2) {
	
	//Implicit translation of OUR points to FABRIC'S points
	var line = new fabric.Line([x1, y1, x2, y2], {
		strokeWidth: '5',
		stroke: 'black', });
	return line;
}


// create a rectangle with angle=45
var rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 20,
  height: 20,
  angle: 45
});*/
