//the easiest way to create a promise is by calling
//Promise.resolve(arg)
let fiften = Promise.resolve(15);
//to get a result the Promise, we use its 'then' method
//which registers a callback fcn to be called when the
//promise resolves and produce a value
fiften.then((res) => console.log(`Got the ${res}`));

//Promise  constructor may take two param, resolve that returns a successful result
//and reject that also return a new promise in case the request is
//unsuccessful

new Promise((resolve, reject) => reject(new Error("fail")))
  .then((value) => console.log("handler1"))
  .catch((reason) => {
    console.log("caught failure", reason);
    return "nothing";
  })
  .then((value) => console.log("handler2 ", value));
