import {
  Book,
  Bookshelf,
  num_bookshelves,
} from "./books.js"

import {
  Willy,
  MDaemon,
} from "./characters.js"


export class TheLibrary {

  constructor(p5) {
    this.p5 = p5;
    this.willy = new Willy(p5);
    this.mdaemon = new MDaemon(p5);
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
    this.willy.Run(this.p5);
    this.mdaemon.Run(this.p5);
  }

}
