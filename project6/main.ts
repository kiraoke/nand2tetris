import parse from "./parser.ts";
import translate from "./translater.ts";

const file = await Deno.readTextFile("app.asm");

const instructions = file.split("\n");

const output = [];

for (let i = 0; i < instructions.length; i++) {
  const instruct = parse(instructions[i]);

  try {
    const out = translate(instruct);

    if (out) output.push(out);
  } catch (e) {
    console.log(instruct);
  }
}

await Deno.writeTextFile("out.bin", output.join("\n"));

console.log("arigato");
