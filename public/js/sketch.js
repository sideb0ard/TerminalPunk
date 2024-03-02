import {
  Terminal
} from "./terminal.js";

export default function sketch(p) {

  p.terminal;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.terminal = new Terminal(p);
  }

  p.draw = () => {
    p.background(0);
    p.terminal.RefreshDisplay();
  }

  p.keyPressed = () => {
    console.log(p.keyCode, p.key);
    p.terminal.KeyPressed(p.keyCode, p.key);
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }
}
