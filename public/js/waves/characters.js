const surfer_width = 342;
const surfer_height = 330;
const surfer_starting_wave = 3;

const shark_width = 522;
const shark_height = 482;

let surfer_balance_1;
let surfer_balance_2;
let surfer_jump_up;
let surfer_jump_middle;
let surfer_jump_down;

const JumpStates = Object.freeze({
  UP: Symbol("jumpUp"),
  MIDDLE: Symbol("jumpMiddle"),
  DOWN: Symbol("jumpDown"),
  NOT: Symbol("jumpNot"),
});

export class Surfer {
  constructor(p5, top_margin, synth, frequencies) {
    this.p5 = p5;
    this.top_margin = top_margin;
    this.waves = frequencies;
    let vstep = p5.windowHeight / 2 / this.waves.length;
    let hafStep = vstep / 2;
    this.position = p5.createVector(surfer_width, this.p5.windowHeight / 2 - surfer_height + vstep * surfer_starting_wave + hafStep);
    this.velocity = p5.createVector(5, 15);
    this.jumpVelocity = p5.createVector(2, 15);
    this.synth = synth;

    surfer_balance_1 = p5.loadImage('/images/surfer-balance-1.png');
    surfer_balance_2 = p5.loadImage('/images/surfer-balance-2.png');
    this.surfing_images = [surfer_balance_1, surfer_balance_2];

    // moving up and down
    this.isMoving = false;
    this.movingCounter = 0;

    this.isJumping = false;
    this.hitJumpMax = false;
    this.jumpStateCounter = 0;
    this.jumpState = JumpStates.NOT;
    surfer_jump_up = p5.loadImage('/images/surfer-jump-up.png');
    surfer_jump_middle = p5.loadImage('/images/surfer-jump-middle.png');
    surfer_jump_down = p5.loadImage('/images/surfer-jump-down.png');

    this.animation_idx = 0;
    this.width = surfer_width;
    this.height = surfer_height;
    this.current_wave = surfer_starting_wave;
  }

  Move(direction) {
    if (direction == "LEFT") {
      this.current_dir = this.left;
    } else {
      this.current_dir = this.right;
    }
  }

  Run(p5) {
    let img = this.surfing_images[this.animation_idx];
    if (this.isMoving) {
      if (this.movingCounter > 0) {
        this.movingCounter -= 1;
        if (this.movingCounter == 0) {
          this.isMoving = 0;
        }
      }
    }
    this.CheckKeys(p5);

    let vstep = this.p5.windowHeight / 2 / this.waves.length;
    let hafStep = vstep / 2;

    let wave_position_y = (this.p5.windowHeight / 2) - surfer_height + (vstep * this.current_wave + hafStep);
    // this.position.y = wave_position_y;
    if (this.jumpState === JumpStates.UP) {
      if (this.isJumping) {
        img = surfer_jump_up;
        let new_y = this.position.y - this.jumpVelocity.y;
        console.log("NEW Y", new_y, this.position.y, this.p5.windowHeight);
        if (new_y >= 0) {
          this.position.y = new_y;
        }
        let new_x = this.position.x + this.jumpVelocity.x;
        if (new_x <= this.p5.windowWidth) {
          this.position.x = new_x;
        }
      } else {
        this.jumpState = JumpStates.MIDDLE;
        this.jumpStateCounter = 10;
        // if (this.current_wave > 0) {
        //   this.current_wave--;
        //   console.log("CHANGdE WAV TO :", this.current_wave);
        // }
      }
    } else if (this.jumpState == JumpStates.MIDDLE) {
      img = surfer_jump_middle;
      this.jumpStateCounter--;
      if (this.jumpStateCounter === 0) {
        this.jumpState = JumpStates.DOWN;
        this.jumpStateCounter = 20;
      }
    } else if (this.jumpState == JumpStates.DOWN) {
      img = surfer_jump_down;
      this.jumpStateCounter--;
      let new_y = this.position.y + this.jumpVelocity.y;
      if (new_y < wave_position_y) {
        this.position.y = new_y;
      }
      if (this.jumpStateCounter === 0) {
        this.jumpState = JumpStates.NOT;
      }
    } else if (this.jumpState == JumpStates.NOT) {
      this.position.y = wave_position_y;
    }

    p5.image(img, this.position.x, this.position.y, this.width, this.height);
    if (p5.frameCount % 30 == 0) {
      this.animation_idx = (this.animation_idx + 1) % this.surfing_images.length;
    }
  }

  CheckKeys(p5) {
    if (p5.keyIsDown(p5.LEFT_ARROW)) {
      this.Move("LEFT");
      let new_x = this.position.x - this.velocity.x;
      if (new_x > 0) this.position.x = new_x;
    }
    if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      this.Move("RIGHT");
      let new_x = this.position.x + this.velocity.x;
      if (new_x < p5.windowWidth - this.width) this.position.x = new_x;
    }

    if (p5.keyIsDown(p5.UP_ARROW) || p5.keyIsDown(p5.DOWN_ARROW)) {
      if (!this.isMoving) {
        this.movingCounter = 20;
        if (p5.keyIsDown(p5.UP_ARROW)) {
          if (this.current_wave > 0) {
            this.current_wave--;
          }
        } else {
          if (this.current_wave < this.waves.length - 1) {
            this.current_wave++;
          }
        }
      }
      this.isMoving = true;
    } else {
      this.isMoving = false;
    }

    if (p5.keyIsDown(32)) {
      this.isJumping = true;
      this.jumpState = JumpStates.UP;
    } else {
      this.isJumping = false;
    }
  }
}

let shark1;
let shark2;
let shark3;
let shark4;

export class Shark {
  constructor(p5, wave_idx, num_waves) {
    shark1 = p5.loadImage('/images/shark1.png');
    shark2 = p5.loadImage('/images/shark2.png');
    shark3 = p5.loadImage('/images/shark3.png');
    shark4 = p5.loadImage('/images/shark4.png');
    this.p5 = p5;
    this.images = [shark1, shark2, shark3, shark4];
    this.img_idx = 0;
    this.width = shark_width;
    this.height = shark_height;
    this.current_wave = wave_idx;
    this.waves = frequencies;
    let vstep = p5.windowHeight / 2 / num_waves;
    let hafStep = vstep / 2;
    this.position = p5.createVector(this.p5.windowWidth, this.p5.windowHeight / 2 - shark_height + vstep * wave_idx + hafStep);
    this.velocity = p5.createVector(-6, 0);
  }
  Run(p5) {
    let img = this.images[this.img_idx];
    this.position.x = -this.velocity.x;
    if (this.position.x + this.width < 0) {
      this.position.x = this.p5.windowWidth;
    }
    p5.image(img, this.position.x, this.position.y, this.width, this.height);
  }
}
