/**
 * looking up food caches in the storage
 * bulb of big oak
 */
import { bigOak } from "./crow-tech";

bigOak.readStorage("food caches", (caches) => {
  let firstCache = caches[0];
  bigOak.readStorage(firstCache, (info) => {
    console.log(info);
  });
});

//nest sends off request.
// call back method for  communication taking four args
//name, type, content, callbackFunction
bigOak.send(
  "Cow Pasture",
  "note",
  "Let's caw loudly at 7PM",
  console.log("note received")
);

//create Promise base interface for readstorage.
function storage(nest, name) {
  return new Promise((resolve) => {
    nest.readStorage(name, (result) => resolve(result));
  });
}

storage(bigOak, "enemies").then((value) => console.log(value));
