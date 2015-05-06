walls = [];

function make_floorplan(name, points)
{
    make_walls(points);
    save_floorplan(name);
}

function make_walls(points_array)
{
    intersections = [];

    //Find intersections
    for (i = 0; i < points_array.length; i++)
    {
        var p0 = points_array[i];
        var p1 = points_array[(i+1)%points_array.length];
        
        //snap to 90: make angles in 75-105 range 90
        console.log("p1 angle original" + p1.angle);
        if (((p1.angle - p0.angle) >= 75) || ((p1.angle - p0.angle) <= 105)) 
        {
            p1.angle = p0.angle + 90;
            console.log("p1 angle changed" + p1.angle);
        }
        else if (((p0.angle - p1.angle) >= 75) || ((p1.angle - p0.angle) <= 105))
        {
            p1.angle = p0.angle - 90;
            console.log("p1 angle changed" + p1.angle);
        }

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


function save_floorplan(fp_name)
{
  console.log("saving");
    
  $.ajax({
      type:'POST',
      url: '/floorplans',
      data:  $.param({floorplan: { name: fp_name, walls_attributes: walls}}),
      dataType: 'json',
      success:function(data) {
        window.location.href = data.location;
      }
  });
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
    points[0] = points[0];
    points[1] = (WIDTH - points[1]);
    points[2] = points[2];
    points[3] = (WIDTH - points[3]);
    return points;
}
