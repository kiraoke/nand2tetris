import { MEM_SEGMENT } from "./constants.ts";

type MemoryCommand = {
  type: "push" | "pop";
  segment: MEM_SEGMENT;
  index: number;
};

type LogicalCommand = {
  type: "add" | "sub" | "neg" | "eq" | "gt" | "lt" | "and" | "or" | "not";
};

type BranchCommand = {
  type: "goto" | "if-goto" | "label";
  label: string;
}

const logicalCommands = [
  "add",
  "sub",
  "neg",
  "eq",
  "gt",
  "lt",
  "and",
  "or",
  "not",
];

const branchCommands = [
  'goto',
  'if-goto',
];

type Command = MemoryCommand | LogicalCommand | BranchCommand;

function parse(command: string): Command {
  const instructions = command.trim().split(" ");

  if (instructions[0] === "push" || instructions[0] === "pop") {
    return {
      type: instructions[0] as MemoryCommand["type"],
      segment: instructions[1] as MEM_SEGMENT,
      index: parseInt(instructions[2]),
    };
  }

  if (logicalCommands.includes(instructions[0])) {
    return {
      type: instructions[0] as LogicalCommand["type"],
    };
  }

  if (branchCommands.includes(instructions[0])) {
   return {
    type: instructions[0] as BranchCommand["type"],
    label: instructions[1],
   } 
  }

  throw new Error("Invalid Command");
}

export default parse;
