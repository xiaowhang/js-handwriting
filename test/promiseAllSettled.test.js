'use strict';

import { describe, it, expect, vi } from 'vitest';
import { promiseAllSettled } from '@/promiseAllSettled.js';

describe('promiseAllSettled - 自定义 Promise.allSettled 实现', () => {
  describe('各种输入', () => {
    it.each([
      { input: [Promise.resolve(1), 2, Promise.resolve(3)], desc: '混合 Promise 和普通值' },
      { input: 'abc', desc: '字符串' },
      { input: [], desc: '空数组' },
      { input: [, 1], desc: '稀疏数组' },
      { input: new Set([Promise.resolve(1), 2, 3]), desc: 'Set' },
      { input: [{ then: resolve => resolve(42) }, 1], desc: 'thenable 对象' },
    ])('$desc', async ({ input }) => {
      await expect(promiseAllSettled(input)).resolves.toEqual(await Promise.allSettled(input));
    });
  });

  describe('顺序保持', () => {
    it('无论解析快慢，结果顺序与输入一致', async () => {
      vi.useFakeTimers();
      try {
        const slow = new Promise(r => setTimeout(() => r('slow'), 30));
        const fast = Promise.resolve('fast');
        const p = promiseAllSettled([slow, fast]);
        // 推进定时器以触发 slow
        vi.advanceTimersByTime(30);
        await expect(p).resolves.toEqual(await Promise.allSettled([slow, fast]));
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('错误处理', () => {
    it('任一 Promise 拒绝时应整体拒绝', async () => {
      const p1 = Promise.resolve('a');
      const p2 = (async () => {
        throw new Error('fail');
      })();

      await expect(promiseAllSettled([p1, p2])).resolves.toEqual(await Promise.allSettled([p1, p2]));
    });
  });
});
