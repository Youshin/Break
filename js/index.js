$(function() {
    //init
    var WIDTH, HEIGHT;
    var x = 150,
        y = 750,
        radius = 7;
    var dx = 2,
        dy = -7;
    var ctx;
    var anim;
    var gameOn;
    var bricks = [];
    var balls = [];
    var score = 0;
    ballCount = 1;


    var BRICKHEIGHT = 0, BRICKWIDTH = 0;
    var NROWS = 0, NCOLS = 0;

    function init() {
        //canvas 가져오기
        ctx = $('#canvas')[0].getContext('2d');
        WIDTH = $('#canvas').width();
        HEIGHT = $('#canvas').height();
        x = WIDTH / 2;
        y = HEIGHT - 3;
        gameOn = false; // whether the ball is in motion
        // x = WIDTH / 2;
        // y = HEIGHT - 1;
        ctx.setLineDash([3, 10]);
        //$('#canvas').addEventListener("click", onClick, false);
        //animation
        window.requestAnimationFrame(draw);
        window.requestAnimationFrame(draw);
    }
    function draw() {

        clear();
        ball(x, y, radius);
        $('#score').text("Score: " + score);
        if(gameOn){
          x += dx;
          y += dy;
          if(x > WIDTH - radius || x < 0 + radius){
            dx = -dx;
          }
          if(y < 0 + radius){
            dy = -dy;
          }
          if( y > HEIGHT - radius - 2){
            gameOn = false;
            dy = -dy;
            //if()
            NROWS++;
            brickrow = [];
            emptyPositions = [];
            for (j = 0; j < NCOLS; j++) {
                brick = {};
                brick.color = getRndColor();
                brick.appear = Math.round(Math.random() - 0.2);
                if(brick.appear == 0){
                  emptyPositions.push(j);
                }
                brick.number = 2;
                brickrow[j] = brick;//Math.round(Math.random() + 0.2);
            }
            randomEmptyPos = Math.floor(Math.random()*(emptyPositions.length));
            newBallPos = emptyPositions[randomEmptyPos];
            brickrow[newBallPos].appear = 2;
            bricks.unshift(brickrow);
          }

          anim = window.requestAnimationFrame(draw);
        }
        // else{
        //
        // }


        //draw bricks
        for (i = 0; i < NROWS; i++) {
            for (j = 0; j < NCOLS; j++) {
                if(bricks[i][j].appear == 2){
                  newBall(j * BRICKWIDTH + BRICKWIDTH/2, i * BRICKHEIGHT + BRICKHEIGHT/2, radius + 3);
                }
                if (bricks[i][j].appear == 1) {
                    rect(j * BRICKWIDTH, i * BRICKHEIGHT
                        , BRICKWIDTH - PADDING, BRICKHEIGHT - PADDING, i, j);
                }
            }
        }

        //Have We Hit a Bricks?
        var row = Math.floor((y+radius)/(BRICKHEIGHT+PADDING));
        var col = Math.floor((x+radius)/(BRICKWIDTH+PADDING));
        if(row < NROWS){
            if(bricks[row][col].appear == 1){
                dy = -dy;
                bricks[row][col].number--;// = bricks[row][col].number - 1;
                if(bricks[row][col].number == 0){
                    bricks[row][col].appear = 0;
                    score++;
                }
            }
            else if(bricks[row][col].appear == 2){
                ballCount++;
                bricks[row][col].appear = 0;
            }
        }
        // if(y == HEIGHT - 5){
        //     gameOn = false;
        // }
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
    function rect(x, y, w, h, i, j){
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fillStyle = bricks[i][j].color;//getRndColor();
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "20px Comic Sans MS";
        ctx.fillText(bricks[i][j].number, x + BRICKWIDTH / 2 - 7, y + BRICKHEIGHT / 2 + 5);
    }
    function newBall(x, y, r){
      ctx.fillStyle = getRndColor();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
    function dropNewBall(i, j){
      bricks[i][j].appear = 0;
      var xnb = j * BRICKWIDTH + BRICKWIDTH/2;
      var ynb = i * BRICKHEIGHT + BRICKHEIGHT/2;

    }
    function init_bricks() {
        NROWS = 5;
        NCOLS = 10;
        PADDING = 3;
        BRICKWIDTH = (WIDTH / NCOLS);
        BRICKHEIGHT = BRICKWIDTH - BRICKWIDTH / 4;
        //bricks = new Array(NROWS);
        //var bricks = [];
        for (i = 0; i < NROWS; i++) {
            // bricks[i] = new Array(NCOLS);
            bricks[i] = [];
            emptyPositions = [];
            for (j = 0; j < NCOLS; j++) {
                brick = {};
                brick.color = getRndColor();
                brick.appear = Math.round(Math.random() - 0.2);
                if(brick.appear == 0){
                  emptyPositions.push(j);
                }
                brick.number = 2;
                bricks[i][j] = brick;//Math.round(Math.random() + 0.2);
            }
            randomEmptyPos = Math.floor(Math.random()*(emptyPositions.length));
            newBallPos = emptyPositions[randomEmptyPos];
            bricks[i][newBallPos].appear = 2;
        }
    }
    // $('#canvas').mousedown(function(e){
    //   // dx = 3;
    //   // dy = (my - y) * dx / (mx - x);
    //
    // });


    $('#canvas').mousemove(function(e){
        // dx = 3;
        // dy = (my - y) * dx / (mx - x);
          if(e.which == 1 && !gameOn){
            clear();
            draw();
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
            ctx.closePath();
            ctx.stroke();
          }

    });

    $('#canvas').mousedown(function(e){
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.lineTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
      ctx.closePath();
      ctx.stroke();
    });


    $('#canvas').mouseup(function(e){
      if(gameOn == false){
        gameOn = true;
        mx = e.pageX - this.offsetLeft; // mouse x position
        my = e.pageY - this.offsetTop;
        var multiplier = mx / my;
        dy = (my - y) / 40;
        dx = (mx - x) / 40;
        draw();
      }
    });

    function getRndColor() {
        var r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

    init();

    init_bricks();

});
