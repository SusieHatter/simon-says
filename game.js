const buttonColours = ["red", "blue", "green", "yellow"];

const colorToMonster = {
  green: "ogre",
  red: "imp",
  yellow: "mummy",
  blue: "goo",
};

const sounds = {
  red: new Audio("./assets/sounds/red.mp3"),
  green: new Audio("./assets/sounds/green.mp3"),
  blue: new Audio("./assets/sounds/blue.mp3"),
  yellow: new Audio("./assets/sounds/yellow.mp3"),
  wrong: new Audio("./assets/sounds/wrong.mp3"),
};

const keyToColor = {
  g: "green",
  b: "yellow",
  j: "red",
  n: "blue",
};

// State
var gamePattern = [];
var userClickedPattern = [];
var playing = false;
var level = 0;

function correctColor(level) {
  return gamePattern[level] === userClickedPattern[level];
}

function hasCompletedLevel() {
  return userClickedPattern.length === gamePattern.length;
}

function getRandomColor() {
  var randomNumber = Math.floor(Math.random() * 4);
  return buttonColours[randomNumber];
}

function playSound(name) {
  const audio = sounds[name];
  audio.currentTime = 0;
  audio.play();
}

function animateHappyMonster(color) {
  const monster = colorToMonster[color];
  $("#" + color + " > img").attr("src", `./assets/${monster}-happy.png`);
  setTimeout(function () {
    $("#" + color + " > img").attr("src", `./assets/${monster}-angry.png`);
  }, 1000);
}

function animateGameOver() {
  playSound("wrong");
  $("body").addClass("game-over");
  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 200);
}

function animateSimonText(text, fadeTime = 800) {
  $("#simon > p").html(text).fadeIn(0).fadeOut(fadeTime);
}

function animateAngrySimon() {
  const simonImg = $("#simon > img");
  simonImg.attr("src", `./assets/simon-angry.png`);
  setTimeout(function () {
    simonImg.attr("src", `./assets/simon-happy.png`);
  }, 1000);
  simonImg.addClass("simon-angry");
  setTimeout(function () {
    simonImg.removeClass("simon-angry");
  }, 1000);
}

function animateNextColor(color) {
  playSound(color);
  $("#" + color)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);
}

function animateUserSelect(color) {
  playSound(color);
  $("#" + color).addClass("pressed");
  setTimeout(function () {
    $("#" + color).removeClass("pressed");
  }, 100);
}

function start() {
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  playing = true;
  nextSequence();
}

function userSelectColour(color) {
  if (!playing) {
    return;
  }
  userClickedPattern.push(color);
  playSound(color);
  animateUserSelect(color);
  checkAnswer(color, userClickedPattern.length - 1);
}

function checkAnswer(color, level) {
  if (!correctColor(level)) {
    playing = false;
    animateGameOver();
    animateSimonText("GAME OVER!", 1000);
    animateAngrySimon();
    setTimeout(start, 1500);
    return;
  }
  animateHappyMonster(color);
  if (!hasCompletedLevel()) {
    return;
  }
  setTimeout(nextSequence, 1000);
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  const randomColor = getRandomColor();
  animateSimonText(randomColor);
  gamePattern.push(randomColor);
  animateNextColor(randomColor);
}

$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userSelectColour(userChosenColour);
});

$(document).keypress(function (e) {
  var userChosenColour = keyToColor[e.originalEvent.key];
  if (userChosenColour === undefined) {
    return;
  }
  userSelectColour(userChosenColour);
});

start();
