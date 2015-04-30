var HEIGHT = 300;
var WIDTH = 300;
var X_MARGIN = 30;
var Y_MARGIN = 30; 
var VERTEX_RADIUS = 12;
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
            move_walls_with_vertex(e.target); 
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
    var newWalls = []

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
        
        // var new_x1 = walls[i].x1; 
        // var new_y1 = walls[i].y1;
        // var new_x2 = walls[i].x2;
        // var new_y2 = walls[i].y2;

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


function move_walls_with_vertex(vertex)
{            
    //Want to check this eventaully            
    //if(!wall_threshold_hit(p))
    console.log(vertex.wall1.get('top'));
    console.log(vertex.wall1.get('left'));
    console.log('--');
    
    vertex.wall1.set({'x2' : vertex.left + VERTEX_RADIUS});
    vertex.wall1.set({'y2' : vertex.top + VERTEX_RADIUS});
        
    vertex.wall2.set({'x1' : vertex.left + VERTEX_RADIUS});
    vertex.wall2.set({'y1' : vertex.top + VERTEX_RADIUS});
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
            showModal();
            
            //displayAsImage();

        }
        else {
            imgnum=canvas_object.number;
            var img = document.getElementById('loadingImage');
            //img.style.visibility = 'visible';
            showModal();
            //hidevar=1;
            //displayAsImage();

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
        oImg.scale(0.6);
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
/*camera code*/




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

function showModal() {
    //canvas.remove(imgInstance);
    file =imgArray[imgnum];
    console.log(imgnum);
    var preview = document.getElementById('loadingImage');
    var reader = new FileReader();
    reader.onloadend = function () {
    preview.src = reader.result;
    }

    if (file) {
       reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }
    $('#picModal').modal('show');

}


function displayAsImage() {
    //canvas.remove(imgInstance);
    file =imgArray[imgnum];
    console.log(imgnum);
  var imgURL = URL.createObjectURL(file);
  
  imgInstance=new fabric.Image.fromURL(imgURL, function(oImg) {
        oImg.name="photo";
        oImg.width=canvas.width;
        oImg.height=canvas.height;
      canvas.add(oImg);
    });
}
function hideModal() {
    if (hidevar==0)    {
         $('#picModal').modal('hide');
     }
     hidevar=0;
    //$('#picModal').remove();
    }
    function hideModal2() {
   
         $('#helpModal').modal('hide');
     
    }