# 智能代理协作系统 (iT-Agent)

基于AutoGen构建的多智能代理协作系统，专为复杂问题解决和创意工作流设计。

![项目状态](https://img.shields.io/badge/状态-开发中-yellow)
![版本](https://img.shields.io/badge/版本-0.1.0_预览版-blue)
![许可](https://img.shields.io/badge/许可-MIT-green)

## 项目概述

iT-Agent是一个专为单人开发者设计的智能代理协作平台，利用AutoGen框架构建多代理系统，能够协同工作以解决复杂问题。系统设计为宇宙星空主题，创造沉浸式的协作体验。

### 核心特性

🤖 **多代理协作** - 预配置的专业代理团队协同工作
🔄 **自适应工作流** - 根据任务类型自动调整协作模式
💬 **自然语言交互** - 无缝的人机交互体验
🛠️ **可定制代理** - 根据特定需求自定义代理角色
📊 **可视化协作过程** - 直观展示代理间互动和贡献

## 快速开始

### 前提条件

- Node.js (v16+)
- Python (v3.9+)
- OpenAI API密钥

### 安装

1. 克隆仓库
   ```bash
   git clone https://github.com/yourusername/iT-Agent.git
   cd iT-Agent
   ```

2. 安装依赖
   ```bash
   # 前端依赖
   npm install
   
   # 后端依赖
   pip install -r requirements.txt
   ```

3. 配置环境变量
   ```
   # 创建.env.local文件
   cp .env.example .env.local
   
   # 添加你的OpenAI API密钥
   # OPENAI_API_KEY=your_api_key_here
   ```

4. 启动开发服务器
   ```bash
   npm run dev
   ```

5. 访问应用
   ```
   http://localhost:3000
   ```

## 项目结构

```
iT-Agent/
├── docs/                # 项目文档
│   ├── 1. 项目规划/      # 项目计划和需求文档
│   ├── 2. 系统设计/      # 架构和数据模型设计
│   ├── 3. 技术规范/      # 技术选择和设计规范
│   ├── 4. 开发指南/      # 开发标准和流程
│   ├── 5. 补充文档/      # 文档导航和索引
│   └── assets/          # 文档资源(图片等)
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── app/             # Next.js应用
│   ├── components/      # UI组件
│   ├── lib/             # 实用工具和钩子
│   ├── agents/          # 代理定义和配置
│   └── styles/          # 全局样式
├── prisma/              # 数据库架构和迁移
├── tests/               # 测试文件
└── scripts/             # 实用脚本
```

## 文档导航

项目包含全面的文档，便于单人开发者理解和扩展系统：

### 项目规划
- [项目计划](./docs/1. 项目规划/project_plan.md) - 项目概览和目标
- [项目阶段](./docs/1. 项目规划/project_phases.md) - 开发阶段和里程碑
- [项目时间线](./docs/1. 项目规划/project_timeline.md) - 详细开发时间表
- [开发进度表](./docs/1. 项目规划/development_progress.md) - 实时开发状态跟踪
- [功能需求](./docs/1. 项目规划/requirements_functional.md) - 系统功能需求
- [非功能需求](./docs/1. 项目规划/requirements_nonfunctional.md) - 性能和质量需求

### 系统设计
- [系统架构](./docs/2. 系统设计/system_architecture.md) - 系统架构设计
- [数据模型](./docs/2. 系统设计/data_model.md) - 数据模型和数据库设计
- [API文档](./docs/2. 系统设计/api_documentation.md) - API规范和示例
- [用户故事](./docs/2. 系统设计/user_stories.md) - 详细用户故事

### 技术与设计
- [技术栈](./docs/3. 技术规范/tech_stack.md) - 技术选择与理由
- [组件库](./docs/3. 技术规范/component_library.md) - UI组件规范
- [UI设计系统](./docs/3. 技术规范/ui_design_system.md) - 视觉设计规范
- [交互设计](./docs/3. 技术规范/interaction_design.md) - 用户交互模式

### 开发指南
- [开发规范](./docs/4. 开发指南/development_guidelines.md) - 编码规范与实践
- [测试策略](./docs/4. 开发指南/testing_strategy.md) - 测试方法和工具
- [部署计划](./docs/4. 开发指南/deployment_plan.md) - 部署流程和环境
- [发布说明](./docs/4. 开发指南/release_notes.md) - 版本发布流程和初始发布说明
- [文档自动更新指南](./docs/4. 开发指南/document_update_guide.md) - 如何使用文档自动更新工具

### 总览
- [文档指南](./docs/5. 补充文档/project_documentation_guide.md) - 文档结构总览

## 开发路线图

- [x] 项目文档框架
- [ ] 基础UI组件库
- [ ] 核心代理定义和配置
- [ ] 代理协作引擎
- [ ] 用户交互界面
- [ ] 初始版本发布

## 贡献指南

尽管这是一个为单人开发而设计的项目，我们也欢迎贡献和反馈：

1. Fork该仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

## 许可

该项目采用MIT许可证 - 详见[LICENSE](LICENSE)文件

## 致谢

- [AutoGen](https://github.com/microsoft/autogen) - 多智能体框架
- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Prisma](https://www.prisma.io/) - 数据库ORM

---

📝 **注意**: 该项目目前处于开发阶段，功能可能会发生变化。

## 开发文档

### 开发指南
- [部署计划](./docs/4.%20开发指南/deployment_plan.md) - 部署流程和环境配置
- [发布说明](./docs/4.%20开发指南/release_notes.md) - 版本发布流程和初始发布说明
- [文档自动更新指南](./docs/4.%20开发指南/document_update_guide.md) - 如何使用文档自动更新工具

## 开发工具

- [文档自动更新工具](./scripts/update-docs.js) - 代码变更时自动更新开发进度表和技术文档
- [Git钩子安装脚本](./scripts/install-hooks.js) - 安装Git钩子以启用自动文档更新

要安装文档自动更新工具，请运行：

```bash
npm run install-hooks
```

更多详情请参阅[文档自动更新指南](./docs/4.%20开发指南/document_update_guide.md)。 