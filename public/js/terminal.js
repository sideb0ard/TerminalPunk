import {
  Bot,
} from "./bot.js";

import {
  Computer
} from "./computer.js"

import {
  TheLibrary,
} from "./the_library/lib.js"

import {
  Environment,
  Modes
} from "./environment.js"

const terminalWidthInChars = 60;
// const MARGIN = 30;

let currentLine = 1;
let lineHeight = 40;
let fontSize = 28;
let fontWidth = 20;

let leftMargin = fontWidth * 1.0;
let rightMargin = fontWidth;
let bottomMargin = lineHeight * 2;

let cursorX = 0;
const shellIcon = ">";
const PS2Line = Environment.user_name + "@terminalpunk";

let cursorBlinkOnTime = 40;
let cursorBlinkOffTime = 20;

const SCREEN_ENTRY_USER_TYPE = 0;
const SCREEN_ENTRY_COMPUTER_TYPE = 1;
const PS2_TYPE = 2;

// for display including reposnse
let screenHistory = [];
// user's typing history
let history = [];
let historyIdx = 0;

let lineBuffer = "";
let lineBufferTmp = "";

const statusHeight = 50;

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
    this.computer = new Computer(p);
    this.bot = new Bot(p);
    this.the_library = new TheLibrary(p, this.bot.screenHeight);
    this.cursor = new Cursor(p, p.color(0, 255, 0));

    this.audioContext = new AudioContext();

    this.audioElement = document.querySelector("audio");
    // pass it into the audio context
    this.track = this.audioContext.createMediaElementSource(this.audioElement);
    this.track.connect(this.audioContext.destination);

    this.audioElement.addEventListener(
      "ended",
      () => {
        //this.PlayMusic(true);
      },
      false,
    );
    this.music_playing = false;

    if (navigator.maxTouchPoints > 1) {
      console.log("TOUCH SCREEN!");
      this.computer.SetMode(Modes.NAE_KEYBOARD);
      Environment.mode = Modes.NAE_KEYBOARD;
      // browser supports multi-touch
    } else {
      console.log("NOT TOUCH!");
      //this.computer.SetMode(Modes.NAE_KEYBOARD);
      //Environment.mode = Modes.NAE_KEYBOARD;
    }
    this.shouldDisplayBot = true;


    this.PS2Display;
    this.lineNum = 1;
    this.displayLenInLines = 0;
    this.lineWidthChars = 0;
    this.computerColor = p.color(0, 195, 0);

    this.PS2Color = p.color(255, 0, 255);

  }

  PlayMusic(should_play) {
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
    if (should_play) {
      //this.audioElement.play();
    } else {
      this.audioElement.pause();
    }

  }

  // main entry point
  RefreshDisplay() {
    this.bot.Display();

    if (Environment.mode == Modes.THE_LIBRARY) {
      //  // if (!this.music_playing) {
      //  //   this.music_playing = true;
      //  //   this.PlayMusic(this.music_playing);
      //  // }
      this.the_library.GameLoop();
    } else {
      //  // if (this.music_playing) {
      //  //   this.music_playing = false;
      //  //   this.PlayMusic(this.music_playing);
      //  // }
      this.CommandModeLoop();
    }
  }

  ResizeDisplay(width, height) {
    if (Environment.mode == Modes.THE_LIBRARY) {
      this.the_library.ResizeDisplay(width, height, this.bot.screenHeight)
    }
  }


  CommandModeLoop() {
    this.displayLenInLines = Math.floor(this.p5.height / lineHeight);
    this.lineWidthChars = this.p5.width / fontWidth;
    this.lineNum = 1;

    this.DisplayScreenHistory();

    let computeEval;
    if (this.computer.isComputing) {
      computeEval = this.computer.Print();
    }

    if (computeEval) {
      // this.bot.isTalking = true;
      this.DisplayLine(SCREEN_ENTRY_COMPUTER_TYPE, computeEval);
      if (!this.computer.isComputing) {
        screenHistory.push(new HistoryEntry(SCREEN_ENTRY_COMPUTER_TYPE, computeEval));
      }
    } else {
      // this.bot.isTalking = false;
      let displayDir = ("/home/" + Environment.user_name === Environment.pwd) ? "~" : Environment.pwd;
      this.PS2Display = PS2Line + " [" + displayDir + "]";
      this.DisplayLine(PS2_TYPE, this.PS2Display);
      this.DisplayLine(SCREEN_ENTRY_USER_TYPE, lineBuffer);
      this.cursor.Display(leftMargin + (shellIcon.length + lineBuffer.length) * fontWidth, (this.lineNum - 1) * lineHeight + this.bot.screenHeight);
    }

    //if (this.shouldDisplayBot) {
    //}

  }

  KeyPressed(keyCode, key) {
    if (Environment.mode == Modes.COMMAND) {
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
        screenHistory.push(new HistoryEntry(PS2_TYPE, this.PS2Display));
        screenHistory.push(new HistoryEntry(SCREEN_ENTRY_USER_TYPE, lineBuffer));
        if (lineBuffer.length > 0) {
          history.push(lineBuffer);
          historyIdx = history.length;
        }
        lineBuffer = "";
      }
    } else if (Environment.mode == Modes.THE_LIBRARY) {
      if (key == 'Escape') {
        Environment.mode = Modes.COMMAND;
        Environment.pwd = "/";
      }

    }
  }

  DisplayScreenHistory() {
    let screenHistoryLength = 0;
    screenHistory.forEach((line) => {
      let lineLen = Math.ceil(line.content.length / this.lineWidthChars);
      screenHistoryLength += lineLen;
    });
    let historyLinesToDisplay = Math.min(screenHistoryLength,
      this.displayLenInLines - 5);
    //console.log("DISPLAY HIST LINES NUM:", historyLinesToDisplay);

    let historyStartIdx = 0;
    if (screenHistory.length > historyLinesToDisplay) {
      historyStartIdx = screenHistory.length - historyLinesToDisplay;
    }

    for (let i = historyStartIdx; i < screenHistory.length; i++) {
      this.DisplayLine(screenHistory[i].type, screenHistory[i].content);
    }
  }

  DisplayLine(type, line) {

    this.p5.textFont("monospace", fontSize);
    if (type === SCREEN_ENTRY_USER_TYPE) {
      this.p5.fill(this.cursor.color);;
      line = shellIcon + line;
    } else if (type === PS2_TYPE) {
      this.p5.fill(this.PS2Color);;
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

    let wurds = line.split(" ");
    while (wurds.length) {
      let wurd = wurds.shift();
      if (wurd.length > (maxCharsPerLine - charCount)) {
        this.lineNum++;
        posX = leftMargin;
        charCount = 0;
      }
      let posY = this.lineNum * lineHeight + this.bot.screenHeight;
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
