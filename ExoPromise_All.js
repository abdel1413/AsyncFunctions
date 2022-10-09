/**
 *
 * @param {*} promises
 * @returns
 *  loop thru all the promises and use then to assign each
 * element from promise array to the result produced
 * we'll need to check the length of the pendings
 * if the pendings are finished then we completed th
 * loop. we can return the results array.
 *
 */
function Promise_All(promises) {
  return new Promise((resolve, reject) => {
    let results = [];
    let pending = promises.length; //all the promises are pending
    for (let i = 0; i < promises.length; i++) {
      //take each promise and evaluate
      promises[i]
        .then((result) => {
          results[i] = result;
          pending--;
          //check if pending is exhauted
          if (pending === 0) resolve(results);
        })
        .catch(reject);
    }
    if (promises.length === 0) {
      resolve(results);
    }
  });
}

//create a function composed of array of promises
function soon(value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), Math.random() * 1000);
  });
}

console.log(
  Promise_All([]).then((array) =>
    console.log("this will print empty array:  ", array)
  )
);
//this will print empty array:[]

console.log(
  Promise_All([soon(2), soon(3), soon(5)]).then((array) => {
    console.log("this is will return [2,3,5]", array);
  })
);
//this is will return [2,3,5]" [2, 3, 5];

console.log(
  Promise_All([soon(2), soon(3), Promise.reject("X")])
    .then((a) => console.log("we should not get there ", a))
    .catch((er) => {
      if (er != "X") {
        console.log("unexpected failure", er);
      }
    })
);
//Promise {<pending>}

// failing promise with Y and printing unexpected failure
console.log(
  Promise_All([soon(2), soon(3), Promise.reject("Y")])
    .then((a) => console.log("we should not get there"))
    .catch((er) => {
      if (er != "X") {
        console.log("unexpected failure", er);
      }
    })
);

//unexpected failure Y

//primosie function taking an array of all promise
// return the resolved promises and saved in new array
//access each element from promise and use then function
// to save resolved result in the new array
//need to check if we finish the loop so create
//a tracker. when finish pass the results array
// to the promise resolve funtion
//if it unsuccessfull, catch the error

function PromiseResult(promises) {
  return new Promise((res, rej) => {
    let ar = [];
    let pending = promises.length;
    for (let i = 0; i < promises.length; i++) {
      promises[i]
        .then((r) => {
          ar[i] = r;
          pending--;
          if (pending === 0) {
            res(ar);
          }
        })
        .catch(rej);
    }
    if (pending === 0) {
      res(ar);
    }
  });
}

console.log(PromiseResult([]).then((a) => console.log("empty result ", a)));

function promiseArrays(value) {
  return new Promise((res) => {
    setTimeout(() => res(value), Math.random() * 5000);
  });
}

let p = PromiseResult([promiseArrays(3), promiseArrays(5), promiseArrays(9)]);
p.then((ar) => console.log(ar));
let er = PromiseResult([
  promiseArrays(1),
  Promise.reject("Y"),
  promiseArrays(4),
]);
er.then((a) => console.log(a)).catch((e) => {
  if (e != "X") {
    console.log("unexpected failure");
  }
});
