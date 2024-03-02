import {
  Bot,
} from "./bot.js";
import {
  Environment,
} from "./terminal.js";



const intro = "Your eyes open... your mind explodes with input - you find yourself inhabiting a humanoid cybernetic body, standing in a rowdy bar, the music a throbbing bass pulse, rattling your metallic core. The heavily pierced elephant-headed barman asks what you're having...";
// const yourName = "Iron Dollar Adamson";
// const intro = "Your name is " + yourName;

const drinks = ["whiskey", "beer", "wine", "coke", "oil", "tea", "coffee", "piss", "water"];

function Eval(line) {
  console.log("Eval this:", line);
  var words = line.split(" ");
  if (words.length == 1) {
    if (words[0] === "pwd")
      return Environment["location"];
  }
  if (words.length == 2) {
    if (words[0] === "cd") {
      ChDir(words[1]);
    }
  }
  return "computer says no";
};

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
  }

  Read(inputLine) {
    this.inputLine = inputLine.slice();
    this.isComputing = true;
    this.bot.isTalking = true;
    if (this.inputLine.length > 0) {
      this.responseLine = Eval(this.inputLine);
    } else {
      this.responseLine = "";
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
    return this.responseLine.slice(0, this.responseIdx);
  }
}

export {
  Computer
};
