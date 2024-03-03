import * as token from "./tokens.js";

function IsLetter(ch) {
  return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || ch === '_';
}

function LookupIdent(ident) {
  if (token.KEYWORDS.has(ident)) {
    return token.KEYWORDS.get(ident);
  }
  return token.IDENT;
}

class Lexer {
  constructor(input) {
    console.log("NEW LEX LUTHOR!");
    this.input = input;
    this.current_char = 0;
    this.current_position = 0;
    this.next_position = 0;
    this.ReadChar();
  }

  ReadChar() {
    if (this.next_position >= this.input.length) {
      this.current_char = 0;
    } else {
      this.current_char = this.input[this.next_position];
    }
    this.current_position = this.next_position;
    this.next_position += 1;
  }

  NextToken() {
    this.SkipWhiteSpace();
    let tok;
    switch (this.current_char) {
      case "=":
        tok = new token.Token(token.ASSIGN, this.current_char);
        break;
      case "+":
        tok = new token.Token(token.PLUS, this.current_char);
        break;
      case "-":
        tok = new token.Token(token.MINUS, this.current_char);
        break;
      case "*":
        tok = new token.Token(token.MULTIPLY, this.current_char);
        break;
      case "/":
        tok = new token.Token(token.DIVIDE, this.current_char);
        break;
      case ";":
        tok = new token.Token(token.SEMICOLON, this.current_char);
        break;
      case "(":
        tok = new token.Token(token.LPAREN, this.current_char);
        break;
      case ")":
        tok = new token.Token(token.RPAREN, this.current_char);
        break;
      case "{":
        tok = new token.Token(token.LBRACE, this.current_char);
        break;
      case "}":
        tok = new token.Token(token.RBRACE, this.current_char);
        break;
      case 0:
        tok = new token.Token(token.EOF, "");
        break;
      default:
        if (IsLetter(this.current_char)) {
          let literal = this.ReadIdentifier();
          console.log("GOT LITERAL:", literal);
          tok = new token.Token(LookupIdent(literal), literal);
          return tok;
        } else {
          tok = new token.Token(token.ILLEGAL, this.current_char);
        }
    }
    this.ReadChar();
    return tok;
  }

  ReadIdentifier() {
    let pos = this.current_position;
    while (IsLetter(this.current_char)) this.ReadChar();
    return this.input.substring(pos, this.current_position);
  }

  SkipWhiteSpace() {
    while (this.current_char === ' ') this.ReadChar();
  }

  ReadInput(mo_input) {}

  Reset() {}

  GetInput() {}

  PeekChar() {}

  ReadNumber() {}

}

export {
  Lexer
};
