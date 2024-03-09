import {
  Computer
} from "./computer.js"

export let Environment = {
  "location": "/foo/bar",
};

const terminalWidthInChars = 60;
// const MARGIN = 30;

let currentLine = 1;
let lineHeight = 40;
let fontSize = 28;
let fontWidth = 20;

let leftMargin = fontWidth * 1.5;
let rightMargin = fontWidth;
let bottomMargin = lineHeight * 2;

let cursorX = 0;
const shellIcon = ">";

let cursorBlinkOnTime = 40;
let cursorBlinkOffTime = 20;

const SCREEN_ENTRY_USER_TYPE = 0;
const SCREEN_ENTRY_COMPUTER_TYPE = 1;

let screenHistory = [];
let history = [];
let historyIdx = 0;

let lineBuffer = "";
let lineBufferTmp = "";

const statusHeight = 50;

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

function DisplayWord(p5, startX, posY, word) {
  for (let i = 0; i < word.length; ++i) {
    let posX = startX + i * fontWidth;
    p5.text(word[i], posX, posY);
  }
}


class StatusBar {
  constructor(p) {
    this.p5 = p;
    this.credit = 107.00;
    this.os = "utf-8[solx]";
    this.height = statusHeight;
    this.color = p.color(52, 66, 89, 0);
    this.textColor = p.color(218, 227, 242, 0);
  }
  Display() {
    if (this.p5.alpha(this.color) < 256) {
      this.color.setAlpha(this.p5.alpha(this.color) + 1);
      this.textColor.setAlpha(this.p5.alpha(this.textColor) + 1);
    }
    let y = this.p5.height - this.height;
    this.p5.fill(this.color);
    this.p5.rect(0, y, this.p5.width, this.p5.height);
    this.p5.textFont("monospace", fontSize);
    this.p5.fill(this.textColor);
    let displayX = 10;
    let displayY = y + 30;
    DisplayWord(this.p5, displayX, displayY, Environment["location"]);
    displayX = this.p5.width - 230;
    DisplayWord(this.p5, displayX, displayY, this.os);
  }
}

class HistoryEntry {
  constructor(type, content) {
    this.type = type;
    this.content = content;
  }
}

class Cursor {
  constructor(p, color) {
    this.p5 = p;
    this.cntr = 0;
    this.isBlinking = 1;
    this.color = color;
    this.nextStateChange = cursorBlinkOnTime;
  }
  Display(x, y) {
    if (this.isBlinking) {
      this.p5.fill(this.color);
      this.p5.rect(x, y, fontWidth, 10);
    }
    this.cntr++;
    if (this.cntr == this.nextStateChange) {
      if (this.isBlinking) {
        this.nextStateChange = this.cntr + cursorBlinkOffTime;
      } else {
        this.nextStateChange = this.cntr + cursorBlinkOnTime;
      }
      this.isBlinking = 1 - this.isBlinking;
    }
  }
}

class Terminal {
  constructor(p) {
    this.p5 = p;
    this.lineNum = 1;
    this.computer = new Computer(p);
    this.computerColor = p.color(0, 195, 0);
    this.cursor = new Cursor(p, p.color(0, 255, 0));
    this.showStatusBar = false;
    this.statusBar = new StatusBar(p);

  }

  RefreshDisplay() {

    let displayLenInLines = Math.floor(this.p5.height / lineHeight);
    let lineWidthChars = this.p5.width / fontWidth;

    let historyLinesToDisplay = Math.min(screenHistory.length,
      displayLenInLines - 2);

    let historyStartIdx = 0;
    if (screenHistory.length > historyLinesToDisplay) {
      historyStartIdx = screenHistory.length - historyLinesToDisplay;
    }

    this.lineNum = 1;
    this.DisplayScreenHistory(historyStartIdx, screenHistory);

    let computeEval;
    if (this.computer.isComputing) {
      computeEval = this.computer.Print();
    }

    if (computeEval) {
      this.DisplayLine(SCREEN_ENTRY_COMPUTER_TYPE, computeEval);
      if (!this.computer.isComputing) {
        screenHistory.push(new HistoryEntry(SCREEN_ENTRY_COMPUTER_TYPE, computeEval));
      }
    } else {
      this.DisplayLine(SCREEN_ENTRY_USER_TYPE, lineBuffer);
      this.cursor.Display(leftMargin + (shellIcon.length + lineBuffer.length) * fontWidth, (this.lineNum - 1) * lineHeight);
    }

    if (this.showStatusBar) {
      this.statusBar.Display();
    }

  }

  KeyPressed(keyCode, key) {
    if (key == 'Backspace') {
      if (lineBuffer.length > 0) {
        lineBuffer = lineBuffer.substring(0, lineBuffer.length - 1);
      }
    }
    if (keyCode == 76 || keyCode == 68) {
      if (this.p5.keyIsDown(this.p5.CONTROL)) {
        screenHistory = [];
        return;
      }
    }
    if (keyCode == 85) {
      if (this.p5.keyIsDown(this.p5.CONTROL)) {
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
      this.computer.Read(lineBuffer);
      screenHistory.push(new HistoryEntry(SCREEN_ENTRY_USER_TYPE, lineBuffer));
      if (lineBuffer.length > 0) {
        history.push(lineBuffer);
        historyIdx = history.length;
        this.showStatusBar = true;
      }
      lineBuffer = "";
    }
  }

  DisplayScreenHistory(startIdx, history) {
    for (let i = startIdx; i < history.length; i++) {
      this.DisplayLine(history[i].type, history[i].content);
    }
  }

  DisplayLine(type, line) {

    this.p5.textFont("monospace", fontSize);
    if (type === SCREEN_ENTRY_USER_TYPE) {
      this.p5.fill(this.cursor.color);;
      this.p5.text(shellIcon, leftMargin, this.lineNum * lineHeight);
    } else {
      this.p5.fill(this.computerColor);;
    }
    if (line.length == 0) {
      this.lineNum++;
      return;
    }

    let maxCharsPerLine = Math.floor((this.p5.width - leftMargin - rightMargin) / fontWidth);
    let charCount = 0;
    let posX = leftMargin;
    if (type === SCREEN_ENTRY_USER_TYPE) posX += fontWidth;

    let wurds = line.split(" ");
    while (wurds.length) {
      let wurd = wurds.shift();
      if (wurd.length > (maxCharsPerLine - charCount)) {
        this.lineNum++;
        posX = leftMargin;
        charCount = 0;
      }
      let posY = this.lineNum * lineHeight;
      DisplayWord(this.p5, posX, posY, wurd);
      posX += wurd.length * fontWidth;
      charCount += wurd.length;
      if (wurds.length) {
        this.p5.text(" ", posX, posY);
        posX += fontWidth;
        charCount++;
      }
    }
    this.lineNum++;
  }
}

export {
  Terminal,
};
