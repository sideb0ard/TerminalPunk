// const BotWidth = 14;
// const this.pixWidth = 7;

const BOT_DISPLAY_HEIGHT = 120;
const WURDS_DISPLAY_TIME = 240; // frames;
const SPEAKING_TIME = 60; // frames;
const FONTSIZE = 38;
const LINEHEIGHT = 60;
const FONTWIDTH = 30;

function DisplayWord(p5, startX, posY, word, font_width) {
  for (let i = 0; i < word.length; ++i) {
    let posX = startX + i * font_width;
    p5.text(word[i], posX, posY);
  }
}

class Bot {
  constructor(p) {
    this.p5 = p;
    this.screenHeight = BOT_DISPLAY_HEIGHT;
    this.pixWidth = 7;

    this.wurds = "";
    this.wurds_idx = 0;
    this.wurds_display_timer = 0;
    this.speaking_timer = 0;
    this.isTalking = false;

    //this.bot_font = p.loadFont('fonts/tiny-islanders.ttf');
    this.bot_font = p.loadFont('fonts/zxspectrum7-nroz0.ttf');

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

  }

  Say(text) {
    this.isTalking = true;
    //this.wurds = text.toUpperCase();
    this.wurds = text;
    this.wurds_idx = 0;
    this.speaking_timer = SPEAKING_TIME;
    this.wurds_display_timer = WURDS_DISPLAY_TIME;
  }

  Talk() {
    let maxCharsPerLine = Math.floor((this.p5.width - BOT_DISPLAY_HEIGHT) / FONTWIDTH);
    let charCount = 0;
    let posX = BOT_DISPLAY_HEIGHT + 20;

    let wurds = this.wurds.split(" ");
    let line_num = 1;
    while (wurds.length) {
      let wurd = wurds.shift();
      console.log("TAL:K TALK", wurd);
      if (wurd.length > (maxCharsPerLine - charCount)) {
        line_num++;
        posX = BOT_DISPLAY_HEIGHT;
        charCount = 0;
      }
      let posY = 45;
      //let posY = line_num * LINEHEIGHT;
      //let posY = BOT_DISPLAY_HEIGHT / 2 + 10;
      DisplayWord(this.p5, posX, posY, wurd, FONTWIDTH);
      posX += wurd.length * FONTWIDTH;
      charCount += wurd.length;
      if (wurds.length) {
        this.p5.text(" ", posX, posY);
        posX += FONTWIDTH;
        charCount++;
      }
    }
  }

  Display() {
    this.p5.fill(0, 0, 0);
    this.p5.rect(0, 0, this.p5.windowWidth, BOT_DISPLAY_HEIGHT);
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
    if (this.speaking_timer > 0) {
      this.speaking_timer--;
      if (this.speaking_timer) this.isTalking = true;
      else this.isTalking = false;
    }

    if (this.wurds_display_timer > 0) {
      this.wurds_display_timer--;
      this.p5.textFont(this.bot_font, FONTSIZE);
      this.Talk();
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
