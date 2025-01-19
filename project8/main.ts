import translate from "./translator.ts";

const file = `
  push constant 30
  push local 0
  add
  push argument 1 
  lt
  push constant 200
  lt
`;

const translated = translate(file);

console.log(translated.join("\n"));
