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
          if (pending === 0) {
            resolve(results);
          }
        })
        .catch(reject);
    }
    if (promises.length === 0) {
      resolve(results);
    }
  });
}
