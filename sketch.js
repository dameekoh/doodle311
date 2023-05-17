let player;
let platforms = [];
let gravity = 0.5;
let jumpForce = -15;

function setup() {
  createCanvas(800, 600);
  player = new Player(width / 2, height / 2);
  
  // Create some platforms
  for (let i = 0; i < 10; i++) {
    platforms.push(new Platform(random(width), random(height)));
  }
}

function draw() {
  background(200);
  
  // Display and move the player
  player.show();
  player.move();
  
  // Display platforms
  for (let platform of platforms) {
    platform.show();
    if (player.intersects(platform)) {
      player.jump();
    }
  }
}

function keyPressed() {
  if (key == ' ') {
    player.jump();
  }
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
    // Simple collision detection
    let distance = dist(this.x, this.y, platform.x, platform.y);
    return (distance < 10 + platform.size / 2);
  }
}

class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 50;
  }
  
  show() {
    fill(100);
    rect(this.x, this.y, this.size, 10);
  }
}
