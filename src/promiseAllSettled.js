'use strict';

export function promiseAllSettled(iterable) {
  const items = Array.from(iterable);
  const result = [];
  let completed = 0;

  if (items.length === 0) {
    return Promise.resolve([]);
  }

  return new Promise(resolve => {
    items.forEach((item, idx) => {
      Promise.resolve(item)
        .then(value => {
          result[idx] = { status: 'fulfilled', value };
        })
        .catch(reason => {
          result[idx] = { status: 'rejected', reason };
        })
        .finally(() => {
          completed++;
          if (completed === items.length) {
            resolve(result);
          }
        });
    });
  });
}
