import parse from "./parser.ts";
import translate from "./translater.ts";

const file = `
// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.

// Computes R0 = 2 + 3  (R0 refers to RAM[0])

@2
D=A
@3
D=D+A
@0
M=D
`;

const instructions = file.split("\n");

for (let i = 0; i < instructions.length; i++) {
  const instruct = parse(instructions[i]);

  console.log(translate(instruct));
}
