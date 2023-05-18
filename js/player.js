const Player = (() => {
    const radius = 25;
    const maxSpeed = 20  
    function create(x, y) {
      const player = {
        x,
        y,
        dx: 0,
        dy: 0,
        angle: 0,
        show() {
          fill(255);
          ellipse(this.x, this.y, radius * 2);
        },
        move() {
          this.x += this.dx;
          let speed = Math.abs(this.angle) / 10;
          if (this.x - radius < 0) this.x = radius; // Prevent player from going off screen on the left
          if (this.x + radius > width) this.x = width - radius; // Prevent player from going off screen on the right
          if (this.angle > 0) this.x -= speed;
          if (this.angle < 0) this.x += speed;
          if (keyIsDown(LEFT_ARROW)) this.x -= 5;
          if (keyIsDown(RIGHT_ARROW)) this.x += 5;
          this.y += this.dy;
          this.dy += gravity;
        },
        setTilt(tilt) {
          this.dx = (-1) * tilt * maxSpeed;
        },
        setAngle(newAngle) {
          this.angle = newAngle;
        },
        jump() {
          this.dy = jumpForce;
        },
        rescale(radius) {

          this.radius = radius;
          // Scale other properties as necessary...
        },
        intersects(platform) {
          let platformTop = platform.y - Platform.h / 2;
          let platformBottom = platform.y + Platform.h / 2;
          let platformLeft = platform.x - Platform.w / 2;
          let platformRight = platform.x + Platform.w / 2;
  
          return (
            this.y + radius > platformTop &&
            this.y - radius < platformBottom &&
            this.x + radius > platformLeft &&
            this.x - radius < platformRight
          );
        }
      };
      return player;
    }
  
    return {
      create
    };
  })();