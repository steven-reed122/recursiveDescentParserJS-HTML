function separateByNewline(inputString) {
  // Split the inputString by newline characters and store the result in an array
  var linesArray = inputString.split("\n");
  
  // Create a queue to hold the lines
  var queue = [];

  // Iterate over each line in the array
  linesArray.forEach(function(line) {
      // Enqueue each line into the queue
      queue.push(line);
  });
  
  // Return the queue containing separate lines
  return queue;
}

function printQueue(queue) {
  // Iterate over each item in the queue
  queue.forEach(function(item) {
      // Print each item on a new line
      console.log(item);
  });
}

function containsKeyWordAtIndex(line, index, keyword) {
  // Find the starting index of the next word after the given index
  var nextWordIndex = line.indexOf(" ", index + 1);
  if (nextWordIndex === -1) {
      nextWordIndex = line.length;
  }
  
  // Extract the word from the line
  var word = line.substring(index, nextWordIndex);

  // Check if the extracted word matches the keyword
  return word === keyword;
}

function isDigit(char) {
  // Use regular expression to test if the character is a digit
  return /^\d$/.test(char);
}

function isLetter(char) {
  // Use regular expression to test if the character is a letter
  return /^[a-zA-Z]$/.test(char);
}

function findEndIndexOfDigits(line, index) {
  var endIndex = index; // Initialize endIndex with the given index

  for (var i = index; i < line.length; i++) {
      // Check if the character is a digit
      if (isDigit(line.charAt(i))) {
          // Update endIndex to the current index
          endIndex++;
      } else {
          // If the character is not a digit, break the loop
          break;
      }
  }

  // If no digits are encountered, return an error (-1)
  if (endIndex === index) {
      return -1;
  }

  return endIndex;
}

function findEndIndexOfAlphanumeric(line, index) {
  var regex = /^[a-zA-Z][a-zA-Z0-9]*/;
  var substring = line.substring(index);

  var match = substring.match(regex); // Capture the match result

  if (match) {
      return index + match[0].length;
  } else {
      return -1;
  }
}

function findTokenType(line, index){
  var ch = line.charAt(index);
  switch(ch) {
    case "i": 
      if (containsKeyWordAtIndex(line, index, "if")) {return "[IF]";}
    case "p":
      if (containsKeyWordAtIndex(line, index, "program")) {return "[PROGRAM]"};
    case "e":
      if (containsKeyWordAtIndex(line, index, "end_if")) {return "[END_IF]";}
      else if (containsKeyWordAtIndex(line, index, "end_loop")) return "[END_LOOP]";
      else if (containsKeyWordAtIndex(line, index, "end_program")) return "[END_PROGRAM]";
    case "l":
      if (containsKeyWordAtIndex(line, index, "loop")) return "[LOOP]";
    case "=":
      if (containsKeyWordAtIndex(line, index, "==")) return "[EE]";
      else if (containsKeyWordAtIndex(line, index, "=")) return "[ASSIGN]";
    case "<":
      if (containsKeyWordAtIndex(line, index, "<=")) return "[LE]";
      else if (containsKeyWordAtIndex(line, index, "<")) return "[LT]";
    case ">":
      if (containsKeyWordAtIndex(line, index, ">=")) return "[GE]";
      else if (containsKeyWordAtIndex(line, index, ">")) return "[GT]";
    case "+": return "[ADD_OP]";
    case "-": return "[SUB_OP]";
    case "*": return "[MUL_OP]";
    case "/": return "[DIV_OP]";
    case "%": return "[MOD_OP]";
    case "(": return "[LP]";
    case ")": return "[RP]";
    case "{": return "[LB]";
    case "}": return "[RB]";
    case "|": return "[OR]";
    case "&": return "[AND]";
    case "!": return "[NEG]";
    case ",": return "[COMMA]";
    case ":": return "[COLON]";
    case ";": return "[SEMI]";
    case '\t': return "[TAB]";
    case '\n': return "[NEWLINE]";
    default: 
    if(isDigit(ch)) return "[INT_CONST]";
    else if(isLetter(ch)) return "[IDENT]";
    else return "[UNKNOWN]";
  }
}

function parseLine(line){
  let lineTokenStrings = [];
  let i = 0;
  var oldIndex = 0;
  var isIdent = false;
  var isIntConst = false;
  function findTokenType(line, index){
    var ch = line.charAt(index);
    switch(ch) {
      case "i": 
        if (containsKeyWordAtIndex(line, index, "if")) {i+=2; return "[IF]";}
      case "p":
        if (containsKeyWordAtIndex(line, index, "program")) {i+=7; return "[PROGRAM]"};
      case "e":
        if (containsKeyWordAtIndex(line, index, "end_if")) {i+=6; return "[END_IF]";}
        else if (containsKeyWordAtIndex(line, index, "end_loop")) {i+=8; return "[END_LOOP]";}
        else if (containsKeyWordAtIndex(line, index, "end_program")) {i+=11; return "[END_PROGRAM]";}
      case "l":
        if (containsKeyWordAtIndex(line, index, "loop")) {i+=4; return "[LOOP]";}
        else if(isLetter(ch)) {
          oldIndex = i; isIdent = true; 
          i = findEndIndexOfAlphanumeric(line, index); 
          return "[IDENT]";}
      case "=":
        if (containsKeyWordAtIndex(line, index, "==")) {i+=2; return "[EE]";}
        else if (containsKeyWordAtIndex(line, index, "=")) {i++; return "[ASSIGN]";}
      case "<":
        if (containsKeyWordAtIndex(line, index, "<=")) {i++; return "[LE]";}
        else if (containsKeyWordAtIndex(line, index, "<")) {i++; return "[LT]";}
      case ">":
        if (containsKeyWordAtIndex(line, index, ">=")) {i+=2; return "[GE]";}
        else if (containsKeyWordAtIndex(line, index, ">")) {i++; return "[GT]";}
      case "+": {i++; return "[ADD_OP]";}
      case "-": {i++; return "[SUB_OP]";}
      case "*": {i++; return "[MUL_OP]";}
      case "/": {i++; return "[DIV_OP]";}
      case "%": {i++; return "[MOD_OP]";}
      case "(": {i++; return "[LP]";}
      case ")": {i++; return "[RP]";}
      case "{": {i++; return "[LB]";}
      case "}": {i++; return "[RB]";}
      case "|": {i++; return "[OR]";}
      case "&": {i++; return "[AND]";}
      case "!": {i++; return "[NEG]";}
      case ",": {i++; return "[COMMA]";}
      case ":": {i++; return "[COLON]";}
      case ";": {i++; return "[SEMI]";}
      case "\t": {i++; return "[TAB]";}
      case "\n": {i++; return "[NEWLINE]";}
      case '': {i++; return "[NULL]";}
      default: 
        if(isDigit(ch)) {
          oldIndex = i;
          i = findEndIndexOfDigits(line, index); 
          isIdent = true; 
          return "[INT_CONST]";
        } else if(isLetter(ch)) {
          oldIndex = i;
          i = findEndIndexOfAlphanumeric(line, index); 
          isIntConst = true; 
          return "[IDENT]";}
        else return "[UNKNOWN]";
    }
  }
  while(i < line.length) {
    while(line.charAt(i) == " ") i++;
    if(i >= line.length) break;
    lineTokenStrings.push(findTokenType(line, i));
    if(isIdent || isIntConst) {
      {
        lineTokenStrings.push(line.substring(oldIndex, i));
        isIdent = false; isIntConst = false; 
      }
    }
  }
  return lineTokenStrings;
}

function buildTokenString(text){
  let lines = separateByNewline(text);
  let tokenStrings = [];
  for(let i = 0; i < lines.length; i++){
    tokenStrings.push(...parseLine(lines[i]));
  }
  return tokenStrings;
}

class RecursiveDescentParser {
  constructor(tokens) {
    this.tokens = tokens;
    this.nextToken = this.tokens.shift();
    this.nextNextToken = this.tokens[0];
    this.currentTokenIndex = 0;
    this.intConst = '';
    this.ident = '';
    this.lineNum = 0;
    this.parsedProgram = '';
    this.usedVariables = new Set();
  }

  getProgram() {
    return this.parsedProgram;
  }

  isVariableUsed(variable) {
    return this.usedVariables.has(variable);
  }

  addUsedVariable(variable) {
    this.usedVariables.add(variable);
  }

  checkVariableAvailable(variable) {
    if (!this.isVariableUsed(variable)) {
      this.addUsedVariable(variable);
      return true;
    }
    return false;
  }

  lex() {
    this.currentTokenIndex++;
    if (this.currentTokenIndex < this.tokens.length) {
      this.nextToken = this.nextNextToken;
      this.nextNextToken = this.tokens[this.currentTokenIndex];
      if (this.nextNextToken !== undefined) {
        if (this.nextNextToken.charAt(0) !== '[') {
          this.intConst = this.nextNextToken;
          this.ident = this.intConst;
          this.currentTokenIndex++;
          this.nextNextToken = this.tokens[this.currentTokenIndex];
        }
      }
    } else {
      this.nextToken = null; // or handle end of tokens
    }
  }

  error(message) {
    console.error(`Error: ${message} at line ${this.lineNum}`);
    throw new Error(message);
  }

  program() {
    console.log("Enter <program>");
    if (this.nextToken === "[PROGRAM]") {
      this.parsedProgram += "public class MyClass {\n";
      this.parsedProgram += "public static void main(String[] args) {\n";
      this.lineNum++;
      this.statements();
    } else {
      this.error("Expected PROGRAM token");
    }
    this.parsedProgram += "}\n}\n";
    console.log("Exit <program>");
  }

  statements() {
    console.log("Enter <statements>");
    while (true) {
      this.lex();
      if (this.nextNextToken === "[END_PROGRAM]") {
        this.lineNum++;
        break;
      }
      this.statement();
    }
    console.log("Exit <statements>");
  }

  statement() {
    console.log("Enter <statement>");
    this.lineNum++;
    this.parsedProgram += "\t";
    if (this.nextToken === "[IDENT]") {
      if (this.checkVariableAvailable(this.ident)) {
        this.parsedProgram += "int ";
      }
      this.parsedProgram += this.ident;
      this.lex();
      this.assignment();
    } else if (this.nextToken === "[IF]") {
      this.parsedProgram += "if (";
      this.lex();
      this.conditional();
    } else if (this.nextToken === "[LOOP]") {
      this.parsedProgram += "for (";
      this.lex();
      this.loop();
    } else {
      this.error("Unexpected token");
    }
    this.parsedProgram += "\n";
    console.log("Exit <statement>");
  }

  assignment() {
    console.log("Enter <assignment>");
    if (this.nextToken === "[ASSIGN]") {
      this.parsedProgram += " = ";
      this.lex();
      this.expr();
      if (this.nextToken !== "[SEMI]") {
        this.error("Expected SEMI token");
      }
      this.parsedProgram += ";";
    } else {
      this.error("Expected ASSIGN token");
    }
    console.log("Exit <assignment>");
  }

  conditional() {
    console.log("Enter <conditional>");
    this.lex();
    this.logicalExpression();
    this.conditional_statements();
  }

  logicalExpression() {
      console.log("Enter <logicalExpression>");
      if (this.nextToken === "[IDENT]") {
          this.parsedProgram += this.ident;
          this.lex();
      } else {
          this.error();
      }
      if (["[LT]", "[GT]", "[LE]", "[GE]", "[EE]"].includes(this.nextToken)) {
          switch (this.nextToken) {
              case "[LT]":
                  this.parseProgram += " < ";
                  break;
              case "[GT]":
                  this.parsedProgramProgram += " > ";
                  break;
              case "[LE]":
                  this.parsedProgram+= " <= ";
                  break;
              case "[GE]":
                  this.parsedProgram += " >= ";
                  break;
              case "[EE]":
                  this.parsedProgram += " == ";
                  break;
              default:
                  this.error();
          }
          this.lex();
          this.expr();
          this.parsedProgram += ")";
      }
      console.log("Exit <logicalExpression>");
  }

  conditional_statements() {
      console.log("Enter <conditional_statements>");
      this.parsedProgram += " {\n";
      while (true) {
          this.lex();
          if (this.nextToken === "[END_IF]") {
              this.lineNum++;
              this.parseProgram += "\t}\n";
              break;
          }
          this.parsedProgram += "\t";
          this.statement();
      }
      console.log("Exit <conditional_statements>");
  }

  loop() {
      console.log("Enter <loop>");
      if (this.nextToken === "[LP]") {
          this.lex();
          this.loop_condition();
          this.loop_statements();
          console.log("Exit <loop>");
      } else {
          this.error();
      }
  }

  loop_condition() {
      console.log("Enter <loop_condition>");
      if (this.nextToken === "[IDENT]") {
          this.lex();
          let tempVariable = this.ident;
          if (this.checkVariableAvailable(this.ident)) {
            this.parsedProgram += "int ";
          }
          this.parsedProgram += this.ident;
          this.loop_assignment();
          if (this.nextToken === "[COLON]") {
              this.parseProgram += tempVariable + " < ";
              this.lex();
              this.expr();
              this.parsedProgram += "; ";
              this.parsedProgram += tempVariable + "++)";
          } else {
              this.error();
          }
      } else {
          this.error();
      }
      console.log("Exit <loop_condition>");
  }

  loop_assignment() {
      console.log("Enter <loop_assignment>");
      if (this.nextToken === "[ASSIGN]") {
          this.parsedProgram += " = ";
          this.lex();
          this.expr();
          this.parseProgram += "; ";
      } else {
          this.error();
      }
      console.log("Exit <loop_assignment>");
  }

  loop_statements() {
      console.log("Enter <loop_statements>");
      this.parsedProgram += " {\n";
      while (true) {
          this.lex();
          if (this.nextToken === "[END_LOOP]") {
              this.lineNum++;
              this.parsedProgram += "\t}\n";
              break;
          }
          this.parsedProgram += "\t";
          this.statement();
      }
      console.log("Exit <loop_statements>");
  }

  expr() {
      console.log("Enter <expr>");
      this.term();
      while (["[ADD_OP]", "[SUB_OP]"].includes(this.nextToken)) {
          switch (this.nextToken) {
              case "[ADD_OP]":
                  this.parsedProgram += " + ";
                  break;
              case "[SUB_OP]":
                  this.parsedProgram += " - ";
                  break;
              default:
                  this.error();
          }
          this.lex();
          this.term();
      }
      console.log("Exit <expr>");
  }

  term() {
      console.log("Enter <term>");
      this.factor();
      while (["[MUL_OP]", "[DIV_OP]", "[MOD_OP]"].includes(this.nextToken)) {
          switch (this.nextToken) {
              case "[MUL_OP]":
                  this.parsedProgram += " * ";
                  break;
              case "[DIV_OP]":
                  this.parsedProgram += " / ";
                  break;
              case "[MOD_OP]":
                  this.parsedProgram += " % ";
                  break;
              default:
                  this.error();
          }
          this.lex();
          this.factor();
      }
      console.log("Exit <term>");
  }

  factor() {
      console.log("Enter <factor>");
      if (this.nextToken === "[IDENT]") {
          this.lex();
          if (!this.checkVariableAvailable(this.ident)) {
              this.parsedProgram += this.ident;
          } else {
              throw new Error(`Error: IDENT ${this.ident} not yet initialized and assigned when used at line ${this.lineNum}`);
          }
      } else if (this.nextToken === "[INT_CONST]") {
          this.parsedProgram += this.intConst;
          this.lex();
      } else {
          if (this.nextToken === "[LP]") {
              this.parseProgram += "(";
              this.lex();
              this.expr();
              if (this.nextToken === "[RP]") {
                  this.parsedProgram += ")";
                  this.lex();
              } else {
                  this.error();
              }
          } else {
              this.error();
          }
      }
      console.log("Exit <factor>");
  }
}


// Test cases for separateByNewline function
console.log("Testing separateByNewline function:");
var inputString1  = "Line 1\nLine 2\nLine 3";
var inputString2 = "program \n value";
var queue = separateByNewline(inputString1);
console.log(queue); // Expected output: ["Line 1", "Line 2", "Line 3"]
queue = separateByNewline(inputString2);
console.log(queue); // Expected output: ["program ", " value"]

// Test cases for printQueue function
console.log("\nTesting printQueue function:");
printQueue(queue); // Expected output: "Line 1", "Line 2", "Line 3"

// Test cases for containsKeyWordAtIndex function
console.log("\nTesting containsKeyWordAtIndex function:");
var line = "if (x > 0)";
console.log(containsKeyWordAtIndex(line, 0, "if") == true); // Expected output: true
console.log(containsKeyWordAtIndex(line, 0, "else") == false); // Expected output: false

// Test cases for findEndIndexOfDigits function
console.log("\nTesting findEndIndexOfDigits function:");
var lineDigits = "bandman122";
console.log(findEndIndexOfDigits(lineDigits, 7) == "9"); // Expected output: 9

// Test cases for findEndIndexOfAlphanumeric function
console.log("\nTesting findEndIndexOfAlphanumeric function:");
var lineAlphanumeric = "bandman122";
console.log(findEndIndexOfAlphanumeric(lineAlphanumeric, 0) == "9"); // Expected output: 9

// Test cases for findKeywordSwitchStatement function
console.log("\nTesting findKeywordSwitchStatement function:");
console.log(findTokenType("if", 0) == "[IF]"); // Expected output: "[IF]"
console.log(findTokenType("program",0) == "[PROGRAM]"); // Expected output: "[PROGRAM]"
console.log(findTokenType("end_if", 0) == "[END_IF]"); // Expected output: "[END_IF]"
console.log(findTokenType("end_loop", 0) == "[END_LOOP]"); // Expected output: "[END_LOOP]"
console.log(findTokenType("loop", 0) == "[LOOP]"); // Expected output: "[LOOP]"
console.log(findTokenType("=",0) == "[ASSIGN]");
console.log(findTokenType("==",0) == "[EE]");
console.log(findTokenType("<=", 0) == "[LE]"); // Expected output: "[LE]"
console.log(findTokenType(">=", 0) == "[GE]"); // Expected output: "[GE]"
console.log(findTokenType("<", 0) == "[LT]"); // Expected output: "[LT]"
console.log(findTokenType(">", 0) == "[GT]"); // Expected output: "[GT]"
console.log(findTokenType("+", 0) == "[ADD_OP]"); // Expected output: "[ADD_OP]"
console.log(findTokenType("-", 0) == "[SUB_OP]"); // Expected output: "[SUB_OP]"
console.log(findTokenType("*", 0) == "[MUL_OP]"); // Expected output: "[MUL_OP]"
console.log(findTokenType("/", 0) == "[DIV_OP]"); // Expected output: "[DIV_OP]"
console.log(findTokenType("%", 0) == "[MOD_OP]"); // Expected output: "[MOD_OP]"
console.log(findTokenType("(", 0) == "[LP]"); // Expected output: "[LP]"
console.log(findTokenType(")", 0) == "[RP]"); // Expected output: "[RP]"
console.log(findTokenType("{", 0) == "[LB]"); // Expected output: "[LB]"
console.log(findTokenType("}", 0) == "[RB]"); // Expected output: "[RB]"
console.log(findTokenType("|", 0) == "[OR]"); // Expected output: "[OR]"
console.log(findTokenType("&", 0) == "[AND]"); // Expected output: "[AND]"
console.log(findTokenType("!", 0) == "[NEG]"); // Expected output: "[NEG]"
console.log(findTokenType(",", 0) == "[COMMA]"); // Expected output: "[COMMA]"
console.log(findTokenType(":", 0) == "[COLON]"); // Expected output: "[COLON]"
console.log(findTokenType(";", 0) == "[SEMI]"); // Expected output: "[SEMI]"
console.log(findTokenType('\t', 0) == "[TAB]"); // Expected output: "[TAB]"
console.log(findTokenType('\n', 0) == "[NEWLINE]"); // Expected output: "[NEWLINE]"
console.log(findTokenType("9", 0) == "[INT_CONST]"); // Expected output: "[INT_CONST]"
console.log(findTokenType("a", 0) == "[IDENT]"); // Expected output: "[IDENT]"
console.log(findTokenType("$", 0) == "[UNKNOWN]"); // Expected output: "[UNKNOWN]"

// Test cases for parseLine function
console.log("\nTesting parseLine function:");
console.log(parseLine("if (x > 0)")); // Expected output: ["[IF]", "[LP]", "[IDENT]", "[GT]", "[INT_CONST]", "[RP]"]
console.log(parseLine("z = mod1 / value * (value % 7) + mod1;")); // Expected output: ["[IDENT]", "[ASSIGN]", "[IDENT]", "[DIV_OP]", "[IDENT]", "[MUL_OP]", "[LP]", "[IDENT]", "[MOD_OP]", "[INT_CONST]", "[RP]", "[ADD_OP]", "[IDENT]", "[SEMI]"]
console.log(parseLine("loop (i = 0 : value)")); // Expected output: ["[LOOP]", "[LP]", "[IDENT]", "[ASSIGN]", "[INT_CONST]", "[COLON]", "[IDENT]", "[RP]"]
console.log(parseLine("program \n x")); // Expected output: ["[PROGRAM]", "[NEWLINE]", "[IDENT]"]

// Test cases for buildTokenString function
console.log("\nTesting buildTokenString function:");
var text = "program \n value = 32; \nmod1 = 45; \nz = mod1 / value * (value % 7) + mod1; \nloop (i = 0 : value) \nz = z + mod1; \nend_loop\nif (z >= 50) \nnewValue = 50 / mod1; \nx = mod1;\nend_if \nend_program";
console.log(buildTokenString(text)); // Expected output: [["[PROGRAM]"], ["[IDENT]", "[ASSIGN]", "[INT_CONST]", "[SEMI]"], ["[IDENT]", "[ASSIGN]", "[INT_CONST]", "[SEMI]"], ["[IDENT]", "[ASSIGN]", "[IDENT]", "[DIV_OP]", "[IDENT]", "[MUL_OP]", "[LP]", "[IDENT]", "[MOD_OP]", "[INT_CONST]", "[RP]", "[ADD_OP]", "[IDENT]", "[SEMI]"], ["[LOOP]", "[LP]", "[IDENT]", "[ASSIGN]", "[INT_CONST]", "[COLON]", "[IDENT]", "
// RP"], ["[IDENT]", "[ASSIGN]", "[IDENT]", "[ADD_OP]", "[IDENT]", "[SEMI]"], ["[END_LOOP]"], ["[IF]", "[LP]", "[IDENT]", "[GE]", "[INT_CONST]", "[RP]"], ["[IDENT]", "[ASSIGN]", "[INT_CONST]", "[DIV_OP]", "[IDENT]", "[SEMI]"], ["[IDENT]", "[ASSIGN]", "[IDENT]", "[SEMI]"], ["[END_IF]"], ["[END_PROGRAM]"]]

// Test cases for RecursiveDescentParser class]
console.log("\nTesting RecursiveDescentParser class:");
var tokens = buildTokenString(text);
var parser = new RecursiveDescentParser(tokens);
var programString = parser.program();
console.log(parser.getProgram());