const willy_width = 68;
const willy_height = 121;

const current_floor_level = 10;
const num_bookshelves = 4;
const bookshelf_thickness = 10;
const avg_book_width = 40;
const shelf_color = "Cyan";
const shelf_interior = "black";
const book_color = "Blue";


class Book {
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

class Bookshelf {
  constructor(x, y, width, height) {
    console.log("TREAT YO SHELF! ", x, y, width, height);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    let cur_x = bookshelf_thickness;
    this.bookshelf = [];
    while (cur_x < width - bookshelf_thickness) {
      let book_wid = avg_book_width + (Math.random() * 10 - avg_book_width / 4);
      let book_height = height - (Math.random() * 30) - 20;
      if (cur_x + book_wid < width - bookshelf_thickness) {
        this.bookshelf.push(new Book(cur_x, this.y + bookshelf_thickness + this.height - book_height, book_wid, book_height - bookshelf_thickness * 2));
      }
      cur_x += book_wid + 2;
    }
  }

  Draw(p5) {
    p5.fill(shelf_color);
    p5.rect(this.x, this.y, this.width, this.height);
    p5.fill(shelf_interior);
    p5.rect(this.x + bookshelf_thickness, this.y + bookshelf_thickness, this.width - 2 * bookshelf_thickness, this.height - 2 * bookshelf_thickness);
    this.bookshelf.forEach((b) => {
      b.Draw(p5);
    });
  }
}

class Character {
  constructor(width, height, position, velocity, left_imgz, right_imgz, direction) {
    this.position = position;
    this.left = left_imgz;
    this.right = right_imgz;
    this.animation_idx = 0;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.is_jumping = false;
    this.jump_power = 6;
    this.jump_counter = 15;
    this.falling_speed = 4;
    if (direction == "LEFT") {
      this.current_dir = this.left;
    } else {
      this.current_dir = this.right;
    }
  }

  Move(direction) {
    if (direction == "LEFT") {
      this.current_dir = this.left;
    } else {
      this.current_dir = this.right;
    }
  }

  Run(p5) {
    if (p5.keyIsDown(p5.LEFT_ARROW) || p5.keyIsDown(p5.RIGHT_ARROW)) {
      if (p5.frameCount % 10 == 0) {
        this.animation_idx = (this.animation_idx + 1) % this.left.length;
      }
    }
    if (p5.keyIsDown(32)) {
      console.log("JUMPING JUMPOING");
      this.is_jumping = true;
    } else {
      this.is_jumping = false;
    }

    if (p5.keyIsDown(p5.LEFT_ARROW)) {
      this.Move("LEFT");
      let new_x = this.position.x - this.velocity.x;
      if (new_x > 0) this.position.x = new_x;
    } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      this.Move("RIGHT");
      let new_x = this.position.x + this.velocity.x;
      if (new_x < p5.windowWidth - this.width) this.position.x = new_x;
    }

    if (this.position.y + this.height >= (p5.windowHeight - current_floor_level) && !this.is_jumping) {
      this.position.y = p5.windowHeight - current_floor_level - this.height;
    } else {
      this.position.y = this.position.y + (this.falling_speed * this.velocity.y);
    }
    if (this.is_jumping) {
      this.velocity.y = -this.jump_power;
    } else {
      this.velocity.y = this.falling_speed;
    }


    let img = this.current_dir[this.animation_idx];
    p5.image(img, this.position.x, this.position.y, this.width, this.height);
  }

}

export class TheLibrary {

  constructor(p5) {
    this.p5 = p5;
    this.willy_left_01 = p5.loadImage('/images/willy_left_01.png');
    this.willy_left_02 = p5.loadImage('/images/willy_left_02.png');
    this.willy_left_03 = p5.loadImage('/images/willy_left_03.png');
    this.willy_left_04 = p5.loadImage('/images/willy_left_04.png');

    this.willy_right_01 = p5.loadImage('/images/willy_right_01.png');
    this.willy_right_02 = p5.loadImage('/images/willy_right_02.png');
    this.willy_right_03 = p5.loadImage('/images/willy_right_03.png');
    this.willy_right_04 = p5.loadImage('/images/willy_right_04.png');

    this.willys_left = [this.willy_left_01, this.willy_left_02, this.willy_left_03, this.willy_left_04];
    this.willys_right = [this.willy_right_01, this.willy_right_02, this.willy_right_03, this.willy_right_04];

    let willy_position = p5.createVector(0, p5.windowHeight - current_floor_level - willy_height);
    console.log("AGENPOS:", willy_position);
    let willy_velocity = p5.createVector(4, 15);
    console.log("AGENVEL:", willy_velocity);
    this.willy = new Character(willy_width, willy_height, willy_position, willy_velocity, this.willys_left, this.willys_right, "RIGHT");

    this.shelves = [];
    let shelf_height = p5.windowHeight / 4;
    let shelf_width = p5.windowWidth;
    for (let i = 0; i < num_bookshelves; i++) {
      this.shelves.push(new Bookshelf(0, i * shelf_height, shelf_width, shelf_height));
    }

  }

  KeyPressed(key) {}

  GameLoop() {
    this.shelves.forEach((s) => {
      s.Draw(this.p5);
    });
    this.willy.Run(this.p5);
    //console.log(this.willys_idx, this.current_willy);
    //console.log(this.current_willy[this.willys_idx]);
    //this.p5.image(this.willy_right_01, 0, 0);
  }

}
