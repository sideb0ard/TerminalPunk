export const num_bookshelves = 4;
export const bookshelf_thickness = 10;
export const art_vol_width = 87;
export const art_vol_height = 121;


const avg_book_width = 40;
//const shelf_color = "HotPink";
const shelf_color = "Chartreuse";
const shelf_interior = "black";
const book_color = "Blue";

let art_vol_1;
let art_vol_2;
let art_vol_3;
let art_vol_4a;
let art_vol_4b;
let art_vol_4c;
let art_vol_4d;
let art_vol_5;
let art_vol_6;
let art_vol_7;

const TIME_TO_REGENERATE = 120; // frames so 2 seconds
export class ArtBook {
  constructor(p5, top_margin) {
    this.position = p5.createVector(0, 0);
    this.p5 = p5;
    this.top_margin = top_margin;
    art_vol_1 = p5.loadImage('/images/art1.png');
    art_vol_2 = p5.loadImage('/images/art2.png');
    art_vol_3 = p5.loadImage('/images/art3.png');
    art_vol_4a = p5.loadImage('/images/art4a.png');
    art_vol_4b = p5.loadImage('/images/art4b.png');
    art_vol_4c = p5.loadImage('/images/art4c.png');
    art_vol_4d = p5.loadImage('/images/art4d.png');
    art_vol_5 = p5.loadImage('/images/art5.png');
    art_vol_6 = p5.loadImage('/images/art6.png');
    art_vol_7 = p5.loadImage('/images/art7.png');
    this.vols = [art_vol_1, art_vol_2, art_vol_3, art_vol_4a, art_vol_4b, art_vol_4c, art_vol_4d, art_vol_5, art_vol_6, art_vol_7];
    this.vol_idx = 0;
    this.current_shelf = Math.floor(Math.random() * num_bookshelves) + 1;
    this.position.x = Math.random() * (p5.windowWidth - art_vol_width - bookshelf_thickness * 2) + bookshelf_thickness
    console.log("POS X:", this.position.x);
    this.should_display = true;
    this.width = art_vol_width;
    this.height = art_vol_height;

    this.regeneration_timer = 0;
  }

  Draw(p5) {
    if (this.regeneration_timer > 0) {
      this.regeneration_timer--;
    } else {
      console.log("GEN TIMER:", this.regeneration_timer);

      if (this.should_display) {
        let shelf_height = (p5.windowHeight - this.top_margin) / num_bookshelves;
        let current_shelf_y_height = this.top_margin + (num_bookshelves + 1 - this.current_shelf) * shelf_height;
        this.position.y = current_shelf_y_height - bookshelf_thickness - art_vol_height;
        p5.image(this.vols[this.vol_idx], this.position.x, this.position.y, art_vol_width, art_vol_height);
      }
    }
  }

  IsRegenerating() {
    return this.regeneration_timer > 0;
  }

  Regenerate() {
    this.vol_idx++;
    if (this.vol_idx >= this.vols.length) {
      this.should_display = false;
    }
    this.current_shelf = Math.floor(Math.random() * num_bookshelves) + 1;
    this.position.x = Math.random() * (this.p5.windowWidth - art_vol_width - bookshelf_thickness * 2) + bookshelf_thickness
    console.log("RGEN: POS X:", this.position.x);
    this.regeneration_timer = TIME_TO_REGENERATE;
  }
}

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
