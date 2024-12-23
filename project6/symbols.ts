import { getCode } from "./utils.ts";

const predefined = {
  SP: 0,
  LCL: 1,
  ARG: 2,
  THIS: 3,
  THAT: 4,
  R0: 0,
  R1: 1,
  R2: 2,
  R3: 3,
  R4: 4,
  R5: 5,
  R6: 6,
  R7: 7,
  R8: 8,
  R9: 9,
  R10: 10,
  R11: 11,
  R12: 12,
  R13: 13,
  R14: 14,
  R15: 15,
  SCREEN: 16384,
  KBD: 24576,
};

interface LooseObject {
  [key: string]: number;
}

function lookLabels(file: string): LooseObject {
  const symbolTable: LooseObject = { ...predefined };

  const instructions = file.split("\n");

  let appIndex = 0;

  for (let i = 0; i < instructions.length; i++) {
    const instruct = instructions[i];
    if (instruct[0] === "(") {
      const first = instruct.split(")")[0];
      const label = first.slice(1, first.length);

      symbolTable[label] = appIndex;
      continue;
    }

    appIndex++;
  }

  return symbolTable;
}

function lookVariables(file: string, symbolTable: LooseObject): LooseObject {
  const instructions = file.split("\n");
  let varAddress = 16;

  for (let i = 0; i < instructions.length; i++) {
    const instruct = instructions[i];
    if (instruct[0] === "@") { // A COMIE
      const command = instruct.split("/")[0];
      const address = command.slice(1, command.length);

      if (parseInt(address)) continue; // a number address

      const isLabel = getCode(symbolTable, address);

      if (isLabel !== undefined) continue; // already in symbol table

      // address is a variable
      symbolTable[address] = varAddress;
      varAddress++;
    }
  }

  return symbolTable;
}

function removeLabels(file: string): string {
  const instructions = file.split("\n");
  const final: string[] = [];

  for (let i = 0; i < instructions.length; i++) {
    const instruct = instructions[i];
    if (instruct[0] === "(") continue;
    // not a label
    final.push(instruct);
  }

  return final.join("\n");
}

function replaceSymbols(file: string): string {
  const symbolTable = lookLabels(file);
  const allSymbols = lookVariables(file, symbolTable);
  const labelRemove = removeLabels(file);

  const instructions = labelRemove.split("\n");

  const final: string[] = [];

  for (let i = 0; i < instructions.length; i++) {
    const instruct = instructions[i];

    if (instruct[0] === "@") { // A COMIE
      const command = instruct.split("/")[0];
      const address = command.slice(1, command.length);

      if (parseInt(address)) final.push(`@${address}`); // number address

      const code = getCode(allSymbols, address);

      if (code === undefined) {
        console.error("Invalid code", code, allSymbols, address);
        throw new Error("Invalid code");
      }

      final.push(`@${code}`);
    } else final.push(instruct);
  }

  return final.join("\n");
}

export { lookLabels, lookVariables, removeLabels, replaceSymbols };
