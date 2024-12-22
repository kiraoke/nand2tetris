import { COMMAND, Parsed } from "./parser.ts";
import { getCode, toBinary } from "./utils.ts";

const compCodes = {
  "0": "0101010",
  "1": "0111111",
  "-1": "0111010",
  "D": "0001100",
  "A": "0110000",
  "!D": "0001101",
  "!A": "0110001",
  "-D": "0001111",
  "-A": "0110011",
  "D+1": "0011111",
  "A+1": "0110111",
  "D-1": "0001110",
  "A-1": "0110010",
  "D+A": "0000010",
  "D-A": "0010011",
  "A-D": "0000111",
  "D&A": "0000000",
  "D|A": "0010101",
  // a = 1
  "M": "1110000",
  "!M": "1110001",
  "-M": "1110011",
  "M+1": "1110111",
  "M-1": "1110010",
  "D+M": "1000010",
  "D-M": "1010011",
  "M-D": "1000111",
  "D&M": "1000000",
  "D|M": "1010101",
};

const destCodes = {
  "M": "001",
  "D": "010",
  "MD": "011",
  "A": "100",
  "AM": "101",
  "AD": "110",
  "AMD": "111",
};

const jumpCodes = {
  "JGT": "001",
  "JEQ": "010",
  "JGE": "011",
  "JLT": "100",
  "JNE": "101",
  "JLE": "110",
  "JMP": "111",
};

function translate(command: Parsed): string | undefined {
  if (!command.valid) return;

  if (command.type === COMMAND.A) {
    // A COMMAND
    return `0${toBinary(command.address)}`;
  }

  if (command.type === COMMAND.DESTINATION) {
    // DESTINATION COMMAND
    const comp = getCode(compCodes, command.comp);
    const dest = getCode(destCodes, command.dest);

    if (!comp) throw Error("Invalid Command(COMPUTATION)" + comp);
    if (!dest) throw Error("Invalid Command(DESTINATION)");

    return `111${comp}${dest}000`;
  }
}

export default translate;
