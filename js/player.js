const Player = (() => {
    const radius = 40;
    
    function create(x, y) {
      const player = {
        x,
        y,
        dy: 0,
        show() {
          fill(255);
          ellipse(this.x, this.y, radius * 2);
        },
        move() {
          if (keyIsDown(LEFT_ARROW)) this.x -= 5;
          if (keyIsDown(RIGHT_ARROW)) this.x += 5;
          this.y += this.dy;
          this.dy += gravity;
        },
        jump() {
          this.dy = jumpForce;
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