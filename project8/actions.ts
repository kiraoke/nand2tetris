import { MEM_SEGMENT, memSegments, Registers } from "./constants.ts";

import { customAlphabet } from "jsr:@viki/nanoid";
const allowedChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const nanoid = customAlphabet(allowedChars, 30);

function initialize() {
  return `
    @256
    D=A
    @${Registers.SP}
    M=D
  `;
}

function push(segment: MEM_SEGMENT, index: number) {
  let base = 0;

  if (segment === memSegments.constant) {
    return `
      @${index} 
      D=A // Set D to the constant value

      @${Registers.SP}
      A=M // Set address to stack pointer
      M=D // Set the value of constant to the address

      @${Registers.SP}
      M=M+1 // Increment the stack pointer
    `;
  }

  if (segment === memSegments.local) base = Registers.LCL;
  else if (segment === memSegments.argument) base = Registers.ARG;
  else if (segment === memSegments.this) base = Registers.THIS;
  else if (segment === memSegments.that) base = Registers.THAT;
  else if (segment === memSegments.static) base = Registers.STATIC;
  else throw Error("Invalid Memory Segment");

  return `
    @${base}
    D=M // Get the pointer of the segment
    @${index}
    D=D+A // Add the index to the pointer
    A=D // Set the address to the sum
    D=M // Get the value of the address

    @${Registers.SP}
    A=M // Set address to stack pointer
    M=D // Set the value of segment to the address

    @${Registers.SP}
    M=M+1 // Increment the stack pointer
  `;
}

// get value from stack
// put it into the mem segment
function pop(segment: MEM_SEGMENT, index: number) {
  let base = 0;

  if (segment === memSegments.local) base = Registers.LCL;
  else if (segment === memSegments.argument) base = Registers.ARG;
  else if (segment === memSegments.this) base = Registers.THIS;
  else if (segment === memSegments.that) base = Registers.THAT;
  else if (segment === memSegments.static) base = Registers.STATIC;
  else throw Error("Invalid Memory Segment");

  return `
    @${base}
    D=M  // Get the pointer of the segment
    @${index}
    D=D+A // Add the index to the pointer
    @R13
    M=D // Store the address in R13

    @${Registers.SP}
    A=M // Set address to stack pointer
    D=M // Get the value of the stack
    @R13
    A=M // Set the address to the segment
    M=D // Set the value of the stack to the segment

    @${Registers.SP}
    M=M-1 // Decrement the stack pointer
  `;
}

// Takes last two values of stack and adds them and puts it into the 2nd last value of the stack and decrements pointer
function add() {
  return `
    @${Registers.SP}
    A=M-1 // set address to stack pointer
    D=M // Get the value of the stack
    @R13
    M=D // Store the value in R13 of last value

    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    D=M // Get the value of the 2nd last value
    @R14
    M=D // Store the value in R14 of 2nd last value

    @R13
    D=M // Get the last value
    @R14
    D=D+M // Add the last and 2nd last value

    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    M=D // Set the value of the sum to the 2nd last value

    @${Registers.SP}
    D=M // Set D to value of stack pointer
    M=D-1 // Decrement the stack pointer
  `;
}

function sub() {
  return `
    @${Registers.SP}
    A=M-1 // set address to stack pointer
    D=M // Get the value of the stack
    @R13
    M=D // Store the value in R13 of last value

    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    D=M // Get the value of the 2nd last value
    @R14
    M=D // Store the value in R14 of 2nd last value

    @R14
    D=M // Get the 2nd last value
    @R13
    D=M-D // Subtract the last and 2nd last value (last - 2nd last)

    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    M=D // Set the value of the sum to the 2nd last value

    @${Registers.SP}
    D=M // Set D to value of stack pointer
    M=D-1 // Decrement the stack pointer
  `;
}

function neg() {
  return `
    @${Registers.SP}
    A=M-1 // set address to stack pointer
    D=M // Get the value of the stack
    D=-D // Negate the value
    M=D // Set the value of the negated value to the stack
  `;
}

function eq() {
  const random = nanoid();

  return `
    @${Registers.SP}
    A=M-1 // set address to stack pointer
    D=M // Get the value of the stack
    @R13
    M=D // Store the value in R13 of last value

    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    D=M // Get the value of the 2nd last value
    @R14
    M=D // Store the value in R14 of 2nd last value

    @R13
    D=M // Get the last value
    @R14
    D=D-M // Subtract the last and 2nd last value (last - 2nd last)
    @EQ_TRUE${random}
    D;JEQ // Jump if equal (D WILL BE 0)
    @EQ_FALSE${random}
    0;JMP // Jump to false

    (EQ_TRUE${random})
    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    M=-1 // -1 is for true
    @CONTINUE${random}
    0;JMP // Jump to continue

    (EQ_FALSE${random})
    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    M=0 // 0 is for false
    @CONTINUE${random}
    0;JMP // Jump to continue

    (CONTINUE${random})
    @${Registers.SP} 
    D=M // Set D to value of stack pointer
    M=D-1 // Decrement the stack pointer
  `;
}

function gt() {
  const random = nanoid();

  return `
    @${Registers.SP}
    A=M-1 // set address to stack pointer
    D=M // Get the value of the stack
    @R13
    M=D // Store the value in R13 of last value

    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    D=M // Get the value of the 2nd last value
    @R14
    M=D // Store the value in R14 of 2nd last value

    @R13
    D=M // Get the last value
    @R14
    D=D-M // Subtract the last and 2nd last value (last - 2nd last)
    @GT_TRUE${random}
    D;JGT // Jump if Last > 2nd last(D > 0)
    @GT_FALSE${random}
    0;JMP // Jump to false

    (GT_TRUE${random})
    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    M=-1 // -1 is for true
    @CONTINUE${random}
    0;JMP // Jump to continue

    (GT_FALSE${random})
    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    M=0 // 0 is for false
    @CONTINUE${random}
    0;JMP // Jump to continue

    (CONTINUE${random})
    @${Registers.SP} 
    D=M // Set D to value of stack pointer
    M=D-1 // Decrement the stack pointer

  `;
}

function lt() {
  const random = nanoid();

  return `
    @${Registers.SP}
    A=M-1 // set address to stack pointer
    D=M // Get the value of the stack
    @R13
    M=D // Store the value in R13 of last value

    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    D=M // Get the value of the 2nd last value
    @R14
    M=D // Store the value in R14 of 2nd last value

    @R13
    D=M // Get the last value
    @R14
    D=D-M // Subtract the last and 2nd last value (last - 2nd last)
    @LT_TRUE${random}
    D;JLT // Jump if Last < 2nd last(D < 0)
    @LT_FALSE${random}
    0;JMP // Jump to false

    (LT_TRUE${random})
    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    M=-1 // -1 is for true
    @CONTINUE${random}
    0;JMP // Jump to continue

    (LT_FALSE${random})
    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    M=0 // 0 is for false
    @CONTINUE${random}
    0;JMP // Jump to continue

    (CONTINUE${random})
    @${Registers.SP} 
    D=M // Set D to value of stack pointer
    M=D-1 // Decrement the stack pointer

  `;
}

function and() {
  return `
    @${Registers.SP}
    A=M-1 // set address to stack pointer
    D=M // Get the value of the stack
    @R13
    M=D // Store the value in R13 of last value

    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    D=M // Get the value of the 2nd last value
    @R14
    M=D // Store the value in R14 of 2nd last value

    @R13
    D=M // Get the last value
    @R14
    D=D&M // And the last and 2nd last value

    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    M=D // Set the value of the AND to the 2nd last value

    @${Registers.SP}
    M=M-1 // Decrement the stack pointer
  `;
}

function or() {
  return `
    @${Registers.SP}
    A=M-1 // set address to stack pointer
    D=M // Get the value of the stack
    @R13
    M=D // Store the value in R13 of last value

    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    D=M // Get the value of the 2nd last value
    @R14
    M=D // Store the value in R14 of 2nd last value

    @R13
    D=M // Get the last value
    @R14
    D=D|M // OR the last and 2nd last value

    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    A=A-1
    M=D // Set the value of the OR to the 2nd last value

    @${Registers.SP}
    M=M-1 // Decrement the stack pointer
  `;
}

function not() {
  return `
    @${Registers.SP}
    A=M-1 // set address to stack pointer
    D=M // Get the value of the stack
    D=!D // NOT the value
    M=D // Set the value of the NOT to the stack
  `;
}

function label(label: string) {
  return `(${label})`;
}

function goto(label: string) {
  return `
    @${label}
    0;JMP
  `;
}

function ifGoto(label: string) {
  const random: string = nanoid();

  return `
   @${Registers.SP} 
   A=M-1 // set address to the stack pointer
   D=M // get value of it
   D=D+1 // true is -1
   @GOTO_TRUE_${random}
   D;JEQ
   @QUIT
   0;JMP

   (GOTO_TRUE_${random})
   @${Registers.SP}
   D=M
   M=M-1 // decrease the SP
   @${label}
   0;JMP

   (QUIT)
   @${Registers.SP}
   D=M
   M=M-1 // decrease the SP
  `;
}

function call(funcName: string, args: number) {
  const random = nanoid();

  return `
   @RETURN_${funcName}_${random}
   D=A // get return address
   // store return address
   @${Registers.SP}
   A=M // set address to sp 
   M=D // set RETURN ADDRESS
   @${Registers.SP}
   M=M+1 // increment SP

   // store LCL of caller
   @${Registers.LCL}
   D=M
   @${Registers.SP}
   A=M // set address to sp 
   M=D // set LCL 
   @${Registers.SP}
   M=M+1 // increment SP

   // store ARG of caller   
   @${Registers.ARG}
   D=M
   @${Registers.SP}
   A=M // set address to sp 
   M=D // set ARG 
   @${Registers.SP}
   M=M+1 // increment SP


   // store THIS of caller   
   @${Registers.THIS}
   D=M
   @${Registers.SP}
   A=M // set address to sp 
   M=D // set THIS 
   @${Registers.SP}
   M=M+1 // increment SP


   // store THAT of caller   
   @${Registers.THAT}
   D=M
   @${Registers.SP}
   A=M // set address to sp 
   M=D // set THAT 
   @${Registers.SP}
   M=M+1 // increment SP

   // set ARG of callee
   @${Registers.SP}
   D=M
   @${args}
   D=D-A // arg 0 is D now
   @${Registers.ARG}
   M=D // set arg 0 to ARG

   // go to function call
   @${funcName}
   0;JMP

   (RETURN_${funcName}_${random})
  `;
}

function functionCommand(name: string, parameters: number) {
  const random = nanoid();
  return `
  (${name}) // Function label

  // set LCL to SP
  @${Registers.SP}
  D=M // get SP
  @${Registers.LCL}
  M=D // set LCL to SP

  // Initialize local variables to 0
  @i_${random}
  M=1 

  (LOOP_${random})
  @${parameters}
  D=A // get no of local vars
  @i_${random}
  D=D-M // total local - i
  @END_LOOP_${random}
  D;JEQ // if i == total local vars, end loop
  
  // push 0 to stack
  @${Registers.SP}
  A=M // set address to sp
  M=0 // set 0 to stack
  @${Registers.SP}
  M=M+1 // increment SP
  @i_${random}
  M=M+1 // increment i
  @LOOP_${random}
  0;JMP // loop


  @END_LOOP_${random}
  // rest of generated code will be here
  `;
}

function returnCommand() {
  return `
    @${Registers.LCL} // get LCL
    D=M // get pointer of LCL
    @frame // frame is a var
    M=D // store LCL in frame

    @frame
    D=M // get frame
    @5
    D=D-A // get return address
    @returnAddress
    M=D // store return address

    // set return value at arg 0
    @${Registers.SP}
    A=M-1 // set address to last val on stack
    D=M // get the return value
    @${Registers.ARG}
    A=M // set address to ARG
    M=D // set return value to ARG

    // set SP to ARG + 1
    @${Registers.ARG}
    D=M+1 // get ARG + 1
    @${Registers.SP}
    M=D // set SP to ARG + 1

    // restore THAT of caller
    @frame
    D=M // get frame
    @1
    D=D-A // get THAT
    @${Registers.THAT}
    M=D // set THAT


    // restore THIS of caller
    @frame
    D=M // get frame
    @2
    D=D-A // get THIS 
    @${Registers.THAT}
    M=D // set THIS


    // restore ARG of caller
    @frame
    D=M // get frame
    @3
    D=D-A // get ARG 
    @${Registers.ARG}
    M=D // set ARG 


    // restore LCL of caller
    @frame
    D=M // get frame
    @4
    D=D-A // get LCL 
    @${Registers.LCL}
    M=D // set LCL 

    @returnAddress
    A=M // get return address
    0;JMP // jump to return address
  `;
}

export {
  add,
  and,
  call,
  eq,
  functionCommand,
  goto,
  returnCommand,
  gt,
  ifGoto,
  initialize,
  label,
  lt,
  neg,
  not,
  or,
  pop,
  push,
  sub,
};
