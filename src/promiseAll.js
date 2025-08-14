'use strict';

// 实现 Promise.all
export function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable);
    const result = [];
    let completed = 0;

    if (items.length === 0) {
      return resolve(result);
    }

    items.forEach((item, idx) => {
      Promise.resolve(item)
        .then(value => {
          result[idx] = value;
        })
        .catch(reject)
        .finally(() => {
          completed++;
          if (completed === items.length) {
            resolve(result);
          }
        });
    });
  });
}
