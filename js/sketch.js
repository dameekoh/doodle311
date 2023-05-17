let player;
let platforms = [];
let gravity = 0.65;
let jumpForce = -15;

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

  // Display and move the player
  player.show();
  player.move();

  // Display platforms and create new ones
  for (let i = 0; i < platforms.length; i++) {
    let platform = platforms[i];
    platform.y += 5;  // add player's vertical speed to the y position of each platform
    platform.render();
    if (player.intersects(platform)) {
      player.jump();
    }
    platform.update();
    
    // If the platform has moved off screen, replace it with a new one at the top
    if (platform.y > height) {
      let x = Platform.w / 2 + (width - Platform.w) * Math.random();
      let y = 0;
      let type = Platform.platformTypes.getRandomType();
      let springed = Math.random() < 0.5;
      platforms[i] = Platform.create(x, y, type, springed);
    }
  }
}


function keyPressed() {
  if (key == " ") {
    player.jump();
  }
}

function windowResized() {
  const REF_HEIGHT = 1289;
  const REF_WIDTH = 725;

  const calculateHeightRatio = () => {
    if (height > 0) {
      const heightRatio = height / REF_HEIGHT;

      // Scale movement heights
      jumpForce *= heightRatio;

      // Scale render heights
      player.h *= heightRatio;
      for (let platform of platforms) {
        platform.h *= heightRatio;
        platform.springH *= heightRatio;
      }
    }
  };

  const calculateWidthRatio = () => {
    if (width > 0) {
      const widthRatio = width / REF_WIDTH;

      // Scale movement widths
      player.speed *= widthRatio;

      // Scale render widths
      player.w *= widthRatio;
      for (let platform of platforms) {
        platform.w *= widthRatio;
        platform.springW *= widthRatio;
      }
    }
  };

  stepSize = windowHeight / 9;
  let canvasHeight = windowHeight;
  let canvasWidth = (canvasHeight * 9) / 16;
  resizeCanvas(canvasWidth, canvasHeight);

  calculateHeightRatio();
  calculateWidthRatio();
}



function generatePlatforms() {
  const stepSize = Math.floor(height / 8); 
  for (let y = height; y > 0; y -= stepSize) {
    const x = Platform.w / 2 + (width - Platform.w) * Math.random();
    let type = Platform.platformTypes.getRandomType();
    while (type === Platform.platformTypes.FRAGILE) {
      type = Platform.platformTypes.getRandomType();
    }
    const springed = Math.random() < 0.5; 
    platforms.push(Platform.create(x, y, type, springed));
  }
}

function updatePlatforms() {
  platforms = platforms.map((plat, i) => {
    const updatedPlatform = {
      ...plat,
      y: plat.y - doodler.vy,
    };

    // Gain score
    score++;

    // Check if the platform needs to be re-rendered to the top
    if (updatedPlatform.y > height) {
      if (
        updatedPlatform.type !== Platform.platformTypes.FRAGILE &&
        updatedPlatform.type !== Platform.platformTypes.INVISIBLE
      ) {
        // Random x
        const x = Platform.w / 2 + (width - Platform.w) * Math.random();
        // One screen height off for y
        const y = updatedPlatform.y - (config.STEPS + 1) * stepSize;
        // Random type
        const type = Platform.platformTypes.getRandomType();
        // Random springed
        const springed = Math.random() < config.SPRINGED_CHANCE;

        // Create a new platform to replace the current one
        const newPlatform = new Platform(x, y, type, springed);

        // If the current platform is fragile, add a stable platform next to it
        if (type === Platform.platformTypes.FRAGILE) {
          // 1/3 offset for the x
          const newPlatformX = (x + width / 3) % width;
          // Stable type
          const newPlatformType = Platform.platformTypes.STABLE;
          // Random springed
          const newPlatformSpringed = Math.random() < config.SPRINGED_CHANCE;

          // Create the stable platform next to the fragile platform
          const stablePlatform = new Platform(
            newPlatformX,
            y,
            newPlatformType,
            newPlatformSpringed
          );

          // Add the stable platform to the platforms array
          platforms.push(stablePlatform);
        }

        // If the platform is not fragile or invisible, there's a chance to generate a blackhole
        if (
          !blackhole &&
          Math.random() < config.BLACKHOLE_CHANCE
        ) {
          blackhole = new Blackhole((x + width / 2) % width, y);
        }

        return newPlatform;
      } else {
        // Remove fragile and invisible platforms
        return null;
      }
    }

    return updatedPlatform;
  }).filter(Boolean);
}
