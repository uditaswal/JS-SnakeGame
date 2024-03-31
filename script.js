/*
Bugs
Remove head when it reloading the page
timer going up in pause page

Notes:

Completed
Need to upload the project to github
Need to host it on a site
Need to make gameover of snake eats itself
and maintain high score for each profile
Need to add music
Need to maintain the snake's location when going from pausePage to gamePage
Need  to maintain snake's direction when going from pausePage to gamePage
Need to maintain ball's location when going from pausePage to gamePage
Need to maintain snake size when going from pausePage to gamePage
*/
// audios
let gameAudio = new Audio("audio/gameAudio.mp3");
let pointAudio = new Audio("audio/ding.mp3");
let crashAudio = new Audio("audio/Lost_a _Life.mp3");
let gameOverAudio = new Audio("audio/GameOver.mp3");
const isMuted = localStorage.getItem("isMuted") === "true";

function playAudio(audioName) {

  if (audioName.paused) {
    audioName.play().then(() => {
      // Playback started successfully
    })
      .catch((error) => {
        console.error("Error playing game audio:", error);
      });
  }
}

// Function to pause game audio
function pauseAudio(audioName) {
  if (!audioName.paused) {
    audioName.pause();
  }}

// Function to toggle mute state
function toggleMute() {

  // Toggle the mute state
  const newMuteState = localStorage.getItem("isMuted") !== "true";

  localStorage.setItem("isMuted", newMuteState);

  // Call the mute function to apply the changes
  muteSounds(newMuteState);

  // Update the mute button text
  updateMuteButtonImg(newMuteState);
}

// Function to mute or unmute all sounds
function muteSounds(isMuted) {
  if (isMuted) {
    gameAudio.muted = true;
    gameOverAudio.muted = true;
    pointAudio.muted = true;
    crashAudio.muted = true;
  } else {
    gameAudio.muted = false;
    gameOverAudio.muted = false;
    pointAudio.muted = false;
    crashAudio.muted = false;
  }
}

// Function to update the mute button text
function updateMuteButtonImg(isMuted) {
  if (isMuted) {
    document.getElementById("soundImg").src = "img/mute-button.png";
  } else {
    document.getElementById("soundImg").src = "img/soundon-button.png";
  }
}

//game Logic
// initilizing variables
let imgContainer = document.getElementById("imgContainer");
let ball;
let step = 5;
let snakeSpeed = 10; // in milliseconds
let score = 0;
let direction;
let gameInterval;
let timerInterval;
let isGameRunning = false;
let headList = []; // Array to store all the head for createHead()
let headListLength = parseInt(localStorage.getItem("headListLength")) || 1; // set the length of snake
let ballLocationX;
let ballLocationY;
let highScore = 0;

function startGame() {
  clearInterval(gameInterval); //

  // Load the stored score and duration from localStorage
  score = parseInt(localStorage.getItem("score")) || 0;
  duration = parseInt(localStorage.getItem("duration")) || 0;

  updateTimer();
  if (!isGameRunning) {
    // If the game is not running, start it
    isGameRunning = true;
    direction = localStorage.getItem("direction") || "right";
    gameInterval = setInterval(function () {
      move();
    }, snakeSpeed);

    timerInterval = setInterval(function () {
      updateTimer();
    }, 1000);
  }
}

function pause() {
  if (isGameRunning) {
    // If the game is already running, stop it
    isGameRunning = false;
    clearInterval(timerInterval);
  }
}

function resetGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  snakeSpeed = 10;
  isGameRunning = false;
  duration = 0;
  score = 0;
  localStorage.removeItem("score");
  localStorage.removeItem("duration");
  localStorage.removeItem("currentTop");
  localStorage.removeItem("currentLeft");
  localStorage.removeItem("direction");
  localStorage.removeItem("ballLocationX");
  localStorage.removeItem("ballLocationY");

  // keeping them before timer and scoreBTN to avoid null exceptions
  if (headList) {
    headList.forEach((head) => head.parentNode.removeChild(head));
    headList = [];
  }
  localStorage.removeItem("headListLength");
  headListLength = 1;
  headList.length = 0;

  document.getElementById("timer").innerText = "00 : 00 : 00";
  document.getElementById("scorebtn").textContent = "Score: 0";

  createHead();
  generateRedBall();
  startGame();
}

function toggleGame() {
  if (isGameRunning) {
    pause();
    document.getElementById("pausebtn").innerText = "Start";
    window.location.href = "pausePage.html";
  } else {
    startGame();
    document.getElementById("pausebtn").innerText = "Pause";
  }
}

function createHead() {
  if (headList) {
    headList.forEach((head) => head.parentNode.removeChild(head));
    headList = [];
  }
  localStorage.removeItem(headListLength);
  if (headList.length === 0) {
    for (let i = 0; i < headListLength; i++) {
      let head = document.createElement("img");
      head.src = "img/blackbox.png";
      head.alt = "snake";
      head.style.top = 5 + "px";
      head.style.left = 5 + "px";
      head.style.height = "6vh";
      head.style.width = "6vh";
      head.style.zIndex = 1;
      head.style.position = "absolute";
      imgContainer.appendChild(head);
      headList.unshift(head); // Add the new head to the array
    }
  }
}

function createNewHead() {
  const lastHead = headList[headList.length - 1];
  const lastHeadRect = lastHead.getBoundingClientRect();
  const newHead = document.createElement("img");
  newHead.src = "img/blackbox.png";
  newHead.alt = "snake";
  newHead.style.top = `${lastHeadRect.top}px`;
  newHead.style.left = `${lastHeadRect.left}px`;
  newHead.style.height = "6vh";
  newHead.style.width = "6vh";
  newHead.style.zIndex = 1;
  newHead.style.position = "absolute";
  imgContainer.appendChild(newHead);
  headList.push(newHead);
}


// Function to update the timer display
function updateTimer() {
  score = parseInt(localStorage.getItem("score")) || 0;
  duration = parseInt(localStorage.getItem("duration")) || 0;

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  // Format the timer display
  const timerDisplay = `${hours} : ${minutes < 10 ? "0" : ""}${minutes} : ${seconds < 10 ? "0" : ""
    }${seconds}`;

  // Increase the duration by one second
  duration++;
  localStorage.setItem("duration", duration);

  document.getElementById("timer").innerText = `${timerDisplay}`;
  document.getElementById("scorebtn").textContent = `Score: ${score}`;
}

function generateRedBall() {
  if (ball != null) {
    ball.remove();
  }

  ball = document.createElement("img");
  ball.src = "img/red.png";
  ball.alt = "ball";
  ball.style.height = "4vh";
  ball.style.width = "4vh";

  // to generate ball in ranfdom locations
  ballLocationX =
    parseInt(localStorage.getItem("ballLocationX")) ||
    Math.floor(
      Math.random() * (imgContainer.clientHeight - (ball.clientHeight + 30))
    );
  ballLocationY =
    parseInt(localStorage.getItem("ballLocationY")) ||
    Math.floor(
      Math.random() * (imgContainer.clientWidth - (ball.clientWidth + 30))
    );

  ball.style.position = "absolute";
  ball.style.top = ballLocationX + "px";
  ball.style.left = ballLocationY + "px";

  imgContainer.appendChild(ball);
}

function checkCollision() {
 let rect = ball.getBoundingClientRect();
  const headRect = headList[0].getBoundingClientRect(); // Check collision with the first head
  return !(
    headRect.bottom < rect.top ||
    headRect.top > rect.bottom ||
    headRect.right < rect.left ||
    headRect.left > rect.right
  );
}

function checkSelfCollision() {
  const currentHead = headList[0];
  const currentHeadRect = currentHead.getBoundingClientRect();

  // Iterate over the remaining heads (excluding the first one)
  for (let i = 1; i < headList.length; i++) {
    const head = headList[i];
    const headRect = head.getBoundingClientRect();

    // Check if the current head's position overlaps with any other head
    if (
      currentHeadRect.left === headRect.left &&
      currentHeadRect.top === headRect.top
    ) {
      return true; // Collision detected
    }
  }
  return false; // No collision detected
}

function setHighScore() {
  updateHighScore()
  score = localStorage.getItem("score")
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  } else {
    return;
  }
}

function updateHighScore() {
  highScore = parseInt(localStorage.getItem("highScore")) || 0;
  document.getElementById("highScorebtn").textContent = `High Score: ${highScore}`;
}


function move() {
  playAudio(gameAudio)
  if (!isGameRunning) return;

  let currentHead = headList[0];

  currentHead.style.top = localStorage.getItem("currentTop") || 5;
  currentHead.style.left = localStorage.getItem("currentLeft") || 5;

 let currentTop = parseInt(currentHead.style.top);
  let currentLeft = parseInt(currentHead.style.left);


  // the functions cheecks for self collision and collision with the border
  if (checkSelfCollision()||currentTop <= 0 ||
  currentTop >= imgContainer.clientHeight - currentHead.clientHeight ||
  currentLeft <= 0 ||
  currentLeft >= imgContainer.clientWidth - currentHead.clientWidth
) {
    {
      isGameRunning = false;
      pauseAudio(gameOverAudio);
      playAudio(crashAudio);
      if (!isMuted) {
        setTimeout(function () {
          window.location.href = "gameOver.html";
        }, 2500);
      } else {
        window.location.href = "gameOver.html";
      }
    }
  }
  //to check collision with the ball
  if (checkCollision()) {
    pauseAudio(gameOverAudio);
    playAudio(pointAudio);
    score += 1;
    document.getElementById("scorebtn").textContent = `Score: ${score}`;
    localStorage.setItem("score", score);
    localStorage.removeItem("ballLocationX");
    localStorage.removeItem("ballLocationY");
    generateRedBall();
    snakeSpeed--;
    headListLength++;
    localStorage.setItem("headListLength", headListLength);
    // createHead();
    createNewHead();
  }


  for (let i = headList.length - 1; i > 0; i--) {
    // Move each head to the position of the previous head
    headList[i].style.top = headList[i - 1].style.top;
    headList[i].style.left = headList[i - 1].style.left;
  }

  switch (direction) {
    case "up":
      currentHead.style.top = Math.max(currentTop - step, 0) + "px";
      break;
    case "down":
      currentHead.style.top =
        Math.min(
          currentTop + step,
          imgContainer.clientHeight - currentHead.clientHeight
        ) + "px";
      break;
    case "left":
      currentHead.style.left = Math.max(currentLeft - step, 0) + "px";
      break;
    case "right":
      currentHead.style.left =
        Math.min(
          currentLeft + step,
          imgContainer.clientWidth - currentHead.clientWidth
        ) + "px";
      break;
    case "none":
      break;
  }
  localStorage.setItem("currentTop", currentHead.style.top);
  localStorage.setItem("currentLeft", currentHead.style.left);
  localStorage.setItem("direction", direction);


}


document.addEventListener("keydown", function (event) {
  if (isGameRunning) {
    const currentDirection = localStorage.getItem("direction");
    // Prevent the default action for these keys
    if (
      (currentDirection === "down" && (event.keyCode === 87 || event.key === "ArrowUp")) ||
      (currentDirection === "up" && (event.keyCode === 83 || event.key === "ArrowDown")) ||
      (currentDirection === "right" && (event.keyCode === 65 || event.key === "ArrowLeft")) ||
      (currentDirection === "left" && (event.keyCode === 68 || event.key === "ArrowRight"))
    ) {
      return;
    }
  }
  if (
    event.key === "ArrowDown" ||
    event.keyCode === 40 ||
    event.key === "S" ||
    event.key === "s"
  ) {
    direction = "down";
  }
  if (
    event.key === "ArrowUp" ||
    event.keyCode === 38 ||
    event.key === "W" ||
    event.key === "w"
  ) {
    direction = "up";
  }
  if (
    event.key === "ArrowLeft" ||
    event.keyCode === 37 ||
    event.key === "A" ||
    event.key === "a"
  ) {
    direction = "left";
  }
  if (
    event.key === "ArrowRight" ||
    event.keyCode === 39 ||
    event.key === "D" ||
    event.key === "d"
  ) {
    direction = "right";
  }
    // to mute when m is pressed
    if (event.keyCode === 77) {
      toggleMute();
    }
  //pause / resume when clicked space or  enter
  if (event.keyCode === 32 || event.keyCode === 13) {
    if (window.location.pathname.includes("index.html")) {
      window.location.href = "gamePage.html";
      document.getElementById("gamebtn").click();
    }
    if (window.location.pathname.includes("gamePage.html")) {
      toggleGame();
      document.getElementById("pausebtn").click();
    }
    if (window.location.pathname.includes("pausePage.html")) {
      toggleGame();
      document.getElementById("pausebtn").click();
    }
    if (window.location.pathname.includes("gameOver.html")) {
      document.getElementById("resetbtn").click();
    }
  }
});

// Function to handle touch events for direction control
function handleTouchStart(event) {
  const touchStartX = event.touches[0].clientX;
  const touchStartY = event.touches[0].clientY;
  
  document.addEventListener('touchmove', function handleTouchMove(event) {
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Determine the direction based on the swipe gesture
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0) {
        direction = 'right';
      } else {
        direction = 'left';
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        direction = 'down';
      } else {
        direction = 'up';
      }
    }
    
    // Prevent scrolling while swiping
    event.preventDefault();
  });
}

// Add touch event listeners
document.addEventListener('touchstart', handleTouchStart, false);


// Page specifics:
if (window.location.pathname.includes("gamePage.html") || window.location.pathname.includes("gameOver.html") || window.location.pathname.includes("index.html")) {
  document.getElementById("soundImg").addEventListener("click", toggleMute);
  // Call the mute function on page load to apply the initial mute state
  document.addEventListener("DOMContentLoaded", function () {
    // Get the initial mute state from localStorage
    const isMuted = localStorage.getItem("isMuted") === "true";
    // Call the mute function to apply the initial state
    muteSounds(isMuted);
    // Update the mute button text
    updateMuteButtonImg(isMuted);
  });
}

if (window.location.pathname.includes("gamePage.html")) {
  generateRedBall();
  createHead();
  localStorage.setItem("ballLocationX", ballLocationX);
  localStorage.setItem("ballLocationY", ballLocationY);
  startGame();
}

if (window.location.pathname.includes("gameOver.html")) {
  document.addEventListener("DOMContentLoaded", function () {
  playAudio(gameOverAudio)
  });
  setHighScore()
  updateHighScore();
  updateTimer();
}

if (window.location.pathname.includes("pausePage.html")) {
  setHighScore()
  updateHighScore();
  updateTimer();
}
