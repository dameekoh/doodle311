let player;
let platforms = [];
let gravity = 0.67;
let jumpForce = -15;
let BASE_WIDTH = 1280;
let BASE_HEIGHT = 720;

let stepSize;
let isMobile;
let cell;
let radius;
let speed;
let platformSpeed = 2;
let gameOver = false;
var blackhole;

let webcam;
var tracker = null;
var features = null;
let playerEnteredBlackHole = false;

const sound = {
  blackhole: null,
  jump: null,
  spring: null,
  fragile: null,
};

function preload() {
  springImage = loadImage("/assets/image/spring.png");
  blackholeImage = loadImage("/assets/image/hole.png");
  soundFormats("mp3", "wav");
  sound.blackhole = loadSound("/assets/sound/blackhole.mp3");
  sound.jump = loadSound("/assets/sound/jump.wav");
  sound.spring = loadSound("/assets/sound/spring.mp3");
  sound.fragile = loadSound("/assets/sound/fragile.mp3");
}

function setup() {
  frameRate(120);
  createCanvas(windowWidth, windowHeight);
  player = Player.create((width / 2) * (width / BASE_WIDTH), (height / 2) * (height / BASE_WIDTH));
  windowResized();
  generatePlatforms();
  webcam = createCapture(VIDEO);
  webcam.size(windowWidth, windowHeight);
  webcam.hide();
  tracker = new clm.tracker()
  tracker.init()
  tracker.start(webcam.elt)
}

function draw() {
  background(200);
  
  if (!blackhole && Math.random() < 0.02) {
    let x = Math.random() * (width);
    let y = Math.random() * (height);
    blackhole = Blackhole.create(x, y);
    blackhole.setImage(blackholeImage);
  }
  if(gameOver) {
    drawDead();
  }
  // Display and move the player
  player.show();
  player.move();
  // If the player reaches the top of the screen, move all platforms down instead of moving player up
  if (player.y < 0) {
    platforms.forEach(platform => platform.y -= player.dy);
    player.y = 0;  // Keep player's y-coordinate at 0
  }
  
  // Display platforms and create new ones
  for (let i = 0; i < platforms.length; i++) {
    let platform = platforms[i];
    platform.y += platformSpeed;  // add player's vertical speed to the y position of each platform
    platform.render();

    if (player.dy >= 0 && player.intersects(platform)) {
      player.jump();
      if (platform.type === Platform.platformTypes.FRAGILE) {
        sound.fragile.play();
        platform.type = Platform.platformTypes.INVISIBLE;
        platform.springed = false;
      } else if (platform.springed) {
        sound.spring.play();
        player.dy = jumpForce * 1.5;
      }
      platform.jumpedOn = true;
      score++;
    }
    platform.update();
    
    // If the platform has moved off screen, replace it with a new one at the top
    if (platform.y > height) {
  
      let x = Platform.w / 2 + (width - Platform.w) * Math.random();
      let y = 0;
      let type = Platform.platformTypes.getRandomType();
      let springed = Math.random() < 0.01;
      platforms[i] = Platform.create(x, y, type, springed);
      platforms[i].jumpedOn = false;
    }
  }
  
  if (blackhole) {
    blackhole.update();
    blackhole.render();
    if (player.intersects(blackhole)) {
      gameOver = true;
      sound.blackhole.play();
      playerEnteredBlackHole = true;
    }
    // If the blackhole goes off screen, set it to null so a new one can be created
    if (blackhole.y > height) {
      blackhole = null;
    }
    if (player.y > height) {
      gameOver = true;
    }
  }
  drawScore();
  printAngle();
  if (score >= 30) {
    platformSpeed = 3;
    if (score >= 60) {
      platformSpeed = 4;
    }
    if (score >= 90) {
      platformSpeed = 5;
    }
    if (score >= 120) {
      platformSpeed = 6;
    }
  }
}

function printAngle() {
  features = tracker.getCurrentPosition();
  if (features.length > 0) {
    var noseTipX = features[41][0];
    var leftEarX = features[1][0];  // Update index based on your model
    var rightEarX = features[12][0];  // Update index based on your model

    var faceWidth = rightEarX - leftEarX;
    var tilt = (noseTipX - leftEarX) / faceWidth;

    // Convert tilt from [0, 1] to [-1, 1]
    tilt = 2 * tilt - 1;

    player.setTilt(tilt);
  }  
}
function keyPressed() {
  if (key == " ") {
    restartGame();
  }
}

function windowResized() {
  // Save previous window dimensions for scaling
  const prevHeight = height;
  const prevWidth = width;

  // Resize canvas and compute new variables
  stepSize = windowHeight / 10 ;
  isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;
  if (!isMobile) {
    resizeCanvas((windowHeight * 9) / 16, windowHeight);
  } else {
    resizeCanvas(windowWidth, windowHeight);
  }
  cell = windowHeight / 30;

  if (prevHeight > 0 && prevWidth > 0) {
    const heightRatio = height / prevHeight;
    const widthRatio = width / prevWidth;
    // Scale movement heights
    jumpForce *= heightRatio;
    gravity *= heightRatio;

    // Scale movement widths
    speed *= widthRatio;

    // Scale render heights and widths
    radius *= Math.sqrt(heightRatio * widthRatio);

    // Rescale platforms and player according to new window dimensions
    platforms.forEach(platform => platform.rescale(widthRatio, heightRatio));
    player.rescale(radius);
  }
}

function generatePlatforms() {
  const baseNumberOfPlatforms = 2;
  const additionalPlatforms = Math.floor(width / 150); // Add one platform for each 400 pixels of width
  const totalNumberOfPlatforms = baseNumberOfPlatforms + additionalPlatforms;

  stepSize = Math.floor(height / totalNumberOfPlatforms * 1.2);
  for (let i = 0; i < totalNumberOfPlatforms; i++) {
    const y = height - i * stepSize;
    const x = Platform.w / 2 + (width - Platform.w) * Math.random();
    let type = Platform.platformTypes.getRandomType();
    while (type === Platform.platformTypes.FRAGILE) {
      type = Platform.platformTypes.getRandomType();
    }
    const springed = Math.random() < 0.01; 
    platforms.push(Platform.create(x, y, type, springed));
  }
}

function updatePlatforms() {
  platforms.forEach((plat, i) => {
    plat.y -= doodler.vy;
    // re-render the bottom non-fragile & non-invisible platform to the top
    // reset position and type
    if (plat.y > height) {
      if (
          plat.type !== Platform.platformTypes.FRAGILE &&
          plat.type !== Platform.platformTypes.INVISIBLE
      ) {
        // Random  x
        let x = Platform.w / 2 + (width - Platform.w) * Math.random();
        // One screen height off for y
        let y = plat.y - 10 * stepSize;
        // Random type
        let type = Platform.platformTypes.getRandomType();
        // Random springed
        let springed = Math.random() < 0.2;
        // Remove current
        platforms.splice(i, 1);
        // Add new
        platforms.push(Platform.create(x, y, type, springed));
        // If got a fragile one, go add another stable one aside
        // In case player have nowhere to go
        if (type === Platform.platformTypes.FRAGILE) {
          // 1/3 offset for the x
          x = (x + width / 3) % width;
          // Stable type
          type = Platform.platformTypes.STABLE;
          // Random springed
          springed = Math.random() < 0.005;
          // add stable next to the fragile
          platforms.push(Platform.create(x, y, type, springed));
        }
        // for other types there's a chance to generate blackhole
        else if (
          !blackhole &&
          Math.random() < 0.1
        ) {
          blackhole = Blackhole.create(x, y);
        }
      } else {
        // Fragile & Invisible just remove
        platforms.splice(i, 1);
      }
    }
  });
}

function restartGame() {
  // Reset game variables to their initial state
  gameOver = false;
  score = 0;
  player = Player.create(width / 2, height / 2);
  platforms = [];
  generatePlatforms();
  blackhole = null;
}

function drawDead() {
    textAlign(CENTER);
    fill(0); // Black color for the text
    textSize(32);
    text("Press SPACE to restart! ", width / 2, height / 2);
}

function touchStarted() {
  if (mouseX < width / 2 && player.x !== -5) {
    player.x -= 5;
  } else if (mouseX >= width / 2 && player.dx !== 5) {
    player.x += 5;
  }
}

function touchMoved() {
  touchStarted();
}

function touchEnded() {
  if (player.x != 0) {
    player.x = 0;
  }
}

