'use strict';

export function deepClone(obj, visited = new WeakMap()) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (visited.has(obj)) {
    return visited.get(obj);
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  if (obj instanceof Set) {
    const clonedSet = new Set();
    visited.set(obj, clonedSet);
    for (const value of obj) {
      clonedSet.add(deepClone(value, visited));
    }
    return clonedSet;
  }

  if (obj instanceof Map) {
    const clonedMap = new Map();
    visited.set(obj, clonedMap);
    for (const [key, value] of obj) {
      clonedMap.set(deepClone(key, visited), deepClone(value, visited));
    }
    return clonedMap;
  }

  if (Array.isArray(obj)) {
    const clonedArray = [];
    visited.set(obj, clonedArray);
    clonedArray.length = obj.length; // 稀疏数组的长度
    for (const key in obj) {
      clonedArray[key] = deepClone(obj[key], visited);
    }
    return clonedArray;
  }

  const clonedObj = {};
  visited.set(obj, clonedObj);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key], visited);
    }
  }
  return clonedObj;
}
