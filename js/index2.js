$(function () {
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
    var bricklevel = 2;
    var gameoff = false;
    var checkifbrick = 0;
    var time = 60;
    var time2 = 6000;
    var fps = 0;
    var nun = 0;
    var turns = 0;
    var s = 0;
    var gamepaused = 0;

    var BRICKHEIGHT = 0,
        BRICKWIDTH = 0;
    var NROWS = 0,
        NCOLS = 0;

    function init() {
        //canvas 가져오기
        ctx = $('#canvas')[0].getContext('2d');
        WIDTH = $('#canvas').width();
        HEIGHT = $('#canvas').height();
        x = WIDTH / 2;
        y = HEIGHT - 7;
        gameOn = false; // whether the ball is in motion
        ctx.setLineDash([3, 10]);
        bricklevel = 1;
        score = 0;
        time = 60;
        time2 = 600;
        fps = 60;
        s = 0;
        gamepaused = 0;
    }

    function draw() {

        clear();
        printBalls();

        //ball(x, y, radius);
        $('#score').text("Score: " + score);
        $('#time ').text("Time: " + time.toFixed(2));
        if (!gamepaused) {
            rectgo(0, 780, 60, 20, "black");
            text("Pause", "15px Comic Sans MS", 10, 795, "white");
        }
        if (gamepaused) {
            rectgo(0, 780, 60, 20, "black");
            text("Resume", "15px Comic Sans MS", 3, 795, "white");
        }


        if (gameOn) {
            time -= 1 / fps;
            time2 -= 10 / fps;
            if (time2 < 0) {
                time2 = 6000;
            }
            if (Math.ceil(Math.round(time2) % 50) == 0) { // && s == 0) {
                bricklevel++;
                s++;

                NROWS++;
                brickrow = [];
                emptyPositions = []; // tracks all position in the row that don't have bricks
                for (j = 0; j < NCOLS; j++) {
                    brick = {};
                    brick.color = getRndColor();
                    brick.appear = Math.round(Math.random() + 0.1);
                    if (brick.appear == 0) {
                        emptyPositions.push(j);
                    }
                    brick.number = bricklevel;
                    brickrow[j] = brick; //Math.round(Math.random() + 0.2);
                }
                randomEmptyPos = Math.floor(Math.random() * (emptyPositions.length)); // to put an extra new ball in a random empty position
                newBallPos = emptyPositions[randomEmptyPos];
                brickrow[newBallPos].appear = 2;
                bricks.unshift(brickrow);
            }

            for (m = 0; m < balls.length; m++) {
                balls[m].x += balls[m].dx;
                balls[m].y += balls[m].dy;
                if (balls[m].x > WIDTH - radius || balls[m].x < 0 + radius) {
                    balls[m].dx = -balls[m].dx;
                    balls[m].bounced = 1;
                }
                if (balls[m].y < 0 + radius) {
                    balls[m].dy = -balls[m].dy;
                    balls[m].bounced = 1;
                }


                // ball hit ground
                if (balls[m].y > HEIGHT - radius - 2 && balls[m].bounced == 1) {
                    numBallsOnGround++;
                    if (ballHitGround == 0) {
                        ballHitGround = 1;

                        firstBallOnGroundIndex = m;
                        // gameOn = false;
                    }
                    balls[m].dy = 0;
                    balls[m].dx = 0;
                    balls[m].bounced = 0;
                }
            }
        }

        //game over condition
        if (time <= 0) {
            gameOn = false;
            gameoff = true;
            gameover();
            return;
        }

        //draw bricks
        for (i = 0; i < NROWS; i++) {
            for (j = 0; j < NCOLS; j++) {
                if (bricks[i][j].appear == 1) {
                    rect(j * BRICKWIDTH, i * BRICKHEIGHT, BRICKWIDTH, BRICKHEIGHT, i, j);
                }
            }
        }

        //Have We Hit a Bricks?
        for (i = 0; i < balls.length; ++i) {
            var row = Math.floor((balls[i].y + radius) / (BRICKHEIGHT));
            var col = Math.floor((balls[i].x + radius) / (BRICKWIDTH));
            if (row < NROWS) {
                if (bricks[row][col].appear == 1) {
                    balls[i].dy = -balls[i].dy;
                    balls[i].bounced = 1;
                    bricks[row][col].number--; // = bricks[row][col].number - 1;
                    if (bricks[row][col].number == 0) {
                        bricks[row][col].appear = 0;
                        score++;
                    }
                }
            }
        }
    }

    function gameover() {
        rectgo(0, 0, WIDTH, HEIGHT, "white");
        text("Game Over", "75px Comic Sans MS", 65, 300, "black");
        text("SCORE: " + score, "35px Comic Sans MS", 100, 400, "black");
        //rectgo(200, 600, 100, 50, "white");
        text("Restart", "20px Comic Sans MS", 215, 630, "black");
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

    function rect(x, y, w, h, i, j) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fillStyle = bricks[i][j].color;
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "20px Comic Sans MS";
        ctx.fillText(bricks[i][j].number, x + BRICKWIDTH / 2 - 7, y + BRICKHEIGHT / 2 + 5);
    }

    function text(txt, fnt, x, y, c) {
        ctx.fillStyle = c;
        ctx.font = fnt;
        ctx.fillText(txt, x, y);
    }

    function rectgo(x, y, w, h, c) {
        ctx.fillStyle = w;
        ctx.fillRect(x, y, w, h);
    }

    function newBall(x, y, r) {
        ctx.fillStyle = getRndColor();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    function printBalls() {
        for (i = 0; i < balls.length; i++) {
            ball(balls[i].x, balls[i].y, radius);
        }
    }

    function init_bricks() {
        NROWS = 5;
        NCOLS = 10;
        //PADDING = 3;
        BRICKWIDTH = (WIDTH / NCOLS);
        BRICKHEIGHT = BRICKWIDTH - BRICKWIDTH / 4;
        //bricks = new Array(NROWS);
        //var bricks = [];
        for (i = 0; i < NROWS; i++) {
            bricks[i] = [];
            emptyPositions = [];
            for (j = 0; j < NCOLS; j++) {
                brick = {};
                brick.color = getRndColor();
                brick.appear = Math.round(Math.random() + 0.1);
                if (brick.appear == 0) {
                    emptyPositions.push(j);
                }
                brick.number = Math.round(Math.random() * (+3 - +1) + +1);
                bricks[i][j] = brick; //Math.round(Math.random() + 0.2);
            }
            randomEmptyPos = Math.floor(Math.random() * (emptyPositions.length));
            newBallPos = emptyPositions[randomEmptyPos];
            bricks[i][newBallPos].appear = 2;
        }
    }

    $('#canvas').mousemove(function (e) {
        if (e.which == 1 && !gameOn && !gameoff) {
            //clear();
            //draw();
            ctx.beginPath();
            //ctx.moveTo(balls[0].x, balls[0].y);
            ctx.lineTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
            ctx.closePath();
            ctx.stroke();
        }
    });

    $('#canvas').mousedown(function (e) {
        //if (gameoff == false) {
        ctx.beginPath();
        //ctx.moveTo(balls[0].x, balls[0].y);
        ctx.lineTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        ctx.closePath();
        ctx.stroke();
        // }
    });


    $('#canvas').mouseup(function (e) {
        mx = e.pageX - this.offsetLeft; // mouse x position
        my = e.pageY - this.offsetTop;
        if (!gameoff) {
            
            //pause
            if (mx > 0 && mx < 60 && my > 770 && my < 800 && !gamepaused && gameOn == true) {
                gameOn = false;
                gamepaused = 1;
            } else if (mx > 0 && mx < 60 && my > 770 && my < 800 && gamepaused == 1 && gameOn == false){
                gameOn = true;
                gamepaused = 0;
            } else if (!gamepaused) {
                gameOn = true;

                //            balls[0].dy = (my - balls[0].y) / 40;
                //            balls[0].dx = (mx - balls[0].x) / 40;
                //            balls[0].bounced = 0;
                //            draw();
                //            for (i = 1; i < balls.length; ++i) {
                //                // while(x++ < 100000000);
                //                balls[i].dy = (my - balls[i].y) / 40;
                //                balls[i].dx = (mx - balls[i].x) / 40;
                //                balls[i].bounced = 0;
                //                // draw();
                //            }
                //            numBallsOnGround = 0;
                //            ballHitGround = 0;
                //            firstBallOnGroundIndex = 0;
                //            //ballsLength = balls.length;
                //            //} 
                //            s = 0;
                //            //time2 += 10;

                var aBall = {};
                aBall.dx = dx;
                aBall.dy = dy;
                aBall.x = x;
                aBall.y = y;
                aBall.bounced = 0;
                balls.push(aBall);
                balls[balls.length - 1].dy = (my - (HEIGHT - 7)) / 40;
                balls[balls.length - 1].dx = (mx - (WIDTH / 2)) / 40;
                balls[balls.length - 1].bounced = 0;
                ballsLength = balls.length;
            }
        }

        //when click restart
        if (gameoff == true && mx > 200 && mx < 300 && my > 600 && my < 650) {
            gameoff = false;
            balls = [];
            init();
            init_bricks();
        }
    });

    function getRndColor() {
        var r = 255 * Math.random() | 0,
            g = 255 * Math.random() | 0,
            b = 255 * Math.random() | 0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    init();

    init_bricks();

    setInterval(draw, 1000 / 60);

});
