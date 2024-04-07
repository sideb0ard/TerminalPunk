import {
  Bot,
} from "./bot.js";
import {
  Interpret,
} from "./interpreter.js";
import {
  FileSystem
} from "./filesystem.js"
import {
  Environment
} from "./environment.js"


const intro = "LO";
//const intro = "Your eyes open... your mind explodes with input - you find yourself inhabiting a humanoid cybernetic body, standing in a rowdy bar, the music a throbbing bass pulse, rattling your metallic core. The heavily pierced elephant-headed barman asks what you're having...";
// const yourName = "Iron Dollar Adamson";
// const intro = "Your name is " + yourName;

const drinks = ["whiskey", "beer", "wine", "coke", "oil", "tea", "coffee", "piss", "water"];

class Computer {
  constructor(p) {
    this.p5 = p;
    this.isComputing = true;
    this.inputLine = "";
    this.responseLine = intro;
    this.responseIdx = 0;
    this.nextFrameIncr = 0;
    this.currentLine = 1;
    this.bot = new Bot();
    this.bot.isTalking = true;
    this.devmode = true;
    Environment.fs = new FileSystem();
    Environment.pwd = "/foo/bar";
  }

  Read(inputLine) {
    this.inputLine = inputLine.slice();
    this.isComputing = true;
    this.bot.isTalking = true;
    this.responseLine = "";
    if (this.inputLine.length > 0) {
      console.log("READGOT:", this.inputLine);
      let resp = Interpret(Environment, this.inputLine);
      console.log("READGOT A4ft Interpret:", resp);
      if (resp !== "n~ll") this.responseLine = resp;
    }
    this.responseIdx = 0;
  }

  Display() {
    this.bot.Display(this.p5);
  }

  // slow response ...
  Print() {
    if (!this.isComputing) return "";

    if (this.p5.frameCount > this.nextFrameIncr || this.devMode) {
      this.responseIdx++;
      if (this.responseIdx >= this.responseLine.length) {
        this.isComputing = false;
        this.bot.isTalking = false;
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
