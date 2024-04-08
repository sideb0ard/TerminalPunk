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


const intro = "Hi hi! you look new here. Want some instructions?";
// const intro = "LO";
//const intro = "Your eyes open... your mind explodes with input - you find yourself inhabiting a humanoid cybernetic body, standing in a rowdy bar, the music a throbbing bass pulse, rattling your metallic core. The heavily pierced elephant-headed barman asks what you're having...";
// const yourName = "Iron Dollar Adamson";
// const intro = "Your name is " + yourName;

const instructions = "You're an ace hacker working for BCPL - The Bureau for the Containment of Programmatic Lifeforms. Your mission is to track down a rogue AI named Mat Daemon, who is loose on this file system. Using a combination of unix commands and text adventure verbs, your mission is to find, isolate and terminate his process!";

const drinks = ["whiskey", "beer", "wine", "coke", "oil", "tea", "coffee", "piss", "water"];

function ParseAdventureCommands(input) {}

class Computer {
  constructor(p) {
    this.p5 = p;
    this.isComputing = true;
    this.inputLine = "";
    this.responseLine = intro;
    this.responseIdx = 0;
    this.nextFrameIncr = 0;
    this.currentLine = 1;
    this.devmode = true;
    Environment.fs = new FileSystem();
    Environment.pwd = "/home/orion";
  }

  // called from keypress == Enter, defined in Terminal
  Read(inputLine) {
    this.inputLine = inputLine.slice();
    this.isComputing = true;
    this.responseLine = "";
    if (this.inputLine.length > 0) {
      if (Environment.mode === Modes.INTRO) {
        if (!this.inputLine.match(/no/g)) {
          console.log("HE SAID YES!");
          this.responseLine = instructions;
        }
        Environment.mode = Modes.COMMAND;
      } else {
        let resp = Interpret(Environment, this.inputLine);
        if (resp !== "n~ll") this.responseLine = resp;
      }
    }
    this.responseIdx = 0;
  }

  // slow response ...
  Print() {
    if (!this.isComputing) return "";

    if (this.p5.frameCount > this.nextFrameIncr || this.devMode) {
      this.responseIdx++;
      if (this.responseIdx >= this.responseLine.length) {
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
