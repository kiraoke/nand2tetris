function removeComments(file: string) {
  const instructions = file.split("\n");
  const final: string[] = [];

  for (let i = 0; i < instructions.length; i++) {
    const instruct = instructions[i].replaceAll(" ", "");

    if (instruct.slice(0, 1) === "/") continue; // a comment

    final.push(instruct);
  }

  const removeEmpty = final.filter((val) => {
    if (val) return val;
  });

  console.log(removeEmpty);

  return removeEmpty.join("\n");
}

export default removeComments;
