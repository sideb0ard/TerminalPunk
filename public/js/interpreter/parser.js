import * as ast from "./ast.js";
import * as token from "./tokens.js";
import {
  Lexer
} from "./lexer.js"

export class Parser {
  constructor(lex) {
    this.lex_ = lex;
    this.cur_token_;
    this.peek_token_;
    this.NextToken();
    this.NextToken();
  }

  NextToken() {
    this.cur_token_ = this.peek_token_;
    this.peek_token_ = this.lex_.NextToken();
    console.log("NEXTTOKEN:: cur is:", this.cur_token_, " peek is:", this.peek_token_);
  }

  ParseProgram() {
    console.log("YO PARSE MY ARSE!");
    let program = new ast.Root();
    while (this.cur_token_.token_type !== token.EOF) {
      console.log("TOK:", this.cur_token_);
      let stmt = this.ParseStatement();
      console.log("STMT, FONNA PGUNSH:", stmt);
      if (stmt = !null) {
        program.statements_.push(stmt);
      }
      this.NextToken();
    }
    return program;
  }

  ParseStatement() {
    // console.log("PARSE STATEMENT!", this.cur_token_.token_type);
    switch (this.cur_token_.token_type) {
      case token.LET:
        return this.ParseLetStatement();
      default:
        return null;
    }
  }

  ParseLetStatement() {
    // console.log("LET STATME");
    let stmt = new ast.LetStatement(this.cur_token_);
    if (!this.ExpectPeek(token.IDENT)) {
      console.log("NAE EXPECT IDENT! have:", this.peek_token_.token_type, " BUT WANT:", token.IDENT);
      return null;
    }
    stmt.name_ = new ast.Identifier(this.cur_token_, this.cur_token_.literal);
    if (!this.ExpectPeek(token.ASSIGN)) {
      console.log("NAE EXPECT ASSIGN!");
      return null;
    }
    while (!this.CurTokenIs(token.SEMICOLON)) {
      console.log("DISCARDME:", this.cur_token_);
      this.NextToken();
    }
  }

  CurTokenIs(token_type) {
    if (this.cur_token_.token_type === token_type) return true;
    return false;
  }

  PeekTokenIs(token_type) {
    if (this.peek_token_.token_type === token_type) return true;
    return false;
  }

  ExpectPeek(token_type) {
    if (this.PeekTokenIs(token_type)) {
      this.NextToken();
      return true;
    }
    return false;
  }
}
