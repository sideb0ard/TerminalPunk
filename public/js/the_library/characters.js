import {
  num_bookshelves,
  bookshelf_thickness,
} from "./books.js"


const agent_width = 76;
const agent_height = 121;
const agent_starting_shelf = 1;
const agent_jump_power = 15;
const num_agent_lives = 5;

let agent_left_01;
let agent_left_02;
let agent_left_03;
let agent_left_04;
let agent_right_01;
let agent_right_02;
let agent_right_03;
let agent_right_04;

const cat_width = 121;
const cat_height = 121;
const cat_starting_shelf = 4;

let cat_left_01;
let cat_left_02;
let cat_right_01;
let cat_right_02;

const dino_width = 100; // orig 494
const dino_height = 110; // orig 551
const dino_starting_shelf = 3;
let dino_left_01;
let dino_left_02;
let dino_left_03;
let dino_left_04;
let dino_right_01;
let dino_right_02;
let dino_right_03;
let dino_right_04;

function IsOutsideScreen(object, p5) {
  if (object.position.x + object.width > p5.windowWidth || object.position.x < 0 || object.position.y + object.height > p5.windowHeight || object.position.y < 0) {
    return true;
  }
  return false;
}

class Laser {
  constructor(p5) {
    this.p5 = p5;
    this.position = p5.createVector(0, 0);
    this.velocity = p5.createVector(3, 3);
    this.width = 15;
    this.height = 15;
    this.cols = [];
    this.cols.push(p5.color(245, 252, 1));
    this.cols.push(p5.color(255, 0, 0));
    this.cols.push(p5.color(252, 146, 1));
    this.cols.push(p5.color(255, 216, 0));
    this.cols.push(p5.color(255, 31, 0));
    this.cols.push(p5.color(180, 38, 18));
    this.cols.push(p5.color(180, 38, 18));
    this.cols.push(p5.color(255, 255, 255));
    this.col_ix = 0;

  }
  Shoot() {
    this.position.add(this.velocity);
    let circ = 15;
    for (let i = 0; i < 5; i++) {
      //this.p5.fill(255, 0, 0);
      this.p5.fill(this.cols[this.col_ix]);
      this.col_ix = (this.col_ix + 1) % this.cols.length;
      let x = this.position.x - i * this.velocity.x * 2;
      let y = this.position.y - i * this.velocity.y * 2;
      let diam = circ - i * 3;
      this.p5.square(x, y, diam);
      //for (let i = 0; i < 5; i++) {
      //  let wee_x = x - this.p5.random(-diam / 2, diam / 2);
      //  let wee_y = y - this.p5.random(-diam / 2, diam / 2);
      //  this.p5.fill(this.cols[this.col_ix]);
      //  this.col_ix = (this.col_ix + 1) % this.cols.length;
      //  this.p5.square(wee_x, wee_y, diam / 3);
      //}
    }
  }
}

export class Cat {
  constructor(p5) {
    this.position = p5.createVector(p5.windowWidth - cat_width - bookshelf_thickness / 2, 0);
    this.velocity = p5.createVector(4, 15);
    cat_left_01 = p5.loadImage('/images/CAT-left-1.png');
    cat_left_02 = p5.loadImage('/images/CAT-left-2.png');

    cat_right_01 = p5.loadImage('/images/CAT-right-1.png');
    cat_right_02 = p5.loadImage('/images/CAT-right-2.png');

    this.left = [cat_left_01, cat_left_02];
    this.right = [cat_right_01, cat_right_02];

    this.animation_idx = 0;
    this.width = cat_width;
    this.height = cat_height;
    this.current_dir = this.left;
    this.current_shelf = cat_starting_shelf;
    console.log("MATT DAEMON!");
    this.laser_eye_left = new Laser(p5);
    this.laser_eye_right = new Laser(p5);
    this.shooting_lasers = true;
  }

  ShootAt(player_pos_source) {
    console.log("SHOULD AT:", player_pos_source);
    let player_pos = player_pos_source.copy();
    player_pos.add(agent_width / 2, agent_height / 2);
    this.shooting_lasers = true;
    this.laser_eye_left.position.set(this.position.x + 45, this.position.y + 45);
    this.laser_eye_left.velocity = p5.Vector.sub(player_pos, this.laser_eye_left.position);
    this.laser_eye_left.velocity.setMag(5);
    this.laser_eye_right.position.set(this.position.x + 85, this.position.y + 45);
    this.laser_eye_right.velocity = p5.Vector.sub(player_pos, this.laser_eye_right.position);
    this.laser_eye_right.velocity.setMag(5);
  }

  Run(p5, target) {
    let img = this.current_dir[this.animation_idx];
    if (p5.frameCount % 20 == 0) {
      this.animation_idx++;
      if (this.animation_idx == this.left.length) this.animation_idx = 0;
    }

    this.position.x += this.velocity.x;
    if (this.position.x < 0 || this.position.x + this.width >= p5.windowWidth) {
      this.velocity.x *= -1;
      if (this.current_dir === this.left) {
        this.current_dir = this.right;
      } else {
        this.current_dir = this.left;
      }
    }

    p5.image(img, this.position.x, this.position.y, this.width, this.height);
    if (this.shooting_lasers) {
      this.laser_eye_left.Shoot();
      this.laser_eye_right.Shoot();
    }
    this.Gravity(p5);
    if (IsOutsideScreen(this.laser_eye_left, p5) && IsOutsideScreen(this.laser_eye_right, p5)) {
      console.log("OUTSIDE SCREEN - LETS RESET!");
      this.ShootAt(target.position);
      //this.shooting_lasers = false;
    }
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

export class Dino {
  constructor(p5) {
    this.position = p5.createVector(p5.windowWidth - dino_width - bookshelf_thickness / 2, 0);
    this.velocity = p5.createVector(4, 15);
    dino_right_01 = p5.loadImage('/images/dino-left-1.png');
    dino_right_02 = p5.loadImage('/images/dino-left-2.png');
    dino_right_03 = p5.loadImage('/images/dino-left-3.png');
    dino_right_04 = p5.loadImage('/images/dino-left-4.png');

    dino_left_01 = p5.loadImage('/images/dino-right-1.png');
    dino_left_02 = p5.loadImage('/images/dino-right-2.png');
    dino_left_03 = p5.loadImage('/images/dino-right-3.png');
    dino_left_04 = p5.loadImage('/images/dino-right-4.png');

    this.left = [dino_left_01, dino_left_02, dino_left_03, dino_left_04];
    this.right = [dino_right_01, dino_right_02, dino_right_03, dino_right_04];

    this.animation_idx = 0;
    this.width = dino_width;
    this.height = dino_height;
    this.current_dir = this.left;
    this.current_shelf = dino_starting_shelf;
  }

  Run(p5, target) {
    let img = this.current_dir[this.animation_idx];
    if (p5.frameCount % 20 == 0) {
      this.animation_idx++;
      if (this.animation_idx == this.left.length) this.animation_idx = 0;
    }

    this.position.x += this.velocity.x;
    if (this.position.x < 0 || this.position.x + this.width >= p5.windowWidth) {
      this.velocity.x *= -1;
      if (this.current_dir === this.left) {
        this.current_dir = this.right;
      } else {
        this.current_dir = this.left;
      }
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


export class Agent {
  constructor(p5) {
    this.position = p5.createVector(0, 0);
    this.velocity = p5.createVector(4, 15);

    agent_left_01 = p5.loadImage('/images/willy_left_01.png');
    agent_left_02 = p5.loadImage('/images/willy_left_02.png');
    agent_left_03 = p5.loadImage('/images/willy_left_03.png');
    agent_left_04 = p5.loadImage('/images/willy_left_04.png');

    agent_right_01 = p5.loadImage('/images/willy_right_01.png');
    agent_right_02 = p5.loadImage('/images/willy_right_02.png');
    agent_right_03 = p5.loadImage('/images/willy_right_03.png');
    agent_right_04 = p5.loadImage('/images/willy_right_04.png');

    this.left = [agent_left_01, agent_left_02, agent_left_03, agent_left_04];
    this.right = [agent_right_01, agent_right_02, agent_right_03, agent_right_04];

    this.animation_idx = 0;
    this.width = agent_width;
    this.height = agent_height;
    this.current_shelf = agent_starting_shelf;
    this.current_dir = this.right;

    this.down_triggered = false;
    this.down_counter = 0;
    this.down_countdown = 15;

    this.is_jumping = false;
    this.jump_power = agent_jump_power
    this.max_height = this.height;
    this.jump_counter = agent_jump_power;
    this.falling_speed = 4;
    this.num_lives = num_agent_lives;
  }

  Move(direction) {
    if (direction == "LEFT") {
      this.current_dir = this.left;
    } else {
      this.current_dir = this.right;
    }
  }

  Regenerate() {
    this.position.set(0, 0);
    this.current_shelf = agent_starting_shelf;
    this.num_lives--;
  }

  Run(p5) {
    if (this.num_lives) {
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
