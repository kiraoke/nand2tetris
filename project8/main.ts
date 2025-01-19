import translate from "./translator.ts";

const file = `
  push constant 30
  push constant 10
  lt
  if-goto nice
  goto bad

  label nice 
  push constant 69

  label bad
  push constant 420
`;

const translated = translate(file);

console.log(translated.join("\n"));
