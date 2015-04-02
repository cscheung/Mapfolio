var HEIGHT = 450;
var WIDTH = 650;
var SCALING_FACTOR = 1;
var X_TRANSLATION = 75;
var Y_TRANSLATION = 75; 
var VERTEX_RADIUS = 10;

   
butnum=0;
imgnum=0;
var button = new Array();
var imgArray = new Array();
points_array = [];
intersections_array = [];
walls_array = [];
verticies_array = [];
var canvas;
var imgInstance;
var imgElement;

function showImage() {
    var img = document.getElementById('loadingImage');

    if (img.style.visibility == 'visible') {
        img.style.visibility = 'hidden';
    }
    else    {
        img.style.visibility = 'visible';
    }
}
$(document).ready(function(){
    
    canvas = new fabric.Canvas('c');
    canvas.setDimensions({
        backgroundColor: '#d1d1d1',
        width: WIDTH,
        height:HEIGHT
    });
    /*
    canvas.setOverlayImage('http://loveshav.com/wp-content/uploads/2013/11/Alaskan-Klee-Kai-puppy-6.jpg',
        canvas.renderAll.bind(canvas), {
  width: canvas.width, height: canvas.height,originX: 'left',originY: 'top'});
*/
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
});

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
    
    for(i=0; i < verticies_array.length; i++)
    {
        if (verticies_array[i].wall2.id == wall.id)
        {                      

            verticies_array[i].top = wall.get('y1') - VERTEX_RADIUS;
            verticies_array[i].left = wall.get('x1') - VERTEX_RADIUS;

            //verticies_array[i].set({'top' : wall.get('y1') - VERTEX_RADIUS});
            //verticies_array[i].set({'left' : wall.get('x1') - VERTEX_RADIUS}); 
            
            verticies_array[i].wall1.set({'x2' : verticies_array[i].left + VERTEX_RADIUS});
            verticies_array[i].wall1.set({'y2' : verticies_array[i].top + VERTEX_RADIUS});            
        }
        
        if (verticies_array[i].wall1.id == wall.id)
        {
            verticies_array[i].set({'top' : wall.get('y2') - VERTEX_RADIUS});
            verticies_array[i].set({'left' : wall.get('x2') - VERTEX_RADIUS});
        
            verticies_array[i].wall2.set({'x1' : verticies_array[i].left + VERTEX_RADIUS});
            verticies_array[i].wall2.set({'y1' : verticies_array[i].top + VERTEX_RADIUS});
        }
        
    }
    
}   

function redraw_elements()
{
    /*
    canvas.dispose();
    
    var c = new fabric.Line(
    [
        10,  
        20,  
        40,  
        60
    ],
    {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 10,
      name: 'wall'
    });
    

    canvas.add(c);  
*/
    /*
    for (i = 0; i < walls_array.length; i++) 
    {
        canvas.add(walls_array[i]);   
    }
    */
    /*
    for (i = 0; i < verticies_array.length; i++) 
    {
        canvas.add(verticies_array[i]);   
    }
    */
    canvas.renderAll();
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

function draw_floorplan()
{
    load_points();
    draw_walls();
    //redraw_elements();
}

function load_points()
{
    var points = $('.points_class').data('points');
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
        var wall = make_wall(i, translated_points);
        walls_array.push(wall);
    }
    
    //Put on walls    
    for (i = 0; i < walls_array.length; i++)
    {
        canvas.add(walls_array[i]);
        walls_array[i].old_left = walls_array[i].left;
        walls_array[i].old_top = walls_array[i].top;
    }
    
    //Make intersections
    //Put them on canvas
    for (i = 0; i < walls_array.length; i++)
    {
        var wall1_id = i;
        var wall2_id = (i+1)%points_array.length;
        var vertex = make_vertex(
        walls_array[i].x2, 
        walls_array[i].y2, 
        walls_array[wall1_id], 
        walls_array[wall2_id]);
        
        canvas.add(vertex);
        verticies_array.push(vertex);
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

function translate_points(points)
{
    points[0] = points[0]*SCALING_FACTOR + X_TRANSLATION;
    points[1] = (WIDTH - points[1])*SCALING_FACTOR - Y_TRANSLATION;
    points[2] = points[2]*SCALING_FACTOR + X_TRANSLATION;
    points[3] = (WIDTH - points[3])*SCALING_FACTOR - Y_TRANSLATION;
    
    return points;
}

function hide_update_button()
{
    document.getElementById("save_floorplan").style.visibility = 'hidden';
}

function show_update_button()
{
    document.getElementById("save_floorplan").style.visibility = 'visible';
}

function save_floorplan()
{
    //hide_update_button();
    //Dummy function for actually putting the values into the db
    save_floorplan_to_database();
    //Hide the verticies
    for(i=0; i < verticies_array.length; i++)
    {
        //verticies_array[i].set('visible', false);
    }

    canvas.renderAll();
    
    
    //Testing the fix of the verte moving
    var c = new fabric.Circle({
      left: 10,
      top: 10,
      strokeWidth: 5,
      radius: 12,
      fill: '#fff',
      stroke: '#666'
    });

    canvas.add(c);
    
    //c.setLeft(50);
        
    //verticies_array[0].setTop(10);
    
    
    //verticies_array[0].x = 100 - VERTEX_RADIUS;
    //verticies_array[0].y = 100 - VERTEX_RADIUS;
    canvas.renderAll();

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
    }
    else
    {
        document.getElementById("toggle_edit").innerHTML = "Edit";   
    }
    
      var walls_data_array = [];
      for (i = 0; i < walls_array.length; i++)
      {
	  	var wall = {x1:walls_array[i].x1, y1:walls_array[i].y1, 
		  			x2:walls_array[i].x2, y2:walls_array[i].y2 
		  			};
	  	walls_data_array.push(wall);
      }
      
      $.ajax({
           type:'POST', 
           url: '/floorplans', 
           data: $.param({floorplan: {walls_attributes: walls_data_array}})
      }); 
      
        
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
