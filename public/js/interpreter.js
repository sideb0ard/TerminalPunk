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
  prog.Print();


  // let tok = lex.NextToken();
  // console.log(tok);
  // while (tok.token_type !== token.EOF) {
  //   tok = lex.NextToken();
  //   console.log(tok);
  // }

  // var words = line.split(" ");
  // if (words.length == 1) {
  //   if (words[0] === "pwd")
  //     return Environment["location"];
  // }
  // if (words.length == 2) {
  //   if (words[0] === "cd") {
  //     ChDir(words[1]);
  //   }
  // }

  return "computer says no";
};

export {
  Eval,
};
