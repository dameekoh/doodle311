let player;
let platforms = [];
let gravity = 0.75;
let jumpForce = -15;

let stepSize;
let isMobile;
let cell;
let radius;
let speed;

let gameOver = false;


function preload() {
  springImage = loadImage("/assets/image/spring.png");
}

function setup() {
  frameRate(120);
  createCanvas(windowWidth, windowHeight);
  player = Player.create(width / 2, height / 2);
  windowResized();
  generatePlatforms();
}

function draw() {
  background(200);
  
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
    platform.y += 5;  // add player's vertical speed to the y position of each platform
    platform.render();
    if (player.dy >= 0 && player.intersects(platform)) {
      player.jump();
      score = score + Math.floor(platform.y/100)
    }
    platform.update();
    
    // If the platform has moved off screen, replace it with a new one at the top
    if (platform.y > height) {
      let x = Platform.w / 2 + (width - Platform.w) * Math.random();
      let y = 0;
      let type = Platform.platformTypes.getRandomType();
      let springed = Math.random() < 0.01;
      platforms[i] = Platform.create(x, y, type, springed);
    }
  }

  if (player.y > height) {
    gameOver = true;
  }

  drawScore();
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
  stepSize = windowHeight / 9;
  isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;
  if (!isMobile) {
    resizeCanvas((windowHeight * 9) / 16, windowHeight);
  }
  cell = windowHeight / 30;

  // Check if window dimensions are defined
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
    player.rescale(widthRatio, heightRatio);
  }
}

function generatePlatforms() {
  stepSize = Math.floor(height / 8); 
  for (let y = height; y > 0; y -= stepSize) {
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
    // Gain score
    score++;
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
        let springed = Math.random() < config.SPRINGED_CHANCE;
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
          blackhole = new Blackhole((x + width / 2) % width, y);
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
}

function drawDead() {
    textAlign(CENTER);
    fill(0); // Black color for the text
    textSize(32);
    text("Press SPACE to restart! ", width / 2, height / 2);
}

