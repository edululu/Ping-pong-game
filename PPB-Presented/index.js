
// Constants for html elements
const ball = document.getElementById('ball');
const playerBar = document.getElementById('playerBar');
const aiBar = document.getElementById('aiBar');
const container = document.getElementById('container');
const aiScore = document.getElementById('aiScore');
const playerScore = document.getElementById('playerScore');

// Constants for game
const playerSpeed = 20;
const aiSpeed = 20;
const winScore = 5;
const initialSpeed = 30;

// Constants for game border
const border = {
    top: 0, 
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0
}

// Gets player mode from stored seesion('one player' or 'two player' or 'no player')
///Called from the landing page
let playerMode = sessionStorage.getItem('playerMode');

// variable for width and height of the bar or paddle
let barDimensions = {
    width: 50,
    height: 200
}

// Variable for ball diemensions. 
let ballDimensions = {
    width: 40,
    height: 40
}

// Variable to track the balls positon starts at the middle.
let ballPosition = {
    x: window.innerWidth / 2 - ballDimensions.width / 2,
    y: window.innerHeight / 2 - ballDimensions.height / 2
};

// Variable to track the players positon starts at the middle left of the screen.
// Can also be an ai depending on the player mode.
let playerPosition = {
    x: 0,
    y: window.innerHeight / 2 - barDimensions.height / 2
}

// Variable to track the ais positon starts at the middle right of the screen.
// Can also be an player depending on the player mode.
let aiPosition = {
    x: window.innerWidth - barDimensions.width,
    y: window.innerHeight / 2 - barDimensions.height / 2
}

// Variable to track the balls speed in the x and y directions.
let ballSpeed = {
    x: -initialSpeed,
    y: initialSpeed    
}


//Variable that hold the score points of the player and ai.
let score = {
    player: 0,
    ai: 0
}

// Constructor that is run first. Basically places all the elements on the screen to their respective positions.
// and show the start score.
function construct(){
    ball.style.left = ballPosition.x + 'px';
    ball.style.top = ballPosition.y + 'px';

    playerBar.style.top = playerPosition.y + 'px';
    playerBar.style.left = playerPosition.x + 'px';

    aiBar.style.top = aiPosition.y + 'px';
    aiBar.style.left = aiPosition.x + 'px';

    aiScore.innerHTML = score.ai;
    playerScore.innerHTML = score.player;
}

// A fucntion to refresh the score show on the screen when called.
function refreshScore(){
    aiScore.innerHTML = score.ai;
    playerScore.innerHTML = score.player;
}

// A function to control the ai bar. It basically tracks the ball.
function aiBarController(){
    // Checks if the ball is with in the paddle area and if the paddle is not going outside the game area.
    if(ballPosition.y + ballDimensions.height > aiPosition.y + barDimensions.height && aiPosition.y <= border.bottom - barDimensions.height){
        aiPosition.y += aiSpeed;
        aiBar.style.top = aiPosition.y + 'px';
    }else if(ballPosition.y - ballDimensions.height < aiPosition.y + barDimensions.height && aiPosition.y >= border.top){
        aiPosition.y -= aiSpeed;
        aiBar.style.top = aiPosition.y + 'px';
    }
}

// A function to turn the player bar into ai for the game mode.
function playerBarController(){
        // Checks if the ball is with in the paddle area and if the paddle is not going outside the game area.
    if(ballPosition.y + ballDimensions.height > playerPosition.y + barDimensions.height && playerPosition.y <= border.bottom - barDimensions.height){
        playerPosition.y += playerSpeed;
        playerBar.style.top = playerPosition.y + 'px';
    }else if(ballPosition.y - ballDimensions.height < playerPosition.y + barDimensions.height && playerPosition.y >= border.top){
        playerPosition.y -= playerSpeed;
        playerBar.style.top = playerPosition.y + 'px';
    }
}

// A fucntion that gives a random number.
function random(min, max){
    let num = Math.random() * (max - min + 1);
    // if(num <= 0){
    //     return 1;
    // }
    return num; 
}

// A function that moves the ballPostion depeinding on the ballSpeed variable and renders it on the screen.
function ballController(){
   
    ballPosition.x += ballSpeed.x;
    ballPosition.y += ballSpeed.y;

    ball.style.left = ballPosition.x + 'px';
    ball.style.top = ballPosition.y + 'px';
}

// A function that checks all the collisions in the world
function collision(){
    
    // The top and bottom area of the ai and player paddles.
    let playerCollisionArea = {
        top: playerPosition.y,
        bottom: playerPosition.y + barDimensions.height,
    }

    let aiCollisionArea = {
        top: aiPosition.y,
        bottom: aiPosition.y + barDimensions.height,
    }


    // Paddle ball collioson detection. Cehcks if the ball.x position is lessthan or equeal to the paddle positon
    // Then check if the ball.y positions is between the top and bottom of the paddle.
    // if so it reverses the ballSpeed by a random amount
    if(ballPosition.x <= border.left + barDimensions.width + 10){
        if(ballPosition.y >= playerCollisionArea.top && ballPosition.y <= playerCollisionArea.bottom){
            // ballSpeed.x *= -(random(1, 1.4));
            let num = (random(1,2));
            console.log(num)
            if(ballSpeed.y <= 0){
                ballSpeed.y = -20;
            }else{
                ballSpeed.y *= -num;
            }
            console.log(ballSpeed.y);
            ballSpeed.x *= -1;
        }
    }

    if(ballPosition.x >= border.right - (2 * barDimensions.width + 10)){
        // if ball positon y is between ai collision
        if(ballPosition.y >= aiCollisionArea.top && ballPosition.y <= aiCollisionArea.bottom){
            // ballSpeed.x *= -(random(1, 1.4));
            let num = (random(2,3));
            console.log(num)
            if(ballSpeed.y <= 0){
                ballSpeed.y = -20;
            }else{
                ballSpeed.y *= -num;
            }
            console.log(ballSpeed.y);
            ballSpeed.x *= -1;
        }
    }


    // Top and Bottom wall collision detection. Checks if the ball.y position is within the game boundary.
    // if not it reverses the ballSpeed.y.
    if((ballPosition.y < border.top) || (ballPosition.y >= border.bottom - ballDimensions.height)){
        // ballSpeed.x *= -(random(0.5, 1));
        ballSpeed.y *= -1;
    }

    // Right and Left wall collision detection. Checks if the ball.x position is within the game boundary.
    // if not a player has scored and the score is updated.
    if(ballPosition.x < border.left - ballDimensions.width){
        score.ai += 1;
        checkScore();
        refreshScore();
        resetBallPositionandSpeed();
    }else if(ballPosition.x > border.right - ballDimensions.width){
        score.player += 1;
        checkScore();
        refreshScore();
        resetBallPositionandSpeed();
    }
}

// A fucntion to reset the ball position and speed to its initial values.
function resetBallPositionandSpeed(){
    ballPosition.x = window.innerWidth / 2 - ballDimensions.width / 2;
    ballPosition.y = window.innerHeight / 2 - ballDimensions.height / 2;
    ballSpeed.y = initialSpeed;
    ballSpeed.x = initialSpeed;
    ballSpeed.x *= 1;
    ballSpeed.y *= 1;
}

// A fucntion to check the score of the players withe the winScore. 
function checkScore(){
    if(score.player >= winScore){
        score.player = 0;
        score.ai = 0;
        refreshScore();
        alert('Player Wins');
    }
    if(score.ai >= winScore){
        score.player = 0;
        score.ai = 0;
        refreshScore();
        alert('AI Wins');
    }
}

// Event handler for key presses. checks the up, down, w , and s keys.
// Based on the key press it adds or subtracts the playerspeed from the playerposition checking game boundaries.
// Then render the new change on screen.
document.addEventListener('keydown', function(event){
        if(event.code ==  'KeyW'){
            console.log(playerPosition.y);
            if(playerPosition.y >= border.top){
                playerPosition.y -= playerSpeed;
                playerBar.style.top = playerPosition.y + 'px';
            }
        }
        if(event.code == 'KeyS'){
            console.log(playerPosition.y);
            if(playerPosition.y <= border.bottom - barDimensions.height){
                playerPosition.y += playerSpeed;
                playerBar.style.top = playerPosition.y + 'px';
            }
        }
        if(event.code ==  'ArrowUp'){
            console.log(aiPosition.y);
            if(aiPosition.y >= border.top){
                aiPosition.y -= aiSpeed;
                aiBar.style.top = aiPosition.y + 'px';
            }
        }
        if(event.code ==  'ArrowDown'){
            console.log(aiPosition.y);
            if(aiPosition.y <= border.bottom - barDimensions.height){
                aiPosition.y += aiSpeed;
                aiBar.style.top = aiPosition.y + 'px';
            }
        }
});

construct();


// Stg I got fromt he intenet for smother game palyer don't know if it works.
const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;

function start() {
    requestAnimationFrame(update);
}

function update(timestamp) {
    requestAnimationFrame(update);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;

    // YOUR FRAME CODE HERE!
    // if(ballSpeed.y == 0){
    //     ballSpeed.y = -5;
    // }
    // if(ballSpeed.x == 0){
    //     ballSpeed.x = -5;
    // }
    
    // Switch for the different game modes that exist.
    switch(playerMode){
        case 'onePlayer':
            collision(); 
            ballController();
            aiBarController();
            break;

        case 'twoPlayer':
            collision();
            ballController();
            break;

        case 'noPlayer':
            collision();
            ballController();
            playerBarController();
            aiBarController();
        break;
        
        
        default:
            break;
    }
}

start();

