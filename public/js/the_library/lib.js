const agent_width = 68;
const agent_height = 121;

class Character {
  constructor(width, height, left_imgz, right_imgz, direction) {
    this.x = 0;
    this.y = 0;
    this.left = left_imgz;
    this.right = right_imgz;
    this.animation_idx = 0;
    this.move_speed = 4;
    this.width = width;
    this.height = height;
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

  Draw(p5) {
    if (p5.keyIsDown(p5.LEFT_ARROW) || p5.keyIsDown(p5.RIGHT_ARROW)) {
      if (p5.frameCount % 10 == 0) {
        this.animation_idx = (this.animation_idx + 1) % this.left.length;
      }
    }

    if (p5.keyIsDown(p5.LEFT_ARROW)) {
      this.Move("LEFT");
      let new_x = this.x - this.move_speed;
      if (new_x > 0) this.x = new_x;
    } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      this.Move("RIGHT");
      let new_x = this.x + this.move_speed;
      if (new_x < p5.windowWidth - this.width) this.x = new_x;
    }

    this.y = p5.windowHeight - this.height - 10;

    let img = this.current_dir[this.animation_idx];
    p5.image(img, this.x, this.y, this.width, this.height);
  }

}

export class TheLibrary {

  constructor(p5) {
    this.p5 = p5;
    this.agent_left_01 = p5.loadImage('/images/agent_left_01.png');
    this.agent_left_02 = p5.loadImage('/images/agent_left_02.png');
    this.agent_left_03 = p5.loadImage('/images/agent_left_03.png');
    this.agent_left_04 = p5.loadImage('/images/agent_left_04.png');

    this.agent_right_01 = p5.loadImage('/images/agent_right_01.png');
    this.agent_right_02 = p5.loadImage('/images/agent_right_02.png');
    this.agent_right_03 = p5.loadImage('/images/agent_right_03.png');
    this.agent_right_04 = p5.loadImage('/images/agent_right_04.png');

    this.agents_left = [this.agent_left_01, this.agent_left_02, this.agent_left_03, this.agent_left_04];
    this.agents_right = [this.agent_right_01, this.agent_right_02, this.agent_right_03, this.agent_right_04];

    this.agent = new Character(agent_width, agent_height, this.agents_left, this.agents_right, "RIGHT");

  }

  KeyPressed(key) {
    //console.log("THE LIB =- KEYPRESS:", key);
    //if (key == "ArrowLeft") {
    //  this.current_agent = this.agents_left;
    //}
    //if (key == "ArrowRight") {
    //  this.current_agent = this.agents_right;
    //}
  }

  GameLoop() {
    this.agent.Draw(this.p5);
    //console.log(this.agents_idx, this.current_agent);
    //console.log(this.current_agent[this.agents_idx]);
    //this.p5.image(this.agent_right_01, 0, 0);
  }

}
