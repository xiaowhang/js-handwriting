'use strict';

import { describe, it, expect } from 'vitest';
import { deepClone } from '@/deepClone.js';

describe('deepClone - 深拷贝函数', () => {
  describe('基本类型处理', () => {
    it.each([
      { value: null, desc: 'null 值' },
      { value: undefined, desc: 'undefined 值' },
      { value: 42, desc: '数字' },
      { value: 'hello', desc: '字符串' },
      { value: true, desc: '布尔值 true' },
      { value: false, desc: '布尔值 false' },
      { value: Symbol('test'), desc: 'Symbol' },
      { value: BigInt(123), desc: 'BigInt' },
    ])('应该正确处理 $desc', ({ value }) => {
      const cloned = deepClone(value);
      expect(cloned).toBe(value);
    });
  });

  describe('对象深拷贝', () => {
    it('应该深拷贝简单对象', () => {
      const original = { a: 1, b: 'test', c: true };
      const cloned = deepClone(original);

      // 验证值相等但引用不同
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it('应该深拷贝嵌套对象', () => {
      const original = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      };
      const cloned = deepClone(original);

      // 验证深层嵌套对象也被正确拷贝
      expect(cloned).toEqual(original);
      expect(cloned.level1).not.toBe(original.level1);
      expect(cloned.level1.level2).not.toBe(original.level1.level2);
      expect(cloned.level1.level2.level3).not.toBe(original.level1.level2.level3);
    });

    it('应该正确拷贝对象的所有可枚举属性', () => {
      const original = {
        name: 'test',
        value: 42,
        nested: { a: 1, b: 2 },
      };
      const cloned = deepClone(original);

      // 验证所有属性都被正确拷贝
      expect(Object.keys(cloned)).toEqual(Object.keys(original));
      for (const key in original) {
        expect(cloned[key]).toEqual(original[key]);
      }
    });
  });

  describe('数组深拷贝', () => {
    it('应该深拷贝一维数组', () => {
      const original = [1, 2, 3, 'test', true];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(Array.isArray(cloned)).toBe(true);
    });

    it('应该深拷贝多维数组', () => {
      const original = [
        [1, 2, 3],
        ['a', 'b', 'c'],
        [{ x: 1 }, { y: 2 }],
      ];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[0]).not.toBe(original[0]);
      expect(cloned[2][0]).not.toBe(original[2][0]);
    });

    it('应该正确处理稀疏数组', () => {
      const original = [1, , 3, , 5];
      original.length = 10;
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned.length).toBe(original.length);
      expect(1 in cloned).toBe(false); // 确保稀疏性被保持
      expect(3 in cloned).toBe(false);
      expect(5 in cloned).toBe(false);
    });

    it('应该深拷贝包含对象的数组', () => {
      const original = [
        { id: 1, data: { value: 'a' } },
        { id: 2, data: { value: 'b' } },
      ];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned[0]).not.toBe(original[0]);
      expect(cloned[0].data).not.toBe(original[0].data);
    });
  });

  describe('特殊对象类型', () => {
    it('应该正确拷贝 Date 对象', () => {
      const original = new Date('2023-01-01');
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned instanceof Date).toBe(true);
      expect(cloned.getTime()).toBe(original.getTime());
    });

    it('应该正确拷贝 RegExp 对象', () => {
      const original = /test\\d+/gi;
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned instanceof RegExp).toBe(true);
      expect(cloned.source).toBe(original.source);
      expect(cloned.flags).toBe(original.flags);
    });

    it('应该正确拷贝 Set 对象', () => {
      const original = new Set([1, 2, 3, { a: 1 }]);
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned instanceof Set).toBe(true);
      expect(cloned.size).toBe(original.size);

      // 验证 Set 中的对象也被深拷贝
      const originalObj = Array.from(original).find(item => typeof item === 'object');
      const clonedObj = Array.from(cloned).find(item => typeof item === 'object');
      expect(clonedObj).toEqual(originalObj);
      expect(clonedObj).not.toBe(originalObj);
    });

    it('应该正确拷贝 Map 对象', () => {
      const original = new Map([
        ['key1', 'value1'],
        [{ objKey: true }, { objValue: 42 }],
      ]);
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned instanceof Map).toBe(true);
      expect(cloned.size).toBe(original.size);

      // 验证 Map 中的键值对都被深拷贝
      const entries = Array.from(cloned.entries());
      const originalEntries = Array.from(original.entries());
      expect(entries[1][0]).toEqual(originalEntries[1][0]);
      expect(entries[1][0]).not.toBe(originalEntries[1][0]);
      expect(entries[1][1]).toEqual(originalEntries[1][1]);
      expect(entries[1][1]).not.toBe(originalEntries[1][1]);
    });
  });

  describe('循环引用处理', () => {
    it('应该正确处理简单的循环引用', () => {
      const original = { name: 'test' };
      original.self = original; // 创建循环引用

      const cloned = deepClone(original);

      expect(cloned.name).toBe('test');
      expect(cloned.self).toBe(cloned); // 循环引用应该指向克隆对象本身
      expect(cloned).not.toBe(original);
    });

    it('应该正确处理复杂的循环引用', () => {
      const original = {
        a: { value: 1 },
        b: { value: 2 },
      };
      original.a.ref = original.b;
      original.b.ref = original.a;
      original.root = original;

      const cloned = deepClone(original);

      expect(cloned.a.value).toBe(1);
      expect(cloned.b.value).toBe(2);
      expect(cloned.a.ref).toBe(cloned.b);
      expect(cloned.b.ref).toBe(cloned.a);
      expect(cloned.root).toBe(cloned);
      expect(cloned).not.toBe(original);
    });

    it('应该正确处理数组中的循环引用', () => {
      const original = [1, 2, 3];
      original.push(original); // 数组引用自身

      const cloned = deepClone(original);

      expect(cloned[0]).toBe(1);
      expect(cloned[1]).toBe(2);
      expect(cloned[2]).toBe(3);
      expect(cloned[3]).toBe(cloned);
      expect(cloned).not.toBe(original);
    });
  });

  describe('复杂场景测试', () => {
    it('应该正确处理混合类型的复杂对象', () => {
      const original = {
        string: 'test',
        number: 42,
        boolean: true,
        nullValue: null,
        undefinedValue: undefined,
        date: new Date('2023-01-01'),
        regex: /test/g,
        array: [1, 2, { nested: true }],
        object: {
          deep: {
            value: 'very deep',
          },
        },
        set: new Set([1, 2, 3]),
        map: new Map([['key', 'value']]),
      };

      const cloned = deepClone(original);

      // 验证所有类型都被正确处理
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.date).not.toBe(original.date);
      expect(cloned.regex).not.toBe(original.regex);
      expect(cloned.array).not.toBe(original.array);
      expect(cloned.object).not.toBe(original.object);
      expect(cloned.set).not.toBe(original.set);
      expect(cloned.map).not.toBe(original.map);
    });

    it('应该正确处理深度嵌套的数据结构', () => {
      // 创建一个深度为 10 层的嵌套对象
      let original = { value: 'leaf' };
      for (let i = 0; i < 10; i++) {
        original = { level: i, nested: original };
      }

      const cloned = deepClone(original);

      // 验证深度嵌套结构被正确拷贝
      let current = cloned;
      for (let i = 9; i >= 0; i--) {
        expect(current.level).toBe(i);
        current = current.nested;
      }
      expect(current.value).toBe('leaf');
    });

    it('应该正确处理包含函数的对象（函数应该被忽略或按引用复制）', () => {
      const original = {
        data: 'test',
        method: function () {
          return 'test';
        },
        arrow: () => 'arrow',
        nested: {
          func: function () {
            return 'nested';
          },
        },
      };

      const cloned = deepClone(original);

      expect(cloned.data).toBe('test');
      expect(cloned.method).toBe(original.method); // 函数按引用复制
      expect(cloned.arrow).toBe(original.arrow);
      expect(cloned.nested.func).toBe(original.nested.func);
      expect(cloned.nested).not.toBe(original.nested);
    });
  });

  describe('性能和边界情况', () => {
    it('应该正确处理空对象和空数组', () => {
      const emptyObj = {};
      const emptyArr = [];

      const clonedObj = deepClone(emptyObj);
      const clonedArr = deepClone(emptyArr);

      expect(clonedObj).toEqual(emptyObj);
      expect(clonedObj).not.toBe(emptyObj);
      expect(clonedArr).toEqual(emptyArr);
      expect(clonedArr).not.toBe(emptyArr);
    });

    it('应该正确处理大型数据结构', () => {
      // 创建一个包含 1000 个元素的数组，每个元素都是对象
      const original = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        data: { value: `item${i}`, nested: { deep: i * 2 } },
      }));

      const startTime = performance.now();
      const cloned = deepClone(original);
      const endTime = performance.now();

      // 验证拷贝正确性
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[500]).not.toBe(original[500]);

      // 性能检查（应该在合理时间内完成）
      expect(endTime - startTime).toBeLessThan(1000); // 1秒内完成
    });

    it('应该正确处理 prototype 链', () => {
      // 创建一个具有原型的对象
      class TestClass {
        constructor(name) {
          this.name = name;
        }
        getName() {
          return this.name;
        }
      }

      const original = new TestClass('test');
      original.data = { value: 42 };

      const cloned = deepClone(original);

      // 验证自有属性被拷贝，但 prototype 方法不应该被拷贝到克隆对象的自有属性中
      expect(cloned.name).toBe('test');
      expect(cloned.data).toEqual({ value: 42 });
      expect(cloned.data).not.toBe(original.data);

      // 克隆对象不应该有 getName 作为自有属性
      expect(Object.hasOwnProperty.call(cloned, 'getName')).toBe(false);
    });
  });

  describe('错误处理和健壮性', () => {
    it('应该处理带有不可枚举属性的对象', () => {
      const original = { visible: 'yes' };
      Object.defineProperty(original, 'hidden', {
        value: 'secret',
        enumerable: false,
      });

      const cloned = deepClone(original);

      // 只有可枚举属性应该被拷贝
      expect(cloned.visible).toBe('yes');
      expect(Object.hasOwnProperty.call(cloned, 'hidden')).toBe(false);
    });
  });

  describe('类型一致性验证', () => {
    it('拷贝后的对象应该保持正确的类型', () => {
      const testCases = [
        { original: new Date(), type: Date },
        { original: /test/, type: RegExp },
        { original: new Set(), type: Set },
        { original: new Map(), type: Map },
        { original: [], type: Array },
        { original: {}, type: Object },
      ];

      testCases.forEach(({ original, type }) => {
        const cloned = deepClone(original);
        expect(cloned instanceof type).toBe(true);
      });
    });

    it('应该正确处理继承关系', () => {
      const original = Object.create({ inherited: 'value' });
      original.own = 'property';

      const cloned = deepClone(original);

      // 只有自有属性应该被拷贝
      expect(cloned.own).toBe('property');
      expect(Object.hasOwnProperty.call(cloned, 'inherited')).toBe(false);
    });
  });
});
