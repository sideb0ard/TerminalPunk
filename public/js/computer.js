import {
  Interpret,
} from "./interpreter.js";
import {
  FileSystem
} from "./filesystem.js"
import {
  Environment,
  Modes
} from "./environment.js"


const intro = "WELCOME, AGENT!";
// const intro = "LO";
//const intro = "Your eyes open... your mind explodes with input - you find yourself inhabiting a humanoid cybernetic body, standing in a rowdy bar, the music a throbbing bass pulse, rattling your metallic core. The heavily pierced elephant-headed barman asks what you're having...";
// const yourName = "Iron Dollar Adamson";
// const intro = "Your name is " + yourName;

const instructions = "You're an ace hacker working for BCPL - The Bureau for the Containment of Programmatic Lifeforms. Your mission is to track down a rogue AI named Mat Daemon, who is loose on this file system. Using a combination of unix commands and text adventure verbs, your mission is to find, isolate and terminate his process!";

const nae_touchscreen_message = "Sorry, punk, touchscreens not supported. Best viewed with a DEC VT100 terminal";

const drinks = ["whiskey", "beer", "wine", "coke", "oil", "tea", "coffee", "piss", "water"];

function ParseAdventureCommands(input) {}

class Computer {
  constructor(p) {
    this.p5 = p;
    this.isComputing = true;
    this.inputLine = "";
    this.responseLine = "";
    this.responseIdx = 0;
    this.nextFrameIncr = 0;
    this.currentLine = 1;
    this.devmode = true;
    Environment.fs = new FileSystem();
    Environment.pwd = "/home/agent";
  }

  // called from keypress == Enter, defined in Terminal
  Read(inputLine) {
    this.inputLine = inputLine.slice();
    this.isComputing = true;
    this.responseLine = "";
    if (this.inputLine.length > 0) {
      let resp = Interpret(Environment, this.inputLine);
      if (resp !== "n~ll") this.responseLine = resp;
    }
    this.responseIdx = 0;
  }

  SetMode(mode) {
    if (mode === Modes.NAE_KEYBOARD) {
      this.responseLine = nae_touchscreen_message;
      this.isComputing = true;
      this.responseIdx = 0;
    }
  }

  // slow response ...
  Print() {
    if (!this.isComputing) return "";

    if (this.p5.frameCount > this.nextFrameIncr || this.devMode) {
      this.responseIdx++;
      if (this.responseIdx >= this.responseLine.length) {
        if (Environment.mode === Modes.NAE_KEYBOARD) {
          this.p5.noLoop();
        }
        this.isComputing = false;
      } else {
        this.nextFrameIncr = this.p5.frameCount + this.p5.random(3);
      }
    }
    if (this.responseLine) {
      return this.responseLine.slice(0, this.responseIdx);
    } else {
      return "";
    }
  }
}

export {
  Computer
};
