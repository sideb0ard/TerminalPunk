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

function Interpret(env, line) {
  console.log("REPL! REPL!", env, line);

  let lex = new Lexer(line);
  let parser = new Parser(lex);
  let prog = parser.ParseProgram();
  console.log("PARSE FINISHED:", prog);

  let resp = Eval(env, prog);
  return resp.Inspect();

  // return "computer says no";
};

export {
  Interpret,
};
