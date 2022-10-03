import { defineRequestType } from "./crow-tech";
import { everywhere } from "./crow-tech";

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

//Note Promise.resolve is used to convert
//VALUE returned by the handler function
// we wrapped promise by try catch block so
// the exception raised is DIRECTLY given to the callback funtion

//function that sends ping request to each of the nest to see
//which ones come back
requestType("ping", () => "pong");

//function using Promise.all methd
//It returns an array of values produced by the promise.
//NOte if any of those promises is rejected, the result of
//Promise.all is also rejected.
function availableNeighbors(nest) {
  //requests is holding the array of result (both fals and true)
  // returned from request methd.
  let requests = nest.neighbors.map((neighbor) => {
    return request(nest, neighbor, "ping").then(
      () => true,
      () => false
    );
  });
  return Promise.all(requests).then((result) => {
    nest.neighbors.filter((_, i) => result[i]);
  });
}
// NOTE: filter is used to remove those elements
//from the neighbors array whose corresponding value is false

//FLOODING
//create everwhere function which runs code on
//every nest—to add a property to the nest’s state object

everywhere((nest) => {
  nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null) {
  nest.state.gossip.push(message);
  for (let neighbor of neighbors) {
    if (neighbor === exceptFor) continue;
    request(nest, neighbor, "gossip", message);
  }
}

requestType("gossip", (nest, message, source) => {
  if (nest.state.gossip.includes(message)) return;
  console.log(`${nest.name} received gossip ${message} from ${source}`);
  sendGossip(nest, message, source);
});
