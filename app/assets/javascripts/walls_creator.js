var points_array = [];

function load_points()
{
    points = $('.points_class').data('points');
    for(i=0; i < points.length; i++)
    {
        var new_point = {
            angle: points[i].angle, 
            x: points[i].x, 
            y: points[i].y};
            
        points_array.push(new_point);
    }

}

function show_points()
{
   console.log(points_array); 
}

