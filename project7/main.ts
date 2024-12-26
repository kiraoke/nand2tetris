const memSegments = {
  local: "local",
  argument: "argument",
  static: "static",
  constant: "constant",
  this: "this",
  that: "that",
};

const Registers = {
  SP: 0,
  LCL: 1,
  ARG: 2,
  THIS: 3,
  THAT: 4,
  STATIC: 16,
};

type MEM_SEGMENT = keyof typeof memSegments;

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
    A=M // set address to stack pointer
    D=M // Get the value of the stack
    @R13
    M=D // Store the value in R13 of last value

    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    D=M // Get the value of the 2nd last value
    @R14
    M=D // Store the value in R14 of 2nd last value

    @R13
    D=M // Get the last value
    @R14
    D=D+M // Add the last and 2nd last value

    @${Registers.SP}
    A=M-1 // set address to 2nd last value
    M=D // Set the value of the sum to the 2nd last value

    @${Registers.SP}
    D=M // Set D to value of stack pointer
    M=D-1 // Decrement the stack pointer
  `;
}

console.log(add());
