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
// Game difficulty, default false for normal, true for hard
var difficultyHard = false;

// Returns a random from 0 to num - 1
function getRandom(num){
    return Math.floor(Math.random() * num);
}

// Shuffles array randomly based on Fisher-Yates shuffling algorithm
function shuffle(){
    $(".container").each(function(){
        var btns = $(this).find('.game-btn');
        console.log(btns);
        let currentIndex = btns.length;
        let randomIndex;
        while(currentIndex != 0){
            randomIndex = getRandom(currentIndex);
            currentIndex--;
            swapElements(btns[currentIndex], btns[randomIndex]);
        } return btns;
    });                    
}

// Function that swaps between two element divs
function swapElements(obj1, obj2) {
    // create marker element and insert it where obj1 is
    var temp = document.createElement("div");
    obj1.parentNode.insertBefore(temp, obj1);
    // move obj1 to right before obj2
    obj2.parentNode.insertBefore(obj1, obj2);
    // move obj2 to right before where obj1 used to be
    temp.parentNode.insertBefore(obj2, temp);
    // remove temporary marker node
    temp.parentNode.removeChild(temp);
}

// Next sequence function
function nextSequence(){
    level++;
    var randomChosenColour = buttonColours[getRandom(4)];
    gamePattern.push(randomChosenColour);
    $("#level-title").text("Level " + level);
    showPattern();
}

// Renders gamePattern from start to finish each round
function showPattern(){
    var i = 0;
    isPaused = true;
    $("body").css("background-color", "#000021");
    var interval = setInterval(function(){
        if(i == gamePattern.length) {
            isPaused = false;
            clearInterval(interval);
            $("body").css("background-color", "#031138");
            if(difficultyHard){
                shuffle();
            }
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
    $("body").css("background-color", "#4D0B08");
    isPaused = true;
    if(level > highscore){
        highscore = level;
    }
    $("#level-title").text("Oops! Game Over");
    $(".container").hide();
    setTimeout(function(){
        $("body").css("background-color", "#000021");
        $("#level-title").text("Try Again?");
        $("#highscore").text("Current Highscore: " + highscore);
        $('.menu-gameover').css("display", "flex");
        isPaused = false;
    }, 2000);  
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

function changeDifficulty(){
    difficultyHard = !difficultyHard;
    difficultyHard ? $(".dot").animate({left: '+=400px'}) : $(".dot").animate({left: '-=400px'});
}