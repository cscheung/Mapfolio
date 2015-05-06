var HEIGHT = 300;
var WIDTH = 300;
var X_MARGIN = 30;
var Y_MARGIN = 30; 
var VERTEX_RADIUS = 12;

   
butnum=0;
imgnum=0;
var button = new Array();
var imgArray = new Array();
intersections_array = [];
verticies = [];
canvas_walls = [];
var canvas;
var imgInstance;
var imgElement;

$( window ).load(function() { setup_canvas(); });

function setup_canvas()
{
    canvas = new fabric.Canvas('c');
    canvas.setDimensions({
        backgroundColor: '#d1d1d1',
        width: WIDTH,
        height:HEIGHT
    });
	//canvas.selection = false;

	var boundingBox = new fabric.Rect({
	  fill: "none",
	  width: WIDTH,
	  height: HEIGHT,
	  hasBorders: false,
	  hasControls: false,
	  lockMovementX: true,
	  lockMovementY: true,
	  evented: false,
	  stroke: "red"
	});
    
    canvas.on('mouse:up', function(e) 
    {
        if(e.target)
        {
            //Call a js function
            display_photo(e.target);
            
            //Fix the positionings
            if(e.target.name == 'vertex')
            {
                redraw_elements();
                console.log("vertex done moving");
            }
            else if (e.target.name == 'wall')
            {
                redraw_elements();
                console.log("wall done moving");            
            }
        }

    });

      canvas.on('object:scaling', function(e) 
        {
            if(e.target)
            {
                //Call a js function
                lock_camera(e.target);
                canvas.renderAll();
            }
        });
        
         
    canvas.on('object:moving', function(e) 
    {
        if(e.target.name == 'vertex')
        {           
            move_walls_with_vertex(e.target, boundingBox); 
            //canvas.renderAll();
        }
        else if (e.target.name == 'wall')
        {
            //This sets the x,y vars of the wall when you move it
            //when you move, you only change the left,top vars
            
            delta_x = e.target.left - e.target.old_left;
            delta_y = e.target.top - e.target.old_top;
                        
            e.target.set({'x1' : e.target.get('x1') + delta_x});
            e.target.set({'x2' : e.target.get('x2') + delta_x});
            e.target.set({'y1' : e.target.get('y1') + delta_y});
            e.target.set({'y2' : e.target.get('y2') + delta_y});
            
            e.target.old_left = e.target.left;
            e.target.old_top = e.target.top;
            
            move_vertecies_with_wall(e.target); 
            canvas.renderAll();
        }
    });	 

    draw_floorplan();
    
}

function draw_floorplan()
{
    var floorplan = $('.floorplan_class').data('floorplan');
    var walls = $('.walls_class').data('walls');
    var scaledWalls = resizeFloorplan(walls);
    draw_walls(scaledWalls);
}

function resizeFloorplan(walls)
{
    var minX = 9007199254740992;
    var minY = 9007199254740992;
    var maxX = -9007199254740992; 
    var maxY = -9007199254740992;

    //find min and max
    for (var i = 0; i < walls.length; i++) {
        if (walls[i].x1 < minX)
            minX = walls[i].x1;
        if (walls[i].x1 > maxX)
            maxX = walls[i].x1;
        
        if (walls[i].x2 < minX)
            minX = walls[i].x2;
        if (walls[i].x2 > maxX)
            maxX = walls[i].x2;

        if (walls[i].y1 < minY)
            minY = walls[i].y1;
        if (walls[i].y1 > maxY)
            maxY = walls[i].y1;


        if (walls[i].y2 < minY)
            minY = walls[i].y2;
        if (walls[i].y2 > maxY)
            maxY = walls[i].y2;
    }
    
    var canvasSizeX = WIDTH - 2*X_MARGIN;
    var canvasSizeY = HEIGHT - 2*Y_MARGIN;

    var scaleX = canvasSizeX*1.0 / ((maxX-minX)*1.0);
    var scaleY = canvasSizeY*1.0 / ((maxY-minY)*1.0);
  
    var finalScaling;
    if (scaleX > scaleY)
        finalScaling = scaleY;
    else 
        finalScaling = scaleX;

    //center the floorplan on canvas
    var X_TRANSLATION = (canvasSizeX - (maxX - minX)*finalScaling) / 2;
    var Y_TRANSLATION = (canvasSizeY - (maxY - minY)*finalScaling) / 2;

    var newWalls = []
    //shift, then scale
    for (var i = 0; i < walls.length; i++) {
        //shift into 1st quadrant, starting at origin
        var x1 = walls[i].x1 - minX;
        var x2 = walls[i].x2 - minX;
        var y1 = walls[i].y1 - minY;
        var y2 = walls[i].y2 - minY;

        //scale
        x1 = x1*finalScaling + X_MARGIN + X_TRANSLATION;
        x2 = x2*finalScaling + X_MARGIN + X_TRANSLATION;
        y1 = y1*finalScaling + Y_MARGIN + Y_TRANSLATION;
        y2 = y2*finalScaling + Y_MARGIN + Y_TRANSLATION;

        
        var wall = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        }
        
        newWalls.push(wall);
    }
    return newWalls;
}

function draw_walls(walls_array)
{
    //Put on walls    
    for (i = 0; i < walls_array.length; i++)
    {
        var points = 
        [
            walls_array[i].x1,
            walls_array[i].y1,
            walls_array[i].x2,
            walls_array[i].y2
        ];
        var wall = make_wall(i, points);
        
        canvas.add(wall);
        
        wall.old_left = wall.left;
        wall.old_top = wall.top;
        canvas_walls.push(wall);
    }
    
    //Make intersections and put them on canvas
    for (i = 0; i < canvas_walls.length; i++)
    {
      var wall1_id = i;
      var wall2_id = (i+1)%canvas_walls.length;
      
      //console.log(canvas_walls[i].x2);
      //console.log(canvas_walls[i].y2);
      
      var vertex = make_vertex(
      canvas_walls[i].x2, 
      canvas_walls[i].y2, 
      canvas_walls[wall1_id], 
      canvas_walls[wall2_id]
      );
      
      canvas.add(vertex);
      verticies.push(vertex);
    
    } 
    
   canvas.renderAll();
}//end draw_walls

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
  
    c.hasBorders = false;
    c.hasControls = false;
    
    return c;
}


function make_wall(id, coords) 
{
    var c = new fabric.Line(coords, 
    {
      fill: 'black',
      stroke: 'black',
      strokeWidth: 5,
      name: 'wall'
    });
    
    c.old_left = 0;
    c.old_top = 0;
    c.hasBorders = false;
    c.hasControls = false;
    c.id = id;
    c.selectable = false;
    return c;
}


function move_walls_with_vertex(vertex, boundingBox)
{            
	var minHeight = VERTEX_RADIUS;
	var maxHeight = HEIGHT - VERTEX_RADIUS;
	var minWidth = VERTEX_RADIUS;
	var maxWidth = WIDTH - VERTEX_RADIUS;
	var vertex_left = vertex.left;
	var vertex_top = vertex.top;
	console.log("vertex top: " + vertex.top);
	console.log("vertex left: " + vertex.left);
    console.log('--');
	/* CANVAS EDGE PROTECTION FOR VERTICES */
	//if object on left of canvas, must be hitting left edge
	if (vertex.left < WIDTH/2)
		vertex.setLeft(Math.max(vertex.left,0));
	else {
		vertex.setLeft(Math.min(vertex.left,WIDTH-2*VERTEX_RADIUS-2));
	}
	//if object on bottom half, must be hitting bottom edge
	if (vertex.top > HEIGHT/2) {
		console.log("vertex top " + vertex.top);
		vertex.setTop(Math.min(vertex.top, HEIGHT-2*VERTEX_RADIUS-2));
	}
	else {
		vertex.setTop(Math.max(vertex.top, 0));
	}

	

	vertex.wall1.set({'x2' : vertex.left + VERTEX_RADIUS});
	vertex.wall1.set({'y2' : vertex.top + VERTEX_RADIUS});
		
	vertex.wall2.set({'x1' : vertex.left + VERTEX_RADIUS});
	vertex.wall2.set({'y1' : vertex.top + VERTEX_RADIUS});

    //Want to check this eventaully            
    //if(!wall_threshold_hit(p))
    //console.log(vertex.wall1.get('top'));
    //console.log(vertex.wall1.get('left'));
    //console.log('--');
    
/*
	var edge_safe_pos = check_points_wall(vertex.left + VERTEX_RADIUS, minWidth, maxWidth);
	vertex.wall1.set({'x2' : edge_safe_pos});
	edge_safe_pos = check_points_wall(vertex.top + VERTEX_RADIUS, minHeight, maxHeight);
	vertex.wall1.set({'y2' : edge_safe_pos});

	edge_safe_pos = check_points_wall(vertex.left + VERTEX_RADIUS, minWidth, maxWidth);
	vertex.wall2.set({'x1' : edge_safe_pos});
	edge_safe_pos = check_points_wall(vertex.top + VERTEX_RADIUS, minHeight, maxHeight);
	vertex.wall2.set({'y1' : edge_safe_pos});
*/

/*
	var goodtop, goodleft, boundingObject;

	canvas.on("object:moving", function(){
		var obj = this.relatedTarget;
		var bounds = boundingObject;
		obj.setCoords();
		if(!obj.isContainedWithinObject(bounds)){
			obj.setTop(goodtop);
			obj.setLeft(goodleft);
			canvas.refresh();    
		} else {
			goodtop = obj.top;
			goodleft = obj.left;
		}  
	});
*/
/*
		vertex.wall1.set({'x2' : vertex.left + VERTEX_RADIUS});
		vertex.wall1.set({'y2' : vertex.top + VERTEX_RADIUS});
			
		vertex.wall2.set({'x1' : vertex.left + VERTEX_RADIUS});
		vertex.wall2.set({'y1' : vertex.top + VERTEX_RADIUS});
*/
}

function move_vertecies_with_wall(wall)
{   
    
    for(i=0; i < verticies.length; i++)
    {
        if (verticies[i].wall2.id == wall.id)
        {                      

            verticies[i].top = wall.get('y1') - VERTEX_RADIUS;
            verticies[i].left = wall.get('x1') - VERTEX_RADIUS;

            //verticies_array[i].set({'top' : wall.get('y1') - VERTEX_RADIUS});
            //verticies_array[i].set({'left' : wall.get('x1') - VERTEX_RADIUS}); 
            
            verticies[i].wall1.set({'x2' : verticies[i].left + VERTEX_RADIUS});
            verticies[i].wall1.set({'y2' : verticies[i].top + VERTEX_RADIUS});            
        }
//function wall_threshold_hit(vertex)
        
        if (verticies[i].wall1.id == wall.id)
        {
            verticies[i].set({'top' : wall.get('y2') - VERTEX_RADIUS});
            verticies[i].set({'left' : wall.get('x2') - VERTEX_RADIUS});
        
            verticies[i].wall2.set({'x1' : verticies[i].left + VERTEX_RADIUS});
            verticies[i].wall2.set({'y1' : verticies[i].top + VERTEX_RADIUS});
        }
        
    }
    
}   

 

/*dog*/
b=0;


/*------------------------------------*/

/*camera code*/
function display_photo(canvas_object)
{
    if (canvas_object.name == "photo")
    {
        canvas.remove(canvas_object);
        console.log("photo clicked");
    }
    if (canvas_object.name == "camera")
    {
        //changeImage();
        console.log("camera clicked");
        if (imgnum==canvas_object.number) {
            //showImage();
            displayAsImage();

        }
        else {
            imgnum=canvas_object.number;
            var img = document.getElementById('loadingImage');
            //img.style.visibility = 'visible';
            displayAsImage();

        }
        canvas.renderAll.bind(canvas);
    }
       
    
}
function lock_camera(canvas_object)  {
    if (canvas_object.name == "camera")
    {
        //canvas_object.set('selectable', false);
        console.log("locking camera");
        
    }

}
function create_camera_icon()
{
    console.log("CAMERA created");
    //Dont take the / out
    fabric.Image.fromURL("/camera.png", function(oImg) 
    {
        oImg.name = "camera";
        oImg.number = butnum-1;
        oImg.scale(0.5);
        oImg.set('selectable', true);
        oImg.set('hasRotatingPoint', false);
        oImg.lockScalingY=true;
        oImg.lockScalingX=true;
        oImg.hasControls=false;
        oImg.hasBorders=false;
        //oImg.transparentCorners=true;
        //oImg.set('hasBorders', false);
        canvas.add(oImg);
    });
}
function previewFile() {

    button[butnum]=create_camera_icon();
    
    showPhoto();
    imgnum=butnum;
    
    
    
}
function showPhoto()    {
    var preview = document.getElementById('loadingImage');
    imgArray[butnum]=document.querySelector('input[type=file]').files[0];
    console.log("imgarray %d assigned", butnum);
    //var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
    preview.src = reader.result;
    }

    if (imgArray[butnum]) {
       reader.readAsDataURL(imgArray[butnum]);
    } else {
        preview.src = "";
    }
    butnum++;
}
function showPhoto2()    {
    var preview = document.getElementById('loadingImage');
    //var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
    preview.src = reader.result;
    }

    if (imgArray[imgnum]) {
       reader.readAsDataURL(imgArray[imgnum]);
    } else {
       // preview.src = "";
    }

}
/*camera code*/

function showImage() {
    var img = document.getElementById('loadingImage');

    if (img.style.visibility == 'visible') {
        img.style.visibility = 'hidden';
    }
    else    {
        img.style.visibility = 'visible';
    }
}

function check_points_wall(point, max, min) {
	if (point >= (max - VERTEX_RADIUS))
		return (max - VERTEX_RADIUS);
	if (point <= (min + VERTEX_RADIUS))
		return (min + VERTEX_RADIUS);
	return point;
}


function wall_threshold_hit(vertex, max)
{
    
/*
    var a = vertex.wall1.get('x2') - vertex.wall1.get('x1');
    var b = vertex.wall1.get('y2') - vertex.wall1.get('y1');
    var a_sqr = Math.pow(a, 2);
    var b_sqr = Math.pow(b, 2);
	
	var a_x = vertex.wall1.get('x2');
	var b_x = vertex.wall1.get('x1');
	var a_y = vertex.wall1.get('y1');
	var b_y = vertex.wall1.get('y2'); */

/*
	if (a_x > (WIDTH - VERTEX_RADIUS) || a_x < (0 + VERTEX_RADIUS))
		return true;
	if (b_x > (WIDTH - VERTEX_RADIUS) || b_x < (0 + VERTEX_RADIUS))
		return true;
	if (a_x > (HEIGHT - VERTEX_RADIUS) || a_x < (0 + VERTEX_RADIUS))
		return true;
	if (a_y > (HEIGHT - VERTEX_RADIUS) || a_y < (0 + VERTEX_RADIUS))
		return true;
*/
        
/*
    if (Math.sqrt(a_sqr + b_sqr) < )
    {
        return true;
    }
*/
    
    //a = vertex.wall2.get('x2') - vertex.wall2.get('x1');
    //b = vertex.wall2.get('y2') - vertex.wall2.get('y1');
/*
    a_sqr = Math.pow(a, 2); b_sqr = Math.pow(b, 2);
    
    if (Math.sqrt(a_sqr + b_sqr) < WALL_THRESH)
    {
        return true;
    }
*/
    
    
    return false;
}
function placeImage()   {
    imgElement = document.getElementById('loadingImage');

    imgInstance = new fabric.Image(imgElement, {
      //left: 0,
      //top: 100,
      //angle: 30,
      //opacity: 0.85
    });
    /*
    canvas.setOverlayImage('http://loveshav.com/wp-content/uploads/2013/11/Alaskan-Klee-Kai-puppy-6.jpg',
        canvas.renderAll.bind(canvas), {
  width: canvas.width, height: canvas.height,originX: 'left',originY: 'top'});
*/
    console.log("placeImage()");
    canvas.add(imgInstance);
}
function changeImage()   {
    //imgElement = document.getElementById('loadingImage');
    //canvas.remove(imgInstance);
 //imgInstance.setElement(document.getElementById('loadingImage'));
    //imgInstance = new fabric.Image(imgElement, {
      //left: 0,
      //top: 100,
      //angle: 30,
      //opacity: 0.85
    //});
    /*
    canvas.setOverlayImage('http://loveshav.com/wp-content/uploads/2013/11/Alaskan-Klee-Kai-puppy-6.jpg',
        canvas.renderAll.bind(canvas), {
  width: canvas.width, height: canvas.height,originX: 'left',originY: 'top'});
*/
    console.log("changeImage()");
    
    //canvas.add(imgInstance);
}
function removeImage()   {
  // document.getElementById('loadingImage').src="";
    //canvas.remove(imgInstance);
}





function displayAsImage() {
    //canvas.remove(imgInstance);
    file =imgArray[imgnum];
    console.log(imgnum);
  var imgURL = URL.createObjectURL(file);
  
  /*
      img = document.getElementById('loadingImage');

  

  img.src = imgURL;
  */
  //document.body.appendChild(img);
  //canvas.renderAll.bind(canvas);
  imgInstance=new fabric.Image.fromURL(imgURL, function(oImg) {
        oImg.name="photo";
        oImg.width=canvas.width;
        oImg.height=canvas.height;
      canvas.add(oImg);
    });
}
