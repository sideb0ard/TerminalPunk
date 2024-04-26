import {
  ArtBook,
  Book,
  Bookshelf,
  num_bookshelves,
} from "./books.js"

import {
  Willy,
  MDaemon,
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

export class TheLibrary {

  constructor(p5) {
    this.p5 = p5;
    this.willy = new Willy(p5);
    this.mdaemon = new MDaemon(p5);
    this.art_book = new ArtBook(p5);
    this.ResizeDisplay(p5.windowWidth, p5.windowHeight);
  }

  ResizeDisplay(width, height) {
    this.shelves = [];
    let shelf_width = width;
    let shelf_height = height / 4;
    for (let i = 0; i < num_bookshelves; i++) {
      this.shelves.push(new Bookshelf(0, i * shelf_height, shelf_width, shelf_height));
    }
    this.willy.SetJumpPower(height / 32);
  }

  GameLoop() {
    this.shelves.forEach((s) => {
      s.Draw(this.p5);
    });
    this.art_book.Draw(this.p5);
    this.willy.Run(this.p5);
    this.mdaemon.Run(this.p5);
    let collision = CheckRectCollision(this.willy, this.art_book);
    if (collision) {
      // willy gets the point
      // regenerate book
      this.art_book.Regenerate();
    } else {
      collision = CheckRectCollision(this.mdaemon, this.art_book);
      if (collision) {
        // mdaemon gets the point
        // regenerate book
        this.art_book.Regenerate();
      }
    }
  }

}
