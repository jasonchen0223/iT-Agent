# 智能代理协作系统测试策略

*基于AutoGen的多智能代理协作系统测试方法与最佳实践*

## 1. 测试策略概述

作为单人开发项目，测试策略需要平衡测试覆盖度和开发效率。本文档详细说明智能代理协作系统的测试方法，确保系统功能正确性、可靠性和性能。

### 1.1 测试原则

1. **关键路径优先**: 聚焦于核心功能和用户流程
2. **自动化为主**: 尽可能自动化重复测试任务
3. **测试金字塔**: 单元测试多于集成测试多于端到端测试
4. **持续测试**: 开发过程中持续执行测试
5. **测试驱动修复**: 每个bug先写测试再修复

### 1.2 测试范围

| 测试类型 | 覆盖目标 | 工具 | 频率 |
|---------|---------|------|------|
| 单元测试 | 函数、组件、钩子 | Jest, React Testing Library | 每次提交 |
| 集成测试 | 模块交互、API流程 | Jest, SuperTest | 每日/PR |
| E2E测试 | 关键用户流程 | Playwright | 每周/发布前 |
| 性能测试 | 响应时间、资源使用 | Lighthouse, custom metrics | 里程碑 |
| 安全测试 | 常见漏洞、权限控制 | OWASP ZAP, npm audit | 月度 |

## 2. 单元测试策略

### 2.1 前端单元测试

#### 测试目标

- 独立UI组件
- 自定义钩子
- 业务逻辑函数
- 状态管理
- 工具函数

#### 测试框架与工具

- **Jest**: 测试运行器和断言库
- **React Testing Library**: 组件测试
- **Mock Service Worker**: API模拟
- **jest-dom**: DOM断言

#### 代码示例

```jsx
// 按钮组件测试
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButton from './ActionButton';

describe('ActionButton', () => {
  test('renders correctly with default props', () => {
    render(<ActionButton>Click me</ActionButton>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<ActionButton onClick={handleClick}>Click me</ActionButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders in disabled state', () => {
    render(<ActionButton disabled>Click me</ActionButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

// 自定义钩子测试
import { renderHook, act } from '@testing-library/react-hooks';
import useAgentState from './useAgentState';

describe('useAgentState', () => {
  test('initializes with default state', () => {
    const { result } = renderHook(() => useAgentState());
    expect(result.current.agents).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  test('adds an agent correctly', () => {
    const { result } = renderHook(() => useAgentState());
    act(() => {
      result.current.addAgent({ id: '1', name: 'Developer' });
    });
    expect(result.current.agents).toHaveLength(1);
    expect(result.current.agents[0].name).toBe('Developer');
  });
});
```

### 2.2 后端单元测试

#### 测试目标

- API处理函数
- 数据库操作
- 工具和辅助函数
- 权限和验证逻辑

#### 测试技术

- 依赖注入模式
- 数据库模拟
- 测试数据生成器
- 自定义断言

#### 代码示例

```javascript
// API处理函数测试
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/projects';
import { PrismaClient } from '@prisma/client';

// 模拟Prisma客户端
jest.mock('@prisma/client');
PrismaClient.mockImplementation(() => ({
  project: {
    findMany: jest.fn().mockResolvedValue([
      { id: '1', name: 'Test Project', createdAt: new Date() }
    ]),
  },
}));

describe('Projects API', () => {
  test('GET returns list of projects', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      session: { user: { id: 'user1' } },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: '1', name: 'Test Project' })
    ]));
  });
});
```

### 2.3 代理系统单元测试

#### 测试目标

- 代理类和工厂函数
- 消息处理和格式化
- 工具集成和使用
- 上下文管理

#### 测试技术

- 固定输入/输出测试
- 行为模拟
- 状态转换验证

#### 代码示例

```python
# Python代理测试
import pytest
from unittest.mock import patch, MagicMock
from agents.developer_agent import DeveloperAgent

def test_developer_agent_initialization():
    agent = DeveloperAgent(name="test_agent")
    assert agent.name == "test_agent"
    assert agent.role == "developer"
    assert agent.skills == ["coding", "debugging", "refactoring"]

@patch('agents.developer_agent.OpenAI')
def test_agent_generates_response(mock_openai):
    # 设置模拟响应
    mock_completion = MagicMock()
    mock_completion.choices[0].message.content = "function createUser() { ... }"
    mock_openai.return_value.chat.completions.create.return_value = mock_completion
    
    agent = DeveloperAgent()
    response = agent.generate_code("Create a user creation function")
    
    # 验证调用和响应
    assert "function createUser()" in response
    mock_openai.return_value.chat.completions.create.assert_called_once()
```

## 3. 集成测试策略

### 3.1 API集成测试

#### 测试目标

- API端点链
- 数据流和转换
- 错误处理和恢复
- 认证和权限流程

#### 测试设置

- 隔离测试数据库
- 请求链模拟
- JWT和会话测试

#### 代码示例

```javascript
// API集成测试
import { createServer } from 'http';
import { apiResolver } from 'next/dist/server/api-utils';
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/collaborations/[id]/messages';
import prisma from '@/lib/prisma';

// 使用真实数据库但事务回滚
beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // 开始事务
  await prisma.$executeRaw`BEGIN`;
});

afterEach(async () => {
  // 回滚事务
  await prisma.$executeRaw`ROLLBACK`;
});

describe('Collaboration Messages API', () => {
  test('POST creates message and returns updated list', async () => {
    // 创建测试协作会话
    const collaboration = await prisma.collaboration.create({
      data: {
        name: 'Test Collaboration',
        userId: 'user1',
      },
    });

    // 模拟请求
    const { req, res } = createMocks({
      method: 'POST',
      query: { id: collaboration.id },
      body: { content: 'Test message', agentId: 'agent1' },
      session: { user: { id: 'user1' } },
    });

    // 执行API处理
    await apiResolver(req, res, { id: collaboration.id }, handler);

    // 验证响应
    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData()).messages).toHaveLength(1);
    
    // 验证数据库状态
    const messages = await prisma.message.findMany({
      where: { collaborationId: collaboration.id },
    });
    expect(messages).toHaveLength(1);
    expect(messages[0].content).toBe('Test message');
  });
});
```

### 3.2 前后端集成测试

#### 测试目标

- 客户端-服务器交互
- WebSocket通信
- 数据加载和渲染
- 状态同步

#### 测试技术

- API模拟和拦截
- WebSocket服务器模拟
- 客户端渲染测试

#### 代码示例

```jsx
// 前后端集成测试
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ProjectDetailPage from '@/pages/projects/[id]';

// 设置Mock服务器
const server = setupServer(
  rest.get('/api/projects/:id', (req, res, ctx) => {
    return res(ctx.json({
      id: '1',
      name: 'Test Project',
      description: 'Test Description',
      collaborations: [
        { id: 'collab1', name: 'First Session', status: 'completed' }
      ]
    }));
  }),
  rest.get('/api/projects/:id/agents', (req, res, ctx) => {
    return res(ctx.json([
      { id: 'agent1', name: 'Developer', role: 'developer' }
    ]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Project Detail Page', () => {
  test('loads and displays project details', async () => {
    render(<ProjectDetailPage id="1" />);
    
    // 检查加载状态
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // 等待数据加载和渲染
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('First Session')).toBeInTheDocument();
      expect(screen.getByText('Developer')).toBeInTheDocument();
    });
  });
});
```

### 3.3 代理协作集成测试

#### 测试目标

- 代理间通信流程
- 代理团队协作
- 消息处理链
- 知识库集成

#### 测试设置

- 模拟代理行为
- 协作场景模拟
- 轻量级代理实现

#### 代码示例

```javascript
// 代理协作测试
import { AgentTeam } from '@/lib/agents/team';
import { mockAgentResponses } from '@/test/fixtures/agent-responses';

describe('Agent Team Collaboration', () => {
  test('completes basic requirement analysis flow', async () => {
    // 配置模拟响应
    const mockResponses = {
      'product-manager': [
        { content: 'We need to analyze the user requirements first.' },
        { content: 'Based on requirements, we need a login system and dashboard.' }
      ],
      'developer': [
        { content: 'I can implement the login system using NextAuth.' },
        { content: 'For the dashboard, we should use a responsive layout.' }
      ],
      'designer': [
        { content: 'I suggest a clean, minimal design for the login page.' },
        { content: 'The dashboard should use a card-based layout.' }
      ]
    };
    
    // 创建模拟的代理团队
    const team = new AgentTeam({
      agents: ['product-manager', 'developer', 'designer'],
      mockResponses
    });
    
    // 执行协作流程
    const result = await team.collaborate('Create a web application for task management');
    
    // 验证协作结果
    expect(result.messages).toHaveLength(6);
    expect(result.summary).toContain('login system');
    expect(result.summary).toContain('dashboard');
    expect(result.artifacts).toHaveProperty('requirements');
    expect(result.artifacts).toHaveProperty('technicalPlan');
    expect(result.artifacts).toHaveProperty('designConcept');
  });
});
```

## 4. 端到端测试策略

### 4.1 关键用户流程

#### 优先测试流程

1. 用户注册和登录
2. 项目创建和配置
3. 代理团队组建
4. 协作会话执行
5. 结果查看和导出
6. 知识库操作

#### 测试自动化

- Playwright测试脚本
- 页面对象模型
- 视觉比较测试

#### 代码示例

```javascript
// E2E测试示例 (Playwright)
import { test, expect } from '@playwright/test';

test.describe('Project Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('creates a new project and runs collaboration', async ({ page }) => {
    // 创建项目
    await page.click('text=New Project');
    await page.fill('input[name="name"]', 'E2E Test Project');
    await page.fill('textarea[name="description"]', 'Testing project creation');
    await page.click('text=Create Project');
    
    // 验证项目创建
    await expect(page).toHaveURL(/projects\/[\w-]+$/);
    await expect(page.locator('h1')).toContainText('E2E Test Project');
    
    // 配置代理团队
    await page.click('text=Configure Team');
    await page.click('text=Add Agent');
    await page.selectOption('select[name="agentType"]', 'developer');
    await page.fill('input[name="agentName"]', 'TestDeveloper');
    await page.click('text=Add');
    
    // 添加更多代理...
    
    // 启动协作会话
    await page.click('text=Start Collaboration');
    await page.fill('textarea[name="initialPrompt"]', 'Create a simple login page');
    await page.click('text=Begin');
    
    // 等待协作完成
    await page.waitForSelector('text=Collaboration Complete', { timeout: 60000 });
    
    // 验证结果
    await expect(page.locator('.result-summary')).toContainText('login page');
    await expect(page.locator('.result-code')).toContainText('<form');
  });
});
```

### 4.2 性能测试

#### 测试指标

- 首次加载时间
- 交互响应时间
- 内存使用情况
- API响应时间
- WebSocket消息延迟

#### 测试工具

- Lighthouse性能审计
- Chrome DevTools性能分析
- 自定义性能指标收集

#### 代码示例

```javascript
// 性能测试示例
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';

async function runPerformanceTest() {
  // 启动浏览器
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 打开页面并等待加载完成
  const startTime = Date.now();
  await page.goto('/dashboard');
  const loadTime = Date.now() - startTime;
  console.log(`Dashboard页面加载时间: ${loadTime}ms`);
  
  // 测量API调用时间
  await page.route('**/api/projects', route => {
    const startTime = Date.now();
    route.continue();
    route.onResponse(() => {
      console.log(`API响应时间: ${Date.now() - startTime}ms`);
    });
  });
  
  // 交互测试
  await page.click('text=New Project');
  await page.waitForSelector('form');
  
  // 使用Lighthouse进行性能审计
  const report = await lighthouse(page.url());
  console.log(`性能分数: ${report.categories.performance.score * 100}`);
  console.log(`首次内容绘制: ${report.audits['first-contentful-paint'].displayValue}`);
  console.log(`交互时间: ${report.audits['interactive'].displayValue}`);
  
  await browser.close();
}
```

### 4.3 可访问性测试

#### 测试范围

- 键盘导航
- 屏幕阅读器兼容性
- 颜色对比度
- ARIA角色和属性
- 内容结构

#### 测试工具

- axe-core自动化检查
- 手动键盘导航测试
- 对比度分析器

#### 代码示例

```javascript
// 可访问性测试
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage has no detectable accessibility issues', async ({ page }) => {
    await page.goto('/');
    
    // 运行自动化可访问性检查
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('dashboard is navigable by keyboard', async ({ page }) => {
    // 登录
    await page.goto('/auth/signin');
    // 登录操作...
    
    // 使用Tab键导航
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('aria-label', 'New Project');
    
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('aria-label', 'Projects');
    
    // 使用Enter键激活
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/projects');
  });
});
```

## 5. 安全测试策略

### 5.1 自动化安全扫描

#### 测试范围

- 依赖漏洞
- 常见Web漏洞
- API端点安全
- 认证和授权

#### 测试工具

- npm audit / yarn audit
- OWASP ZAP自动扫描
- Snyk代码安全分析

#### 执行计划

- 每日依赖扫描
- 每周ZAP自动扫描
- 每月完整安全评估

### 5.2 渗透测试清单

手动安全检查项目：

- 跨站脚本(XSS)尝试
- 跨站请求伪造(CSRF)测试
- 权限绕过尝试
- 输入验证绕过
- 敏感数据泄露
- 会话管理缺陷

## 6. 测试自动化与CI/CD

### 6.1 测试自动化流程

```yaml
# GitHub Actions工作流示例
name: Test Suite

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Lint check
      run: npm run lint
      
    - name: Set up database
      run: npx prisma migrate deploy
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        
    - name: Run unit tests
      run: npm run test:unit
      
    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        
    - name: Build application
      run: npm run build
      
    - name: Run E2E tests
      run: npm run test:e2e
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        
    - name: Security audit
      run: npm audit --production
```

### 6.2 测试报告与可视化

- Jest HTML报告
- Playwright测试录像
- 测试覆盖率徽章
- 性能指标仪表板

## 7. 测试驱动开发流程

适合单人开发的TDD轻量级流程：

1. 编写测试定义预期行为
2. 运行测试确认失败
3. 编写最小实现代码
4. 运行测试直到通过
5. 重构优化设计和实现
6. 重复流程

### 代码示例

```javascript
// 1. 编写测试
test('formatSessionDuration formats seconds correctly', () => {
  expect(formatSessionDuration(65)).toBe('1m 5s');
  expect(formatSessionDuration(3661)).toBe('1h 1m 1s');
  expect(formatSessionDuration(0)).toBe('0s');
});

// 2. 实现功能
function formatSessionDuration(seconds) {
  if (seconds === 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  if (remainingSeconds > 0) result += `${remainingSeconds}s`;
  
  return result.trim();
}
```

## 8. 测试数据管理

### 8.1 测试数据策略

- 使用工厂函数创建测试数据
- 隔离测试数据库环境
- 每次测试后清理数据

### 8.2 测试数据生成器

```javascript
// 测试数据工厂
import { v4 as uuidv4 } from 'uuid';

export const userFactory = (overrides = {}) => ({
  id: uuidv4(),
  name: `Test User ${Math.floor(Math.random() * 1000)}`,
  email: `test-${Math.floor(Math.random() * 1000)}@example.com`,
  createdAt: new Date(),
  ...overrides
});

export const projectFactory = (overrides = {}) => ({
  id: uuidv4(),
  name: `Test Project ${Math.floor(Math.random() * 1000)}`,
  description: 'This is a test project',
  userId: userFactory().id,
  createdAt: new Date(),
  ...overrides
});

export const agentFactory = (type = 'developer', overrides = {}) => {
  const agentTypes = {
    developer: {
      name: 'Developer Agent',
      role: 'developer',
      skills: ['coding', 'debugging']
    },
    designer: {
      name: 'Designer Agent',
      role: 'designer',
      skills: ['ui', 'ux']
    },
    pm: {
      name: 'Product Manager Agent',
      role: 'product_manager',
      skills: ['planning', 'requirements']
    }
  };
  
  return {
    id: uuidv4(),
    ...agentTypes[type],
    ...overrides
  };
};
```

## 9. 测试治理与流程

### 9.1 测试覆盖率目标

| 代码类型 | 目标覆盖率 | 解释 |
|---------|----------|------|
| 核心业务逻辑 | 90%+ | 关键功能需高覆盖 |
| UI组件 | 70%+ | 主要组件和交互需测试 |
| API端点 | 80%+ | 主要路径和错误处理 |
| 工具函数 | 90%+ | 通用功能需高覆盖 |

### 9.2 测试执行时间表

| 类型 | 运行时机 | 目标时间 |
|------|---------|---------|
| 单元测试 | 开发中、提交前、CI | < 30秒 |
| 集成测试 | 提交前、CI | < 2分钟 |
| E2E测试 | 每日、发布前 | < 5分钟 |
| 性能测试 | 每周、重大更改后 | < 10分钟 |

## 10. 结论

本测试策略为智能代理协作系统提供了全面的测试方法和实践，平衡了单人开发的效率需求和软件质量保证。通过优先测试关键路径、自动化重复性测试任务和建立持续集成测试流程，可以在资源有限的情况下保持高质量的软件交付。

随着项目进展，应定期回顾和调整测试策略，确保测试活动继续支持开发目标和用户需求。 