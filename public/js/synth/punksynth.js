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

class SynthEngine {
  constructor(p5) {
    console.log("YO PYUNK SYNTH!", p5);
    this.p5 = p5;

    this.amp_gain = 0.3;
    this.amp_sustain = 0.7;
    this.amp_sustain_time = 0.5;
    this.amp_attack = 0.2;
    this.amp_decay = 0.2;
    this.amp_release = 0.2;

    this.lfo_rate = 3;
    this.lfo_intensity = 1;

    this.filter_cutoff = 300;
    this.filter_peak = 1;

    // https://github.com/pendragon-andyh/WebAudio-PulseOscillator/blob/master/example-synth.html#L207
    const context = this.p5.getAudioContext();
    context.createPulseOscillator = function() {

      let node = this.createOscillator();
      node.type = "sawtooth";

      let pulse_shaper = context.createWaveShaper();
      pulse_shaper.curve = pulseCurve;
      node.connect(pulse_shaper);

      let width_gain = context.createGain();
      width_gain.gain.value = 0;
      node.width = width_gain.gain;
      width_gain.connect(pulse_shaper);

      let constant_one_shaper = this.createWaveShaper();
      constant_one_shaper.curve = constantOneCurve;
      node.connect(constant_one_shaper);
      constant_one_shaper.connect(width_gain);

      node.connect = function() {
        pulse_shaper.connect.apply(pulse_shaper, arguments);
        return node;
      }

      node.disconnect = function() {
        pulse_shaper.disconnect.apply(pulse_shaper, arguments);
        return node;
      }

      return node;
    }

    this.pulse_time = 0.5;
    console.log("PUNK SYNTH CREATED!", this.p5);
  }

  set(param, value) {
    console.log("YO SET:", param, value, this);
    if (this[param]) {
      this[param] = value;
    }
  }

  createNote(freq) {
    //console.log("CREATENOtE");
    const context = this.p5.getAudioContext();
    const amp = context.createGain();
    amp.gain.value = 0;
    amp.connect(context.destination);

    const osc = context.createPulseOscillator();
    osc.frequency.value = freq;
    osc.connect(amp);

    //console.log("OSC:", osc);

    const amp_gain = this.amp_gain;
    const amp_attack = this.amp_attack;
    const amp_decay = this.amp_decay;
    const amp_release = this.amp_release;
    let amp_sustain_time = this.amp_sustain_time;
    const amp_sustain = this.amp_sustain;

    return {
      start: function(startTime) {
        //console.log("NOTEON THIS", this);
        startTime = startTime || context.currentTime;
        amp.gain.linearRampToValueAtTime(amp_gain, startTime + amp_attack);
        amp.gain.linearRampToValueAtTime(amp_gain * amp_sustain, amp_decay);
        amp.gain.linearRampToValueAtTime(amp_gain * amp_sustain, amp_sustain_time);
        osc.start(startTime);
        //lfo.start(startTime);
      },
      stop: function(releaseTime) {
        //console.log("NOTEOFFFF");
        releaseTime = releaseTime || context.currentTime;

        let stopTime = Math.max(releaseTime, amp_sustain_time) + amp_release;
        amp.gain.linearRampToValueAtTime(0, stopTime);
        osc.stop(stopTime);
        //lfo.stop(stopTime);

      }
    }
  }

  noteOn(midi_num, time) {
    //console.log("NOTON", time);
    const context = this.p5.getAudioContext();
    if (context.state === "suspended") {
      context.resume();
    }

    let osc = this.createNote(this.p5.midiToFreq(midi_num));
    osc.start(time);
    osc.stop(time + 0.1);
    //osc.disconnect(time + 0.7);

  }

  noteOff(freq, time) {}

  Lazer() {
    const context = this.p5.getAudioContext();
    if (context.state === "suspended") {
      context.resume();
    }
    let time = context.currentTime;

    const osc = new OscillatorNode(context, {
      type: "square",
      frequency: 100,
    });

    const att_rel = new GainNode(context);
    att_rel.gain.cancelScheduledValues(time);
    att_rel.gain.setValueAtTime(0, time);
    att_rel.gain.linearRampToValueAtTime(0.5, time + 0.4);
    att_rel.gain.linearRampToValueAtTime(0, time + this.pulse_time - 0.4);

    osc.connect(att_rel);
    att_rel.connect(context.destination);
    osc.frequency.setTargetAtTime(70, time, time + 0.3);
    osc.start(time);
    osc.stop(time + this.pulse_time);

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
    }
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

}


class Panel {
  constructor(p5, name) {
    this.p5 = p5;
    this.name = name;
    this.sliders = [];
    this.margin = 7;
    this.buttons = [];
  }

  addSlider(control_target, control_param, control_min, control_max, val) {
    this.sliders.push(new Slider(this.p5, control_target, control_param, control_min, control_max, val));
  }

  addButton(callback, text) {
    this.buttons.push(new Button(this.p5, callback, text));
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
  }
}

class PianoRoll {
  constructor(p5, engine, scheduler) {
    this.p5 = p5;
    this.engine = engine;
    this.scheduler = scheduler;
    this.numKeys = 13;
    this.octave = 3; // https://computermusicresource.com/midikeys.html
    this.activeNotes = [];
    this.oscz = [];
    //this.keyWidth = 70;
    //this.rowColor = new p5.color(140);
    //this.blackRowColor = new p5.color(128);
  }

  draw(x, y, width, height) {
    this.p5.rect(x, y, width, height);
    this.p5.stroke(0);
    this.p5.noFill();
    const blackKeys = [1, 3, 6, 8, 10];

    let currentStep = this.scheduler.currentStep - 1;
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
        if (j === currentStep && this.scheduler.playing) {
          this.p5.fill(240);
        }
        if (melody[j] === midiVal) {
          this.p5.fill(255, 0, 0);
        }
        this.p5.rect(gridX + j * cellWidth, y + i * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  mousePressed(x, y, width, height) {
    let cellWidth = width / 17;
    let cellHeight = height / this.numKeys;

    // KEY DOWN
    for (let i = 0; i < this.numKeys; i++) {
      if (CheckPointInsideArea(this.p5.mouseX, this.p5.mouseY, x, y + i * cellHeight, cellWidth, cellHeight)) {
        let midiKeyNum = this.numKeys - 1 - i;
        let midiVal = 12 + this.octave * 12 + midiKeyNum;
        let freq = this.p5.midiToFreq(midiVal);
        console.log("KEY DOWN! ", midiKeyNum, " midi val:", midiVal, " freq:", freq);
        this.activeNotes.push(midiVal);
        let osc = this.engine.createNote(freq);
        osc.start(0);
        this.oscz.push(osc);
      }


    }
  }

  mouseReleased() {
    this.activeNotes.forEach((n) => {
      // TODO - match note to switch off.
      console.log("NOTE OFF FOR ", n);
    });
    this.activeNotes.length = 0;
    this.oscz.forEach((o) => {
      o.stop(0);
    });
    this.oscz.length = 0;
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
    this.playing = false;

    this.adsr_panel = new Panel(this.p5, "ADSR");
    this.adsr_panel.addSlider(this.engine, "amp_attack", 1, 500, 10);
    this.adsr_panel.addSlider(this.engine, "amp_decay", 1, 500, 10);
    this.adsr_panel.addSlider(this.engine, "amp_sustain", 1, 500, 10);
    this.adsr_panel.addSlider(this.engine, "amp_release", 1, 500, 10);

    this.lfo_panel = new Panel(this.p5, "LFO");
    this.lfo_panel.addSlider(this.engine, "lfo_rate", 1, 20, 7);
    this.lfo_panel.addSlider(this.engine, "lfo_intensity", 1, 100, 1);

    this.filter_panel = new Panel(this.p5, "Filter");
    this.filter_panel.addSlider(this.engine, "filter_cutoff", 20, 20000, 8000);
    this.filter_panel.addSlider(this.engine, "filter_peak", 1, 10, 6);

    this.amp_panel = new Panel(this.p5, "Volume");
    this.amp_panel.addSlider(this.engine, "amp_gain", 0, 100, 40);
    this.amp_panel.addButton(this.StartLoop.bind(this), "start");
    this.amp_panel.addButton(this.StopLoop.bind(this), "stop");

    this.columns = [];
    this.columns.push([this.amp_panel]);
    this.columns.push([this.adsr_panel]);
    this.columns.push([this.filter_panel, this.lfo_panel]);

    this.pianoRoll = new PianoRoll(this.p5, this.engine, this);
    this.pianoWidth = 0;
    this.pianoHeight = 0;
    this.pianoX = 0;
    this.pianoY = 0;

    this.melody1 = [56, 60, 49, 55, 0, 0, 49, 52, 0, 0, 60, 0, 0, 0, 0, 0];
    this.melody2 = [];
    this.melodies = [this.melody1];
    this.mx = 0;

    this.tempo = 210.0;
    this.currentStep = 0;
    this.nextStepTime = 0.0;

    this.timer_id = 0;
  }

  NextStep() {
    const seconds_per_beat = 60.0 / this.tempo;
    this.nextStepTime += seconds_per_beat;
    let melody = this.melodies[this.mx];
    this.currentStep = (this.currentStep + 1) % melody.length;
    if (this.currentStep === 0) {
      this.mx = (this.mx + 1) % this.melodies.length;
    }
  }

  ScheduleStep(step_number, time) {
    let melody = this.melodies[this.mx];
    if (melody[step_number]) {
      this.engine.noteOn(melody[step_number], time);
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
    if (!this.playing) {
      let context = this.p5.getAudioContext();
      this.currentStep = 0;
      this.nextStepTime = context.currentTime;
      this.Scheduler();
      this.playing = true;
    }
  }

  StopLoop() {
    if (this.playing) {
      clearTimeout(this.time_id);
      this.playing = false;
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


  }
}
