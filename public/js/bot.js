const BotWidth = 14;
const PixWidth = 7;

class Bot {
  constructor() {
    this.head = [{
        y: 0,
        x: 5
      }, {
        y: 0,
        x: 6
      }, {
        y: 0,
        x: 7
      }, {
        y: 0,
        x: 8
      },
      {
        y: 1,
        x: 3
      }, {
        y: 1,
        x: 4
      }, {
        y: 1,
        x: 9
      }, {
        y: 1,
        x: 10
      },
      {
        y: 2,
        x: 2
      }, {
        y: 2,
        x: 11
      },
      {
        y: 3,
        x: 1
      }, {
        y: 3,
        x: 12
      },
      {
        y: 4,
        x: 1
      }, {
        y: 4,
        x: 12
      },
      {
        y: 5,
        x: 0
      }, {
        y: 5,
        x: 13
      },
      {
        y: 6,
        x: 0
      }, {
        y: 6,
        x: 13
      },
      {
        y: 7,
        x: 0
      }, {
        y: 7,
        x: 13
      },
      {
        y: 8,
        x: 0
      }, {
        y: 8,
        x: 13
      },
      {
        y: 9,
        x: 0
      }, {
        y: 9,
        x: 13
      },
      {
        y: 10,
        x: 1
      }, {
        y: 10,
        x: 12
      },
      {
        y: 11,
        x: 2
      }, {
        y: 11,
        x: 11
      },
      {
        y: 12,
        x: 3
      }, {
        y: 12,
        x: 10
      },
      {
        y: 13,
        x: 4
      }, {
        y: 13,
        x: 5
      }, {
        y: 13,
        x: 6
      }, {
        y: 13,
        x: 7
      }, {
        y: 13,
        x: 8
      }, {
        y: 13,
        x: 9
      }
    ];

    this.eyes = [{
      x: 4,
      y: 4
    }, {
      x: 4,
      y: 5
    }, {
      x: 4,
      y: 6
    }, {
      x: 9,
      y: 4
    }, {
      x: 9,
      y: 5
    }, {
      x: 9,
      y: 6
    }];

    this.openSmile = [{
        x: 3,
        y: 8
      },
      {
        x: 4,
        y: 8
      },
      {
        x: 5,
        y: 8
      },
      {
        x: 6,
        y: 8
      },
      {
        x: 7,
        y: 8
      },
      {
        x: 8,
        y: 8
      },
      {
        x: 9,
        y: 8
      },
      {
        x: 10,
        y: 8
      },
      {
        x: 3,
        y: 9
      },
      {
        x: 10,
        y: 9
      },
      {
        x: 4,
        y: 10
      },
      {
        x: 9,
        y: 10
      },
      {
        x: 5,
        y: 11
      },
      {
        x: 6,
        y: 11
      },
      {
        x: 7,
        y: 11
      },
      {
        x: 8,
        y: 11
      },
    ];

    this.closedSmile = [{
      x: 4,
      y: 9
    }, {
      x: 9,
      y: 9
    }, {
      x: 5,
      y: 10
    }, {
      x: 6,
      y: 10
    }, {
      x: 7,
      y: 10
    }, {
      x: 8,
      y: 10
    }]

    this.isTalking = false;
  }

  display() {
    let topx = width - (BotWidth * 2) * PixWidth;
    let topy = height - statusHeight - (BotWidth * 2) * PixWidth;
    noStroke();
    fill(0, 255, 0);
    this.head.forEach((pix) => {
      let x = topx + pix.x * PixWidth;
      let y = topy + pix.y * PixWidth;
      square(x, y, PixWidth);
    });
    this.eyes.forEach((pix) => {
      let x = topx + pix.x * PixWidth;
      let y = topy + pix.y * PixWidth;
      square(x, y, PixWidth);
    });
    if (this.isTalking && (frameCount % 30 < 15)) {
      this.openSmile.forEach((pix) => {
        let x = topx + pix.x * PixWidth;
        let y = topy + pix.y * PixWidth;
        square(x, y, PixWidth);
      });
    } else {
      this.closedSmile.forEach((pix) => {
        let x = topx + pix.x * PixWidth;
        let y = topy + pix.y * PixWidth;
        square(x, y, PixWidth);
      });
    }
  }
}
