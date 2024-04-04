import * as token from "./tokens.js";

function IsLetter(ch) {
  return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || ch === '_' || ch === '/' || ch === '.';
}

function IsDigit(ch) {
  return '0' <= ch && ch <= '9';
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
      this.current_char = -1;
    } else {
      this.current_char = this.input[this.next_position];
    }
    this.current_position = this.next_position;
    this.next_position += 1;
  }
  PeekChar() {
    if (this.next_position < this.input.length) {
      return this.input[this.next_position];
    }
    return -1;
  }

  NextToken() {
    this.SkipWhiteSpace();
    let tok;
    console.log("NEXT TOKEN - CUURR:", this.current_char);
    switch (this.current_char) {
      case "=":
        if (this.PeekChar() == '=') {
          this.ReadChar();
          tok = new token.Token(token.EQ, "==");
        } else {
          tok = new token.Token(token.ASSIGN, this.current_char);
        }
        break;
      case "!":
        if (this.PeekChar() == '=') {
          ReadChar();
          tok = new token.Token(token.NOT_EQ, "!=");
        } else {
          tok = new token.Token(token.BANG, this.current_char);
        }
        break;
      case "+":
        tok = new token.Token(token.ADD, this.current_char);
        break;
      case "-":
        tok = new token.Token(token.MINUS, this.current_char);
        break;
      case "*":
        tok = new token.Token(token.ASTERISK, this.current_char);
        break;
      case ";":
        tok = new token.Token(token.SEMICOLON, this.current_char);
        break;
      case ",":
        tok = new token.Token(token.COMMA, this.current_char);
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
      case -1:
        tok = new token.Token(token.EOF, "");
        break;
      case "/":
        if (!IsLetter(this.PeekChar())) {
          console.log("NOT A LETTER:", this.PeekChar());
          tok = new token.Token(token.SLASH, this.current_char);
          break;
        } // else fall through and try identifier
      default:
        if (IsLetter(this.current_char)) {
          let literal = this.ReadIdentifier();
          console.log("YO IDENTDDDDFF:", literal);
          tok = new token.Token(LookupIdent(literal), literal);
          return tok;
        } else if (IsDigit(this.current_char)) {
          let num = this.ReadNumber()
          tok = new token.Token(token.NUMBER, num);
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
    this.ReadChar(); // identifier can't start with a number so take first char
    while (IsLetter(this.current_char) || IsDigit(this.current_char)) this.ReadChar();
    return this.input.substring(pos, this.current_position);
  }

  ReadNumber() {
    console.log("READNUM:");
    let pos = this.current_position;
    while (IsDigit(this.current_char) || this.current_char == '.') this.ReadChar();
    return this.input.substring(pos, this.current_position);
  }

  SkipWhiteSpace() {
    while (this.current_char === ' ') this.ReadChar();
  }

  ReadInput(mo_input) {}

  Reset() {}

  GetInput() {}

}

export {
  Lexer
};
