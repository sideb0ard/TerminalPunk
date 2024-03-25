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
precedences.set(token.ADD, Precedence.SUM)
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
    this.RegisterPrefixFn(token.NUMBER, this.ParseNumberLiteral.bind(this));
    this.RegisterPrefixFn(token.BANG, this.ParsePrefixExpression.bind(this));
    this.RegisterPrefixFn(token.MINUS, this.ParsePrefixExpression.bind(this));
    this.RegisterPrefixFn(token.TRUE, this.ParseBoolean.bind(this));
    this.RegisterPrefixFn(token.FALSE, this.ParseBoolean.bind(this));
    this.RegisterPrefixFn(token.LPAREN, this.ParseGroupedExpression.bind(this));

    this.RegisterInfixFn(token.ADD, this.ParseInfixExpression.bind(this));
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
    let program = new ast.Program(token.PROGRAM);
    while (!this.CurTokenIs(token.EOF)) {
      let stmt = this.ParseStatement();
      if (stmt) {
        program.statements_.push(stmt);
        stmt.String();
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
      case token.CD:
        return this.ParseCdStatement();
      case token.LS:
        return this.ParseLsStatement();
      case token.PWD:
        return this.ParsePwdStatement();
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

  ParseCdStatement() {
    let stmt = new ast.CdStatement(this.cur_token_);
    this.NextToken();

    console.log(this.cur_token_);

    while (!this.CurTokenIs(token.SEMICOLON)) {
      if (this.CurTokenIs(token.EOF)) {
        break;
      }
      console.log("DISCARDME:", this.cur_token_);
      this.NextToken();
    }
    return stmt;
  }

  ParseLsStatement() {
    let stmt = new ast.LsStatement(this.cur_token_);
    this.NextToken();

    console.log(this.cur_token_);

    while (!this.CurTokenIs(token.SEMICOLON)) {
      if (this.CurTokenIs(token.EOF)) {
        break;
      }
      console.log("DISCARDME:", this.cur_token_);
      this.NextToken();
    }
    return stmt;
  }

  ParsePwdStatement() {
    let stmt = new ast.PwdStatement(this.cur_token_);
    this.NextToken();

    console.log(this.cur_token_);

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
      console.log("PREXZ:", this.prefix_parse_fns_);
      console.log("Nah, nae prefix:", prefix, " returning null");
      return;
    }

    console.log("PREFIXFN:", prefix);

    let left_exp = prefix();
    console.log("LEFT EXPRESSION:", left_exp);

    console.log("LETS LOOK FOR AN INFIX OP.. PREC is ", prec, " PEEK PRECEDENC IS", this.PeekPrecedence());
    while (!this.PeekTokenIs(token.SEMICOLON) && prec < this.PeekPrecedence()) {
      console.log("LOOKINF FOR INFIX FUNC for token_type:", this.peek_token_.token_type, " in ", this.infix_parse_fns_);
      let infix = this.infix_parse_fns_[this.peek_token_.token_type];
      if (!infix) {
        console.log("NAE INFIX");
        return left_exp;
      }
      console.log("GOT INFIX");
      this.NextToken();
      left_exp = infix(left_exp);
    }

    return left_exp;
  }

  ParseIdentifier() {
    return new ast.Identifier(this.cur_token_, this.cur_token_.literal);
  }

  ParseNumberLiteral() {
    console.log("YOYO", this);
    return new ast.NumberLiteral(this.cur_token_, this.cur_token_.literal);
  }

  ParsePrefixExpression() {
    let exp = new ast.PrefixExpression(this.cur_token_, this.cur_token_.literal);
    this.NextToken();
    exp.right_ = this.ParseExpression(Precedence.PREFIX);
    return exp;
  }

  ParseInfixExpression(left_expression) {
    let exp = new ast.InfixExpression(this.cur_token_, this.cur_token_.literal, left_expression);
    let precedence = this.CurPrecedence();
    this.NextToken();
    exp.right_ = this.ParseExpression(precedence);
    return exp;
  }

  ParseBoolean() {
    console.log("YO PARSE BOOLEAN - val:", this.cur_token_, this);
    return new ast.Boolean(this.cur_token_, this.CurTokenIs(token.TRUE));
  }

  ParseGroupedExpression(left_expression) {
    this.NextToken();
    let exp = this.ParseExpression(Precedence.LOWEST);
    if (!this.ExpectPeek(token.RPAREN)) {
      return null;
    }
    return exp;
  }


  ///// UTILS ////////////////////////////////////////////////////////////////////////

  CurTokenIs(token_type) {
    if (this.cur_token_.token_type == token_type) return true;
    return false;
  }

  PeekTokenIs(token_type) {
    console.log("YO PEEK - for ", token_type, " ppek tok", this.peek_token_.token_type);
    if (this.peek_token_.token_type == token_type) return true;
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

  PeekPrecedence() {
    let token_type = this.peek_token_.token_type;
    console.log("YO PEEK PRECEDENCE - looking for ", token_type, " ", precedences);
    if (precedences.has(token_type)) {

      console.log("IN MAP!", precedences.get(token_type));
      return precedences.get(token_type);
    }
    console.log("NTO IN MAP - RETUN LOWESET");
    return Precedence.LOWEST;
  }

  CurPrecedence() {
    console.log("CurPrec!");
    if (precedences.has(this.cur_token_.token_type)) {
      console.log("FOUND IN PRCEDENCS - RETURNING:", precedences.get(this.cur_token_.token_type));
      return precedences.get(this.cur_token_.token_type);
    }
    console.log("NOT FOUND IN PRCEDENCS - RETURNING:", Precedence.LOWEST);
    return Precedence.LOWEST;
  }
}
