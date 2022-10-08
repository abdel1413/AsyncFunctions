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
