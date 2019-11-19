function xmas(){
    $.ajax({url: 'acttheme/xmas/snowfall.jquery.min.js', async: false, dataType: 'script'});
    $(document).ready(function() {
        var windowWidth = $(document).width();
        var santa = $('.santa');
        santa_right_pos = windowWidth + santa.width();
        santa.right = santa_right_pos;            
        function movesanta(){
        santa.animate({right : windowWidth +  santa.width()},20000, function(){
        santa.css("right","-500px");
        setTimeout(function(){
        movesanta();
        },60000);
        });
        }
        movesanta();
        });

    $('head').append('<link rel="stylesheet" href="/acttheme/xmas/xmas.css" type="text/css" />');
    $('body').append('<div class="santa"><img src="/acttheme/xmas/xmas_sledge.gif" alt="" height="102" width="183"></div>');
    if (theme.features.snowfall.enabled !== false){
        $(document).snowfall({flakeCount : 150, maxSpeed : 1, maxSize : 10, round: true});
    }
    if (window.innerWidth > 767){
        $('body').append('<div class="xmas-tree"><img src="/acttheme/xmas/christmas_PNG17241.png" alt="" height="202" width="283"></div>');         
    }
}
