import { defineRequestType } from "./crow-tech";

defineRequestType("note", (nest, content, source, done) => {
  console.log(`${nest.name} receive note ${content} `);
  done();
});

//create a wrapper of defineRestType allowing the hanler
//function to return a promise or plain value and wires
function requestType(name, handler) {
  defineRequestType(name, (content, source, callback) => {
    try {
      Promise.resolve(handler(nest, content, source)).then(
        (res) => callback(null, res),
        (fail) => callback(fail)
      );
    } catch (exceptions) {
      callback(exceptions);
    }
  });
}
