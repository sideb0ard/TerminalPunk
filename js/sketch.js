let ctx = null;
let the_canvas = null;
let line_height = 20;

let width_offset = 2;
let cursor_width = 8;
let cursor_height = 3;
let font_color = "#0df005";
let output_font = '12pt Consolas';
let char_width;

let all_user_cmds = [];
let current_cmd = "";

let PROMPT = "PUNK::>";
let prompt_width = null;
let prompt_pad = 3;
let left_window_margin = 2;
let cursor = null;
window.addEventListener("load", initTerm);
let flash_counter = 1;

function initTerm() {
  the_canvas = document.getElementById("console");
  ctx = the_canvas.getContext("2d");
  ctx.font = output_font;
  let metrics = ctx.measureText("W");
  char_width = Math.ceil(metrics.width);
  prompt_width = char_width * PROMPT.length + prompt_pad;
  cursor = new appCursor({
    x: prompt_width,
    y: line_height,
    width: cursor_width,
    height: cursor_height
  });

  window.addEventListener("resize", draw);
  window.addEventListener("keydown", keyDownHandler);
  window.addEventListener("keypress", showKey);
  initViewArea();
  setInterval(flashCursor, 300);

  function appCursor(cursor) {
    this.x = cursor.x;
    this.y = cursor.y;
    this.width = cursor.width;
    this.height = cursor.height;
  }
}

function initViewArea() {
  // prevents scrollbar
  ctx.canvas.width = window.innerWidth - 5;
  ctx.canvas.height = window.innerHeight - 5;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.font = output_font;
  ctx.fillStyle = font_color;
  let text_out = PROMPT;

  ctx.fillText(text_out, left_window_margin, cursor.y);
  draw();
}

function flashCursor() {
  var flag = flash_counter % 3;

  switch (flag) {
    case 1:
    case 2: {
      ctx.fillStyle = font_color;
      ctx.fillRect(cursor.x, cursor.y, cursor.width, cursor.height);
      flash_counter++;
      break;
    }
    default: {
      ctx.fillStyle = "#000000";
      ctx.fillRect(cursor.x, cursor.y, cursor.width, cursor.height);
      flash_counter = 1;
    }
  }
}

function drawPrompt() {}

function draw() {
  ctx.canvas.width = window.innerWidth - 5;
  ctx.canvas.height = window.innerHeight - 5;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.font = output_font;
  ctx.fillStyle = font_color;

  for (var i = 0; i < all_user_cmds.length; i++) {
    drawPrompt(i + 1);
    if (i == 0) {
      x_val = prompt_width;
    } else {
      x_val = prompt_width - char_width;
    }

    ctx.font = output_font;
    ctx.fillStyle = font_color;
    for (var letter_count = 0; letter_count < all_user_cmds[i].length; letter_count++) {
      ctx.fillText(all_user_cmds[i][letter_count], x_val, line_height * (i + 1));
      x_val += char_width;
    }
  }
  if (current_cmd != "") {
    drawPrompt(Math.ceil(cursor.y / line_height));
    ctx.font = output_font;
    ctx.fillStyle = font_color;
    x_val = prompt_width - char_width;
    for (var letter_count = 0; letter_count < current_cmd.length; letter_count++) {
      ctx.fillText(current_cmd[letter_count], x_val.cursor.y);
      x_val += char_wudth;
    }
  } else {
    drawPrompt(Math.ceil(cursor.y / line_height));
  }
}

function showKey(e) {
  blowOutCursor();
  ctx.font = output_font;
  ctx.fillStyle = font_color;

  ctx.fillText(String.fromCharCode(e.charCord), cursor.x, cursor.y);
  cursor.x += char_width;
  current_cmd += String.fromCharCode(e.charCode);
}

function keyDownHandler(e) {
  var current_key = null;
  if (e.code !== undefined) {
    current_key = e.code;
    console.log("e.code:" + e.code);
  } else {
    current_key = e.keyCode;
    console.log("e.keyCode:" + e.keyCode);
  }
  console.log(current_key);
  if ((current_key === 8 || current_key === 'Backspace') && document.activeElemnt !== 'text') {
    e.preventDefault();
    if (cursor.x > prompt_width) {
      blotPrevChar();
      if (current_cmd.length > 0) {
        current_cmd = current_cmd.slice(0, -1);
      }
    }
  }
  if (current_key === 13 || current_key === 'Enter') {
    blotPrevChar();
    drawNewLine();
    cursor.x = prompt_width - char_width;
    cursor.y += line_height;
    if (current_cmd.length > 0) {
      all_user_cmds.push(current_cmd);
      current_cmd = "";
    }
  }
}
