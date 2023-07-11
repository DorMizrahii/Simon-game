var level = 0, started = false;
//array of button colours
var buttonColours = ["red", "blue", "green", "yellow"];
//array of game pattern
var gamePattern = [];
//array of user clicked pattern
var userClickedPattern = [];

//next sequence function
function nextSequence(){
    $("#level-title").text("Level "+level);
    var randomNumber = Math.floor(Math.random()*4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    $("#"+randomChosenColour).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
    level++;
}

//play sound function
function playSound(name){
    var audio = new Audio("sounds/"+name+".mp3");
    audio.play();
}
//animate press effect on buttons when pressed by users
function animatePress(currentColour){
    $("#"+currentColour).addClass("pressed");
    setTimeout(function(){
        $("#"+currentColour).removeClass("pressed");
    }, 100);
}

//game over function
function gameOver(){
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function(){
        $("body").removeClass("game-over");
    }, 200);
    $("#level-title").text("Game Over, Press Any Key to Restart");
    startOver();
}

//check answer and call for a new round or endgame condition
function checkAnswer(currentLevel){
    if(gamePattern[currentLevel] === userClickedPattern[currentLevel]){
        console.log("success");
        if(userClickedPattern.length === gamePattern.length){
            setTimeout(function(){
                nextSequence();
            }, 1000);
            userClickedPattern = [];
        }
    }
    else{
        gameOver();
    }
}
//start over function
function startOver(){
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    started = false;
}

//click event listener
$(".btn").click(function(){
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    animatePress(userChosenColour);
    playSound(userChosenColour);
    checkAnswer(userClickedPattern.length-1);
}
);

//start the game
$(document).keypress(function(){
    if(!started){
        $("#level-title").text("Level "+level);
        started = true;
        nextSequence();
    }
});