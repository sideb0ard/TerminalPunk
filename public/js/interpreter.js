import {
  Environment,
} from "./terminal.js";

import {
  Lexer,
} from "./interpreter/lexer.js";

import {
  Parser,
} from "./interpreter/parser.js";

import * as token from "./interpreter/tokens.js";

function Eval(line) {
  console.log("Eval this:", line);

  let lex = new Lexer(line);
  let parser = new Parser(lex);

  let prog = parser.ParseProgram();
  console.log("PROGPROG:", prog);
  prog.String();

  return "computer says no";
};

export {
  Eval,
};
