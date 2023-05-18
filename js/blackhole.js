const Blackhole = (() => {
    const width = 40;
    const height = 40;
    const ROCHE_LIMIT = height * 0.75;
    let blackholeImg;
  
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
        setBlackholeImage(img) {
          blackholeImage = img;
        },
        getROCHE_LIMIT() {
          return ROCHE_LIMIT;
        },
        getWidth() {
          return width;
        },
        getHeight() {
          return height;
        },
      };
      return blackhole;
    }
  
    return {
      create
    };
  })();
  