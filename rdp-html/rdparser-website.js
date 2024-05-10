//File created on April 15 2024
//Last updated May 1 2024
//Written by Steven Reed
//To run program, open rdparser-website.html file with chrome
//Refer to example_program.txt for example code to try in the parser
//Refer to grammars.txt for language grammars

//***Do not use '_' in variables names***or anywhere besides the necessary tokens***

//Function to print an array of tokens to the specified HTML box
//HTML box must have id "tokenizer-output-box"
function printTokenStream(tokenStrings) {
  var outputTextTokenStream = "";
  for (let i = 0; i < tokenStrings.length; i++) {
    outputTextTokenStream += tokenStrings[i] + " ";
  }
  outputTextTokenStream = outputTextTokenStream.slice(0,-12); //chops off the [TRUE_END] token
  document.getElementById("tokenizer-output-box").value = outputTextTokenStream;
}

function clearErrorOutputBox() {
  document.getElementById("error-output-box").value = "";
}


//Function to print errors to html error output box
//printer helper function
//Also returns parseTree and JavaCode if no errors are found
function printErrors(tokenStrings) {
  try {
    var parser = new RecursiveDescentParser(tokenStrings, document.getElementById("input-box").value);
    parser.program();
    return {
      javaCode: parser.getProgram(),
      parseTree: parser.getParseTree()
    };
  } catch (error) {
    return {
      javaCode: "",
      parseTree: ""
    };
  }
}

// Function to update the Java code output box
//printer helper function
function updateJavaCodeOutputBox(outputTextJavaCode) {
  document.getElementById("java-code-output-box").value = outputTextJavaCode;
}

// Function to update the Parse Tree output box
//printer helper function
function updateParseTreeOutputBox(outputTextParseTree) {
  document.getElementById("parser-output-box").value = outputTextParseTree;
}

//This is the function that does all the information printing
//It calls the printer helper functions
function printInformation() {
  var inputText = document.getElementById("input-box").value;
  var tokenStrings = buildTokenString(inputText);

  printTokenStream(tokenStrings);
  clearErrorOutputBox();

  var { javaCode, parseTree } = printErrors(tokenStrings);

  updateJavaCodeOutputBox(javaCode);
  updateParseTreeOutputBox(parseTree);
}

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

//A function for determining if anyword is located at a given index
//in a string
//returns true if the word is found at the index
//returns false otherwise
//keyword is the word to be found
//index is the index to start searching from
//line is the string to search in
function containsKeyWordAtIndex(line, index, keyword) {
  // Find the end index of the word starting from the given index
  var length = keyword.length;
  end_index = index + length;
  // Check if the word is present in the line
  if (line.substring(index, end_index) == keyword) {
    return true;
  }
  if (isLetter(line.charAt(end_index+1)) || isDigit(line.charAt(end_index+1))) {
    return false;
  }
  return false;
}

function isDigit(char) {
  // Use regular expression to test if the character is a digit
  return /^\d$/.test(char);
}

function isLetter(char) {
  // Use regular expression to test if the character is a letter
  return /^[a-zA-Z]$/.test(char);
}

//returns the ending index of the digits in a string
//returns -1 if no digits are found
//starts from the given index
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

//returns the ending index of the alphanumeric chars in a string (line)
//returns -1 if no digits are found
//starts from the given index
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


//Finds the type of token at the given index
//This is a testing version of the same function inside of the parseLine function
//line is the string to be parsed
//index is the position in the string to do the parsing
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


//Parses a line of text and returns an array of tokens
//When an ident or int constant is encountered it places
//the ident name or int value immediately behind the token
//in the stream

//Utilizes the findTokenType function that is found above
//That function must be used as a subfunction here so it can 
//manipulate the index variable properly
function parseLine(line){
  let lineTokenStrings = [];
  let i = 0;
  var oldIndex = 0;
  var isIdent = false;
  var isIntConst = false;
  function findTokenType(line, index){ //line is the string to be parsed //index is the position in the string to do the parsing
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
        else {
          i++;
          return "[UNKNOWN]";
        }
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

//Builds a token string from the input text
//Splits the text into lines and parses each line
//Concatenates all line arrays as it goes
//Returns an array of token strings
function buildTokenString(text){
  let lines = separateByNewline(text);
  let tokenStrings = [];
  for(let i = 0; i < lines.length; i++){
    tokenStrings.push(...parseLine(lines[i])); //concatenates the different line arrays into a single array
  }
  tokenStrings.push("[TRUE_END]"); //token added for error handling purposes
  //Don't think of it as an actual token as it is only used for error handling purposes
  //It will be chopped off the token array later
  return tokenStrings;
}


//Finds the number of lines a text has
//Used for checking if an end_loop or end_if token is missing
//If the flow of a program goes over numLines without finding
//the corresponding end_loop or end_if token we know one is missing
function findNumLines(text){
  var lines = separateByNewline(text);
  return lines.length;
}

//Class for doing recursive descent parsing
//Takes in an array of tokens and the original text
//Parses the tokens and builds the Java code
//Also builds a parse tree
//Call this.program() function to start the parsing
//Call this.getProgram() to get the Java code
//Call this.getParseTree() to get the parse tree
class RecursiveDescentParser {
  constructor(tokens,text) {
    this.tokens = tokens;
    this.nextToken = this.tokens.shift();
    this.nextNextToken = this.tokens[0];
    this.currentTokenIndex = 0;
    this.intConst = '';
    this.ident = '';
    this.lineNum = 0;
    this.numLines = findNumLines(text);
    this.parsedProgram = ''; //The java code program
    this.parseTree = ''; //The parseTree
    this.usedVariables = new Set(); //set of initialized and declared variables in a given program
    this.errorTextBox = document.getElementById("error-output-box");
    this.inIfStatement = false;
    this.inLoopStatement = false; //both are used for checking if the corresponding end statement is missing
    //If the program ends with this value at true then there is an error
  }

  getProgram() {
    return this.parsedProgram;
  }

  getParseTree() {
    return this.parseTree;
  }

  //function for checking if a variable has been used yet 
  //useful for error handling
  //If a variable has not been used yet then it is not initialized or assigned and
  //cannot be used for certain tasks such as comparison or RHS of assignment statements
  isVariableUsed(variable) {
    return this.usedVariables.has(variable);
  }

  //Add a variable to the used variables set
  addUsedVariable(variable) {
    this.usedVariables.add(variable);
  }

  //Check if a variable is available for use
  //If it is not used yet, add it to the used variables
  checkVariableAvailable(variable) {
    if (!this.isVariableUsed(variable)) {
      this.addUsedVariable(variable);
      return true;
    }
    return false;
  }

  //Function responsible for iterating token stream
  //When this function is called it does all the necessary iterating for the token stream
  //This includes updating the nextToken and nextNextToken
  //and checking for an ident or int constant and updating those variables accordingly
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

  //Function responsible for handling errors
  //formats the error message and adds the line number
  //adds the error message to the console and HTML box
  //throws an error to terminate the program
  error(message) {
    const errorMessage = `${message} at line ${this.lineNum}\n`;
    console.error(errorMessage);
    this.errors += errorMessage;
    this.errorTextBox.value += errorMessage;
    throw new Error(message);
  }
  

  //All the following functions correspond to the same-named
  //EBNF grammar found in the grammars.txt file
  program() {
    console.log("Enter <program>"); this.parseTree += "Enter <program> \n";
    if (this.nextToken === "[PROGRAM]") {
      this.parsedProgram += "public class MyClass {\n";
      this.parsedProgram += "public static void main(String[] args) {\n";
      this.lineNum++;
      this.statements();
    } else {
      this.errors += "Program must begin with keyword 'program'";
      this.error("Program must begin with keyword 'program'");
    }
    this.parsedProgram += "}\n}\n";
    console.log("Exit <program>"); this.parseTree += "Exit <program> \n";
  }

  statements() {
    console.log("Enter <statements>"); this.parseTree += "Enter <statements> \n";
    while (true) {
      this.lex();
      if (this.nextToken === "[END_PROGRAM]" && this.nextNextToken === "[TRUE_END]") {
        this.lineNum++; //must be iterated here for correct error checking
        break;
      }
      this.statement();
      if (this.lineNum > this.numLines) {
        this.errors += "No end_program token found in the program";
        this.error("No end_program token found in the program");
      
      }
    }
    console.log("Exit <statements>"); this.parseTree += "Exit <statements> \n";
  }

  statement() { 
    console.log("Enter <statement>"); this.parseTree += "Enter <statement> \n";
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
      this.inIfStatement = true;
      this.parsedProgram += "if (";
      this.lex();
      this.conditional();
    } else if (this.nextToken === "[LOOP]") {
      this.parsedProgram += "for (";
      this.lex();
      this.loop();
    } else if(this.nextToken === "[END_PROGRAM]" || this.nextToken === "[TRUE_END]") {
      if(this.inIfStatement) {
        this.errors += "Missing end_if token";
        this.error("Missing end_if token");
      } else if(this.inLoopStatement) {
        this.errors += "Missing end_loop token";
        this.error("Missing end_loop token");
      } else {
        this.errors += "Weird Error";
        this.error("Weird Error");
      }
    } else if(this.nextNextToken === "[TRUE_END]") {
      this.errors += "Missing end_program token";
      this.error("Missing end_program token");
    }
    else {
      this.errors += "Unexpected token";
      this.error("Unexpected token");
    }
    this.parsedProgram += "\n";
    console.log("Exit <statement>"); this.parseTree += "Exit <statement> \n";
  }

  assignment() {
    console.log("Enter <assignment>"); this.parseTree += "Enter <assignment> \n";
    if (this.nextToken === "[ASSIGN]") {
      this.parsedProgram += " = ";
      this.lex();
      this.expr();
      if (this.nextToken !== "[SEMI]") {
        this.errors += "Expected a semicolon (;) to end statement";
        this.error("Expected a semicolon (;)");
      }
      this.parsedProgram += ";";
    } else {
      this.errors += "Expected an assignment operator (=)";
      this.error("Expected an assignment operator (=)");
    }
    console.log("Exit <assignment>"); this.parseTree += "Exit <assignment> \n";
  }

  conditional() {
    console.log("Enter <conditional>"); this.parseTree += "Enter <conditional> \n";

    if(this.nextToken === "[LP]") {
      this.lex();
      this.logicalExpression();
      this.conditional_statements();
    }else {
      this.errors += "if must be followed by a valid conditional statement";
      this.error("if must be followed by a valid conditional statement");
    }
    console.log("Exit <conditional>"); this.parseTree += "Exit <conditional> \n";
  }

  logicalExpression() {
    console.log("Enter <logicalExpression>"); this.parseTree += "Enter <logicalExpression> \n";
    if (this.nextToken === "[IDENT]") {
      this.lex();
      if (!this.checkVariableAvailable(this.ident)) {
        this.parsedProgram += this.ident;
      } else {
        this.errors += `Error: IDENT ${this.ident} not yet initialized and assigned when used at line ${this.lineNum}`;
        throw new Error(`Error: IDENT ${this.ident} not yet initialized and assigned when used at line ${this.lineNum}`);
      }
    } else {
      this.errors += "Logical Expression must start with an IDENT";
      this.error("Logical Expression must start with an IDENT");
    }
    switch (this.nextToken) {
      case "[LT]":
        this.parsedProgram += " < ";
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
      this.errors += "Logical Expression must contain a relational operator";
      this.error("Logical Expression must contain a relational operator");
    }
    this.lex();
    this.expr();
    if(this.nextToken === "[RP]") {
      this.parsedProgram += ")";
    } else {
      this.errors += "Logical expression must end with a right parenthesis";
      this.error("Logical expression must end with a right parenthesis");
    }
    console.log("Exit <logicalExpression>"); this.parseTree += "Exit <logicalExpression> \n";
  }

  conditional_statements() {
      console.log("Enter <conditional_statements>"); this.parseTree += "Enter <conditional_statements> \n";
      this.parsedProgram += " {\n";
      var thisLineNum = this.lineNum;
      while (true) {
          this.lex();
          if (this.nextToken === "[END_IF]") {
              this.lineNum++;
              this.parsedProgram += "\t}";
              break;
          }
          this.parsedProgram += "\t";
          this.statement();
      }
      console.log("Exit <conditional_statements>"); this.parseTree += "Exit <conditional_statements> \n";
  }

  loop() {
      console.log("Enter <loop>"); this.parseTree += "Enter <loop> \n";
      if (this.nextToken === "[LP]") {
          this.lex();
          this.loop_condition();
          this.loop_statements();
          console.log("Exit <loop>"); this.parseTree += "Exit <loop> \n";
      } else {
          this.errors += "Loop must be immediately followed by a valid loop condition";
          this.error("Loop must be immediately followed by a valid loop condition");
      }
  }

  loop_condition() {
      console.log("Enter <loop_condition>"); this.parseTree += "Enter <loop_condition> \n";
      if (this.nextToken === "[IDENT]") {
          this.lex();
          let tempVariable = this.ident;
          if (this.checkVariableAvailable(this.ident)) {
            this.parsedProgram += "int ";
          }
          this.parsedProgram += this.ident;
          this.loop_assignment();
          if (this.nextToken === "[COLON]") {
              this.parsedProgram += tempVariable + " < ";
              this.lex();
              this.expr();
              this.parsedProgram += "; ";
              this.parsedProgram += tempVariable + "++)";
          } else {
              this.errors += "Loop condition must contain a colon followed by an end value for the loop";
              this.error("Loop condition must contain a colon followed by an end value for the loop");
          }
      } else {
          this.errors += "Loop condition must contain an IDENT variable";
          this.error("Loop condition must contain an IDENT variable");
      }
      console.log("Exit <loop_condition>"); this.parseTree += "Exit <loop_condition> \n";
  }

  loop_assignment() {
      console.log("Enter <loop_assignment>"); this.parseTree += "Enter <loop_assignment> \n";
      if (this.nextToken === "[ASSIGN]") {
          this.parsedProgram += " = ";
          this.lex();
          this.expr();
          this.parsedProgram += "; ";
      } else {
          this.errors += "Loop assignment statement must contain assignment operator";
          this.error("Loop assignment statement must contain assignment operator");
      }
      console.log("Exit <loop_assignment>"); this.parseTree += "Exit <loop_assignment> \n";
  }

  loop_statements() {
      console.log("Enter <loop_statements>"); this.parseTree += "Enter <loop_statements> \n";
      var thisLineNum = this.lineNum;
      this.parsedProgram += " {\n";
      while (true) {
          this.lex();
          if (this.nextToken === "[END_LOOP]") {
              this.lineNum++;
              this.parsedProgram += "\t}";
              break;
          }
          this.parsedProgram += "\t";
          this.statement();
      }
      console.log("Exit <loop_statements>"); this.parseTree += "Exit <loop_statements> \n";
  }

  expr() {
      console.log("Enter <expr>"); this.parseTree += "Enter <expr> \n";
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
                  this.errors += "Unexpected token in an expression statement";
                  this.error("Unexpected token in an expression statement");
          }
          this.lex();
          this.term();
      }
      console.log("Exit <expr>"); this.parseTree += "Exit <expr> \n";
  }

  term() {
      console.log("Enter <term>"); this.parseTree += "Enter <term> \n";
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
                  this.errors += "Unexpected token in a term statement";
                  this.error("Unexpected token in a term statement");
          }
          this.lex();
          this.factor();
      }
      console.log("Exit <term>"); this.parseTree += "Exit <term> \n";
  }

  factor() {
      console.log("Enter <factor>"); this.parseTree += "Enter <factor> \n";
      if (this.nextToken === "[IDENT]") {
          this.lex();
          if (!this.checkVariableAvailable(this.ident)) {
              this.parsedProgram += this.ident;
          } else {
              this.errors += `Error: IDENT ${this.ident} not yet initialized and assigned when used`;
              throw new Error(`Error: IDENT ${this.ident} not yet initialized and assigned when used`);
          }
      } else if (this.nextToken === "[INT_CONST]") {
          this.parsedProgram += this.intConst;
          this.lex();
      } else {
          if (this.nextToken === "[LP]") {
              this.parsedProgram += "(";
              this.lex();
              this.expr();
              if (this.nextToken === "[RP]") {
                  this.parsedProgram += ")";
                  this.lex();
              } else {
                  this.errors += "Left parenthesis must be followed by a closing right parenthesis";
                  this.error("Left parenthesis must be followed by a closing right parenthesis");
              }
          } else {
              this.errors += "Invalid character in a factor statement";
              this.error("Invalid character in a factor statement");
          }
      }
      console.log("Exit <factor>"); this.parseTree += "Exit <factor> \n";
  }
}

// Testing code past this point

//Test cases for isDigit function
console.log("Testing isDigit function:");
console.log(isDigit("1") == true); // Expected output: true
console.log(isDigit("a") == false); // Expected output: false
console.log(isDigit(" ") == false); // Expected output: false
console.log(isDigit("_") == false); // Expected output: false
console.log(isDigit("@") == false); // Expected output: false
console.log(isDigit("#") == false); // Expected output: false
console.log(isDigit("$") == false); // Expected output: false

//Test cases for isLetter function
console.log("\nTesting isLetter function:");
console.log(isLetter("a") == true); // Expected output: true
console.log(isLetter("1") == false); // Expected output: false
console.log(isLetter(" ") == false); // Expected output: false
console.log(isLetter("_") == false); // Expected output: false
console.log(isLetter("@") == false); // Expected output: false
console.log(isLetter("#") == false); // Expected output: false
console.log(isLetter("$") == false); // Expected output: false

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
var line = "if(x > 0)";
var line2 = "else()";
console.log(containsKeyWordAtIndex(line, 0, "if") == true); // Expected output: true
console.log(containsKeyWordAtIndex(line, 0, "else") == false); // Expected output: false
console.log(containsKeyWordAtIndex(line2, 0, "else") == true); // Expected output: true

// Test cases for findEndIndexOfDigits function
console.log("\nTesting findEndIndexOfDigits function:");
var lineDigits = "bandman122";
console.log(findEndIndexOfDigits(lineDigits, 7) == "10"); // Expected output: 8

// Test cases for findEndIndexOfAlphanumeric function
console.log("\nTesting findEndIndexOfAlphanumeric function:");
var lineAlphanumeric = "bandman122";
console.log(findEndIndexOfAlphanumeric(lineAlphanumeric, 0) == "10"); // Expected output: 9

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
console.log(parseLine("x =5")); // Expected output: ["[IDENT]", "[ASSIGN]", "[INT_CONST]"]
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
var parser1 = new RecursiveDescentParser(tokens, text);
var programString = parser1.program();
console.log(parser1.getProgram());
