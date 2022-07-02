export {Numeric}

class Numeric {
  expression: string
  value: number
  static regex = /^[\d+-/*e()]+$/;

  constructor(expression:string|number) {
    if(typeof expression == 'number') {
      this.value = expression;
      this.expression = expression.toString();
    }
    else if(typeof expression == 'string') {
      if(expression.match(Numeric.regex) != null) {
        this.value = eval(expression);
        this.expression = expression;
      }
    }
    if(!this.value) {
      throw new Error(`Error: "${expression}" is not Numeric: ${Numeric.regex}.`);
    }
  }
}