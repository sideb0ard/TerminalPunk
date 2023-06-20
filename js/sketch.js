let terminal_width_in_chars = 40;
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

function setup() {
  createCanvas(windowWidth, windowHeight);
  cursor = new Cursor();
  cursor_color = color(0, 255, 0);
}

function draw() {
  background(0);
  key_width = (width - (margin * 2)) / terminal_width_in_chars;
  display_line(line_buffer);
}

function keyPressed() {
  if (keyCode > 31 && keyCode < 91 && line_buffer.length < terminal_width_in_chars) {
    line_buffer.push(key);
  }
  if (key == 'Backspace') {
    if (line_buffer.length > 0) {
      line_buffer.pop();
    }
  }
}
