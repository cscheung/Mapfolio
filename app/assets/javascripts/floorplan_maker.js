
//Farthest left origin
var x1 = 0; 
var y1 = 0;

var x2 = 300;
var y2 = 200;
//////


$(document).ready(function(){
    document.getElementById('intake_points').onclick=function(){intake_points()};
        
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


function intake_points()
{
    var oTable = document.getElementById('points_table');

    //gets rows of table
    var rowLength = oTable.rows.length;
    
    //loops through rows    
    for (i = 0; i < rowLength; i++){
    
       //gets cells of current row
       var oCells = oTable.rows.item(i).cells;
    
       //gets amount of cells of current row
       var cellLength = oCells.length;
    
       //loops through each cell in current row
       for(var j = 0; j < cellLength; j++){
          /* get your cell info here */
          /* var cellVal = oCells.item(j).innerHTML; */
          console.log(oCells.item(j).innerHTML);
       }
    }
    
}





