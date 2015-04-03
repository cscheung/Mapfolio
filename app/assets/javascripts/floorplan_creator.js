walls = [];

function make_floorplan(points)
{
    make_walls(points);
    save_floorplan();
}

function make_walls(points_array)
{
    intersections = [];
    //Find intersections
    for (i = 0; i < points_array.length; i++) 
    {
        var p0 = points_array[i];
        var p1 = points_array[(i+1)%points_array.length];
        var p2 = find_intersection(p0, p1);

        intersections.push(p2);
    }
    
    //Find walls
    for (i = 0; i < intersections.length; i++) 
    {
        var a = intersections[i];
        var b = intersections[(i+1)%intersections.length];
        
        var translated_points = translate_points([a.x, a.y, b.x, b.y]);
        var wall = {
            x1: translated_points[0],
            y1: translated_points[1],
            x2: translated_points[2],
            y2: translated_points[3]
        }
        
        walls.push(wall);
    }
}


function save_floorplan()
{    
    $.ajax({
        type:'POST', 
        url: '/floorplans', 
        data: $.param({floorplan: {walls_attributes: walls}})
    });
    
    console.log("Saved!");
}
//Helper
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

//Helper
function translate_points(points)
{
    points[0] = points[0]*SCALING_FACTOR + X_TRANSLATION;
    points[1] = (WIDTH - points[1])*SCALING_FACTOR - Y_TRANSLATION;
    points[2] = points[2]*SCALING_FACTOR + X_TRANSLATION;
    points[3] = (WIDTH - points[3])*SCALING_FACTOR - Y_TRANSLATION;
    
    return points;
}