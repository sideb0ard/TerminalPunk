let cursor;
let cursorColor;
let computerColor;

let computer;

function isPrintable(keyCode) {
  // from http://gcctech.org/csc/javascript/javascript_keycodes.htm

  // space
  if (keyCode == 32)
    return true;
  // 0 - 9
  if (keyCode > 47 && keyCode < 58)
    return true;
  // a - z
  if (keyCode > 64 && keyCode < 91)
    return true;
  // numpad 
  if (keyCode > 95 && keyCode < 112)
    return true;
  // semi-colon -> single quote
  if (keyCode > 185 && keyCode < 223)
    return true;

  return false;
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  cursor = new Cursor();
  cursorColor = color(0, 255, 0);

  computer = new Computer();
  computerColor = color(0, 195, 0);
}

function draw() {
  background(0);
  refreshDisplay();
}

function keyPressed() {
  print(keyCode, key);
  if (key == 'Backspace') {
    if (lineBuffer.length > 0) {
      lineBuffer = lineBuffer.substring(0, lineBuffer.length - 1);
    }
  }
  if (keyCode == 76 || keyCode == 68) {
    if (keyIsDown(CONTROL)) {
      screenHistory = [];
      return;
    }
  }
  if (keyCode == 85) {
    if (keyIsDown(CONTROL)) {
      lineBuffer = "";
      return;
    }
  }
  if (isPrintable(keyCode)) {
    lineBuffer = lineBuffer + key;
  }

  if (key == 'ArrowUp') {
    if (historyIdx == history.length) {
      lineBufferTmp = lineBuffer;
    }
    if (historyIdx > 0) {
      lineBuffer = history[historyIdx - 1];
      historyIdx--;
    }
  }

  if (key == 'ArrowDown') {
    if (historyIdx < history.length) {
      historyIdx++;
      if (historyIdx == history.length) {
        lineBuffer = lineBufferTmp;
      } else if (historyIdx < history.length) {
        lineBuffer = history[historyIdx];
      }
    }
  }

  if (key == 'Enter') {
    computer.read(lineBuffer);
    screenHistory.push(new HistoryEntry(SCREEN_ENTRY_USER_TYPE, lineBuffer));
    if (lineBuffer.length > 0) {
      history.push(lineBuffer);
      historyIdx = history.length;
    }
    lineBuffer = "";

  }
}

addEventListener("keyup", (event) => {
  print("CLAKC!");
});
addEventListener("keydown", (event) => {});

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
