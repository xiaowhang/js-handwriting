'use strict';

import { describe, it, expect } from 'vitest';
import { promiseAll } from '@/promiseAll.js';

describe('promiseAll', () => {
  it('对混合的 Promise 和普通值按输入顺序返回结果数组', async () => {
    const p1 = Promise.resolve(1);
    const p2 = 2;
    const p3 = new Promise(resolve => setTimeout(() => resolve(3), 10));

    const res = await promiseAll([p1, p2, p3]);
    expect(res).toEqual([1, 2, 3]);
  });

  it('当任一 Promise 拒绝时应整体拒绝', async () => {
    const p1 = Promise.resolve('a');
    const p2 = Promise.reject(new Error('fail'));

    await expect(promiseAll([p1, p2])).rejects.toThrow('fail');
  });

  it('对空输入应解析为空数组', async () => {
    const res = await promiseAll([]);
    expect(res).toEqual([]);
  });

  it('对非可迭代值应以 TypeError 拒绝', async () => {
    await expect(promiseAll(null)).rejects.toBeInstanceOf(TypeError);
  });

  it('无论解析快慢均保持结果顺序与输入一致', async () => {
    const slow = new Promise(r => setTimeout(() => r('slow'), 30));
    const fast = Promise.resolve('fast');
    const res = await promiseAll([slow, fast]);
    expect(res).toEqual(['slow', 'fast']);
  });

  it('Set 应按输入顺序返回结果数组', async () => {
    const p1 = new Promise(resolve => setTimeout(() => resolve(1), 10));
    const p2 = Promise.resolve(2);
    const p3 = 3;

    const res = await promiseAll(new Set([p1, p2, p3]));
    expect(res).toEqual([1, 2, 3]);
  });
});
