/**
 * Generator is a function
 *  with an asterik(*) right after the word function
 * and it returns an iterator
 * When powers is called, the function frozes at its start
 * So every time you call next on the iterator, the fcn runs untill it
 * hits the yield expression which pauses it. then the value produced by
 * yield becomes the next value produced by the iterator.
 *
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

//writing Grp function from chap 6 using generator function
Group.prototype[Symbol.iterator] = function* () {
  for (let i = 0; i < this.members.length; i++) {
    yield this.members[i];
  }
};

//NOTE: Async function is a special type of generator.
//When called, it returns a result (resolve) when finish
//or it's rejected when throw an exception
