import {
  num_bookshelves,
  bookshelf_thickness,
} from "./books.js"


const willy_width = 76;
const willy_height = 121;
const willy_starting_shelf = 1;
const willy_jump_power = 15;

let willy_left_01;
let willy_left_02;
let willy_left_03;
let willy_left_04;
let willy_right_01;
let willy_right_02;
let willy_right_03;
let willy_right_04;

const matt_width = 121;
const matt_height = 121;
const matt_starting_shelf = 4;

let matt_left_01;
let matt_left_02;
let matt_left_03;
let matt_right_01;
let matt_right_02;
let matt_right_03;

export class MDaemon {
  constructor(p5) {
    this.position = p5.createVector(0, 0);
    this.velocity = p5.createVector(4, 15);
    matt_left_01 = p5.loadImage('/images/CAT-left-1.png');
    matt_left_02 = p5.loadImage('/images/CAT-left-2.png');

    matt_right_01 = p5.loadImage('/images/CAT-right-1.png');
    matt_right_02 = p5.loadImage('/images/CAT-right-2.png');

    this.left = [matt_left_01, matt_left_02];
    this.right = [matt_right_01, matt_right_02];

    this.animation_idx = 0;
    this.width = matt_width;
    this.height = matt_height;
    this.current_dir = this.left;
    this.current_shelf = matt_starting_shelf;
    console.log("MATT DAEMON!");
  }

  Run(p5) {
    let img = this.current_dir[this.animation_idx];
    if (p5.frameCount % 20 == 0) {
      this.animation_idx++;
      if (this.animation_idx == this.left.length) this.animation_idx = 0;
    }

    this.position.x += this.velocity.x;
    if (this.position.x < 0 || this.position.x + this.width >= p5.windowWidth) {
      this.velocity.x *= -1;
    }

    p5.image(img, this.position.x, this.position.y, this.width, this.height);
    this.Gravity(p5);
  }

  Gravity(p5) {
    let shelf_height = p5.windowHeight / num_bookshelves;
    let current_shelf_y_height = (num_bookshelves + 1 - this.current_shelf) * shelf_height;
    if (this.position.y + this.height >= (current_shelf_y_height - bookshelf_thickness)) {
      // hit the ground
      this.position.y = current_shelf_y_height - bookshelf_thickness - this.height;
    } else {
      this.position.y = this.position.y + this.velocity.y;
    }
  }
}

export class Willy {
  constructor(p5) {
    this.position = p5.createVector(0, 0);
    this.velocity = p5.createVector(4, 15);

    willy_left_01 = p5.loadImage('/images/willy_left_01.png');
    willy_left_02 = p5.loadImage('/images/willy_left_02.png');
    willy_left_03 = p5.loadImage('/images/willy_left_03.png');
    willy_left_04 = p5.loadImage('/images/willy_left_04.png');

    willy_right_01 = p5.loadImage('/images/willy_right_01.png');
    willy_right_02 = p5.loadImage('/images/willy_right_02.png');
    willy_right_03 = p5.loadImage('/images/willy_right_03.png');
    willy_right_04 = p5.loadImage('/images/willy_right_04.png');

    this.left = [willy_left_01, willy_left_02, willy_left_03, willy_left_04];
    this.right = [willy_right_01, willy_right_02, willy_right_03, willy_right_04];

    this.animation_idx = 0;
    this.width = willy_width;
    this.height = willy_height;
    this.current_shelf = willy_starting_shelf;
    this.current_dir = this.right;

    this.down_triggered = false;
    this.down_counter = 0;
    this.down_countdown = 15;

    this.is_jumping = false;
    this.jump_power = willy_jump_power
    this.max_height = this.height;
    this.jump_counter = willy_jump_power;
    this.falling_speed = 4;
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

    if (this.down_triggered) {
      this.down_counter++;
      if (this.down_counter >= this.down_countdown) {
        this.down_triggered = false;
        this.down_counter = 0;
      }
    }
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

    if (p5.keyIsDown(32) && this.current_shelf != 4) {
      this.is_jumping = true;
    } else {
      this.is_jumping = false;
    }

    if (p5.keyIsDown(p5.DOWN_ARROW)) {
      if (!this.down_triggered) {
        this.down_triggered = true;
        if (this.current_shelf > 1) {
          this.current_shelf--;
        }
      }
    }
  }

  Gravity(p5) {
    let shelf_height = p5.windowHeight / num_bookshelves;
    let current_shelf_y_height = (num_bookshelves + 1 - this.current_shelf) * shelf_height;
    let next_shelf_y_height = current_shelf_y_height - shelf_height;
    if (this.position.y + this.height >= (current_shelf_y_height - bookshelf_thickness) && !this.is_jumping) {
      // hit the ground
      this.position.y = current_shelf_y_height - bookshelf_thickness - this.height;
      this.jump_counter = 0;
    } else {
      this.position.y = this.position.y + this.velocity.y;
    }

    if (this.is_jumping) {

      if (this.position.y <= 0 || this.jump_counter >= this.jump_power) {
        // maxed out, lets stop jumping
        if (this.position.y + this.height >= current_shelf_y_height - bookshelf_thickness) {
          // hit the ground
          this.position.y = current_shelf_y_height - bookshelf_thickness - this.height;
          this.jump_counter = 0;
        } else {
          this.velocity.y = this.falling_speed;
        }
      } else {
        // upwards movement
        this.velocity.y = -this.jump_power;
        this.jump_counter++;

        if (this.current_shelf != num_bookshelves) {
          if (this.position.y + this.height <= next_shelf_y_height - bookshelf_thickness) {
            this.current_shelf++;
            console.log("NEXT SHELF!", this.current_shelf);
          }
        }
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
