# js-handwriting 项目 AI 编程指南

## 项目概述
这是一个 JavaScript 工具库，实现了常见内置函数和算法的手写版本。每个实现都专注于正确性、边缘情况处理和全面测试。

## 架构与模式

### 代码组织结构
- **`src/`**: 每个工具函数都是独立模块（如 `deepClone.js`、`promiseAll.js`）
- **`test/`**: 对应的测试文件，包含全面的边缘情况覆盖
- **一对一映射**: 每个 `src/*.js` 都有对应的 `test/*.test.js`

### 实现风格
- **ES 模块**: 主要工具函数使用 `export function`
- **严格模式**: 所有文件都以 `'use strict';` 开头
- **边缘情况优先**: 在主要逻辑之前处理 null/undefined/空输入
- **WeakMap 循环引用**: 参考 `deepClone.js` 的对象追踪模式
- **渐进复杂度**: 从简单情况开始，逐步构建复杂场景

### 测试模式
使用 Vitest 的全面测试结构：

```javascript
describe('函数名', () => {
  describe('基本类型处理', () => {
    it.each([...])('应该正确处理基本类型', ...)
  });

  describe('边缘情况', () => {
    it('处理循环引用', ...)
  });
});
```

## 开发工作流

### 运行测试
```bash
pnpm test           # 监视模式，用于开发
pnpm test run       # 一次性运行所有测试，用于 CI
pnpm test -t <名称> # 运行特定模式的测试
```

**重要提醒**: Copilot 生成代码后如需运行测试验证，请使用 `pnpm test run` 而不是 `pnpm test`，避免进入监视模式导致命令阻塞。

### 添加新工具函数
1. 创建 `src/newUtility.js`，包含全面的边缘情况处理
2. 创建 `test/newUtility.test.js`，使用 describe 块组织不同场景
3. 在测试中使用 `@/` 别名导入（在 vitest.config.js 中配置）
4. 尽可能与原生实现对比测试 (`expect(myImpl(input)).toEqual(await NativeAPI(input))`)

### 代码风格
- 复杂逻辑使用中文注释说明
- 测试名称使用中文描述以提高可读性
- 使用 `it.each()` 测试多个相似用例
- 使用 `vi.useFakeTimers()` 模拟定时器测试异步代码

## 关键文件
- `vitest.config.js`: 测试配置，包含 `@/` 别名设置
- `package.json`: ES 模块配置 (`"type": "module"`)
- 每个测试文件都展示了对应工具函数的预期 API 和边缘情况
