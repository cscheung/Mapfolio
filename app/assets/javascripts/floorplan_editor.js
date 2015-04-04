var HEIGHT = 400;
var WIDTH = 400;
var SCALING_FACTOR = 1;
var X_TRANSLATION = 75;
var Y_TRANSLATION = 75; 
var VERTEX_RADIUS = 10;

   
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

$(document).ready(function()
{  
    canvas = new fabric.Canvas('c');
    canvas.setDimensions({
        backgroundColor: '#d1d1d1',
        width: WIDTH,
        height:HEIGHT
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
    
});//end document ready

function draw_floorplan()
{
    var floorplan = $('.floorplan_class').data('floorplan');
    var walls = $('.walls_class').data('walls');
    
    draw_walls(walls);
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
        if (hasVertex(canvas_walls[i].x1, canvas_walls[i].y1) == false)
        {
            var wall1_id = i;
            var wall2_id = (i+1)%canvas_walls.length;
    
            console.log(canvas_walls[i].x2);
            console.log(canvas_walls[i].y2);
    
            var vertex = make_vertex(
            canvas_walls[i].x1, 
            canvas_walls[i].y1, 
            canvas_walls[wall1_id], 
            canvas_walls[wall2_id]
            );
            
            canvas.add(vertex);
            verticies.push(vertex);
        }
        if (hasVertex(canvas_walls[i].x2, canvas_walls[i].y2) == false)
        {
            var wall1_id = i;
            var wall2_id = (i+1)%canvas_walls.length;
    
            console.log(canvas_walls[i].x2);
            console.log(canvas_walls[i].y2);
    
            var vertex = make_vertex(
            canvas_walls[i].x2, 
            canvas_walls[i].y2, 
            canvas_walls[wall1_id], 
            canvas_walls[wall2_id]
            );
            
            canvas.add(vertex);
            verticies.push(vertex);
        }
    } 
    
   canvas.renderAll();
}//end draw_walls

function hasVertex(x, y)
{
    for(var i = 0; i < verticies.length; i++)
    {
        if ((verticies[i].top - VERTEX_RADIUS == y) && (verticies[i].left - VERTEX_RADIUS == x))
        {
            return true;
        }
    }
    return false;
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

    c.visible = false;    
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
    fabric.Image.fromURL('camera.png', function(oImg) 
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








function hide_update_button()
{
    document.getElementById("save_floorplan").style.visibility = 'hidden';
}

function show_update_button()
{
    document.getElementById("save_floorplan").style.visibility = 'visible';
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
function toggle_edit()
{     
    var title = document.getElementById("toggle_edit").innerHTML;
    
    if (title == "Edit")
    {
        document.getElementById("toggle_edit").innerHTML = "Done";  
        for(i=0; i < verticies.length; i++)
        {
            verticies[i].visible = true;
            verticies[i].selectable = true;
        } 
        canvas.renderAll();
    }
    else
    {
        document.getElementById("toggle_edit").innerHTML = "Edit";   
        for(i=0; i < verticies.length; i++)
        {
            verticies[i].visible = false;
            verticies[i].selectable = false;
        }
        canvas.renderAll();
        
        update_floorplan();
    }      
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
