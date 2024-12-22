import { search } from "./utils.ts";

export enum COMMAND {
  A,
  DESTINATION,
  JUMP,
}

interface ACommand {
  valid: true;
  type: COMMAND.A;
  address: number;
}

interface DCommand {
  valid: true;
  type: COMMAND.DESTINATION;
  dest: string;
  comp: string;
}

interface JMPCommand {
  valid: true;
  type: COMMAND.JUMP;
  comp: string;
  jmp: string;
}

interface InvalidCommand {
  valid: false;
}

export type Parsed = ACommand | DCommand | JMPCommand | InvalidCommand;

function parse(command: string): Parsed {
  if (command.slice(0, 2) === "//") { // (0,2) here 2 is excluded so 0 and 1
    // COMMENT
    return {
      valid: false,
    };
  }

  command = command.split("/")[0];

  if (command[0] === "@") { // A COMMAND
    return {
      valid: true,
      type: COMMAND.A,
      address: parseInt(command.slice(1, command.length)),
    };
  }

  // C COMMAND
  if (search("=", command).found) {
    // NON JMP COMMAND
    // DESTINATION COMMAND
    const cmds = command.split("=");

    return {
      valid: true,
      type: COMMAND.DESTINATION,
      dest: cmds[0],
      comp: cmds[1],
    };
  }

  if (search(";", command).found) {
    // JMP COMMAND
    const cmds = command.split(";");

    return {
      valid: true,
      type: COMMAND.JUMP,
      comp: cmds[0],
      jmp: cmds[1],
    };
  }

  return {
    valid: false,
  };
}

export default parse;
