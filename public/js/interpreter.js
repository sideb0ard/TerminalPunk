import {
  Environment,
} from "./terminal.js";

import {
  Lexer,
} from "./interpreter/lexer.js";

import {
  Parser,
} from "./interpreter/parser.js";

import {
  Eval,
} from "./interpreter/eval.js";


import * as token from "./interpreter/tokens.js";

function Interpret(line) {
  console.log("REPL! REPL!");

  let lex = new Lexer(line);
  let parser = new Parser(lex);
  let prog = parser.ParseProgram();
  console.log("PARSE FINISHED:", prog);

  let resp = Eval(prog);
  console.log("RESP::", resp);
  return resp;

  // return "computer says no";
};

export {
  Interpret,
};
