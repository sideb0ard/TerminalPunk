let cursor;
let cursorColor;
let computerColor;

let computer;

let statusBar;
let showStatusBar = false;

let devMode = true;

let environment = {
  "location": "/foo/bar",
}

let map = {
  "/": {
    "usr": {},
    "home": {},
    "opt": {},
    "bin": {},
    "sbin": {},
    "bin": {},
    "etc": {},
    "tmp": {},
    "dev": {},
    "var": {
      "log": {},
    },
    "foo": {
      "bar": {},
    },
  }
}

function ChDir(loc) {
  let fullpath = [];
  let isAbsolute = loc.startsWith("/");
  if (isAbsolute) {
    fullpath.push("/");
    loc = loc.substr(1);
  } else {}
  fullpath.push(...loc.split("/"));
  fullpath.forEach((d) => {
    print("BLAH:", d);
  });
  print("Changing dir from ", environment["location"], " to ", loc);
}

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

  statusBar = new StatusBar();

}

let glitchx = 500;
let glitchy = 500;
let glitchMod = 50;
let glitchRadius = 70;
let glitchLen = 100;

function draw() {
  background(0);
  strokeWeight(5);
  refreshDisplay();
  computer.display();

  // if (frameCount % glitchMod == 0) {
  //   glitchx += random(-500, 500);
  //   if (glitchx < 0) glitchx += width;
  //   if (glitchx > width) glitchx -= width;
  //   glitchy += random(-500, 500);
  //   if (glitchy < 0) glitchy += height;
  //   if (glitchy > width) glitchy -= height;

  // }
  // if (frameCount % glitchMod < (glitchMod / 10)) {
  //   strokeWeight(glitchRadius);
  //   drawSquiggle(glitchx, glitchy, glitchRadius, glitchLen);
  //   glitchRadius = glitchRadius + 3 % 30;
  //   glitchLen = glitchLen + 4 % 27;
  // }
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
      showStatusBar = true;
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
