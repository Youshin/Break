$(function() {
    //init
    var WIDTH, HEIGHT;
    var x = 150,
        y = 750,
        radius = 7;
    var dx = 2,
        dy = 4;
    var ctx;
    var anim;

    function init() {
        //canvas 가져오기
        ctx = $('#canvas')[0].getContext('2d');
        WIDTH = $('#canvas').width();
        HEIGHT = $('#canvas').height();
        //animation
        window.requestAnimationFrame(draw);
        window.requestAnimationFrame(draw);
    }
    function draw() {

        clear();
        ball(x, y, radius);
        x += dx;
        y += dy;
        if(x > WIDTH - radius || x < 0 + radius){
          dx = -dx;
        }
        if( y > HEIGHT - radius || y < 0 + radius){
          dy = -dy;
        }
        anim = window.requestAnimationFrame(draw);

        //draw bricks 
        for (i = 0; i < NROWS; i++) {
            for (j = 0; j < NCOLS; j++) {
                if (bricks[i][j] == 1) {
                    rect(j * BRICKWIDTH, i * BRICKHEIGHT
                        , BRICKWIDTH - PADDING, BRICKHEIGHT - PADDING);
                }
            }
        }
     
        //Have We Hit a Bricks? 
        var row = Math.floor(y/(BRICKHEIGHT+PADDING));
        var col = Math.floor(x/(BRICKWIDTH+PADDING));
        if(row < NROWS){
            if(bricks[row][col] == 1){
                dy = -dy;
                bricks[row][col] = 0;
            }
        }
    }

    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    function ball(x, y, r) {
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
    function rect(x, y, w, h){
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }
    function init_bricks() {
        NROWS = 10;
        NCOLS = 10;
        PADDING = 1;
        BRICKWIDTH = (WIDTH / NCOLS);
        BRICKHEIGHT = 15;
        bricks = new Array(NROWS);
        for (i = 0; i < NROWS; i++) {
            bricks[i] = new Array(NCOLS);
            for (j = 0; j < NCOLS; j++) {
                bricks[i][j] = 1;
            }
        }
    }
    init();

    init_bricks();

}); 