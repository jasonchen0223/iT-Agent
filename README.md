# 智能代理协作系统 (iT-Agent)

基于AutoGen构建的多智能代理协作系统，专为复杂问题解决和创意工作流设计。

![项目状态](https://img.shields.io/badge/状态-开发中-yellow)
![版本](https://img.shields.io/badge/版本-0.1.0_预览版-blue)
![许可](https://img.shields.io/badge/许可-MIT-green)

## 项目概述

iT-Agent是一个专为单人开发者设计的智能代理协作平台，基于AutoGen构建的增强型多代理协作开发系统，实现了动态工作流、专家协作、反思学习和上下文管理等高级功能。系统以靛青(Indigo)为基础配色的宇宙星空主题设计，创造沉浸式的协作体验。


### 核心特性

🤖 **多代理协作** - 模拟完整软件开发团队的专业代理协同工作
🔄 **自适应工作流** - 根据任务类型自动调整协作模式
💬 **自然语言交互** - 无缝的人机交互体验
🛠️ **可定制代理与工具** - 根据特定需求自定义代理角色和工具集
🤯 **反思与学习**：代理能对自身输出进行反思并持续学习提升，不断优化开发成果
📊 **可视化协作过程** - 直观展示代理间互动和贡献
🌐 **MCP工具集成** - 基于Model Context Protocol的强大工具扩展

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
   
   # 后端和代理依赖
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

## 技术亮点

### 代理系统

iT-Agent采用AutoGen框架和MCP Agent工具集构建多代理协作系统，模拟完整的软件开发团队：

- **混合集成架构** - 核心功能自主开发，辅助功能选择性集成，平衡系统一致性与开发效率
- **产品经理代理** - 需求分析和功能规划
- **架构师代理** - 系统设计和技术选型
- **前端开发代理** - UI实现和交互逻辑
- **后端开发代理** - API和业务逻辑实现
- **测试工程师代理** - 质量保障和测试设计
- **DevOps代理** - 部署和运维自动化
- **文档工程师代理** - 技术文档和使用指南

每个代理配备特定的工具集，通过MCP Agent扩展其能力范围，如终端操作、代码分析、文档生成等。系统采用统一抽象层设计，降低外部工具耦合度，确保可维护性。

### 用户界面

系统采用基于shadcn/ui的靛青(Indigo)主题作为宇宙星空设计的基础：

- **靛青主题** - 美观现代的色彩系统，支持亮暗模式
- **沉浸式体验** - 宇宙星空设计元素增强用户体验
- **响应式设计** - 完美适配桌面和移动设备
- **高性能组件** - 基于Radix UI的无样式组件系统
- **无障碍设计** - 符合WCAG标准的交互体验

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
│   │   ├── product-manager/  # 产品经理代理
│   │   ├── architect/        # 架构师代理
│   │   ├── developer/        # 开发者代理
│   │   ├── tester/           # 测试工程师代理
│   │   ├── devops/           # DevOps代理
│   │   └── doc-writer/       # 文档工程师代理
│   ├── mcp/             # MCP Agent服务
│   │   ├── tools/            # 工具定义
│   │   ├── servers/          # MCP服务器
│   │   └── bridge/           # Node-Python桥接
│   └── styles/          # 全局样式
├── prisma/              # 数据库架构和迁移
├── tests/               # 测试文件
└── scripts/             # 实用脚本
```

## 文档导航

项目包含全面的文档，便于单人开发者理解和扩展系统：

### 项目规划
- [项目概述](./docs/1. 项目规划/project_overview.md)
- [开发路线图](./docs/1. 项目规划/roadmap.md)
- [需求分析](./docs/1. 项目规划/requirements.md)

### 系统设计
- [系统架构](./docs/2. 系统设计/system_architecture.md)
- [数据模型](./docs/2. 系统设计/data_models.md)
- [代理配置](./docs/2. 系统设计/agent_configuration.md)

### 技术规范
- [技术栈](./docs/3. 技术规范/tech_stack.md)
- [UI设计系统](./docs/3. 技术规范/ui_design_system.md)
- [API设计](./docs/3. 技术规范/api_design.md)
- [MCP集成方案](./docs/3. 技术规范/mcp_integration.md)

### 开发指南
- [环境设置](./docs/4. 开发指南/environment_setup.md)
- [代码规范](./docs/4. 开发指南/coding_standards.md)
- [测试策略](./docs/4. 开发指南/testing_strategy.md)

### 补充文档
- [混合集成策略](./docs/5. 补充文档/hybrid_integration_strategy.md)
- [性能优化](./docs/5. 补充文档/performance_optimization.md)
- [常见问题](./docs/5. 补充文档/faq.md)

## 开发路线图

- [x] 项目文档框架
- [ ] 基础UI组件库（基于shadcn/ui的靛青主题）
- [ ] MCP Agent工具集成
- [ ] AutoGen多代理系统实现
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
- [MCP Agent](https://github.com/lastmile-ai/mcp-agent) - Model Context Protocol实现
- [Next.js](https://nextjs.org/) - React框架
- [shadcn/ui](https://ui.shadcn.com/) - 无样式组件系统
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