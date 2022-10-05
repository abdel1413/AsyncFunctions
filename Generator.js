/**
 * Generator is a function
 *  with an asterik(*) right after the word function
 * and it returns an iterator.
 */

function* Powers(n) {
  for (let current = n; ; current *= n) {
    yield current;
  }
}

for (let p of Powers(3)) {
  if (p > 50) break;
  console.log(p);
}
// 3
// 9
// 27
