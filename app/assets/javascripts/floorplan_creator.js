var HEIGHT = 500;
var WIDTH = 500;
var SCALING_FACTOR = 1;
var X_TRANSLATION = 75;
var Y_TRANSLATION = 75;	
var VERTEX_RADIUS = 10;

points_array = [];
intersections_array = [];
walls_array = [];
var canvas;

$(document).ready(function(){
    
	canvas = new fabric.Canvas('c');
	canvas.setDimensions({
		width: WIDTH,
		height:HEIGHT
	});
	
	
    canvas.on('mouse:down', function(e) 
    {
        if(e.target)
        {
            //Call a js function
            display_photo(e.target);
            canvas.renderAll();
        }
    });
  
    canvas.on('object:moving', function(e) 
    {
        if(e.target.name == 'vertex')
        {
            var p = e.target;
            p.wall1.set({'x2' : p.left + VERTEX_RADIUS, 'y2' : p.top + VERTEX_RADIUS});
            p.wall2.set({'x1' : p.left + VERTEX_RADIUS, 'y1' : p.top + VERTEX_RADIUS});    
            canvas.renderAll();
        }
    });

	  
});

/*camera code*/
function display_photo(canvas_object)
{
    if (canvas_object.name == "camera")
    {
        console.log("camera clicked");
    }
}

function create_camera_icon()
{
    fabric.Image.fromURL('camera.png', function(oImg) 
    {
        oImg.name = "camera";
        oImg.scale(0.5);
        oImg.set('selectable', false);
        canvas.add(oImg);
    });
}
function previewFile() {

create_camera_icon();

var preview = document.querySelector('img');
var file = document.querySelector('input[type=file]').files[0];
var reader = new FileReader();

reader.onloadend = function () {
preview.src = reader.result;
}

if (file) {
reader.readAsDataURL(file);
} else {
preview.src = "";
}
}
/*camera code*/

function draw_floorplan()
{
    load_points();
    draw_walls();
}

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

function draw_walls()
{
    //Find interctions
    for (i = 0; i < points_array.length; i++) 
    {
        var p0 = points_array[i];
        var p1 = points_array[(i+1)%points_array.length];
        var p2 = find_intersection(p0, p1);

        intersections_array.push(p2);
    }
    
    //Find walls
    for (i = 0; i < intersections_array.length; i++) 
    {
        var a = intersections_array[i];
        var b = intersections_array[(i+1)%intersections_array.length];
        
        var translated_points = translate_points([a.x, a.y, b.x, b.y]);
        walls_array.push(make_wall(translated_points));
    }
    
    //Put on walls    
    for (i = 0; i < walls_array.length; i++)
    {
        canvas.add(walls_array[i]);
    }
    
    //Make intersections
    //Put them on canvas
    for (i = 0; i < walls_array.length; i++)
    {
        var vertex = make_vertex(
        walls_array[i].x2, 
        walls_array[i].y2, 
        walls_array[i], 
        walls_array[(i+1)%points_array.length]);
        
        canvas.add(vertex);
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

function make_wall(coords) 
{
    return new fabric.Line(coords, 
    {
      fill: 'black',
      stroke: 'black',
      strokeWidth: 5,
      selectable: false
    });
}

function make_vertex(left, top, wall1, wall2) 
{
    var c = new fabric.Circle(
    {
        left: left - VERTEX_RADIUS,
        top: top - VERTEX_RADIUS,
        strokeWidth: 2,
        radius: VERTEX_RADIUS,
        fill: '#fff',
        stroke: '#666',
        name: 'vertex'
    });
    
    c.wall1 = wall1;
    c.wall2 = wall2;
    c.hasControls = c.hasBorders = false;
    return c;
}

function translate_points(points)
{
    points[0] = points[0]*SCALING_FACTOR + X_TRANSLATION;
    points[1] = (WIDTH - points[1])*SCALING_FACTOR - Y_TRANSLATION;
    points[2] = points[2]*SCALING_FACTOR + X_TRANSLATION;
    points[3] = (WIDTH - points[3])*SCALING_FACTOR - Y_TRANSLATION;
    
    return points;
}

