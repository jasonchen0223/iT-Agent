# MCP Agent 集成方案

*智能代理协作系统 MCP 工具集成技术文档*

## 1. MCP Agent 概述

MCP (Model Context Protocol) Agent 是一个简单、可组合的框架，用于构建基于模型上下文协议的智能代理。它处理 MCP 服务器连接的生命周期管理，并实现了构建高效生产级代理所需的设计模式。在 iT-Agent 系统中，MCP Agent 作为核心工具集成层，为各专业代理提供扩展能力。

### 1.1 核心功能

- **服务器管理**: 自动管理 MCP 服务器的连接、启动和关闭
- **工具调用**: 标准化的工具调用接口，支持代理使用外部工具
- **工作流定义**: 支持复杂的代理工作流，包括顺序、并行、条件工作流
- **人机交互**: 支持代理在工作流中请求人类输入
- **状态管理**: 维护代理工作流状态，支持暂停和恢复
- **可扩展性**: 灵活的架构允许添加新的服务器和工具

## 2. 架构设计

### 2.1 总体架构

```
┌───────────────────────────────────────────────────────────────┐
│                    iT-Agent前端 (Next.js)                      │
└───────────────────────────────┬───────────────────────────────┘
                               │
┌───────────────────────────────▼───────────────────────────────┐
│                         后端API层                              │
└───────────────────────────────┬───────────────────────────────┘
                               │
┌───────────────────────────────▼───────────────────────────────┐
│                    AutoGen 多代理协作系统                        │
└───────────────────────────────┬───────────────────────────────┘
                               │
┌───────────────────────────────▼───────────────────────────────┐
│                    MCP Agent中间层 (Python)                     │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐     │
│  │  代理定义      │ │  工作流管理     │ │  状态管理       │     │
│  └────────┬───────┘ └──────┬─────────┘ └─────────┬──────┘     │
│           │                │                     │            │
│  ┌────────▼───────────────▼─────────────────────▼──────┐     │
│  │                MCP服务聚合器                         │     │
│  └────────┬───────────────┬────────────────────┬───────┘     │
└───────────┼───────────────┼────────────────────┼─────────────┘
            │               │                    │
┌───────────▼───────┐ ┌─────▼────────┐ ┌────────▼────────────┐
│  终端命令MCP服务   │ │ 文件系统MCP服务│ │  网络请求MCP服务    │
└───────────────────┘ └──────────────┘ └─────────────────────┘
```

### 2.2 组件说明

1. **MCP服务聚合器**: 将多个MCP服务器聚合为单一接口，简化代理工具调用
2. **代理定义**: 使用MCP Agent API定义各专业领域的代理
3. **工作流管理**: 处理代理工作流程的执行、协调和通信
4. **状态管理**: 管理代理执行状态，支持持久化和恢复
5. **MCP服务**: 各种专用工具服务，如终端命令、文件系统操作、网络请求等

### 2.3 在混合集成架构中的定位

在iT-Agent系统采用的混合集成架构中，MCP Agent承担以下角色：

1. **核心工具扩展**: 作为AutoGen框架的主要工具扩展机制，通过标准化接口提供工具调用能力
2. **优先集成组件**: 在选择性集成策略中，MCP Agent作为首选集成工具，负责处理常用的终端、文件系统等操作
3. **集成桥接层**: 在核心系统与各类专业工具之间提供统一的桥接服务
4. **可插拔设计**: 符合系统统一抽象层设计，通过标准接口集成，保持低耦合度

MCP Agent的集成符合以下混合架构原则：

- **轻量级接入**: 仅引入必要服务，避免依赖膨胀
- **标准化接口**: 提供统一API，简化调用流程
- **可选功能**: 支持按需加载不同工具服务
- **独立部署**: 服务可独立运行，减少对主系统影响

更多关于iT-Agent混合集成策略的详细信息，请参考[混合集成策略文档](../5.%20补充文档/hybrid_integration_strategy.md)。

## 3. 集成实现

### 3.1 环境配置

#### 3.1.1 安装依赖

```bash
# 安装MCP Agent核心库
pip install mcp-agent

# 安装MCP服务器依赖
pip install uvx mcp-server-fetch mcp-server-filesystem mcp-server-terminal
```

#### 3.1.2 配置文件

在项目根目录创建`mcp_agent.config.yaml`配置文件:

```yaml
mcp:
  servers:
    # 文件系统操作服务
    filesystem:
      command: "uvx"
      args: ["mcp-server-filesystem"]
      description: "文件系统操作，如读写文件、列出目录等"
    
    # 终端命令执行服务
    terminal:
      command: "uvx"
      args: ["mcp-server-terminal"]
      description: "终端命令执行，支持各种Shell命令"
    
    # 网络请求服务
    fetch:
      command: "uvx"
      args: ["mcp-server-fetch"]
      description: "获取网络内容，支持HTTP请求"
    
    # 代码分析服务
    code-analysis:
      command: "uvx"
      args: ["mcp-server-code-analysis"]
      description: "代码分析工具，如代码审查、结构分析等"
```

### 3.2 服务器管理

#### 3.2.1 服务器初始化

```python
from mcp_agent.mcp.gen_client import gen_client
from mcp_agent.mcp.mcp_aggregator import MCPAggregator

# 使用上下文管理器初始化单个服务器
async def use_filesystem_server():
    async with gen_client("filesystem") as fs_client:
        # 使用文件系统服务
        tools = await fs_client.list_tools()
        print(f"可用工具: {tools}")

# 聚合多个服务器
async def initialize_servers():
    server_names = ["filesystem", "terminal", "fetch", "code-analysis"]
    aggregator = await MCPAggregator.create(server_names=server_names)
    
    async with aggregator:
        # 获取所有服务器提供的工具
        all_tools = await aggregator.list_tools()
        return aggregator
```

### 3.3 代理定义

#### 3.3.1 基础代理模板

```python
from mcp_agent.workflow.agent import Agent
from mcp_agent.human_input.handler import console_input_callback

# 创建开发工程师代理
developer_agent = Agent(
    name="开发工程师",
    instruction="""你是一位专业的软件开发工程师，擅长编写高质量代码。
    你的主要职责包括:
    1. 根据需求实现功能
    2. 编写清晰、模块化的代码
    3. 进行代码审查和重构
    4. 修复发现的缺陷
    5. 与团队成员协作完成开发任务
    """,
    server_names=["filesystem", "terminal", "code-analysis"],
    human_input_callback=console_input_callback
)
```

#### 3.3.2 专业工具集配置

为每种代理角色配置特定的工具集:

```python
# 产品经理代理工具集
product_manager_tools = [
    {
        "name": "create_user_story",
        "description": "创建用户故事",
        "parameters": {...}
    },
    {
        "name": "prioritize_features",
        "description": "功能优先级排序",
        "parameters": {...}
    }
]

# 架构师代理工具集
architect_tools = [
    {
        "name": "design_system_architecture",
        "description": "设计系统架构",
        "parameters": {...}
    },
    {
        "name": "technology_evaluation",
        "description": "技术评估",
        "parameters": {...}
    }
]

# 为每个代理注册工具
async def register_agent_tools(agent, tools):
    for tool in tools:
        await agent.register_tool(tool)
```

### 3.4 工作流定义

#### 3.4.1 顺序工作流

```python
from mcp_agent.workflow.sequential import SequentialWorkflow

# 定义软件开发顺序工作流
development_workflow = SequentialWorkflow(
    name="软件功能开发流程",
    steps=[
        # 1. 需求分析
        {
            "agent": product_manager_agent,
            "task": "分析用户需求并创建用户故事",
            "output_key": "user_story"
        },
        # 2. 架构设计
        {
            "agent": architect_agent,
            "task": "根据用户故事设计系统架构",
            "input_keys": ["user_story"],
            "output_key": "architecture"
        },
        # 3. 代码实现
        {
            "agent": developer_agent,
            "task": "实现设计的功能",
            "input_keys": ["user_story", "architecture"],
            "output_key": "implementation"
        },
        # 4. 测试验证
        {
            "agent": tester_agent,
            "task": "测试实现的功能",
            "input_keys": ["implementation", "user_story"],
            "output_key": "test_results"
        }
    ]
)
```

#### 3.4.2 并行工作流

```python
from mcp_agent.workflow.parallel import ParallelWorkflow

# 定义并行开发工作流
parallel_development = ParallelWorkflow(
    name="并行开发任务",
    steps=[
        # 前端开发
        {
            "agent": frontend_developer_agent,
            "task": "实现用户界面",
            "input_keys": ["design_spec"],
            "output_key": "frontend_implementation"
        },
        # 后端开发
        {
            "agent": backend_developer_agent,
            "task": "实现API和业务逻辑",
            "input_keys": ["api_spec"],
            "output_key": "backend_implementation"
        },
        # 文档编写
        {
            "agent": documentation_agent,
            "task": "编写技术文档",
            "input_keys": ["architecture"],
            "output_key": "documentation"
        }
    ]
)
```

### 3.5 人机交互集成

```python
# 自定义Web界面输入回调
async def web_input_callback(prompt, context=None):
    # 在Web界面显示提示并获取用户输入
    # 这里通过WebSocket将提示发送给前端
    socket_id = context.get("socket_id")
    await websocket_manager.send_message(
        socket_id, 
        {"type": "human_input_request", "prompt": prompt}
    )
    
    # 等待用户响应
    response = await websocket_manager.wait_for_response(socket_id)
    return response["data"]

# 创建支持Web交互的代理
interactive_agent = Agent(
    name="交互式架构师",
    instruction="你是交互式架构师，在设计过程中会寻求用户反馈...",
    server_names=["filesystem", "code-analysis"],
    human_input_callback=web_input_callback
)
```

## 4. 工具集成案例

### 4.1 终端命令工具

```python
# 执行终端命令的示例
async def run_terminal_command(agent, command):
    result = await agent.run_tool(
        server_name="terminal",
        tool_name="run_command",
        tool_params={"command": command}
    )
    return result

# 使用案例
async def install_dependencies(agent):
    await run_terminal_command(agent, "npm install")
    await run_terminal_command(agent, "pip install -r requirements.txt")
```

### 4.2 代码分析工具

```python
# 代码分析工具使用示例
async def analyze_code(agent, file_path):
    result = await agent.run_tool(
        server_name="code-analysis",
        tool_name="analyze_code",
        tool_params={"file_path": file_path}
    )
    return result

# 使用案例
async def review_code(agent, changed_files):
    reviews = []
    for file in changed_files:
        analysis = await analyze_code(agent, file)
        reviews.append({
            "file": file,
            "analysis": analysis
        })
    return reviews
```

### 4.3 文件操作工具

```python
# 文件操作工具使用示例
async def read_file(agent, file_path):
    result = await agent.run_tool(
        server_name="filesystem",
        tool_name="read_file",
        tool_params={"path": file_path}
    )
    return result["content"]

async def write_file(agent, file_path, content):
    result = await agent.run_tool(
        server_name="filesystem",
        tool_name="write_file",
        tool_params={"path": file_path, "content": content}
    )
    return result
```

## 5. 前后端集成

### 5.1 Python与Node.js集成

使用WebSocket建立JavaScript前端与Python后端MCP Agent的通信:

```typescript
// src/lib/mcp-bridge.ts
import { Server as SocketServer } from 'socket.io';
import { spawn } from 'child_process';

export class MCPBridge {
    private socketServer: SocketServer;
    private pythonProcess: any;
    
    constructor(server: any) {
        this.socketServer = new SocketServer(server);
        this.initSocketServer();
        this.startPythonProcess();
    }
    
    private initSocketServer() {
        this.socketServer.on('connection', (socket) => {
            console.log('客户端连接:', socket.id);
            
            // 接收前端指令
            socket.on('start_workflow', async (data) => {
                // 向Python进程发送工作流启动指令
                this.pythonProcess.stdin.write(
                    JSON.stringify({
                        action: 'start_workflow',
                        workflow_name: data.workflowName,
                        parameters: data.parameters,
                        socket_id: socket.id
                    }) + '\n'
                );
            });
            
            // 处理人机交互响应
            socket.on('human_input_response', (data) => {
                this.pythonProcess.stdin.write(
                    JSON.stringify({
                        action: 'human_input_response',
                        response: data.response,
                        request_id: data.requestId
                    }) + '\n'
                );
            });
        });
    }
    
    private startPythonProcess() {
        // 启动Python MCP Agent进程
        this.pythonProcess = spawn('python', ['src/mcp/server.py']);
        
        // 处理Python进程输出
        this.pythonProcess.stdout.on('data', (data) => {
            try {
                const message = JSON.parse(data.toString());
                
                // 根据消息类型处理
                if (message.type === 'agent_message') {
                    // 代理消息转发到前端
                    this.socketServer.to(message.socket_id).emit(
                        'agent_message', 
                        message.data
                    );
                } else if (message.type === 'workflow_status') {
                    // 工作流状态更新
                    this.socketServer.to(message.socket_id).emit(
                        'workflow_status',
                        message.data
                    );
                }
            } catch (error) {
                console.error('解析Python消息失败:', error);
            }
        });
    }
}
```

### 5.2 Python服务器实现

```python
# src/mcp/server.py
import asyncio
import json
import sys
from mcp_agent.workflow.agent import Agent
from mcp_agent.workflow.sequential import SequentialWorkflow

# 全局状态
workflows = {}
human_input_requests = {}

# 处理输入消息
async def process_input():
    for line in sys.stdin:
        try:
            message = json.loads(line.strip())
            
            if message["action"] == "start_workflow":
                # 启动工作流
                workflow_name = message["workflow_name"]
                parameters = message["parameters"]
                socket_id = message["socket_id"]
                
                # 启动工作流处理
                asyncio.create_task(
                    run_workflow(workflow_name, parameters, socket_id)
                )
            
            elif message["action"] == "human_input_response":
                # 处理人机交互响应
                request_id = message["request_id"]
                response = message["response"]
                
                if request_id in human_input_requests:
                    future = human_input_requests[request_id]
                    future.set_result(response)
                    del human_input_requests[request_id]
        
        except json.JSONDecodeError:
            print(json.dumps({
                "type": "error",
                "error": "Invalid JSON input"
            }))
        except Exception as e:
            print(json.dumps({
                "type": "error", 
                "error": str(e)
            }))

# Web界面人机交互回调
async def web_input_callback(prompt, context=None):
    socket_id = context.get("socket_id")
    request_id = str(uuid.uuid4())
    
    # 创建Future对象用于等待响应
    future = asyncio.Future()
    human_input_requests[request_id] = future
    
    # 向前端发送请求
    print(json.dumps({
        "type": "human_input_request",
        "socket_id": socket_id,
        "request_id": request_id,
        "prompt": prompt
    }))
    
    # 等待用户响应
    response = await future
    return response

# 运行工作流
async def run_workflow(workflow_name, parameters, socket_id):
    try:
        # 获取预定义的工作流
        workflow = get_workflow_by_name(workflow_name)
        context = {"socket_id": socket_id, **parameters}
        
        # 更新状态
        print(json.dumps({
            "type": "workflow_status",
            "socket_id": socket_id,
            "data": {
                "status": "started",
                "workflow": workflow_name
            }
        }))
        
        # 运行工作流
        result = await workflow.run(context=context)
        
        # 完成通知
        print(json.dumps({
            "type": "workflow_status",
            "socket_id": socket_id,
            "data": {
                "status": "completed",
                "workflow": workflow_name,
                "result": result
            }
        }))
    
    except Exception as e:
        # 错误处理
        print(json.dumps({
            "type": "workflow_status",
            "socket_id": socket_id,
            "data": {
                "status": "error",
                "workflow": workflow_name,
                "error": str(e)
            }
        }))

# 主函数
async def main():
    # 初始化工作流和代理
    await initialize_agents_and_workflows()
    
    # 处理输入
    await process_input()

if __name__ == "__main__":
    asyncio.run(main())
```

## 6. 最佳实践

### 6.1 代理设计原则

1. **单一职责**: 每个代理应专注于特定专业领域
2. **清晰指令**: 提供详细、具体的代理行为指导
3. **工具选择**: 为代理配置与其职责相符的工具集
4. **容错设计**: 实现错误处理和重试机制
5. **可理解输出**: 确保代理输出易于人类理解
6. **适当交互**: 在关键决策点设计人机交互

### 6.2 性能优化

1. **按需启动**: 仅在需要时启动MCP服务器
2. **资源管理**: 及时关闭不再使用的服务器
3. **批量处理**: 尽可能批量处理请求减少往返延迟
4. **缓存结果**: 缓存常用工具调用结果
5. **超时控制**: 设置合理的工具调用超时

### 6.3 安全考虑

1. **权限限制**: 限制代理可执行的命令范围
2. **输入验证**: 验证所有用户输入
3. **敏感信息**: 避免在代理交互中暴露敏感信息
4. **安全沙箱**: 在隔离环境中执行不可信命令
5. **审计日志**: 记录所有代理活动和工具调用

## 7. 未来扩展

### 7.1 计划扩展

1. **更多MCP服务**: 添加数据库操作、云服务管理等服务
2. **工作流持久化**: 支持长时间运行工作流的暂停和恢复
3. **多模型集成**: 支持不同LLM提供商和模型
4. **知识库集成**: 结合向量数据库实现代理知识扩展
5. **可视化工具**: 工作流设计和监控界面

### 7.2 贡献指南

如需为MCP Agent工具集成提交改进或报告问题，请按以下步骤:

1. 创建问题详细描述建议或问题
2. Fork仓库并创建功能分支
3. 实现更改并添加测试
4. 提交Pull Request详细说明更改
5. 等待代码审查和合并 