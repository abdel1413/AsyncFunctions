async function locateScalpel(nest) {
  let current = nest.name;
  for (;;) {
    let next = await anyStorage(nest, current, "scalpel");
    if (next == current) return current;
    current = next;
  }
}

//using same function without async
// this require another  rerursive function inside and
function locateScalpel2(nest) {
  function loop(current) {
    return anyStorage(nest, current, "scalpel").then((next) => {
      if (next == current) return current;
      else {
        return loop(next);
      }
    });
  }
  return loop(nest.name);
}
