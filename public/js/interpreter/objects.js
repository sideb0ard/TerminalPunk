export const INTEGER_OBJECT = "INTEGER";
export const BOOLEAN_OBJECT = "BOOLEAN";
export const NULL_OBJECT = "NULL";

class Pobject {
  constructor(type) {
    this.type_ = type
  }
  Type() {
    return this.type_;
  }
  Inspect() {
    return this.type_.toString();
  }
}

class Integer extends Pobject {
  constructor(value) {
    super(INTEGER_OBJECT);
    this.value_ = value;
  }
  Inspect() {
    return this.value_.toString();
  }
}

class Boolean extends Pobject {
  constructor(value) {
    super(BOOLEAN_OBJECT);
    this.value_ = value;
  }
  Inspect() {
    return this.value_.toString();
  }
}

class Null extends Pobject {
  constructor() {
    super(NULL_OBJECT);
  }
  Inspect() {
    return "n~ll";
  }
}

export {
  Boolean,
  Integer,
  Null,
}
