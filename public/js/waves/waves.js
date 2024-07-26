import {
  Surfer
} from "./surfer.js"

// key - C (48)
// notes in Key [48, 50, 52, 53, 55, 57, 59, 60]
const freqs = [
  130.813,
  146.832,
  164.814,
  174.614,
  195.998,
  220,
  246.942,
  261.626,
];

const steps = 1000;

let colors = [];
let angles = [];
let heightz = [];
let incrs = [];

let startz = [];

export class Waves {

  constructor(p5, bot, synth) {
    this.p5 = p5;
    this.bot = bot;
    this.synth = synth;
    this.top_margin = bot.screenHeight;

    this.surfer = new Surfer(p5, bot.top_margin, synth, freqs);

    colors.push(p5.color(0, 153, 255));
    colors.push(p5.color(26, 163, 255));
    colors.push(p5.color(51, 173, 255));
    colors.push(p5.color(77, 184, 255));
    colors.push(p5.color(102, 194, 255));
    colors.push(p5.color(128, 204, 255));
    colors.push(p5.color(153, 214, 255));
    colors.push(p5.color(179, 224, 255));

    for (let i = 0; i < freqs.length; i++) {
      let fangles = [];
      for (let j = 0; j < steps + 1; j++) {
        fangles[j] = p5.sin(p5.map(j, 0, steps, 0, (p5.TWO_PI * freqs[i]) / 20));
      }
      angles.push(fangles);
      heightz.push(1);
      incrs.push((i + 1) * 0.01);
      startz.push(Math.floor(p5.random(steps)));
    }
  }

  Start() {
    this.Reset();
    this.has_started = true;
  }

  Reset() {
    this.ResizeDisplay(this.p5.windowWidth, this.p5.windowHeight);
    this.has_started = false;
  }

  ResizeDisplay(p5_width, p5_height) {
    let height = p5_height - this.top_margin;
    let width = p5_width;
  }

  GameLoop() {
    if (!this.has_started) {
      this.Start();
    }
    this.p5.background(255, 204, 255);
    this.p5.stroke(255);

    let vstep = this.p5.windowHeight / 2 / freqs.length;
    let hafStep = vstep / 2;

    let hafw = this.p5.windowWidth / 2;

    for (let i = 0; i < freqs.length; i++) {
      this.p5.fill(colors[i]);

      this.p5.push();
      let vh = this.p5.windowHeight / 2 + (i * vstep - hafStep);

      this.p5.beginShape();
      this.p5.translate(hafw, vh);
      this.p5.vertex(-hafw, this.p5.windowHeight);

      for (let j = 0; j < steps + 1; j++) {
        let ax = (startz[i] + j) % steps;
        let angle = angles[i][ax];
        let y = this.p5.map(angle * heightz[i], -1, 1, -hafStep, hafStep);
        let x = this.p5.map(j, 0, steps + 1, -hafw, hafw);
        this.p5.vertex(x, y);
      }

      this.p5.vertex(this.p5.windowWidth, this.p5.windowHeight);

      let nextHeight = heightz[i] + incrs[i];
      if (nextHeight >= 1 || nextHeight < 0) {
        incrs[i] *= -1;
      } else {
        heightz[i] = nextHeight;
      }

      this.p5.endShape();
      this.p5.pop();

      let shouldScroll = Math.floor(this.p5.frameCount % (i + 1));

      if (shouldScroll > 0) {
        startz[i] = startz[i] + 1;
      }
    }
    this.surfer.Run(this.p5);
  }
}
