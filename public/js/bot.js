// const BotWidth = 14;
// const this.pixWidth = 7;

class Bot {
  constructor(p) {
    this.p5 = p;
    this.screenHeight = 110;
    this.pixWidth = 7;
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

    this.glasses = [{
      x: 2,
      y: 4
    }, {
      x: 3,
      y: 4
    }, {
      x: 4,
      y: 4
    }, {
      x: 5,
      y: 4
    }, {
      x: 6,
      y: 4
    }, {
      x: 7,
      y: 4
    }, {
      x: 8,
      y: 4
    }, {
      x: 9,
      y: 4
    }, {
      x: 10,
      y: 4
    }, {
      x: 11,
      y: 4
    }, {
      x: 2,
      y: 5
    }, {
      x: 3,
      y: 5
    }, {
      x: 4,
      y: 5
    }, {
      x: 5,
      y: 5
    }, {
      x: 6,
      y: 5
    }, {
      x: 7,
      y: 5
    }, {
      x: 8,
      y: 5
    }, {
      x: 9,
      y: 5
    }, {
      x: 10,
      y: 5
    }, {
      x: 11,
      y: 5
    }, {
      x: 2,
      y: 6
    }, {
      x: 3,
      y: 6
    }, {
      x: 4,
      y: 6
    }, {
      x: 5,
      y: 6
    }, {
      x: 8,
      y: 6
    }, {
      x: 9,
      y: 6
    }, {
      x: 10,
      y: 6
    }, {
      x: 11,
      y: 6
    }, {
      x: 3,
      y: 7
    }, {
      x: 4,
      y: 7
    }, {
      x: 9,
      y: 7
    }, {
      x: 10,
      y: 7
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

    this.glassesShine = [{
      x: 3,
      y: 5
    }, {
      x: 4,
      y: 5
    }, {
      x: 9,
      y: 5
    }, {
      x: 10,
      y: 5
    }, {
      x: 3,
      y: 6
    }, {
      x: 9,
      y: 6
    }];

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

  Display() {
    let topx = 10;
    let topy = 10;
    this.p5.noStroke();
    this.p5.fill(0, 255, 0);
    this.head.forEach((pix) => {
      let x = topx + pix.x * this.pixWidth;
      let y = topy + pix.y * this.pixWidth;
      this.p5.square(x, y, this.pixWidth);
    });
    this.eyes.forEach((pix) => {
      //this.glasses.forEach((pix) => {
      let x = topx + pix.x * this.pixWidth;
      let y = topy + pix.y * this.pixWidth;
      this.p5.square(x, y, this.pixWidth);
    });
    if (this.isTalking && (this.p5.frameCount % 30 < 15)) {
      this.openSmile.forEach((pix) => {
        let x = topx + pix.x * this.pixWidth;
        let y = topy + pix.y * this.pixWidth;
        this.p5.square(x, y, this.pixWidth);
      });
    } else {
      this.closedSmile.forEach((pix) => {
        let x = topx + pix.x * this.pixWidth;
        let y = topy + pix.y * this.pixWidth;
        this.p5.square(x, y, this.pixWidth);
      });
    }
    //this.p5.fill(255);
    //this.glassesShine.forEach((pix) => {
    //  let x = topx + pix.x * this.pixWidth;
    //  let y = topy + pix.y * this.pixWidth;
    //  this.p5.square(x, y, this.pixWidth);
    //});
  }
}

export {
  Bot
};
