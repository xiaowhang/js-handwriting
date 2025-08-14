# js-handwriting

## 项目结构

```shell
.
├── package.json
├── pnpm-lock.yaml
├── README.md
├── src               # 源代码目录
├── test              # 测试目录
└── vitest.config.ts  # Vitest 配置
```

## 先决条件

- Node.js（建议使用 LTS 版本，例如 18 或 20）。
- 包管理器：pnpm（也可以使用 npm 或 yarn，但下文示例使用 pnpm）。

如果未安装 pnpm，可运行：

```shell
npm install -g pnpm
```

## 安装依赖

在项目根目录运行：

```shell
pnpm install
```

## 运行测试

本仓库 `package.json` 中包含两个测试脚本：

```shell
pnpm test         # 启动 vitest watch 模式
pnpm test run     # 以一次性模式运行所有测试
```

你还可以传递参数到 Vitest：

- 运行匹配名称的测试：

```shell
pnpm test -t <pattern>
```

- 运行单个测试文件：

```shell
pnpm test -- test/yourTestFile.test.js
```
