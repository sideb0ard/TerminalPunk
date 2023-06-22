let terminal_width_in_chars = 60;
let margin = 30;

let current_line = 1;
let line_height = 40;

let key_width = 0;
let cursor_x = 0;

let cursor;
let cursor_blink_on_time = 40;
let cursor_blink_off_time = 20;
let cursor_color;

let history = [];
let line_buffer = [];
let line_buffer_temp = [];

const REAL_TIME_FREQUENCY = 440;

let audio_context;
let key_noise;

function is_printable(key_code) {
  // from http://gcctech.org/csc/javascript/javascript_keycodes.htm

  // space
  if (key_code == 32)
    return true;
  // 0 - 9
  if (key_code > 47 && key_code < 58)
    return true;
  // a - z
  if (key_code > 64 && key_code < 91)
    return true;
  // numpad 
  if (key_code > 95 && key_code < 112)
    return true;
  // semi-colon -> single quote
  if (key_code > 185 && key_code < 223)
    return true;

  return false;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  audio_context = new AudioContext();
  key_noise = audio_context.createOscillator();
  key_noise.frequency.value = REAL_TIME_FREQUENCY;
  key_noise.connect(audio_context.destination);
  cursor = new Cursor();
  cursor_color = color(0, 255, 0);
}

function draw() {
  background(0);
  key_width = (width - (margin * 2)) / terminal_width_in_chars;
  refresh_display();
}

let history_idx = 0;

function keyPressed() {
  print(keyCode, key);
  if (key == 'Backspace') {
    if (line_buffer.length > 0) {
      line_buffer.pop();
    }
  }
  if (keyCode == 76) {
    if (keyIsDown(CONTROL)) {
      history = [];
      return;
    }
  }
  if (keyCode == 85) {
    if (keyIsDown(CONTROL)) {
      line_buffer = [];
      return;
    }
  }
  if (is_printable(keyCode) && line_buffer.length < terminal_width_in_chars) {
    line_buffer.push(key);
  }

  if (key == 'ArrowUp') {
    if (history_idx == history.length) {
      line_buffer_tmp = line_buffer;
    }
    if (history_idx > 0) {
      line_buffer = [...history[history_idx - 1]];
      history_idx--;
    }
  }

  if (key == 'ArrowDown') {
    if (history_idx == history.length) {
      line_buffer = line_buffer_tmp;
    }
    if (history_idx < history.length) {
      line_buffer = [...history[history_idx + 1]];
      history_idx++;
    }
  }

  if (key == 'Enter') {
    history.push(line_buffer);
    line_buffer = [];
    history_idx = history.length;
  }
}

addEventListener("keyup", (event) => {
  print("CLAKC!");
  // key_noise.stop(0);
});
addEventListener("keydown", (event) => {
  //print("DOON");
  // key_noise.start(0);
});
