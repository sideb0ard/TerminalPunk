import * as ast from "./ast.js";
import * as token from "./tokens.js";
import {
  Lexer
} from "./lexer.js"

const Precedence = {
  LOWEST: 0,
  EQUALS: 1,
  LESSGREATER: 2,
  SUM: 3,
  PRODUCT: 4,
  PREFIX: 5,
  CALL: 6
}

export class Parser {
  constructor(lex) {
    this.lex_ = lex;
    this.errors_ = [];

    this.cur_token_;
    this.peek_token_;

    this.prefix_parse_fns_ = {}
    this.infix_parse_fns_ = {}

    this.prefix_parse_fns_[token.IDENT] = this.ParseIdentifier.bind(this);
    this.prefix_parse_fns_[token.INT] = this.ParseIntegerLiteral.bind(this);

    this.NextToken();
    this.NextToken();
  }

  RegisterPrefixFn(token_type, prefixParseFn) {
    this.prefix_parse_fns_[token_type] = prefixParseFn;
  }
  RegisterInfixFn(token_type, infixParseFn) {
    this.infix_parse_fns_[token_type] = infixParseFn;
  }

  NextToken() {
    this.cur_token_ = this.peek_token_;
    this.peek_token_ = this.lex_.NextToken();
    console.log("NEXTTOKEN:: cur is:", this.cur_token_, " peek is:", this.peek_token_);
  }

  //// ENTRY PROGRAM ///////////////////////////////////////////////////////////////////
  ParseProgram() {
    console.log("YO PARSE MY ARSE!");
    let program = new ast.Root();
    while (!this.CurTokenIs(token.EOF)) {
      console.log("TOK:", this.cur_token_);
      let stmt = this.ParseStatement();
      console.log("STMT, FONNA PGUNSH:", stmt);
      if (stmt !== null) {
        program.statements_.push(stmt);
      }
      this.NextToken();
    }
    console.log("PROG:", program);
    return program;
  }

  //// STATEMENTS ///////////////////////////////////////////////////////////////////
  ParseStatement() {
    console.log("PARSE STATEMENT!", this.cur_token_.token_type);
    switch (this.cur_token_.token_type) {
      case token.LET:
        return this.ParseLetStatement();
      case token.RETURN:
        return this.ParseReturnStatement();
      default:
        return this.ParseExpressionStatement();
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
    this.NextToken();

    while (!this.CurTokenIs(token.SEMICOLON)) {
      if (this.CurTokenIs(token.EOF)) {
        break;
      }
      console.log("DISCARDME:", this.cur_token_);
      this.NextToken();
    }
    return stmt;
  }

  ParseReturnStatement() {
    let stmt = new ast.ReturnStatement(this.cur_token_);
    this.NextToken();

    while (!this.CurTokenIs(token.SEMICOLON)) {
      if (this.CurTokenIs(token.EOF)) {
        break;
      }
      console.log("DISCARDME:", this.cur_token_);
      this.NextToken();
    }
    return stmt;
  }

  //// EXPRESSIONS ///////////////////////////////////////////////////////////////////

  ParseExpressionStatement(prec) {
    let stmt = new ast.ExpressionStatement(this.cur_token_);
    stmt.expression_ = this.ParseExpression(Precedence.LOWEST);

    if (this.PeekTokenIs(token.SEMICOLON)) {
      this.NextToken();
    }
    return stmt;
  }

  ParseExpression(prec) {
    console.log("LOOKING FOR PRECEDENCE:", prec, "TOKEN:", this.cur_token_);
    let prefix = this.prefix_parse_fns_[this.cur_token_.token_type];
    if (!prefix) {
      console.log("Nah, nae prefix:", prefix);
    }

    let left_exp = prefix();

    return left_exp;
  }

  ParseIdentifier() {
    return new ast.Identifier(this.cur_token_, this.cur_token_.literal);
  }

  ParseIntegerLiteral() {
    console.log("YOYO", this);
    return new ast.IntegerLiteral(this.cur_token_, this.cur_token_.literal);
  }

  ///// UTILS ////////////////////////////////////////////////////////////////////////

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
    this.PeekError(token_type);
    return false;
  }

  PeekError(token_type) {
    let e = "Expected next token to be " + token_type + " but got " + this.peek_token_.token_type;
    this.errors_.push(e);
  }
}
