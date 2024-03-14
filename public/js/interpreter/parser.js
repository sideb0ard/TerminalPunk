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

const precedences = new Map();

precedences.set(token.EQ, Precedence.EQUALS)
precedences.set(token.NOT_EQ, Precedence.EQUALS)
precedences.set(token.LT, Precedence.LESSGREATER)
precedences.set(token.GT, Precedence.LESSGREATER)
precedences.set(token.PLUS, Precedence.SUM)
precedences.set(token.MINUS, Precedence.SUM)
precedences.set(token.SLASH, Precedence.PRODUCT)
precedences.set(token.ASTERISK, Precedence.PRODUCT)

export class Parser {
  constructor(lex) {
    this.lex_ = lex;
    this.errors_ = [];

    this.cur_token_;
    this.peek_token_;

    this.prefix_parse_fns_ = {}
    this.infix_parse_fns_ = {}

    this.RegisterPrefixFn(token.IDENT, this.ParseIdentifier.bind(this));
    this.RegisterPrefixFn(token.INT, this.ParseIntegerLiteral.bind(this));
    this.RegisterPrefixFn(token.BANG, this.ParsePrefixExpression.bind(this));
    this.RegisterPrefixFn(token.MINUS, this.ParsePrefixExpression.bind(this));

    this.RegisterInfixFn(token.PLUS, this.ParseInfixExpression.bind(this));
    this.RegisterInfixFn(token.MINUS, this.ParseInfixExpression.bind(this));
    this.RegisterInfixFn(token.SLASH, this.ParseInfixExpression.bind(this));
    this.RegisterInfixFn(token.ASTERISK, this.ParseInfixExpression.bind(this));
    this.RegisterInfixFn(token.EQ, this.ParseInfixExpression.bind(this));
    this.RegisterInfixFn(token.NOT_EQ, this.ParseInfixExpression.bind(this));
    this.RegisterInfixFn(token.LT, this.ParseInfixExpression.bind(this));
    this.RegisterInfixFn(token.GT, this.ParseInfixExpression.bind(this));

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
      let stmt = this.ParseStatement();
      console.log("GOT 4RM PARSE STATEMENT:", stmt);
      if (stmt) {
        program.statements_.push(stmt);
      }
      this.NextToken();
    }
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
    console.log("GOT ", stmt.expression_);
    if (!stmt.expression_) {
      console.log("UNDEFINE YO");
      return;
    }

    if (this.PeekTokenIs(token.SEMICOLON)) {
      this.NextToken();
    }
    return stmt;
  }

  ParseExpression(prec) {
    console.log("LOOKING FOR PRECEDENCE:", prec, "TOKEN:", this.cur_token_);
    let prefix = this.prefix_parse_fns_[this.cur_token_.token_type];
    if (!prefix) {
      console.log("Nah, nae prefix:", prefix, " returning null");
      return;
    }

    console.log("PREFIXFN:", prefix);

    let left_exp = prefix();

    while (!this.PeekTokenIs(token.SEMICOLON) && prec < this.PeekPrecedence()) {
      let infix = this.infix_parse_fns_[this.peek_token_.token_type];
      if (!infix) return left_exp;
      this.NextToken();
      left_exp = infix(left_exp);
    }

    return left_exp;
  }

  ParseIdentifier() {
    return new ast.Identifier(this.cur_token_, this.cur_token_.literal);
  }

  ParseIntegerLiteral() {
    console.log("YOYO", this);
    return new ast.IntegerLiteral(this.cur_token_, this.cur_token_.literal);
  }

  ParsePrefixExpression() {
    let exp = new ast.PrefixExpression(this.cur_token_, this.cur_token_.literal);
    this.NextToken();
    exp.Right = this.ParseExpression(Precedence.PREFIX);
    return exp;
  }

  ParseInfixExpression(left_expression) {
    let exp = new ast.InfixExpression(this.cur_token_, this.cur_token_.literal, left_expression);
    let precedence = CurPrecedence();
    this.NextToken();
    exp.Right = this.ParseExpression(precedence);
    return exp;
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

  PeekPrecedence(token_type) {
    if (precedences.has(token_type)) {
      return precedences[token_type];
    }
    return Precedence.LOWEST;
  }

  CurPrecedence() {
    if (precedences.has(this.cur_token_.token_type)) {
      return precedences[this.cur_token_.token_type];
    }
    return Precedence.LOWEST;
  }
}
