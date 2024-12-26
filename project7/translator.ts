import {
  add,
  and,
  eq,
  gt,
  initialize,
  lt,
  neg,
  not,
  or,
  pop,
  push,
  sub,
} from "./actions.ts";
import parse from "./parser.ts";

function translate(file: string) {
  const instructions = file.split("\n");
  const output: string[] = [];

  // output.push(initialize());

  for (let i = 0; i < instructions.length; i++) {
    if (!instructions[i]) continue;

    const command = parse(instructions[i]);

    if (command.type === "push") {
      output.push(push(command.segment, command.index));
    } else if (command.type === "pop") {
      output.push(pop(command.segment, command.index));
    } else if (command.type === "add") output.push(add());
    else if (command.type === "sub") output.push(sub());
    else if (command.type === "neg") output.push(neg());
    else if (command.type === "eq") output.push(eq());
    else if (command.type === "gt") output.push(gt());
    else if (command.type === "lt") output.push(lt());
    else if (command.type === "and") output.push(and());
    else if (command.type === "or") output.push(or());
    else if (command.type === "not") output.push(not());
  }

  return output;
}

export default translate;
