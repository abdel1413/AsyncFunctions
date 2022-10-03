requestType("storage", (nest, name) => storage(nest, name));

function findInStorage(nest, name) {
  return storage(nest, name).then((found) => {
    if (found != null) return found;
    else return findInRemoteStorage(nest, name);
  });
}

function network(nest) {
  return Array.from(nest.state.connections);
}

function findInRemoteStorage(nest, name) {
  let sources = network(nest).filter((n) => n != nest.name);
  function next() {
    if (sources.length == 0) {
      return Promise.reject(new Error("Not found"));
    } else {
      let source = sources[Math.floor(Math.random() * sources.length)];
      sources = sources.filter((n) => n != source);
      return requestRout(nest, source, "storage", name).then(
        (value) => (value != null ? value : next()),
        next
      );
    }
  }
  return next();
}
