interface Search {
  found: boolean;
  position: number | undefined;
}

function search(needle: string, haystack: string): Search {
  const hays = haystack.split("");

  for (let hay = 0; hay < hays.length; hay++) {
    if (hays[hay] === needle) {
      return {
        found: true,
        position: hay,
      };
    }
  }

  return {
    found: false,
    position: undefined,
  };
}

function toBinary(num: number): string {
  const bin = num.toString(2);
  return bin.padStart(15, "0");
}

interface Codes {
  [key: string]: string;
}

function getCode(codes: Codes, needle: string): string | undefined {
  const hays = Object.entries(codes);

  for (let code = 0; code < hays.length; code++) {
    const [key, val] = hays[code];
    if (key === needle) return val;
  }

  return;
}

export { getCode, search, toBinary };
