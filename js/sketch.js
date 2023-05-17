let player;
let platforms = [];
let gravity = 0.5;
let jumpForce = -15;

function preload() {
  springImage = loadImage("/assets/image/spring.png");
}

function setup() {
  createCanvas(800, 600);
  player = new Player(width / 2, height / 2);
  windowResized()
  // Create some platforms
  for (let i = 0; i < 10; i++) {
    platforms.push(Platform.create(random(width), random(height), Platform.platformTypes.getRandomType(), Math.random() < 0.5));
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
  if (key == ' ') {
    player.jump();
  }
}

function windowResized() {
  let canvasHeight = windowHeight;
  let canvasWidth = (canvasHeight * 9) / 16;
  resizeCanvas(canvasWidth, canvasHeight);
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dy = 0;
  }
  
  show() {
    fill(255);
    ellipse(this.x, this.y, 20);
  }
  
  move() {
    if (keyIsDown(LEFT_ARROW)) this.x -= 5;
    if (keyIsDown(RIGHT_ARROW)) this.x += 5;
    this.y += this.dy;
    this.dy += gravity;
  }

  jump() {
    this.dy = jumpForce;
  }

  intersects(platform) {
    let playerRadius = 10; // Assuming the player is a circle with radius 10
    let platformTop = platform.y - Platform.h / 2;
    let platformBottom = platform.y + Platform.h / 2;
    let platformLeft = platform.x - Platform.w / 2;
    let platformRight = platform.x + Platform.w / 2;

    // Check if player's bottom edge is touching the platform's top edge,
    // and player's horizontal position is within the platform's width
    return (
        this.y + playerRadius > platformTop &&
        this.y - playerRadius < platformBottom &&
        this.x + playerRadius > platformLeft &&
        this.x - playerRadius < platformRight
    );
}

}
