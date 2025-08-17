'use strict';

import { describe, it, expect, vi } from 'vitest';
import { promiseAll } from '@/promiseAll.js';

describe('promiseAll - 自定义 Promise.all 实现', () => {
  describe('各种输入', () => {
    it.each([
      { input: [Promise.resolve(1), 2, Promise.resolve(3)], desc: '混合 Promise 和普通值' },
      { input: 'abc', desc: '字符串' },
      { input: [], desc: '空数组' },
      { input: [, 1], desc: '稀疏数组' },
      { input: new Set([Promise.resolve(1), 2, 3]), desc: 'Set' },
      { input: [{ then: resolve => resolve(42) }, 1], desc: 'thenable 对象' },
    ])('$desc', async ({ input }) => {
      await expect(promiseAll(input)).resolves.toEqual(await Promise.all(input));
    });
  });

  describe('顺序保持', () => {
    it('无论解析快慢，结果顺序与输入一致', async () => {
      vi.useFakeTimers();
      try {
        const slow = new Promise(r => setTimeout(() => r('slow'), 30));
        const fast = Promise.resolve('fast');

        const input = [slow, fast];
        // 推进定时器以触发 slow
        vi.advanceTimersByTime(30);
        await expect(promiseAll(input)).resolves.toEqual(await Promise.all(input));
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

      const input = [p1, p2];
      await expect(promiseAll(input)).rejects.toEqual(await Promise.all(input).catch(e => e));
      await expect(promiseAll(input)).rejects.toThrow('fail');
      await expect(promiseAll(input)).rejects.toMatchObject({ message: 'fail' });
    });

    it('非可迭代值应以 TypeError 拒绝', async () => {
      await expect(promiseAll(null)).rejects.toBeInstanceOf(TypeError);
    });
  });
});
