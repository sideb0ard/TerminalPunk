const REAL_TIME_FREQUENCY = 440;

let eval;

let key_noise;

let cursor;
let cursor_color;

let computer;

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

  cursor = new Cursor();
  cursor_color = color(0, 255, 0);

  computer = new Computer();
}

function draw() {
  background(0);
  refresh_display();
}

function keyPressed() {
  print(keyCode, key);
  if (key == 'Backspace') {
    if (line_buffer.length > 0) {
      line_buffer.pop();
    }
  }
  if (keyCode == 76) {
    if (keyIsDown(CONTROL)) {
      screen_history = [];
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
    computer.Eval(line_buffer);
    line_buffer = [];

  }
}

addEventListener("keyup", (event) => {
  print("CLAKC!");
});
addEventListener("keydown", (event) => {});

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
