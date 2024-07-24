const surfer_width = 342;
const surfer_height = 330;
const surfer_starting_wave = 1;

let surfer_01;
let surfer_02;
let surfer_jump;

export class Surfer {
  constructor(p5, top_margin, synth) {
    this.top_margin = top_margin;
    this.position = p5.createVector(surfer_width, p5.windowHeight / 2);
    this.velocity = p5.createVector(4, 15);
    this.synth = synth;

    surfer_01 = p5.loadImage('/images/Surfer-1.png');
    surfer_02 = p5.loadImage('/images/Surfer-2.png');

    this.isJumping = false;
    surfer_jump = p5.loadImage('/images/Surfer-3.png');

    this.images = [surfer_01, surfer_02];

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
    let img = this.images[this.animation_idx];
    if (this.isJumping) {
      img = surfer_jump;
    }
    this.CheckKeys(p5);
    p5.image(img, this.position.x, this.position.y, this.width, this.height);
    if (p5.frameCount % 30 == 0) {
      this.animation_idx = (this.animation_idx + 1) % this.images.length;
    }
  }

  CheckKeys(p5) {
    if (p5.keyIsDown(p5.LEFT_ARROW)) {
      this.Move("LEFT");
      let new_x = this.position.x - this.velocity.x;
      if (new_x > 0) this.position.x = new_x;
    } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      this.Move("RIGHT");
      let new_x = this.position.x + this.velocity.x;
      if (new_x < p5.windowWidth - this.width) this.position.x = new_x;
    }

    if (p5.keyIsDown(p5.UP_ARROW)) {
      this.isJumping = true;
    } else {
      this.isJumping = false;
    }
  }
}
