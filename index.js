const mainArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];

async function main() {
  const res = await fetch("sample.txt");
  const text = await res.text();
  const puzzles = text.split("\r\n\r\n").map((e) =>
    e
      .split("\r\n")
      .filter((e) => !!e)
      .map((e) => e.split(" "))
  );
  const n = parseInt(puzzles[0].shift());
  const sol = puzzles.map((e) => parseInt(solve(e)));
  const sum = sol.reduce((partialSum, a) => partialSum + a, 0);
  console.log(sum);
}

main();

function getZig(p, n) {
  let zig = [];
  for (let i = 0; i < 9; i++) {
    zig.push(p[i][n++ % 9]);
  }
  return zig;
}

function getZag(p, n) {
  let zag = [];
  for (let i = 0; i <= 8; i++) {
    zag.push(p[i][(9 + n - i) % 9]);
  }
  return zag;
}

function getBlock(p, n) {
  let block = [];
  let col = (n % 3) * 3;
  let row = Math.trunc(n / 3) * 3;
  block = p.slice(row, row + 3).map((f) => f.slice(col, col + 3));
  block = [].concat.apply([], block);
  return block;
}

function validSudoku(p) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const value = p[i][j];
      if (value == ".") {
        return false;
      }
    }
  }
  return true;
}

function validZig(p, n) {
  const zig = getZig(p, n);
  if (zig.includes(".")) return false;
  return true;
}

function validZag(p, n) {
  const zag = getZag(p, n);
  if (zag.includes(".")) return false;
  return true;
}

function validBlock(p, n) {
  const block = getBlock(p, n);
  if (block.includes(".")) return false;
  return true;
}

let union = (a, b, c) => new Set([...a, ...b, ...c]);

let intersection = (a, b) => new Set([...a].filter((x) => b.has(x)));

let difference = (a, b) => new Set([...a].filter((x) => !b.has(x)));

function xy_type(x, y) {
  const zig = (y - x + 9) % 9;
  const zag = (x + y) % 9;
  const block = (y % 3) + Math.trunc(x / 3) * 3;
  return [zig, zag, block];
}

function solve(p) {
  let needMoreIteration = true;
  while (needMoreIteration) {
    let changed = false;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (p[i][j] == ".") {
          const [zig, zag, block] = xy_type(i, j);
          console.log(getZig(p, zig), getZag(p, zag), getBlock(p, block));
          const avail = difference(
            mainArr,
            union(getZig(p, zig), getZag(p, zag), getBlock(p, block))
          );
          console.log(avail, i, j);
          if ([...avail].length == 1) {
            p[i][j] = [...avail][0];
            if (i == 0 && j == 0) return [...avail][0];
            changed = true;
            break;
          }
        }
        if (changed) break;
      }
    }
    if (!changed) break;
  }
  console.log(p);
}
