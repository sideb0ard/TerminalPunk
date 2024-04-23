export const num_bookshelves = 4;
export const bookshelf_thickness = 10;

const avg_book_width = 40;
const shelf_color = "Brown";
const shelf_interior = "black";
const book_color = "Blue";

export class Book {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  Draw(p5) {
    p5.fill(book_color);
    p5.rect(this.x, this.y, this.width, this.height);
  }
}

export class Bookshelf {
  constructor(x, y, width, height) {
    console.log("TREAT YO SHELF! ", x, y, width, height);
    this.x = x;
    this.y = y;
    this.width = width;
    this.inner_width = width - 2 * bookshelf_thickness;
    this.height = height;
    this.inner_height = height - 2 * bookshelf_thickness;
    let cur_x = bookshelf_thickness;
    this.bookshelf = [];
    while (cur_x < this.inner_width) {
      let book_wid = avg_book_width + (Math.random() * 10 - avg_book_width / 4);
      let book_height = this.inner_height - (Math.random() * 30) - 20;
      if (cur_x + book_wid >= bookshelf_thickness + this.inner_width) {
        book_wid = bookshelf_thickness + this.inner_width - cur_x;
      }
      this.bookshelf.push(new Book(cur_x, this.y + bookshelf_thickness + this.inner_height - book_height, book_wid, book_height));
      cur_x += book_wid + 2;
    }
  }

  Draw(p5) {
    p5.fill(shelf_color);
    p5.rect(this.x, this.y, this.width, this.height);
    p5.fill(shelf_interior);
    p5.rect(this.x + bookshelf_thickness, this.y + bookshelf_thickness, this.inner_width, this.inner_height);
    this.bookshelf.forEach((b) => {
      b.Draw(p5);
    });
  }
}
