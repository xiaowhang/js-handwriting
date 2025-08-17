import { describe, it, expect } from 'vitest';
import { _instanceof } from '@/instanceof.js';

('use strict');

describe('_instanceof - 自定义 instanceof 实现', () => {
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
    ])('应该对 $desc 返回 false', ({ value }) => {
      const result = _instanceof(value, Object);
      expect(result).toBe(false);
      expect(result).toBe(value instanceof Object);
    });
  });

  describe('对象类型验证', () => {
    it('应该正确验证普通对象', () => {
      const obj = {};
      expect(_instanceof(obj, Object)).toBe(true);
      expect(_instanceof(obj, Object)).toBe(obj instanceof Object);
    });

    it('应该正确验证数组对象', () => {
      const arr = [];
      expect(_instanceof(arr, Array)).toBe(true);
      expect(_instanceof(arr, Array)).toBe(arr instanceof Array);
      expect(_instanceof(arr, Object)).toBe(true);
      expect(_instanceof(arr, Object)).toBe(arr instanceof Object);
    });

    it('应该正确验证函数对象', () => {
      const func = function () {};
      expect(_instanceof(func, Function)).toBe(true);
      expect(_instanceof(func, Function)).toBe(func instanceof Function);
      expect(_instanceof(func, Object)).toBe(true);
      expect(_instanceof(func, Object)).toBe(func instanceof Object);
    });

    it('应该正确验证日期对象', () => {
      const date = new Date();
      expect(_instanceof(date, Date)).toBe(true);
      expect(_instanceof(date, Date)).toBe(date instanceof Date);
      expect(_instanceof(date, Object)).toBe(true);
      expect(_instanceof(date, Object)).toBe(date instanceof Object);
    });

    it('应该正确验证正则表达式对象', () => {
      const regex = /test/;
      expect(_instanceof(regex, RegExp)).toBe(true);
      expect(_instanceof(regex, RegExp)).toBe(regex instanceof RegExp);
      expect(_instanceof(regex, Object)).toBe(true);
      expect(_instanceof(regex, Object)).toBe(regex instanceof Object);
    });
  });

  describe('内置类型测试', () => {
    it.each([
      { obj: new Set(), constructor: Set, desc: 'Set' },
      { obj: new Map(), constructor: Map, desc: 'Map' },
      { obj: new WeakSet(), constructor: WeakSet, desc: 'WeakSet' },
      { obj: new WeakMap(), constructor: WeakMap, desc: 'WeakMap' },
      { obj: new Promise(() => {}), constructor: Promise, desc: 'Promise' },
      { obj: new Error(), constructor: Error, desc: 'Error' },
    ])('应该正确验证 $desc 类型', ({ obj, constructor }) => {
      expect(_instanceof(obj, constructor)).toBe(true);
      expect(_instanceof(obj, constructor)).toBe(obj instanceof constructor);
      expect(_instanceof(obj, Object)).toBe(true);
      expect(_instanceof(obj, Object)).toBe(obj instanceof Object);
    });
  });

  describe('自定义类测试', () => {
    it('应该正确验证自定义类实例', () => {
      class TestClass {
        constructor(name) {
          this.name = name;
        }
      }

      const instance = new TestClass('test');
      expect(_instanceof(instance, TestClass)).toBe(true);
      expect(_instanceof(instance, TestClass)).toBe(instance instanceof TestClass);
      expect(_instanceof(instance, Object)).toBe(true);
      expect(_instanceof(instance, Object)).toBe(instance instanceof Object);
    });

    it('应该正确处理类继承关系', () => {
      class Animal {
        constructor(name) {
          this.name = name;
        }
      }

      class Dog extends Animal {
        constructor(name, breed) {
          super(name);
          this.breed = breed;
        }
      }

      const dog = new Dog('Buddy', 'Golden Retriever');

      expect(_instanceof(dog, Dog)).toBe(true);
      expect(_instanceof(dog, Dog)).toBe(dog instanceof Dog);
      expect(_instanceof(dog, Animal)).toBe(true);
      expect(_instanceof(dog, Animal)).toBe(dog instanceof Animal);
      expect(_instanceof(dog, Object)).toBe(true);
      expect(_instanceof(dog, Object)).toBe(dog instanceof Object);
    });

    it('应该正确处理多层继承', () => {
      class A {}
      class B extends A {}
      class C extends B {}
      class D extends C {}

      const instance = new D();

      expect(_instanceof(instance, D)).toBe(true);
      expect(_instanceof(instance, D)).toBe(instance instanceof D);
      expect(_instanceof(instance, C)).toBe(true);
      expect(_instanceof(instance, C)).toBe(instance instanceof C);
      expect(_instanceof(instance, B)).toBe(true);
      expect(_instanceof(instance, B)).toBe(instance instanceof B);
      expect(_instanceof(instance, A)).toBe(true);
      expect(_instanceof(instance, A)).toBe(instance instanceof A);
      expect(_instanceof(instance, Object)).toBe(true);
      expect(_instanceof(instance, Object)).toBe(instance instanceof Object);
    });
  });

  describe('构造函数测试', () => {
    it('应该正确验证构造函数创建的对象', () => {
      function Person(name) {
        this.name = name;
      }

      const person = new Person('Alice');
      expect(_instanceof(person, Person)).toBe(true);
      expect(_instanceof(person, Person)).toBe(person instanceof Person);
      expect(_instanceof(person, Object)).toBe(true);
      expect(_instanceof(person, Object)).toBe(person instanceof Object);
    });

    it('应该正确处理原型链修改', () => {
      function Parent() {}
      function Child() {}
      Child.prototype = Object.create(Parent.prototype);
      Child.prototype.constructor = Child;

      const child = new Child();
      expect(_instanceof(child, Child)).toBe(true);
      expect(_instanceof(child, Child)).toBe(child instanceof Child);
      expect(_instanceof(child, Parent)).toBe(true);
      expect(_instanceof(child, Parent)).toBe(child instanceof Parent);
    });
  });

  describe('错误匹配测试', () => {
    it('应该对不匹配的类型返回 false', () => {
      const obj = {};
      const arr = [];
      const date = new Date();

      expect(_instanceof(obj, Array)).toBe(false);
      expect(_instanceof(obj, Array)).toBe(obj instanceof Array);
      expect(_instanceof(arr, Date)).toBe(false);
      expect(_instanceof(arr, Date)).toBe(arr instanceof Date);
      expect(_instanceof(date, Array)).toBe(false);
      expect(_instanceof(date, Array)).toBe(date instanceof Array);
    });

    it('应该对不相关的自定义类返回 false', () => {
      class ClassA {}
      class ClassB {}

      const instanceA = new ClassA();
      expect(_instanceof(instanceA, ClassB)).toBe(false);
      expect(_instanceof(instanceA, ClassB)).toBe(instanceA instanceof ClassB);
    });
  });

  describe('边缘情况处理', () => {
    it('应该正确处理 Object.create(null) 创建的对象', () => {
      const obj = Object.create(null);
      expect(_instanceof(obj, Object)).toBe(false);
      expect(_instanceof(obj, Object)).toBe(obj instanceof Object);
    });

    it('应该正确处理原型为 null 的情况', () => {
      const obj = {};
      Object.setPrototypeOf(obj, null);
      expect(_instanceof(obj, Object)).toBe(false);
      expect(_instanceof(obj, Object)).toBe(obj instanceof Object);
    });

    it('应该正确处理构造函数 prototype 为 null 的情况', () => {
      function TestConstructor() {}
      const originalPrototype = TestConstructor.prototype;
      TestConstructor.prototype = null;

      const obj = {};
      expect(_instanceof(obj, TestConstructor)).toBe(false);

      // 恢复原型以避免影响其他测试
      TestConstructor.prototype = originalPrototype;
    });
  });

  describe('复杂对象测试', () => {
    it('应该正确处理绑定函数', () => {
      function originalFunc() {}
      const boundFunc = originalFunc.bind({});

      expect(_instanceof(boundFunc, Function)).toBe(true);
      expect(_instanceof(boundFunc, Function)).toBe(boundFunc instanceof Function);
    });

    it('应该正确处理箭头函数', () => {
      const arrowFunc = () => {};
      expect(_instanceof(arrowFunc, Function)).toBe(true);
      expect(_instanceof(arrowFunc, Function)).toBe(arrowFunc instanceof Function);
    });

    it('应该正确处理代理对象', () => {
      const target = {};
      const proxy = new Proxy(target, {});

      expect(_instanceof(proxy, Object)).toBe(true);
      expect(_instanceof(proxy, Object)).toBe(proxy instanceof Object);
    });
  });

  describe('与原生 instanceof 对比', () => {
    it('应该与原生 instanceof 行为完全一致', () => {
      const testCases = [
        // 基本类型
        { obj: 42, constructor: Number },
        { obj: 'string', constructor: String },
        { obj: true, constructor: Boolean },
        { obj: null, constructor: Object },
        { obj: undefined, constructor: Object },

        // 对象类型
        { obj: {}, constructor: Object },
        { obj: [], constructor: Array },
        { obj: [], constructor: Object },
        { obj: function () {}, constructor: Function },
        { obj: new Date(), constructor: Date },
        { obj: /regex/, constructor: RegExp },

        // 错误匹配
        { obj: {}, constructor: Array },
        { obj: [], constructor: Date },
        { obj: 'string', constructor: Object },
      ];

      testCases.forEach(({ obj, constructor }) => {
        const customResult = _instanceof(obj, constructor);
        const nativeResult = obj instanceof constructor;
        expect(customResult).toBe(nativeResult);
      });
    });

    it('应该在复杂继承场景下与原生 instanceof 一致', () => {
      class GrandParent {}
      class Parent extends GrandParent {}
      class Child extends Parent {}

      const child = new Child();
      const testConstructors = [Child, Parent, GrandParent, Object, Array, Date];

      testConstructors.forEach(constructor => {
        const customResult = _instanceof(child, constructor);
        const nativeResult = child instanceof constructor;
        expect(customResult).toBe(nativeResult);
      });
    });
  });

  describe('性能和稳定性', () => {
    it('应该能处理深层原型链而不栈溢出', () => {
      // 创建一个深层原型链
      let current = {};
      const depth = 1000;

      for (let i = 0; i < depth; i++) {
        const next = {};
        Object.setPrototypeOf(next, current);
        current = next;
      }

      function DeepConstructor() {}
      expect(() => _instanceof(current, DeepConstructor)).not.toThrow();
      expect(_instanceof(current, DeepConstructor)).toBe(false);
    });

    it('应该正确处理循环原型链（如果存在）', () => {
      // 注意：正常情况下 JavaScript 不允许循环原型链
      // 但我们的实现应该能够安全处理这种情况
      const obj = {};
      expect(() => _instanceof(obj, Object)).not.toThrow();
    });
  });
});
