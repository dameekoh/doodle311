const Blackhole = (() => {
    const width = 40;
    const height = 40;
    const ROCHE_LIMIT = height * 0.95;

    function create(x, y) {
      const blackhole = {
        x,
        y,
        angle: 0,
        render() {
          image(
            blackholeImage,
            this.x - width / 2,
            this.y - height / 2,
            width,
            height
          );
        },
        setImage(img) {
          blackholeImage = img;
        },
        update() {
          this.y += Math.random() * 5;
        },
      };
      return blackhole;
    }
  
    return {
      create
    };
  })();
  