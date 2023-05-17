let Platform = (() => {
    const w = 110;
    const h = 28;
    const speed = 2;
    const springW = 14;
    const springH = 14;
    let springImage;
  
    const platformTypes = {
      STABLE: 5,
      MOVING: 2,
      FRAGILE: 3,
      INVISIBLE: 0,
      getRandomType() {
        const rand = Math.random() * 10;
        return rand < this.STABLE
          ? this.STABLE
          : rand < this.STABLE + this.MOVING
            ? this.MOVING
            : this.FRAGILE;
      },
      getColor(type) {
        switch (type) {
          case this.STABLE:
            return color("#8ac43d");
          case this.MOVING:
            return color("#31b8d6");
          case this.FRAGILE:
            return color(255);
          default:
            return null;
        }
      },
    };
  
    function create(x, y, type, springed) {
      const platform = {
        x,
        y,
        type,
        vx: speed,
        springed,
        springX: springed ? (Math.random() - 0.5) * w * 0.8 : null,
        springY: springed ? -h / 2 - springH / 2 : null,
        render() {
            if (this.type === platformTypes.INVISIBLE) return;
            
            noStroke();
            rectMode(RADIUS);
            fill(platformTypes.getColor(this.type));
            rect(this.x, this.y, w / 2, h / 2);
            
            stroke(0);
            strokeWeight(2);
            arc(this.x - w / 2, this.y, h, h, HALF_PI, HALF_PI + PI, OPEN);
            arc(this.x + w / 2, this.y, h, h, HALF_PI + PI, HALF_PI, OPEN);
            
            line(this.x - w / 2, this.y - h / 2, this.x + w / 2, this.y - h / 2);
            line(this.x - w / 2, this.y + h / 2, this.x + w / 2, this.y + h / 2);
            
            if (this.springed) {
                image(
                    springImage = window.springImage,
                    this.x + this.springX - springW / 2 - 11,
                    this.y + this.springY - springH / 2,
                    springW * 2.5,
                    springH * 2
                );
            }
          },
        update() {
            this.x += this.vx;
            if (this.x > width - w / 2 || this.x < w / 2) {
                this.vx *= -1;
            }
        },
    };
    return platform;
  }

  return {
    w,
    h,
    speed,
    springW,
    springH,
    springImage,
    platformTypes,
    create,
  };
})();

