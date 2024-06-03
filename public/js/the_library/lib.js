import {
  ArtBook,
  Book,
  Bookshelf,
  num_bookshelves,
} from "./books.js"

import {
  Agent,
  Cat,
  Dino,
} from "./characters.js"

const NUM_ALGO_BOOKS = 10;
const FONTSIZE = 38;
const LINEHEIGHT = 40;
const FONTWIDTH = 30;
const RIGHTMARGIN = 280;
const WINNAH_IMAGE = "/images/willy_right_04.png";
const LOSSAH_IMAGE = "/images/CAT-left-1.png";

export const GameState = Object.freeze({
  UNDECIDED: 0,
  WON: 1,
  LOST: 2,
});

function DisplayWord(p5, startX, posY, word, font_width) {
  for (let i = 0; i < word.length; ++i) {
    let posX = startX + i * font_width;
    p5.text(word[i], posX, posY);
  }
}

function CheckRectCollision(object1, object2) {
  if (object1.position.x + object1.width >= object2.position.x &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2.height) {
    return true;
  }
  return false;
}

function CheckCircleRectCollision(circle_object, rect_object) {
  //console.log("YO _ CHECK CIRCLE RECET COLL", circle_object, rect_object);
  let test_x = circle_object.position.x;
  let test_y = circle_object.position.y;

  if (circle_object.position.x < rect_object.position.x) test_x = rect_object.position.x; // test left edge
  else if (circle_object.position.x > rect_object.position.x + rect_object.width) test_x = rect_object.position.x + rect_object.width; // right edge

  if (circle_object.position.y < rect_object.position.y) test_y = rect_object.position.y; // top_edge
  else if (circle_object.position.y > rect_object.position.y + rect_object.height) test_y = rect_object.position.y + rect_object.height;

  let dist_x = circle_object.position.x - test_x;
  let dist_y = circle_object.position.y - test_y;
  let distance = Math.sqrt((dist_x * dist_x) + (dist_y * dist_y));
  let radius = circle_object.height / 2;

  if (distance <= radius) {
    console.log("DISATANCE:", distance, " RADOIS:", radius);
    return true;
  }
  return false;
}

function CheckLazerCollision(cat, agent, bot) {
  if (CheckCircleRectCollision(cat.laser_eye_left, agent) || CheckCircleRectCollision(cat.laser_eye_right, agent)) {
    bot.Say("BURN!")
    console.log("LAZER COLLISIOn - YYEYYEAHA");
    agent.Zap();
    cat.ShootAt(agent.position);
  }
}

function CheckDinoCollision(dino, agent, bot) {
  if (CheckRectCollision(dino, agent)) {
    console.log("DINO COLLISIOn - YYEYYEAHA");
    bot.Say("BZZZZT!")
    if (agent.zap_timer === 0 && dino.shock_timer === 0) {
      agent.Zap();
      dino.Zap();
    }
  }
}

export class TheLibrary {

  constructor(p5, bot, synth) {
    this.p5 = p5;
    this.bot = bot;
    this.synth = synth;
    this.top_margin = bot.screenHeight;
    this.font = p5.loadFont('fonts/zxspectrum7-nroz0.ttf');
    this.winnah_image = p5.loadImage(WINNAH_IMAGE);
    this.lossah_image = p5.loadImage(LOSSAH_IMAGE);
  }

  Start() {
    this.Reset();
    this.has_started = true;
  }

  Reset() {
    this.state = GameState.UNDECIDED;
    //this.state = GameState.LOST;
    //this.state = GameState.WON;
    this.agent = new Agent(this.p5, this.top_margin, this.synth);
    this.num_books_gathered = 0;
    this.cat = new Cat(this.p5, this.top_margin, this.synth);
    this.dino = new Dino(this.p5, this.top_margin);
    this.art_book = new ArtBook(this.p5, this.top_margin);
    this.cat.ShootAt(this.agent.position);
    this.ResizeDisplay(this.p5.windowWidth, this.p5.windowHeight);
    this.has_started = false;
  }

  ResizeDisplay(p5_width, p5_height) {
    let height = p5_height - this.top_margin;
    let width = p5_width;
    this.shelves = [];
    let shelf_width = width;
    let shelf_height = height / num_bookshelves;
    for (let i = 0; i < num_bookshelves; i++) {
      this.shelves.push(new Bookshelf(0, this.top_margin + (i * shelf_height), shelf_width, shelf_height));
    }
    if (this.has_started) {
      this.agent.SetJumpPower(height / 32);
    }
  }

  DisplayScores() {
    this.p5.textFont(this.font, FONTSIZE);
    let posX = this.p5.windowWidth - RIGHTMARGIN;
    let posY = 45;

    let wurd = "Lives: " + this.agent.num_lives;
    DisplayWord(this.p5, posX, posY, wurd, FONTWIDTH);

    posY += LINEHEIGHT;
    wurd = "Books: " + this.num_books_gathered;
    DisplayWord(this.p5, posX, posY, wurd, FONTWIDTH);
  }

  GameLoop() {
    if (!this.has_started) {
      console.log("NOT STARTED!");
      this.Start();
      this.bot.Say("Collect all 7 volumes!");
    }
    this.DisplayScores();
    if (this.state === GameState.UNDECIDED) {
      this.shelves.forEach((s) => {
        s.Draw(this.p5);
      });
      this.art_book.Draw(this.p5);
      this.agent.Run(this.p5);
      this.cat.Run(this.p5, this.agent);
      this.dino.Run(this.p5, this.agent);

      let collision = CheckRectCollision(this.agent, this.art_book);
      if (collision) {
        if (!this.art_book.IsRegenerating()) {
          this.num_books_gathered++;
          this.cat.velocity.mult(1.03);
          this.dino.velocity.mult(1.03);
          if (this.num_books_gathered === NUM_ALGO_BOOKS) {
            this.bot.Say("WINNEER! Check your home dir!");
            this.state = GameState.WON;
          }
          this.art_book.Regenerate();
        }
      }

      CheckLazerCollision(this.cat, this.agent, this.bot);
      CheckLazerCollision(this.cat, this.dino, this.bot);
      CheckDinoCollision(this.dino, this.agent, this.bot);

      if (!this.agent.Alive()) {
        this.state = GameState.LOST;
        this.bot.Say("THA LOOOOOOOOSAH!");
      }
    } else if (this.state === GameState.WON || this.state === GameState.LOST) {
      let img = this.winnah_image;
      let img_width = 190
      let img_height = 304
      let posX = (this.p5.windowWidth / 2) - 100;
      //let posY = (this.p5.windowHeight / 2) - 145;
      let posY = this.top_margin + 50;
      let img_x = posX + 10;
      if (this.state === GameState.LOST) {
        img = this.lossah_image;
        img_width = 304
        img_x -= 50;
      }


      this.p5.image(img, img_x, posY, img_width, img_height);

      posX -= 100;
      posY += img_height + LINEHEIGHT;

      this.p5.textFont(this.font, FONTSIZE);
      //posX = (this.p5.windowWidth / 2) - 200;
      //posY = (this.p5.windowHeight / 2) + 145;

      let wurd = "'r' to restart.";
      DisplayWord(this.p5, posX, posY, wurd, FONTWIDTH);

      posY += LINEHEIGHT;
      wurd = "'Esc' to exit";
      //wurd = "Books: " + this.num_books_gathered;
      DisplayWord(this.p5, posX, posY, wurd, FONTWIDTH);
    }
  }
}
