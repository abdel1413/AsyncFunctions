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

chicks(bigOak, 2022).then(console.log); // won't work bcz of +=
