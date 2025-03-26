# 智能代理协作系统快速入门指南

*iT-Agent 快速入门与开发步骤指南*

## 1. 系统概述

iT-Agent 是一个基于多智能代理协作的软件开发团队模拟系统，通过整合多个专业化的AI代理（如产品经理、架构师、前后端开发等）实现从需求分析到功能实现的全流程自动化。系统采用Next.js 14构建前端，结合AutoGen和MCP Agent提供强大的多代理协作能力，使用靛青宇宙主题提供沉浸式体验。

## 2. 环境准备

### 2.1 基本要求

开发和运行iT-Agent需要以下环境：

- **Node.js**: v18.0.0或更高版本
- **Python**: v3.10或更高版本
- **PostgreSQL**: v14或更高版本
- **Git**: 版本控制
- **npm**或**yarn**: 包管理工具

### 2.2 依赖安装

#### 2.2.1 前端依赖

```bash
# 克隆项目
git clone https://github.com/your-username/iT-Agent.git
cd iT-Agent

# 安装依赖
npm install
# 或使用yarn
yarn install
```

#### 2.2.2 Python环境

```bash
# 创建虚拟环境(推荐)
python -m venv venv
# 在Mac上激活
source venv/bin/activate
# 在Windows上激活
# venv\Scripts\activate

# 安装Python依赖
pip install -r requirements.txt
```

主要Python依赖包括：
- AutoGen
- MCP Agent
- LangChain
- Sentence Transformers
- FastAPI

### 2.3 环境配置

创建`.env.local`文件，配置必要的环境变量：

```
# 数据库连接
DATABASE_URL="postgresql://username:password@localhost:5432/it_agent_db"

# OpenAI API配置
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_MODEL=gpt-4

# 认证配置
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 3. 本地开发

### 3.1 启动开发服务器

```bash
# 启动Next.js开发服务器
npm run dev
# 或
yarn dev

# 在另一个终端中启动MCP服务
cd backend
python mcp_server.py
```

开发服务器将在以下地址运行：
- 前端: [http://localhost:3000](http://localhost:3000)
- MCP服务: [http://localhost:8000](http://localhost:8000)

### 3.2 数据库设置

```bash
# 初始化数据库(创建表结构)
npx prisma migrate dev --name init

# 生成Prisma客户端
npx prisma generate

# (可选)填充示例数据
npm run seed
```

## 4. 项目结构

### 4.1 主要目录

```
iT-Agent/
├── app/                  # Next.js应用目录(App Router)
│   ├── page.tsx          # 首页
│   ├── dashboard/        # 仪表盘页面
│   ├── session/          # 会话页面
│   ├── agents/           # 代理管理页面
│   └── api/              # API路由
├── components/           # 前端组件
│   ├── ui/               # UI基础组件(shadcn/ui)
│   ├── agents/           # 代理相关组件
│   ├── session/          # 会话相关组件
│   └── layouts/          # 布局组件
├── lib/                  # 工具函数和共用库
│   ├── db.ts             # 数据库连接客户端
│   ├── auth.ts           # 认证相关函数
│   └── utils/            # 通用工具函数
├── prisma/               # Prisma ORM配置
│   ├── schema.prisma     # 数据模型定义
│   └── migrations/       # 数据库迁移文件
├── public/               # 静态资源
├── styles/               # 全局样式
├── backend/              # 后端Python代码
│   ├── agents/           # 代理定义
│   ├── mcp_server.py     # MCP服务器
│   └── tools/            # 工具定义
├── config/               # 配置文件
├── docs/                 # 项目文档
├── scripts/              # 辅助脚本
└── [配置文件]            # 各类配置文件
```

### 4.2 关键文件

- `app/layout.tsx`: 全局布局文件
- `app/api/trpc/[trpc]/route.ts`: tRPC路由处理
- `prisma/schema.prisma`: 数据库模型定义
- `lib/store.ts`: Zustand状态管理
- `backend/agents/team.py`: 代理团队定义
- `config/mcp_config.yaml`: MCP工具配置

## 5. 系统关键功能

### 5.1 创建代理会话

1. 访问首页 [http://localhost:3000](http://localhost:3000)
2. 登录系统(首次使用可以创建账号)
3. 点击"创建新会话"按钮
4. 选择需要的代理角色(建议至少包含产品经理、架构师和开发者)
5. 输入会话名称和描述
6. 点击"开始会话"

### 5.2 与代理团队协作

1. 在会话界面，输入您的需求描述
2. 系统将自动启动代理协作流程
3. 您可以观察代理之间的对话和工具调用
4. 根据需要，您可以插入反馈或修改建议
5. 代理团队完成任务后，将展示最终结果

### 5.3 自定义代理

1. 访问"代理管理"页面
2. 点击"创建新代理"按钮
3. 设置代理名称、角色和描述
4. 编写系统提示(System Prompt)
5. 选择代理可用的工具集
6. 点击"保存"完成创建

### 5.4 查看历史会话

1. 访问"仪表盘"页面
2. 在"历史会话"部分可以看到所有会话
3. 点击任意会话查看详细对话内容
4. 您也可以继续之前的会话，或基于历史会话创建新会话

## 6. 开发指南

### 6.1 添加新页面

在Next.js App Router中添加新页面:

```tsx
// app/new-page/page.tsx
import React from 'react';

export default function NewPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-indigo-600">新页面</h1>
      <p>页面内容...</p>
    </div>
  )
}
```

### 6.2 创建新组件

创建符合靛青宇宙主题的新组件:

```tsx
// components/ui/CustomCard.tsx
import React from 'react';

interface CustomCardProps {
  title: string;
  children: React.ReactNode;
}

export const CustomCard: React.FC<CustomCardProps> = ({ title, children }) => {
  return (
    <div className="rounded-lg border border-indigo-200 bg-gradient-to-b from-indigo-50 to-slate-50 p-4 shadow-md dark:border-indigo-800 dark:from-indigo-950 dark:to-slate-950">
      <h3 className="mb-3 text-lg font-semibold text-indigo-700 dark:text-indigo-300">{title}</h3>
      <div>{children}</div>
    </div>
  );
};
```

### 6.3 添加新API端点

创建新的API端点:

```ts
// app/api/custom-endpoint/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  // 获取会话，验证用户身份
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: '未授权访问' },
      { status: 401 }
    );
  }
  
  try {
    // 执行数据库操作
    const data = await db.someModel.findMany({
      where: { userId: session.user.id },
    });
    
    // 返回结果
    return NextResponse.json({ data });
  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
}
```

### 6.4 定义新代理

在Python代码中添加新代理:

```python
# backend/agents/custom_agent.py
from autogen import ConversableAgent

def create_custom_agent(llm_config):
    """创建自定义代理"""
    custom_agent = ConversableAgent(
        name="Custom_Agent",
        system_message="""你是一个专门的自定义代理，负责...
        你的主要职责包括:
        1. ...
        2. ...
        3. ...
        
        请始终保持专业、准确，并与团队其他成员良好协作。
        """,
        llm_config=llm_config,
        human_input_mode="NEVER",
    )
    
    return custom_agent
```

### 6.5 添加新工具

通过MCP Agent添加新工具:

```yaml
# config/custom_tools.yaml
tools:
  - name: "custom_tool"
    description: "自定义工具描述"
    server: "custom_server"
    parameters:
      param1: "参数1描述"
      param2: "参数2描述"
```

对应的Python实现:

```python
# backend/tools/custom_tool.py
async def custom_tool(context, params):
    """自定义工具实现"""
    param1 = params.get("param1")
    param2 = params.get("param2")
    
    # 工具逻辑实现
    result = do_something(param1, param2)
    
    return {
        "status": "success",
        "result": result
    }
```

## 7. 常见问题解决

### 7.1 数据库连接问题

**问题**: 应用无法连接到数据库

**解决方案**:
1. 确认PostgreSQL服务正在运行
2. 验证`.env.local`中的`DATABASE_URL`格式正确
3. 确保数据库用户有足够权限
4. 尝试手动连接数据库测试凭据: `psql -U username -d it_agent_db`

### 7.2 API密钥问题

**问题**: 收到OpenAI API密钥无效的错误

**解决方案**:
1. 检查`.env.local`中的`OPENAI_API_KEY`是否正确
2. 确认API密钥有足够的额度
3. 尝试在[OpenAI平台](https://platform.openai.com)上测试密钥
4. 如果使用代理，确保环境变量`HTTPS_PROXY`已正确设置

### 7.3 Python依赖问题

**问题**: 安装Python依赖时出错

**解决方案**:
1. 确保使用Python 3.10或更高版本: `python --version`
2. 尝试升级pip: `pip install --upgrade pip`
3. 如果特定包安装失败，尝试单独安装: `pip install problematic-package`
4. 对于依赖编译的包，确保系统有必要的编译工具

### 7.4 前端构建问题

**问题**: Next.js应用构建失败

**解决方案**:
1. 确保Node.js版本兼容(v18+): `node --version`
2. 清除缓存并重新安装依赖:
   ```bash
   rm -rf node_modules .next
   npm install
   ```
3. 检查控制台错误信息，解决特定模块问题
4. 确保所有环境变量都已正确设置

## 8. 部署指南

### 8.1 Vercel部署

部署前端到Vercel:

1. 创建[Vercel账号](https://vercel.com)
2. 从GitHub导入项目
3. 配置环境变量(与`.env.local`相同)
4. 点击部署

### 8.2 Railway部署

部署MCP服务到Railway:

1. 创建[Railway账号](https://railway.app)
2. 从GitHub导入后端代码
3. 配置环境变量
4. 设置启动命令: `python mcp_server.py`

### 8.3 Neon数据库设置

使用Neon托管PostgreSQL:

1. 创建[Neon账号](https://neon.tech)
2. 创建新项目和数据库
3. 获取连接字符串
4. 在前端项目的环境变量中更新`DATABASE_URL`
5. 运行数据库迁移: `npx prisma migrate deploy`

## 9. 下一步学习

继续深入了解iT-Agent系统的更多功能:

1. 阅读[系统架构文档](../2.%20系统设计/system_architecture.md)了解详细设计
2. 查看[代理配置指南](../2.%20系统设计/agent_configuration.md)学习代理定制
3. 参考[UI设计系统](../3.%20技术规范/ui_design_system.md)实现一致的用户界面
4. 阅读[MCP集成方案](../3.%20技术规范/mcp_integration.md)深入了解工具集成
5. 查看[技术栈文档](../3.%20技术规范/tech_stack.md)了解更多技术细节 