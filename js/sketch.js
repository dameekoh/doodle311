let player;
let platforms = [];
let gravity = 0.5;
let jumpForce = -15;

function preload() {
  springImage = loadImage("/assets/image/spring.png");
}

function setup() {
  frameRate(120);
  createCanvas(windowWidth, windowHeight);
  player = Player.create(width / 2, height / 2);
  windowResized();
  // Create some platforms
  for (let i = 0; i < 10; i++) {
    platforms.push(
      Platform.create(
        random(width),
        random(height),
        Platform.platformTypes.getRandomType(),
        Math.random() < 0.5
      )
    );
  }
}

function draw() {
  background(200);

  // Display and move the player
  player.show();
  player.move();

  // Display platforms
  for (let platform of platforms) {
    platform.render();
    if (player.intersects(platform)) {
      player.jump();
    }
    platform.update();
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
