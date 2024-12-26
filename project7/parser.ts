import { MEM_SEGMENT } from "./constants.ts";

type MemoryCommand = {
  type: "push" | "pop";
  segment: MEM_SEGMENT;
  index: number;
};

type LogicalCommand = {
  type: "add" | "sub" | "neg" | "eq" | "gt" | "lt" | "and" | "or" | "not";
};

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

type Command = MemoryCommand | LogicalCommand;

function parse(command: string): Command {
  const instructions = command.trim().split(" ");

  if (instructions[0] === "push" || instructions[0] === "pop") {
    return {
      type: instructions[0],
      segment: instructions[1] as MEM_SEGMENT,
      index: parseInt(instructions[2]),
    };
  }

  if (logicalCommands.includes(instructions[0])) {
    return {
      type: instructions[0] as LogicalCommand["type"],
    };
  }

  throw new Error("Invalid Command");
}

export default parse;
