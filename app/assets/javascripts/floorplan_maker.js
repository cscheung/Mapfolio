//Farthest left origin
var x1 = 0; 
var y1 = 0;

var x2 = 300;
var y2 = 200;
//////


$(document).ready(function(){
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
});





