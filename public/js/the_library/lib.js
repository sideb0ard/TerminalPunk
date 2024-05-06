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

function CheckLazerCollision(cat, agent) {
  if (cat.shooting_lasers && (CheckCircleRectCollision(cat.laser_eye_left, agent) || CheckCircleRectCollision(cat.laser_eye_right, agent))) {
    console.log("LAZER COLLISIOn - YYEYYEAHA");
    //cat.shooting_lasers = false;
    agent.Regenerate();
    //cat.ShootAt(agent);
  }
}

export class TheLibrary {

  constructor(p5) {
    this.p5 = p5;
    this.agent = new Agent(p5);
    this.cat = new Cat(p5);
    this.dino = new Dino(p5);
    this.art_book = new ArtBook(p5);
    this.cat.ShootAt(this.agent.position);
    this.ResizeDisplay(p5.windowWidth, p5.windowHeight);
  }

  ResizeDisplay(width, height) {
    this.shelves = [];
    let shelf_width = width;
    let shelf_height = height / 4;
    for (let i = 0; i < num_bookshelves; i++) {
      this.shelves.push(new Bookshelf(0, i * shelf_height, shelf_width, shelf_height));
    }
    this.agent.SetJumpPower(height / 32);
  }

  GameLoop() {
    this.shelves.forEach((s) => {
      s.Draw(this.p5);
    });
    this.art_book.Draw(this.p5);
    this.agent.Run(this.p5);
    this.cat.Run(this.p5, this.agent);
    this.dino.Run(this.p5, this.agent);

    let collision = CheckRectCollision(this.agent, this.art_book);
    if (collision) {
      this.art_book.Regenerate();
    }

    CheckLazerCollision(this.cat, this.agent);
  }

}
