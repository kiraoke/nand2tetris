const memSegments = {
  local: "local",
  argument: "argument",
  static: "static",
  constant: "constant",
  this: "this",
  that: "that",
};

const Registers = {
  SP: 0,
  LCL: 1,
  ARG: 2,
  THIS: 3,
  THAT: 4,
  STATIC: 16,
};

export type MEM_SEGMENT = keyof typeof memSegments;

export { memSegments, Registers };
