const willy_width = 68;
const willy_height = 121;

const num_bookshelves = 4;
const bookshelf_thickness = 10;
const avg_book_width = 40;
const shelf_color = "Brown";
const shelf_interior = "black";
const book_color = "Blue";

const willy_starting_shelf = 1;


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

class Character {
  constructor(width, height, position, velocity, left_imgz, right_imgz, direction, jump_power, current_shelf) {
    this.position = position;
    this.left = left_imgz;
    this.right = right_imgz;
    this.animation_idx = 0;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.current_shelf = current_shelf;

    this.is_jumping = false;
    this.jump_power = jump_power
    this.max_height = this.height;
    this.jump_counter = jump_power;
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
    this.CheckKeys(p5);
    this.Gravity(p5);
    let img = this.current_dir[this.animation_idx];
    p5.image(img, this.position.x, this.position.y, this.width, this.height);
  }

  CheckKeys(p5) {
    if (p5.keyIsDown(p5.LEFT_ARROW) || p5.keyIsDown(p5.RIGHT_ARROW)) {
      if (p5.frameCount % 10 == 0) {
        this.animation_idx = (this.animation_idx + 1) % this.left.length;
      }
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

    if (p5.keyIsDown(32)) {
      this.is_jumping = true;
    } else {
      this.is_jumping = false;
    }
  }

  Gravity(p5) {
    let shelf_height = p5.windowHeight / num_bookshelves;
    let current_shelf_y_height = (num_bookshelves + 1 - this.current_shelf) * shelf_height;
    if (this.position.y + this.height >= (current_shelf_y_height - bookshelf_thickness) && !this.is_jumping) {
      this.position.y = current_shelf_y_height - bookshelf_thickness - this.height;
      this.jump_counter = 0;
    } else {
      this.position.y = this.position.y + this.velocity.y;
    }

    if (this.is_jumping) {
      if (this.position.y <= 0 || this.jump_counter >= this.jump_power) {
        if (this.position.y + this.height >= current_shelf_y_height - bookshelf_thickness) {
          this.position.y = current_shelf_y_height - bookshelf_thickness - this.height;
        } else {
          this.velocity.y = this.falling_speed;
        }
      } else {
        this.velocity.y = -this.jump_power;
        this.jump_counter++;
      }
    } else {
      this.velocity.y = this.falling_speed;
    }
  }

  SetJumpPower(power) {
    console.log("JUMP POWER - ", power);
    this.jump_power = power;
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

    let willy_position = p5.createVector(0, 0);
    console.log("AGENPOS:", willy_position);
    let willy_velocity = p5.createVector(4, 15);
    console.log("AGENVEL:", willy_velocity);
    this.willy = new Character(willy_width, willy_height, willy_position, willy_velocity, this.willys_left, this.willys_right, "RIGHT", p5.windowHeight / 32, willy_starting_shelf);

    this.ResizeDisplay(p5.windowWidth, p5.windowHeight);

  }

  ResizeDisplay(width, height) {
    this.shelves = [];
    let shelf_width = width;
    let shelf_height = height / 4;
    console.log("SHELF HEIGHT:", shelf_height);
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
  }

}
