import { bigOak, defineRequestType } from "./crow-tech";
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

//broadcasting(flooding)  checking whether the new set of neighbors for a
//given nest matches the current set we have for it.
requestType("connections", (nest, { name, neighbors }, source) => {
  let connections = nest.state.connections;
  if (JSON.stringify(connections.get(name)) == JSON.stringify(neighbors))
    return;
  connections.set(name, neighbors);
  broadCastConnections(name, neighbors, source);
});

function broadCastConnections(nest, name, exceptFor = null) {
  for (let neighbor of neighbors) {
    if (neighbor === exceptFor) return;
    request(nest, neighbor, {
      name,
      neighbors: nest.state.connections.get(name),
    });
  }
}

everywhere((nest) => {
  nest.state.connections = new Map();
  nest.state.connections.set(nest.name, nest.neighbors);
  broadCastConnections(nest, nest.name);
});

//create a function to find a route
// Searches for a way to reach a given node in the network.
//But instead of returning the whole route, it just
//returns the next step.That next nest will itself, using
//its current information about the network, decide where
//it sends the message.

function findRoute(from, to, connections) {
  let work = [{ at: from, via: null }];
  for (let i = 0; i < work.length; i++) {
    let { at, via } = work[i];
    for (let next of connections.get(at || [])) {
      if (next == to) return via;
      if (!work.some((w) => w.at == next)) {
        work.push({ at: next, via: via || next });
      }
    }
  }
  return null;
}

function requestRoute(nest, target, type, content) {
  if (nest.neighbors.includes(target)) {
    return request(nest, target, type, content);
  } else {
    let via = findRoute(nest.name, target, nest.state.connections);
    if (!via) throw new Error(`No route to ${target}`);
    return request(nest, via, "route", { target, type, content });
  }
}

requestType("route", (nest, { target, type, content }) => {
  return requestRoute(nest, via, "route", { target, type, content });
});

//we can now send message to the Church tower.
requestRoute(bigOak, "Church Tower", "note", "Incoming jackdaws!");
