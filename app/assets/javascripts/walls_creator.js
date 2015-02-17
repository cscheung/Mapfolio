var points_array = [];

function load_points()
{
    players = $('.points_class').data('points');
    for(i=0; i < players.length; i++)
    {
        var new_point = {
            angle: players[i].angle, 
            x: players[i].x, 
            y: players[i].y};
            
        points_array.push(new_point);
    }

}

function show_points()
{
   console.log(points_array); 
}

