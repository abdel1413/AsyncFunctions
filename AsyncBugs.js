/**
 * create a function which fails to run due to bugs
 *
 */

const { async } = require("rxjs");
const { bigOak } = require("./crow-tech");

//using our crow tech
function anyStorage(nest, source, name) {
  if (source == nest.name) {
    return storage(nest, name);
  } else {
    return request(nest, source, "storage", name);
  }
}

//a function that count the number of chicks
//that hatch throughout the village every year
//using async
async function chicks(nest, year) {
  let list = "";
  await Promise.all(
    network(nest).map(async (name) => {
      list += `${name}: ${await anyStorage(nest, name, `chicks in ${year}`)}\n`;
    })
  );
  return list;
}

chicks(bigOak, 2022).then(console.log);
// won't work bcz of +=
/**
 * The problem lies in the += operator, which takes the
 *  current value of list at the time where the statement 
 * starts executing and then, when the await finishes, 
 * sets the list binding to be that value plus the added string.

But between the time where the statement starts 
executing and the time where it finishes there’s an 
asynchronous gap. The map expression runs before anything has 
been added to the list, so each of the += operators starts from 
an empty string and ends up, when its storage retrieval 
finishes, setting list to a single-line list—the result of 
adding its line to the empty string.
 */

//To solve this issue, call 'join' on the Promise.all instead of
//building up the list

async function chicks(nest, name) {
  let lines = network(nest).map(async (name) => {
    return name + " : " + (await anyStorage(nest, name, `chicks in ${year}`));
  });
  return (await Promise.all(lines)).join("\n");
}
