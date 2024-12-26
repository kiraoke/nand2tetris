import parse from "./parser.ts";
import translate from "./translater.ts";
import { replaceSymbols } from "./symbols.ts";
import removeComments from "./comments.ts";

const file = await Deno.readTextFile("app.asm");

const replaced = replaceSymbols(
  removeComments(file),
);


console.log(replaced);

const instructions = replaced.split("\n");

const output = [];

for (let i = 0; i < instructions.length; i++) {
  const instruct = parse(instructions[i]);

  try {
    const out = translate(instruct);

    if (out) output.push(out);
  } catch {
    console.log(instruct);
  }
}

await Deno.writeTextFile("out.bin", output.join("\n"));

console.log("arigato");
