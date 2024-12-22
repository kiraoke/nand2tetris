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
  dest: string;
  jmp: string;
}

interface InvalidCommand {
  valid: false;
}

export type Parsed = ACommand | DCommand | JMPCommand | InvalidCommand;

function parse(command: string): Parsed {
  if (command.slice(0, 2) === "//") {
    // COMMENT
    return {
      valid: false,
    };
  }

  if (command[0] === "@") { // A COMMAND
    return {
      valid: true,
      type: COMMAND.A,
      address: parseInt(command[1]),
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
      dest: cmds[0],
      jmp: cmds[1],
    };
  }

  return {
    valid: false,
  };
}

export default parse;
