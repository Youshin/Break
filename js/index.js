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
    var ballCount = 1;
    var ballHitGround = 0;
    var firstBallOnGroundIndex = 0;
    var numBallsOnGround = 0;
    var ballsLength = 0;


    var BRICKHEIGHT = 0, BRICKWIDTH = 0;
    var NROWS = 0, NCOLS = 0;

    function init() {
        //canvas 가져오기
        ctx = $('#canvas')[0].getContext('2d');
        WIDTH = $('#canvas').width();
        HEIGHT = $('#canvas').height();
        x = WIDTH / 2;
        y = HEIGHT - 7;
        gameOn = false; // whether the ball is in motion
        // x = WIDTH / 2;
        // y = HEIGHT - 1;
        ctx.setLineDash([3, 10]);
        var aBall = {};
        aBall.dx = dx;
        aBall.dy = dy;
        aBall.x = x;
        aBall.y = y;
        aBall.bounced = 0;
        balls.push(aBall);
        //$('#canvas').addEventListener("click", onClick, false);
        //animation
        window.requestAnimationFrame(draw);
        window.requestAnimationFrame(draw);
    }
    function draw() {

        clear();
        printBalls();
        //ball(x, y, radius);
        $('#score').text("Score: " + score);
        if(gameOn){
            for(m = 0; m < balls.length; m++){
                balls[m].x += balls[m].dx;
                balls[m].y += balls[m].dy;
                if(balls[m].x > WIDTH - radius || balls[m].x < 0 + radius){
                  balls[m].dx = -balls[m].dx;
                  balls[m].bounced = 1;
                }
                if(balls[m].y < 0 + radius){
                  balls[m].dy = -balls[m].dy;
                  balls[m].bounced = 1;
                }


                // ball hit ground
                if( balls[m].y > HEIGHT - radius-2 && balls[m].bounced == 1){
                    //alert(numBallsOnGround);
                    numBallsOnGround++;
                    if(ballHitGround == 0){
                        ballHitGround = 1;

                        firstBallOnGroundIndex = m;
                    }
                    balls[m].dy = 0;
                    balls[m].dx = 0;
                    balls[m].bounced = 0;
                    // else {
                    //   balls[m].y = balls[firstBallOnGroundIndex].y;
                    //   balls[m].x = balls[firstBallOnGroundIndex].x;
                    //   balls[m].dy = 0;
                    //   balls[m].dx = 0;
                    // }
                    if(numBallsOnGround == ballsLength){
                        for(j = 0; j < balls.length; ++j){ // brings all balls together after all the balls are on ground
                            balls[j].x = balls[firstBallOnGroundIndex].x;
                            balls[j].y = balls[firstBallOnGroundIndex].y;
                        }
                        gameOn = false;
                        NROWS++;
                        brickrow = [];
                        emptyPositions = []; // tracks all position in the row that don't have bricks
                        for (j = 0; j < NCOLS; j++) {
                            brick = {};
                            brick.color = getRndColor();
                            brick.appear = Math.round(Math.random() + 0.1);
                            if(brick.appear == 0){
                              emptyPositions.push(j);
                            }
                            brick.number = 2;
                            brickrow[j] = brick;//Math.round(Math.random() + 0.2);
                        }
                        randomEmptyPos = Math.floor(Math.random()*(emptyPositions.length));// to put an extra new ball in a random empty position
                        newBallPos = emptyPositions[randomEmptyPos];
                        brickrow[newBallPos].appear = 2;
                        bricks.unshift(brickrow);
                    }

                    //if()
                }

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
        for(i = 0; i < balls.length; ++i){
            var row = Math.floor((balls[i].y+radius)/(BRICKHEIGHT+PADDING));
            var col = Math.floor((balls[i].x+radius)/(BRICKWIDTH+PADDING));
            if(row < NROWS){
                if(bricks[row][col].appear == 1){
                    balls[i].dy = -balls[i].dy;
                    balls[i].bounced = 1;
                    bricks[row][col].number--;// = bricks[row][col].number - 1;
                    if(bricks[row][col].number == 0){
                        bricks[row][col].appear = 0;
                        score++;
                    }
                }
                else if(bricks[row][col].appear == 2){
                    ballCount++;
                    aNewBall = {};
                    aNewBall.dx = 0;
                    aNewBall.dy = 0;
                    aNewBall.y = HEIGHT - 2*radius;
                    aNewBall.x = col*BRICKWIDTH + BRICKWIDTH/2;
                    aNewBall.bounced = 0;
                    balls.push(aNewBall);
                    bricks[row][col].appear = 0;
                }
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
    function printBalls(){
        for(i = 0; i < balls.length; i++){
            ball(balls[i].x, balls[i].y, radius);
        }
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
                brick.appear = Math.round(Math.random() + 0.1);
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
            ctx.moveTo(balls[0].x,balls[0].y);
            ctx.lineTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
            ctx.closePath();
            ctx.stroke();
          }

    });

    $('#canvas').mousedown(function(e){
      ctx.beginPath();
      ctx.moveTo(balls[0].x,balls[0].y);
      ctx.lineTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
      ctx.closePath();
      ctx.stroke();
    });


    $('#canvas').mouseup(function(e){
      clear();

      if(gameOn == false){
        gameOn = true;
        mx = e.pageX - this.offsetLeft; // mouse x position
        my = e.pageY - this.offsetTop;
        balls[0].dy = (my - balls[0].y) / 40;
        balls[0].dx = (mx - balls[0].x) / 40;
        balls[0].bounced = 0;
        draw();
        for(i = 1; i < balls.length; ++i){
            // while(x++ < 100000000);
            balls[i].dy = (my - balls[i].y) / 40;
            balls[i].dx = (mx - balls[i].x) / 40;
            balls[i].bounced = 0;
            // draw();
        }
        numBallsOnGround = 0;
        ballHitGround = 0;
        firstBallOnGroundIndex = 0;
        ballsLength = balls.length;
      }
    });

    function getRndColor() {
        var r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }

    init();

    init_bricks();

});
