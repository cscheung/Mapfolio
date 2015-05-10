var HEIGHT = 300;
var WIDTH = 300;
var X_MARGIN = 30;
var Y_MARGIN = 30; 
var VERTEX_RADIUS = 12;
var KNOB_RADIUS = 20;
var WALL_WIDTH = 5;
var hidevar=0;

   
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

$( document ).ready(function() {
    setup_canvas();
});

function setup_canvas()
{
    canvas = new fabric.Canvas('c');
    canvas.selection = false;
    canvas.setDimensions({
        backgroundColor: '#d1d1d1',
        width: WIDTH,
        height:HEIGHT
    });
    
    canvas.on('mouse:down', function(e) 
    {
        hidevar=1;
    });
    canvas.on('mouse:move', function(e) 
    {
        hidevar=0;
    });
    canvas.on('mouse:up', function(e) 
    {
      //hidevar=0;
      if(e.target)
      {
          //Call a js function
          display_photo(e.target);
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
            move_walls_with_vertex(e.target); 
            canvas.renderAll();
        }
        else if (e.target.name == 'wall')
        {          

            delta_x = e.target.left - e.target.old_left;
            delta_y = e.target.top - e.target.old_top;
            e.target.old_left = e.target.left;
            e.target.old_top = e.target.top;
            move_vertecies_with_wall(e.target, delta_x, delta_y);  
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
    if(typeof walls === 'undefined') return walls;
    var newWalls = [];

    //rotate the walls, so the first wall is parallel to the x axis
    var slope = (walls[0].y2 - walls[0].y1) / (walls[0].x2 - walls[0].x1);
    var rotateby = Math.atan(slope); 
    var matrix = new FULLTILT.RotationMatrix();
    matrix.rotateZ(rotateby);
    
    for (var i = 0; i < walls.length; i++) {
        var new_x1 = matrix.elements[0]*walls[i].x1 + matrix.elements[3]*walls[i].y1; 
        var new_y1 = matrix.elements[1]*walls[i].x1 + matrix.elements[4]*walls[i].y1;
        var new_x2 = matrix.elements[0]*walls[i].x2 + matrix.elements[3]*walls[i].y2;
        var new_y2 = matrix.elements[1]*walls[i].x2 + matrix.elements[4]*walls[i].y2;
        
        var wall = {
            x1: new_x1,
            y1: new_y1,
            x2: new_x2,
            y2: new_y2
        }     
        newWalls.push(wall);
    }

    //find min and max
    var minX = 9007199254740992;
    var minY = 9007199254740992;
    var maxX = -9007199254740992; 
    var maxY = -9007199254740992;

    for (var i = 0; i < newWalls.length; i++) {
        if (newWalls[i].x1 < minX)
            minX = newWalls[i].x1;
        if (newWalls[i].x1 > maxX)
            maxX = newWalls[i].x1;
        
        if (newWalls[i].x2 < minX)
            minX = newWalls[i].x2;
        if (newWalls[i].x2 > maxX)
            maxX = newWalls[i].x2;

        if (newWalls[i].y1 < minY)
            minY = newWalls[i].y1;
        if (newWalls[i].y1 > maxY)
            maxY = newWalls[i].y1;

        if (newWalls[i].y2 < minY)
            minY = newWalls[i].y2;
        if (newWalls[i].y2 > maxY)
            maxY = newWalls[i].y2;
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

    //shift, then scale
    for (var i = 0; i < walls.length; i++) {
        //shift into 1st quadrant, starting at origin
        newWalls[i].x1 -= minX;
        newWalls[i].x2 -= minX;
        newWalls[i].y1 -= minY;
        newWalls[i].y2 -= minY;

        //scale
        newWalls[i].x1 = newWalls[i].x1*finalScaling + X_MARGIN + X_TRANSLATION;
        newWalls[i].x2 = newWalls[i].x2*finalScaling + X_MARGIN + X_TRANSLATION;
        newWalls[i].y1 = newWalls[i].y1*finalScaling + Y_MARGIN + Y_TRANSLATION;
        newWalls[i].y2 = newWalls[i].y2*finalScaling + Y_MARGIN + Y_TRANSLATION;    
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
        
        console.log("making this wall: ");
        console.log(points);
        var wall = make_wall(points);
        /*
        var knob = make_knob(points);
        
        var group = new fabric.Group([wall,knob], {
          name: 'wall',
          old_left: 0,
          old_top: 0,
          hasBorders: false,
          hasControls: false,
          id: i
        });
        
        canvas.add(group);
        */
        canvas.add(wall);
        
        wall.old_left = wall.left;
        wall.old_top = wall.top;
        //canvas_walls.push(group);
        canvas_walls.push(wall);
    }
    
    //Make intersections and put them on canvas
    for (i = 0; i < canvas_walls.length; i++)
    {
      var wall1_id = i;
      var wall2_id = (i+1)%canvas_walls.length;
            
      var vertex = make_vertex(
      canvas_walls[wall1_id].x2, 
      canvas_walls[wall1_id].y2, 
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
    var c = new fabric.Rect(
    {
        left: left - VERTEX_RADIUS + WALL_WIDTH,
        top: top - VERTEX_RADIUS + WALL_WIDTH,
        strokeWidth: 2,
        width: KNOB_RADIUS,
        height: KNOB_RADIUS,
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

function make_wall(coords) 
{
    var straight_threshold = 10;
    var c = new fabric.Line(coords);
        
    c.fill = 'black';
    c.stroke = 'black';
    c. strokeWidth = WALL_WIDTH;
              
    //horizontal line
    if(Math.abs(coords[1] - coords[3]) < straight_threshold)
    {
      c.lockMovementX = true;
    }
    //vertical line
    if(Math.abs(coords[0] - coords[2]) < straight_threshold)
    {
      c.lockMovementY = true;
    }
    
    return c;
}

function make_knob(coords) 
{
  var knob = new fabric.Rect(
  {
      left: (coords[0]+coords[2])/2 - VERTEX_RADIUS + WALL_WIDTH,
      top: (coords[1]+coords[3])/2 - VERTEX_RADIUS + WALL_WIDTH,
      strokeWidth: 2,
      width: KNOB_RADIUS,
      height: KNOB_RADIUS,
      fill: '#fff',
      stroke: '#666'
  });
    
  return knob;
}


function move_walls_with_vertex(vertex, boundingBox)
{            
	var minHeight = VERTEX_RADIUS;
	var maxHeight = HEIGHT - VERTEX_RADIUS;
	var minWidth = VERTEX_RADIUS;
	var maxWidth = WIDTH - VERTEX_RADIUS;
	var vertex_left = vertex.left;
	var vertex_top = vertex.top;
	
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
}


function move_vertecies_with_wall(wall, delta_x, delta_y)
{   
    console.log(wall.top);
    console.log(wall.left);
    for(i=0; i < verticies.length; i++)
    {
        if (verticies[i].wall2.id == wall.id)
        {                      
            verticies[i].top += delta_y;
            verticies[i].left += delta_x;
            
            verticies[i].wall1.top += delta_y;
            verticies[i].wall1.left += delta_x;
        }
        
        if (verticies[i].wall1.id == wall.id)
        {
          /*
            verticies[i].top += delta_y;
            verticies[i].left += delta_x;
        
            verticies[i].wall2.top += delta_y;
            verticies[i].wall2.left += delta_x;
            */
        }
    }
}   

 function update_floorplan()
{
  var floorplan_id = $('.floorplan_class').data('floorplan').id; 
  var fp_name = $('.floorplan_class').data('floorplan').name;
 
    var db_walls = [];
	  for (i = 0; i < canvas_walls.length; i++)
    {
        var points = 
        {
          x1: canvas_walls[i].x1,
          y1: canvas_walls[i].y1,
          x2: canvas_walls[i].x2,
          y2: canvas_walls[i].y2
        };
        db_walls.push(points);
    }

    
  
  $.ajax({
      type:'PUT',
      url: '/floorplans/' + floorplan_id,
      data:  $.param({floorplan: { name: fp_name, walls_attributes: db_walls}}),
      dataType: 'json'
  });
  
   
   
    window.location.href = "/floorplans";
     
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


function wall_threshold_hit(vertex)
{
    
    var a = vertex.wall1.get('x2') - vertex.wall1.get('x1');
    var b = vertex.wall1.get('y2') - vertex.wall1.get('y1');
    var a_sqr = Math.pow(a, 2);
    var b_sqr = Math.pow(b, 2);
        
    if (Math.sqrt(a_sqr + b_sqr) < WALL_THRESH)
    {
        return true;
    }
    
    a = vertex.wall2.get('x2') - vertex.wall2.get('x1');
    b = vertex.wall2.get('y2') - vertex.wall2.get('y1');
    a_sqr = Math.pow(a, 2);
    b_sqr = Math.pow(b, 2);
    
    if (Math.sqrt(a_sqr + b_sqr) < WALL_THRESH)
    {
        return true;
    }
    
    
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