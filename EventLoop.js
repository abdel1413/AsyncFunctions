/**
 * Note. the promise return when it finishes the request
 * or it may fails an throw an error or exception
 */

let start = Date.now();
setTimeout(() => {
  console.log("Timeout ran at ", Date.now() - start);
}, 20);

while (Date.now() < start + 50) {}
console.log("Wasted time until: ", Date.now() - start); // will print first

//console.log("Wasted time until: ", Date.now() - start)

// Wasted time until:  63
//Timeout ran at  71

//Even if the promise is already finishes, waiting for it will
//cause the callback to run after the current script is finished
// rather than right away.

Promise.resolve("Done").then(console.log);
console.log("Me run first though I came after the promise");
