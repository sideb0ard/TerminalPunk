import {
  BOT_DISPLAY_HEIGHT,
} from '../bot.js'

let vibrato_amount = 0.5;
let vibrato_speed = 70;

//Pre-calculate the WaveShaper curves so that we can reuse them.
let pulseCurve = new Float32Array(256);
for (var i = 0; i < 128; i++) {
  pulseCurve[i] = -1;
  pulseCurve[i + 128] = 1;
}
let constantOneCurve = new Float32Array(2);
constantOneCurve[0] = 1;
constantOneCurve[1] = 1;

const SYNTH_OUTLINE_STROKE = 3;
const SYNTH_MARGIN = 5;

const SYNTH_HIGHLIGHT_COLOR = 'Lime'
const SYNTH_TEXT_COLOR = 'Chartreuse';
const SYNTH_ALT_COLOR = 'LawnGreen';

function CheckPointInsideArea(px, py, area_x, area_y, area_width, area_height) {
  if ((px >= area_x && px <= area_x + area_width) &&
    (py >= area_y && py <= area_y + area_height)) {
    return true;
  }
  return false;
}

const MAX_ADSR_VAL = 2; // seconds
//

class Envelope {
  constructor() {
    this.attack = 0.1;
    this.decay = 0.1;
    this.sustain = 1;
    this.release = 0.1;
  }
}
class Voice {
  constructor(p5) {
    this.p5 = p5;
    const context = this.p5.getAudioContext();
    if (context.state === "suspended") {
      context.resume();
    }
    this.vco = context.createOscillator();
    this.lfo = context.createOscillator();
    this.lfoGain = context.createGain();
    this.vcf = context.createBiquadFilter();
    this.output = context.createGain();

    this.vco.connect(this.vcf);
    this.vcf.connect(this.output);

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.vcf.frequency);
    this.lfo.frequency.value = 30;

    this.output.gain.value = 0;
    this.vco.type = 'sine';
    this.lfo.type = 'sine';

    this.attack = 0.1;
    this.decay = 0.1;
    this.sustain = 1;
    this.release = 0.1;

    this.vco.start();
    this.lfo.start();
  }

  setEnvelope(env) {
    if (env.attack) this.attack = env.attack;
    if (env.decay) this.decay = env.decay;
    if (env.sustain) this.sustain = env.sustain;
    if (env.release) this.release = env.release;
  }

  noteOn(midi_num, time) {
    const context = this.p5.getAudioContext();
    if (context.state === "suspended") {
      context.resume();
    }

    const now = time || context.currentTime;
    this.output.gain.cancelScheduledValues(now);

    this.vco.frequency.setValueAtTime(this.p5.midiToFreq(midi_num), now);

    // ATTACK -> DECAY -> SUSTAIN
    const atkDuration = this.attack * MAX_ADSR_VAL;
    const atkEndTime = now + atkDuration;
    const decayDuration = this.decay * MAX_ADSR_VAL;

    this.output.gain.linearRampToValueAtTime(1, atkEndTime);
    this.output.gain.exponentialRampToValueAtTime(this.sustain, atkEndTime + decayDuration);
  }

  noteOff(time) {
    const context = this.p5.getAudioContext();
    const now = time || context.currentTime;
    this.output.gain.cancelScheduledValues(now);
    this.output.gain.setValueAtTime(this.output.gain.value, now);

    // RELEASE
    const relDuration = this.release * MAX_ADSR_VAL;
    const relEndTime = now + relDuration;
    this.output.gain.linearRampToValueAtTime(0, relEndTime);

  }

  connect(destination) {
    this.output.connect(destination);
  }
}

class SynthEngine {
  constructor(p5) {
    console.log("YO PYUNK SYNTH!", p5);
    this.p5 = p5;

    this.attack = 0.2;
    this.decay = 0.2;
    this.sustain = 1;
    this.sustain_time = 0.5;
    this.release = 0.2;

    this.lfo_rate = 3;
    this.lfo_intensity = 1;

    this.filter_cutoff = 300;
    this.filter_peak = 1;

    const context = this.p5.getAudioContext();

    this.vco = context.createOscillator();
    this.lfo = context.createOscillator();
    this.lfoGain = context.createGain();
    this.vcf = context.createBiquadFilter();
    this.output = context.createGain();

    this.vco.connect(this.vcf);
    this.vcf.connect(this.output);

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.vcf.frequency);
    this.lfo.frequency.value = 30;

    this.output.gain.value = 0;
    this.vco.type = 'sawtooth';
    this.lfo.type = 'sawtooth';

    this.vco.start();
    this.lfo.start();

    this.volume = context.createGain();

    this.output.connect(this.volume);
    this.volume.connect(context.destination);

    console.log("PUNK SYNTH CREATED!", this.p5);
  }

  set(param, value) {
    console.log("YO SET:", param, value, this);
    if (param === "volume") {
      this.volume.gain.value = value;
    } else if (param === "attack") {
      this.attack = value;
    } else if (param === "decay") {
      this.decay = value;
    } else if (param === "sustain") {
      this.sustain = value;
    } else if (param === "release") {
      this.release = value;
    }
  }

  noteOn(midi_num, time) {
    const context = this.p5.getAudioContext();
    if (context.state === "suspended") {
      context.resume();
    }

    const now = time || context.currentTime;
    this.output.gain.cancelScheduledValues(now);

    this.vco.frequency.setValueAtTime(this.p5.midiToFreq(midi_num), now);

    // ATTACK -> DECAY -> SUSTAIN
    const atkDuration = this.attack * MAX_ADSR_VAL;
    const atkEndTime = now + atkDuration;
    const decayDuration = this.decay * MAX_ADSR_VAL;

    this.output.gain.linearRampToValueAtTime(1, atkEndTime);
    this.output.gain.exponentialRampToValueAtTime(this.sustain, atkEndTime + decayDuration);
  }

  noteOff(time) {
    const context = this.p5.getAudioContext();
    const now = time || context.currentTime;
    this.output.gain.cancelScheduledValues(now);
    this.output.gain.setValueAtTime(this.output.gain.value, now);

    // RELEASE
    const relDuration = this.release * MAX_ADSR_VAL;
    const relEndTime = now + relDuration;
    this.output.gain.linearRampToValueAtTime(0, relEndTime);

  }

  Lazer(time) {
    console.log("LAZZZER");
    const context = this.p5.getAudioContext();
    if (context.state === "suspended") {
      context.resume();
    }
    const now = time || context.currentTime;

    let lazLen = now + 0.3;

    let osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 1900;
    osc.frequency.exponentialRampToValueAtTime(700, lazLen);

    let vol = context.createGain();
    osc.frequency.linearRampToValueAtTime(1, lazLen);
    osc.frequency.linearRampToValueAtTime(0, lazLen + 0.1);

    osc.connect(vol);
    vol.connect(context.destination);

    osc.start(now);
    osc.stop(lazLen + 0.1);


  }
}
/////////// END SYNTH ENGINE /////////////////////////////////////////////

/////////// BEGIN UI /////////////////////////////////////////////////////

const buttonCurve = 10;
const min_slider_size = 30;

class Slider {
  constructor(p5, control_target, control_param, min, max, start_val) {
    this.slider = p5.createSlider(0, 100, start_val);
    this.min_val = min;
    this.max_val = max;
    this.control_target = control_target;
    this.control_param = control_param;
    this.control_pct = 0;
  }

  draw(p5, x, y, width) {
    this.slider.position(x, y);
    this.slider.size(width);
    let current_pct = this.slider.value();
    if (current_pct !== this.control_pct) {
      console.log("CURR IS NOT SAME AS THIS:", current_pct, this.control_pct);
      let range = this.max_val - this.min_val;
      let new_val = this.min_val + (current_pct / 100 * range);
      console.log("NEW VAL:", new_val);
      this.control_pct = current_pct;
      this.control_target.set(this.control_param, new_val);
    }
  }
  show() {
    this.slider.show();
  }
  hide() {
    this.slider.hide();
  }
}

class Button {
  constructor(p5, callback, text) {
    this.button = p5.createButton(text);
    this.button.mousePressed(callback);
  }

  draw(p5, x, y, width) {
    this.button.position(x, y);
  }
  show() {
    this.button.show();
  }
  hide() {
    this.button.hide();
  }
}

class Radio {
  constructor(p5, control_target, param, options) {
    this.radio = p5.createRadio();
    this.radio.size(60);
    options.forEach((o) => {
      this.radio.option(o);
    });
  }
  draw(p5, x, y, width) {
    this.radio.position(x, y);
  }
  show() {
    this.radio.show();
  }
  hide() {
    this.radio.hide();
  }
}


class Panel {
  constructor(p5, name) {
    this.p5 = p5;
    this.name = name;
    this.margin = 7;
    this.sliders = [];
    this.buttons = [];
    this.radios = [];
  }

  addSlider(control_target, control_param, control_min, control_max, val) {
    this.sliders.push(new Slider(this.p5, control_target, control_param, control_min, control_max, val));
  }

  addRadio(control_target, control_param, options) {
    this.radios.push(new Radio(this.p5, control_target, control_param, options));
  }

  addButton(callback, text) {
    this.buttons.push(new Button(this.p5, callback, text));
  }

  hide() {
    this.buttons.forEach((b) => {
      b.hide();
    });
    this.sliders.forEach((s) => {
      s.hide();
    });
    this.radios.forEach((r) => {
      r.hide();
    });
  }

  show() {
    this.buttons.forEach((b) => {
      b.show();
    });
    this.sliders.forEach((s) => {
      s.show();
    });
    this.radios.forEach((r) => {
      r.show();
    });
  }

  draw(p5, x, y, slider_width, max_slider_height) {
    let px = x + this.margin;
    let py = y + this.margin;
    let width = slider_width - 2 * this.margin;
    let height = max_slider_height - 2 * this.margin;
    p5.rect(px, py, width, height, 10);

    px += this.margin;
    py += this.margin * 3;
    width -= this.margin * 2;
    p5.textSize(20);
    p5.text(this.name, px, py);

    py += this.margin;
    for (let i = 0; i < this.sliders.length; i++) {
      this.sliders[i].draw(p5, px, py + i * min_slider_size, width);
    }

    py += this.sliders.length - 1 * min_slider_size;
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].draw(p5, px, py + i * min_slider_size);
    }

    for (let i = 0; i < this.radios.length; i++) {
      this.radios[i].draw(p5, px, py + i * min_slider_size, width);
    }
  }
}

class PianoRoll {
  constructor(p5, engine, scheduler) {
    this.p5 = p5;
    this.engine = engine;
    this.scheduler = scheduler;
    this.numKeys = 13;
    this.octave = 3; // https://computermusicresource.com/midikeys.html
    //this.keyWidth = 70;
    //this.rowColor = new p5.color(140);
    //this.blackRowColor = new p5.color(128);
  }

  draw(x, y, width, height) {
    this.p5.rect(x, y, width, height);
    this.p5.stroke(0);
    this.p5.noFill();
    const blackKeys = [1, 3, 6, 8, 10];

    // chicanery!
    let currentStep = this.scheduler.currentStep - 1;
    if (currentStep === -1) {
      currentStep = 15;
    }
    // end chicanery!

    let cellWidth = width / 17;
    let cellHeight = height / this.numKeys;

    // KEYS
    for (let i = 0; i < this.numKeys; i++) {
      let fillCol = 255;
      this.p5.stroke(0);
      if (blackKeys.includes(this.numKeys - 1 - i)) {
        fillCol = 0;
      }

      this.p5.fill(fillCol);
      this.p5.rect(x, y + i * cellHeight, cellWidth, cellHeight);
    }

    // GRID
    let gridX = x + cellWidth;
    let gridWidth = width - cellWidth;
    let gridHeight = height;
    for (let i = 0; i < this.numKeys; i++) {
      let midiKeyNum = this.numKeys - 1 - i;
      let midiVal = 12 + this.octave * 12 + midiKeyNum;
      let fillCol = 200;
      if (blackKeys.includes(this.numKeys - 1 - i)) {
        fillCol = 180;
      }
      this.p5.fill(fillCol);
      this.p5.noStroke();
      this.p5.rect(gridX, y + i * cellHeight, gridWidth, cellHeight);
      this.p5.stroke(0);
      let melody = this.scheduler.melodies[this.scheduler.mx];
      for (let j = 0; j < 16; j++) {
        this.p5.noFill();
        if (j === currentStep && this.scheduler.is_playing) {
          this.p5.fill(240);
        }
        melody[j].forEach((n) => {
          if (n === midiVal) {
            this.p5.fill(255, 0, 0);
          }
        });
        this.p5.rect(gridX + j * cellWidth, y + i * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  mousePressed(x, y, width, height) {
    let cellWidth = width / 17;
    let cellHeight = height / this.numKeys;

    let gridX = x + cellWidth;
    let gridWidth = width - cellWidth;
    let gridHeight = height;

    for (let i = 0; i < this.numKeys; i++) {
      // PIANO KEYS
      if (CheckPointInsideArea(this.p5.mouseX, this.p5.mouseY, x, y + i * cellHeight, cellWidth, cellHeight)) {
        let midiKeyNum = this.numKeys - 1 - i;
        let midiVal = 12 + this.octave * 12 + midiKeyNum;
        this.engine.noteOn(midiVal);
      }

      // GRID
      for (let j = 0; j < 16; j++) {
        if (CheckPointInsideArea(this.p5.mouseX, this.p5.mouseY, gridX + j * cellWidth, y + i * cellHeight, cellWidth, cellHeight)) {
          let midiKeyNum = this.numKeys - 1 - i;
          let midiVal = 12 + this.octave * 12 + midiKeyNum;
          let idx = this.scheduler.melodies[this.scheduler.mx][j].indexOf(midiVal);
          if (idx > -1) {
            this.scheduler.melodies[this.scheduler.mx][j].splice(idx, 1);
          } else {
            this.scheduler.melodies[this.scheduler.mx][j].push(midiVal);
          }
        }
      }
    }
  }

  mouseReleased() {
    this.engine.noteOff();
  }
}

/////////// END UI /////////////////////////////////////////////////////


/////////// BEGIN SYNTH /////////////////////////////////////////////////////

const LOOKAHEAD = 25.0; // How frequently to call scheduling function (in milliseconds)
const SCHEDULE_AHEAD_TIME = 0.1; // How far ahead to schedule audio (sec)

export class PunkSynth {
  constructor(p5) {
    this.p5 = p5;
    this.engine = new SynthEngine(p5);
    this.is_playing = false;

    this.adsr_panel = new Panel(this.p5, "ADSR");
    this.adsr_panel.addSlider(this.engine, "attack", 0.01, 1, 10);
    this.adsr_panel.addSlider(this.engine, "decay", 0.01, 1, 10);
    this.adsr_panel.addSlider(this.engine, "sustain", 0.01, 1, 100);
    this.adsr_panel.addSlider(this.engine, "release", 0.01, 1, 10);

    this.lfo_panel = new Panel(this.p5, "LFO");
    this.lfo_panel.addSlider(this.engine, "lfo_rate", 1, 20, 7);
    this.lfo_panel.addSlider(this.engine, "lfo_intensity", 1, 100, 1);

    this.filter_panel = new Panel(this.p5, "Filter");
    this.filter_panel.addSlider(this.engine, "filter_cutoff", 20, 20000, 70);
    this.filter_panel.addSlider(this.engine, "filter_peak", 1, 10, 50);

    this.amp_panel = new Panel(this.p5, "Volume");
    this.amp_panel.addSlider(this.engine, "volume", 0, 1, 40);
    this.amp_panel.addRadio(this.engine, "wav", [
      "sine",
      "square",
      "saw",
      "triangle"
    ]);
    // this.amp_panel.addButton(this.StartLoop.bind(this), "start");
    // this.amp_panel.addButton(this.StopLoop.bind(this), "stop");

    this.columns = [];
    this.columns.push([this.amp_panel]);
    this.columns.push([this.adsr_panel]);
    this.columns.push([this.filter_panel, this.lfo_panel]);

    this.pianoRoll = new PianoRoll(this.p5, this.engine, this);
    this.pianoWidth = 0;
    this.pianoHeight = 0;
    this.pianoX = 0;
    this.pianoY = 0;

    this.melody1 = [
      [52],
      [50],
      [0],
      [59],
      [0],
      [57],
      [0],
      [50, 57],
      [0],
      [52],
      [0],
      [50, 57],
      [50],
      [0],
      [55, 50],
      [0]
    ];
    this.melody2 = [
      [56],
      [60],
      [49],
      [55],
      [0],
      [0],
      [49],
      [52],
      [0],
      [0],
      [60],
      [0],
      [0],
      [0],
      [0],
      [0]
    ];
    this.melodies = [this.melody1];
    this.mx = 0;

    this.tempo = 120.0;
    this.currentStep = 0;
    this.nextStepTime = 0.0;

    this.timer_id = 0;
  }

  hide() {
    console.log("HIDDDE!");
    this.columns.forEach((c) => {
      c.forEach((p) => {
        p.hide();
      });
    });
  }

  show() {
    this.columns.forEach((c) => {
      c.forEach((p) => {
        p.show();
      });
    });
  }

  NextStep() {
    const seconds_per_sixteenth = 60.0 / this.tempo / 4;
    this.nextStepTime += seconds_per_sixteenth;
    console.log("NEXTSTEP TIME:", this.nextStepTime);
    let melody = this.melodies[this.mx];
    this.currentStep = (this.currentStep + 1) % melody.length;
    if (this.currentStep === 0) {
      this.mx = (this.mx + 1) % this.melodies.length;
    }
  }

  ScheduleStep(step_number, time) {
    let melody = this.melodies[this.mx];
    console.log("STEP NUM:", step_number);
    let noteLen = this.engine.attack + this.engine.decay + this.engine.release;
    if (melody[step_number]) {
      melody[step_number].forEach((n) => {
        if (n !== 0) {
          this.engine.noteOn(n, time);
          this.engine.noteOff(time + noteLen);
        }
      })
    }
  }

  Scheduler() {
    let context = this.p5.getAudioContext();
    while (this.nextStepTime < context.currentTime + SCHEDULE_AHEAD_TIME) {
      this.ScheduleStep(this.currentStep, this.nextStepTime);
      this.NextStep();
    }
    this.time_id = setTimeout(this.Scheduler.bind(this), LOOKAHEAD);
  }

  StartLoop() {
    if (!this.is_playing) {
      let context = this.p5.getAudioContext();
      this.currentStep = 0;
      this.nextStepTime = context.currentTime;
      this.Scheduler();
      this.is_playing = true;
    }
  }

  StopLoop() {
    if (this.is_playing) {
      clearTimeout(this.time_id);
      this.is_playing = false;
    }
  }

  mousePressed() {
    this.pianoRoll.mousePressed(this.pianoX, this.pianoY, this.pianoWidth, this.pianoHeight);
  }

  mouseReleased() {
    this.pianoRoll.mouseReleased(this.pianoX, this.pianoY, this.pianoWidth, this.pianoHeight);
  }

  Lazer() {
    this.engine.Lazer();
  }

  Display() {
    // outer container
    let display_height = this.p5.windowHeight - BOT_DISPLAY_HEIGHT - (SYNTH_MARGIN * 2);
    let display_width = this.p5.windowWidth - (SYNTH_MARGIN * 2);
    let outer_x = SYNTH_MARGIN;
    let outer_y = BOT_DISPLAY_HEIGHT + SYNTH_MARGIN;
    this.p5.stroke(SYNTH_HIGHLIGHT_COLOR);
    this.p5.strokeWeight(SYNTH_OUTLINE_STROKE);
    this.p5.noFill();
    this.p5.rect(outer_x, outer_y, display_width, display_height, 20);

    // top section container box
    let top_height = display_height / 5 * 2 - (SYNTH_MARGIN * 2);
    let top_width = display_width - (SYNTH_MARGIN * 2);
    let top_x = outer_x + SYNTH_MARGIN;
    let top_y = outer_y + SYNTH_MARGIN;
    this.p5.stroke(SYNTH_ALT_COLOR);
    this.p5.strokeWeight(1);
    this.p5.rect(top_x, top_y, top_width, top_height, 20);

    // top section sliders
    let all_cols_width = top_width - SYNTH_MARGIN * 2;
    let col_width = all_cols_width / this.columns.length;

    let cx = top_x + SYNTH_MARGIN;
    let cy = top_y + SYNTH_MARGIN;
    this.columns.forEach((c) => {
      let panel_height = top_height / c.length;
      for (let i = 0; i < c.length; i++) {
        c[i].draw(this.p5, cx, cy + i * panel_height, col_width, panel_height);
      }
      cx += col_width;
    });

    // bottom section container
    let bottom_height = display_height / 5 * 3 - (SYNTH_MARGIN * 2);
    let bottom_width = top_width;
    let bottom_x = top_x;
    let bottom_y = top_y + top_height;
    this.p5.stroke(SYNTH_ALT_COLOR);
    this.p5.strokeWeight(1);
    this.p5.rect(bottom_x, bottom_y, bottom_width, bottom_height, 10);

    // bottom section piano roll
    this.pianoWidth = bottom_width - SYNTH_MARGIN * 2;
    this.pianoHeight = bottom_height - SYNTH_MARGIN * 2;
    this.pianoX = bottom_x + SYNTH_MARGIN;
    this.pianoY = bottom_y + SYNTH_MARGIN;
    this.pianoRoll.draw(this.pianoX, this.pianoY, this.pianoWidth, this.pianoHeight);

    this.show();
  }
}
