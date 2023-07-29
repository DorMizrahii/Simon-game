var level = 0;
var highscore = 1;
// Array of button colours
var buttonColours = ["red", "blue", "green", "yellow"];
// Array of game pattern
var gamePattern = [];
// Array of user clicked pattern
var userClickedPattern = [];
// Pauses the ability to restart and click buttons
var isPaused = false;
// Music state
var isMusicPlaying = false;
var music = new Audio("sounds/bgmusic.mp3");


// Next sequence function
function nextSequence(){
    level++;
    var randomNumber = Math.floor(Math.random()*4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    $("#level-title").text("Level " + level);
    showPattern();
}

// Renders gamePattern from start to finish each round
function showPattern(){
    var i = 0;
    isPaused = true;
    $("body").css("background-color", "#011122");
    var interval = setInterval(function(){
        if(i == gamePattern.length) {
            isPaused = false;
            clearInterval(interval);
            $("body").css("background-color", "#011F3F");
        }
        $("#"+gamePattern[i]).fadeOut(100).fadeIn(100);
        playSound(gamePattern[i]);
        i++; 
   }, 500)
}

// Function that controls the background music
function playMusic(){
    isMusicPlaying = !isMusicPlaying;
    if(isMusicPlaying){ 
        music.play();
        $("#music_img").attr("src","assets/music.png"); 
    } 
    else{ 
        music.pause();
        $("#music_img").attr("src","assets/music-mute.png"); 
    }
}

// Play sound function
function playSound(name){
    var audio = new Audio("sounds/"+name+".mp3");
    audio.volume = 0.5;
    if(name === "wrong") audio.volume = 0.3;
    audio.play();
}

// Animate press effect on buttons when pressed by users
function animatePress(currentColour){
    $("#"+currentColour).addClass("pressed");
    setTimeout(function(){
        $("#"+currentColour).removeClass("pressed");
    }, 100);
}

// Game over function
function gameOver(){
    playSound("wrong");
    $("body").css("background-color", "#C00000");
    isPaused = true;
    if(level > highscore){
        highscore = level;
    }
    $("#level-title").text("Oops! Game Over, You've Reached Level " + level);
    $(".container").hide();
    setTimeout(function(){
        $("body").css("background-color", "#011F3F");
        $("#level-title").text("Try Again?");
        $("#highscore").text("Current Highscore: " + highscore);
        $('.menu-gameover').show();
        isPaused = false;
    }, 3000);  
}

// Check answer and call for a new round or endgame condition
function checkAnswer(currentLevel){
    if(gamePattern[currentLevel] === userClickedPattern[currentLevel]){
        if(userClickedPattern.length === gamePattern.length){
            nextSequence();
            userClickedPattern = [];
        }
    }
    else{ 
            gameOver();
    }
}

// Click event listener
$(".game-btn").click(function(){
    if(!isPaused){
       var userChosenColour = $(this).attr("id");
       userClickedPattern.push(userChosenColour);
       animatePress(userChosenColour);
       playSound(userChosenColour);
       checkAnswer(userClickedPattern.length - 1); 
}});

// Start the game
function startGame(){
    if(!isPaused){
        level = 0;
        gamePattern = [];
        userClickedPattern = [];
        $(".container").show();
        $(".menu").hide();
        $(".menu-gameover").hide();
        $("#highscore").text("");
        if(!isMusicPlaying) { 
            playMusic(); 
        }
        nextSequence();
    }
};

function openMenu(){
    $(".menu-gameover").hide();
    $(".menu").show();
    $("#level-title").text("Welcome To The Simon Game");
}