# 智能代理协作系统 API 文档

*基于AutoGen的多智能代理协作系统API接口规范 v1.0*

## 1. 简介

### 1.1 文档目的

本文档详细描述了智能代理协作系统的API接口设计，为前端应用、第三方集成和开发人员提供完整的接口参考。文档包含所有可用的API端点、请求参数、响应格式、错误处理机制以及认证方法。

### 1.2 系统概述

智能代理协作系统是一个基于AutoGen框架的多智能代理协作平台，该系统模拟软件开发团队的工作流程，使多个专业智能代理协同工作，仅需用户提供需求即可自动完成任务并产出高质量成果。系统采用宇宙星空主题的现代化UI设计，为用户提供沉浸式体验。

### 1.3 API版本信息

| 属性 | 值 |
|------|-----|
| 当前版本 | v1.0 |
| 基础URL | `https://api.aiagents-collab.com/v1` |
| 响应格式 | JSON |
| 文档更新日期 | 2023-MM-DD |

### 1.4 联系方式

- **技术支持邮箱**: support@aiagents-collab.com
- **API文档仓库**: github.com/aiagents-collab/api-docs
- **开发者社区**: community.aiagents-collab.com

## 2. 认证与授权

### 2.1 认证方式

本系统支持以下认证方式：

#### 2.1.1 API密钥认证

用于服务间通信和后端集成。

```
Authorization: ApiKey YOUR_API_KEY
```

#### 2.1.2 JWT令牌认证

用于前端应用和用户会话管理。

```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 2.1.3 OAuth2.0认证

用于第三方应用集成。

支持的授权流程：
- 授权码流程
- 客户端凭证流程
- 资源所有者密码凭证流程

### 2.2 权限级别

系统定义了以下权限级别：

| 角色 | 描述 | 权限范围 |
|------|------|----------|
| 游客 | 未登录用户 | 只读公共资源 |
| 用户 | 普通注册用户 | 管理自己的项目和资源 |
| 团队成员 | 属于团队的用户 | 访问和编辑团队资源 |
| 团队管理员 | 团队的管理员 | 管理团队成员和设置 |
| 系统管理员 | 平台管理员 | 全平台管理权限 |

### 2.3 获取访问令牌

**端点**: `POST /auth/token`

**请求体**:

```json
{
  "username": "user@example.com",
  "password": "secure_password",
  "grant_type": "password"
}
```

**响应**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### 2.4 刷新访问令牌

**端点**: `POST /auth/token/refresh`

**请求体**:

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "grant_type": "refresh_token"
}
```

**响应**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## 3. API约定

### 3.1 请求格式

- 所有API请求使用HTTPS协议
- 请求体采用JSON格式
- 请求头必须包含`Content-Type: application/json`
- 认证请求头使用`Authorization`字段

### 3.2 响应格式

所有API响应采用统一的JSON格式：

```json
{
  "status": "success",
  "data": { 
    // 响应数据对象
  },
  "meta": {
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20
    }
  }
}
```

错误响应示例：

```json
{
  "status": "error",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": {
      // 错误详情
    }
  }
}
```

### 3.3 HTTP状态码

| 状态码 | 描述 |
|--------|------|
| 200 | 请求成功 |
| 201 | 资源创建成功 |
| 204 | 请求成功，无返回内容 |
| 400 | 请求参数错误 |
| 401 | 认证失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 422 | 请求格式正确但语义错误 |
| 429 | 请求频率超限 |
| 500 | 服务器内部错误 |

### 3.4 分页

列表类API支持分页，使用以下查询参数：

- `page`: 页码，从1开始
- `limit`: 每页项目数，默认20，最大100
- `sort`: 排序字段，格式为`field:direction`，如`createdAt:desc`

响应的`meta.pagination`对象包含分页信息：

```json
"meta": {
  "pagination": {
    "total": 100,    // 总记录数
    "pages": 5,      // 总页数
    "page": 1,       // 当前页
    "limit": 20,     // 每页项目数
    "prev": null,    // 上一页链接
    "next": "/api/v1/users?page=2&limit=20"  // 下一页链接
  }
}
```

### 3.5 过滤和搜索

列表类API支持过滤和搜索，使用以下查询参数：

- `filter[field]`: 按字段过滤，如`filter[status]=active`
- `search`: 全文搜索，如`search=keyword`

### 3.6 字段选择

可以使用`fields`参数指定响应中包含的字段：

```
GET /users?fields=id,username,email
```

### 3.7 版本控制

所有API路径包含版本前缀，如`/v1/users`。版本变更遵循语义化版本规范。

### 3.8 限流策略

API实施请求限流，默认限制为：

- 认证用户: 每分钟100个请求
- 匿名用户: 每分钟20个请求

超过限制将返回429状态码，响应头`X-RateLimit-Reset`指示重置时间。

## 4. 用户管理API

### 4.1 注册用户

**端点**: `POST /users`

**权限**: 公开

**请求体**:

```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "secure_password",
  "firstName": "John",
  "lastName": "Doe"
}
```

**响应** (201 Created):

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "u-123456",
      "username": "newuser",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2023-01-01T00:00:00Z"
    }
  }
}
```

### 4.2 获取用户信息

**端点**: `GET /users/{userId}`

**权限**: 认证用户（自己的资料）或管理员

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "u-123456",
      "username": "newuser",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "preferences": {
        "theme": "dark",
        "language": "zh-CN"
      },
      "createdAt": "2023-01-01T00:00:00Z",
      "lastLoginAt": "2023-01-10T00:00:00Z"
    }
  }
}
```

### 4.3 更新用户信息

**端点**: `PATCH /users/{userId}`

**权限**: 认证用户（自己的资料）或管理员

**请求体**:

```json
{
  "firstName": "Jonathan",
  "preferences": {
    "theme": "light"
  }
}
```

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "u-123456",
      "username": "newuser",
      "email": "user@example.com",
      "firstName": "Jonathan",
      "lastName": "Doe",
      "preferences": {
        "theme": "light",
        "language": "zh-CN"
      },
      "updatedAt": "2023-01-15T00:00:00Z"
    }
  }
}
```

### 4.4 删除用户

**端点**: `DELETE /users/{userId}`

**权限**: 认证用户（自己的账户）或管理员

**响应** (204 No Content)

### 4.5 获取用户列表

**端点**: `GET /users`

**权限**: 管理员

**查询参数**:
- `page`: 页码
- `limit`: 每页项目数
- `filter[role]`: 按角色过滤
- `search`: 搜索用户名或邮箱

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "u-123456",
        "username": "user1",
        "email": "user1@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "user",
        "createdAt": "2023-01-01T00:00:00Z"
      },
      {
        "id": "u-123457",
        "username": "user2",
        "email": "user2@example.com",
        "firstName": "Jane",
        "lastName": "Smith",
        "role": "admin",
        "createdAt": "2023-01-02T00:00:00Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "total": 50,
      "pages": 25,
      "page": 1,
      "limit": 2,
      "next": "/v1/users?page=2&limit=2"
    }
  }
}
```

### 4.6 修改用户密码

**端点**: `POST /users/{userId}/password`

**权限**: 认证用户（自己的账户）或管理员

**请求体**:

```json
{
  "currentPassword": "old_secure_password",
  "newPassword": "new_secure_password"
}
```

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "message": "密码已成功更新"
  }
}
```

## 5. 代理管理API

### 5.1 获取可用代理列表

**端点**: `GET /agents`

**权限**: 认证用户

**查询参数**:
- `type`: 代理类型筛选
- `status`: 代理状态筛选
- `fields`: 返回字段选择

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "agents": [
      {
        "id": "agent-pm-001",
        "name": "产品经理代理",
        "description": "负责需求分析和规格说明的生成",
        "type": "product_manager",
        "capabilities": ["需求分析", "用户故事编写", "优先级排序"],
        "status": "active",
        "createdAt": "2023-01-01T00:00:00Z"
      },
      {
        "id": "agent-dev-001",
        "name": "开发工程师代理",
        "description": "负责代码实现和技术问题解决",
        "type": "developer",
        "capabilities": ["代码生成", "问题解决", "技术实现"],
        "status": "active",
        "createdAt": "2023-01-01T00:00:00Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "total": 6,
      "pages": 3,
      "page": 1,
      "limit": 2,
      "next": "/v1/agents?page=2&limit=2"
    }
  }
}
```

### 5.2 获取代理详情

**端点**: `GET /agents/{agentId}`

**权限**: 认证用户

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "agent": {
      "id": "agent-pm-001",
      "name": "产品经理代理",
      "description": "负责需求分析和规格说明的生成",
      "type": "product_manager",
      "capabilities": ["需求分析", "用户故事编写", "优先级排序"],
      "parameters": {
        "responseStyle": "详细",
        "focusAreas": ["用户体验", "市场需求", "技术可行性"]
      },
      "status": "active",
      "performanceMetrics": {
        "accuracyScore": 0.92,
        "satisfactionScore": 0.88,
        "completionTimeAvg": 120 // 秒
      },
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-10T00:00:00Z"
    }
  }
}
```

### 5.3 自定义代理参数

**端点**: `PATCH /agents/{agentId}/parameters`

**权限**: 认证用户

**请求体**:

```json
{
  "parameters": {
    "responseStyle": "简洁",
    "focusAreas": ["技术可行性", "开发效率"]
  }
}
```

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "agent": {
      "id": "agent-pm-001",
      "name": "产品经理代理",
      "parameters": {
        "responseStyle": "简洁",
        "focusAreas": ["技术可行性", "开发效率"]
      },
      "updatedAt": "2023-01-15T00:00:00Z"
    }
  }
}
```

### 5.4 获取代理能力指标

**端点**: `GET /agents/{agentId}/metrics`

**权限**: 认证用户

**查询参数**:
- `period`: 时间范围（day, week, month, all）
- `metric`: 特定指标筛选

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "metrics": {
      "accuracy": {
        "current": 0.92,
        "trend": "+0.05",
        "history": [
          {"date": "2023-01-01", "value": 0.85},
          {"date": "2023-01-08", "value": 0.87},
          {"date": "2023-01-15", "value": 0.92}
        ]
      },
      "satisfaction": {
        "current": 0.88,
        "trend": "+0.03",
        "history": [
          {"date": "2023-01-01", "value": 0.84},
          {"date": "2023-01-08", "value": 0.86},
          {"date": "2023-01-15", "value": 0.88}
        ]
      },
      "completionTime": {
        "current": 120,
        "trend": "-15",
        "history": [
          {"date": "2023-01-01", "value": 145},
          {"date": "2023-01-08", "value": 130},
          {"date": "2023-01-15", "value": 120}
        ]
      }
    }
  }
}
```

### 5.5 获取代理交互历史

**端点**: `GET /agents/{agentId}/interactions`

**权限**: 认证用户

**查询参数**:
- `taskId`: 按任务ID筛选
- `startDate`: 开始日期
- `endDate`: 结束日期
- `page`: 页码
- `limit`: 每页项目数

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "interactions": [
      {
        "id": "int-123456",
        "agentId": "agent-pm-001",
        "taskId": "task-123456",
        "type": "message",
        "content": "请分析以下需求并创建用户故事...",
        "source": "user",
        "timestamp": "2023-01-15T10:00:00Z"
      },
      {
        "id": "int-123457",
        "agentId": "agent-pm-001",
        "taskId": "task-123456",
        "type": "message",
        "content": "基于您提供的需求，我创建了以下用户故事...",
        "source": "agent",
        "timestamp": "2023-01-15T10:02:30Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "total": 24,
      "pages": 12,
      "page": 1,
      "limit": 2,
      "next": "/v1/agents/agent-pm-001/interactions?page=2&limit=2"
    }
  }
}
```

## 6. 任务管理API

### 6.1 创建新任务

**端点**: `POST /tasks`

**权限**: 认证用户

**请求体**:

```json
{
  "title": "开发电子商务网站",
  "description": "需要一个现代化的电子商务网站，包含产品展示、购物车、支付和用户账户管理功能",
  "type": "development",
  "priority": "high",
  "deadline": "2023-03-01T00:00:00Z",
  "attachments": [
    {
      "name": "参考设计.pdf",
      "content": "base64_encoded_content..."
    }
  ]
}
```

**响应** (201 Created):

```json
{
  "status": "success",
  "data": {
    "task": {
      "id": "task-123456",
      "title": "开发电子商务网站",
      "description": "需要一个现代化的电子商务网站，包含产品展示、购物车、支付和用户账户管理功能",
      "type": "development",
      "priority": "high",
      "status": "pending",
      "createdBy": "u-123456",
      "createdAt": "2023-01-15T00:00:00Z",
      "deadline": "2023-03-01T00:00:00Z",
      "attachments": [
        {
          "id": "att-123456",
          "name": "参考设计.pdf",
          "contentType": "application/pdf",
          "size": 1024000,
          "url": "https://api.aiagents-collab.com/v1/files/att-123456"
        }
      ]
    }
  }
}
```

### 6.2 获取任务详情

**端点**: `GET /tasks/{taskId}`

**权限**: 认证用户（任务相关人员）

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "task": {
      "id": "task-123456",
      "title": "开发电子商务网站",
      "description": "需要一个现代化的电子商务网站，包含产品展示、购物车、支付和用户账户管理功能",
      "type": "development",
      "priority": "high",
      "status": "in_progress",
      "progress": 35,
      "createdBy": "u-123456",
      "assignedAgents": [
        {
          "id": "agent-pm-001",
          "name": "产品经理代理",
          "role": "product_manager"
        },
        {
          "id": "agent-dev-001",
          "name": "开发工程师代理",
          "role": "developer"
        }
      ],
      "createdAt": "2023-01-15T00:00:00Z",
      "startedAt": "2023-01-15T01:30:00Z",
      "estimatedCompletionAt": "2023-02-20T00:00:00Z",
      "deadline": "2023-03-01T00:00:00Z",
      "attachments": [
        {
          "id": "att-123456",
          "name": "参考设计.pdf",
          "contentType": "application/pdf",
          "size": 1024000,
          "url": "https://api.aiagents-collab.com/v1/files/att-123456"
        }
      ],
      "tags": ["电子商务", "Web开发"]
    }
  }
}
```

### 6.3 更新任务

**端点**: `PATCH /tasks/{taskId}`

**权限**: 认证用户（任务创建者或管理员）

**请求体**:

```json
{
  "title": "开发现代电子商务平台",
  "priority": "medium",
  "deadline": "2023-03-15T00:00:00Z",
  "tags": ["电子商务", "Web开发", "响应式设计"]
}
```

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "task": {
      "id": "task-123456",
      "title": "开发现代电子商务平台",
      "priority": "medium",
      "deadline": "2023-03-15T00:00:00Z",
      "tags": ["电子商务", "Web开发", "响应式设计"],
      "updatedAt": "2023-01-16T00:00:00Z"
    }
  }
}
```

### 6.4 获取任务列表

**端点**: `GET /tasks`

**权限**: 认证用户

**查询参数**:
- `status`: 任务状态筛选
- `priority`: 优先级筛选
- `type`: 任务类型筛选
- `createdBy`: 创建者ID筛选
- `startDate`: 开始日期
- `endDate`: 结束日期
- `search`: 搜索关键词
- `sort`: 排序字段和方向

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "tasks": [
      {
        "id": "task-123456",
        "title": "开发现代电子商务平台",
        "type": "development",
        "priority": "medium",
        "status": "in_progress",
        "progress": 35,
        "createdBy": "u-123456",
        "createdAt": "2023-01-15T00:00:00Z",
        "deadline": "2023-03-15T00:00:00Z"
      },
      {
        "id": "task-123457",
        "title": "设计公司品牌标识",
        "type": "design",
        "priority": "high",
        "status": "pending",
        "progress": 0,
        "createdBy": "u-123456",
        "createdAt": "2023-01-16T00:00:00Z",
        "deadline": "2023-02-01T00:00:00Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "total": 15,
      "pages": 8,
      "page": 1,
      "limit": 2,
      "next": "/v1/tasks?page=2&limit=2"
    }
  }
}
```

### 6.5 取消任务

**端点**: `POST /tasks/{taskId}/cancel`

**权限**: 认证用户（任务创建者或管理员）

**请求体**:

```json
{
  "reason": "需求变更，项目取消",
  "notifyTeam": true
}
```

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "task": {
      "id": "task-123456",
      "status": "cancelled",
      "cancelledAt": "2023-01-17T00:00:00Z",
      "cancelledBy": "u-123456",
      "cancelReason": "需求变更，项目取消"
    }
  }
}
```

### 6.6 获取任务历史记录

**端点**: `GET /tasks/{taskId}/history`

**权限**: 认证用户（任务相关人员）

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "history": [
      {
        "id": "hist-123456",
        "taskId": "task-123456",
        "action": "created",
        "actor": {
          "id": "u-123456",
          "name": "John Doe",
          "type": "user"
        },
        "timestamp": "2023-01-15T00:00:00Z",
        "details": {
          "title": "开发电子商务网站",
          "description": "需要一个现代化的电子商务网站...",
          "priority": "high"
        }
      },
      {
        "id": "hist-123457",
        "taskId": "task-123456",
        "action": "started",
        "actor": {
          "id": "agent-pm-001",
          "name": "产品经理代理",
          "type": "agent"
        },
        "timestamp": "2023-01-15T01:30:00Z"
      },
      {
        "id": "hist-123458",
        "taskId": "task-123456",
        "action": "updated",
        "actor": {
          "id": "u-123456",
          "name": "John Doe",
          "type": "user"
        },
        "timestamp": "2023-01-16T00:00:00Z",
        "details": {
          "changes": {
            "title": {
              "from": "开发电子商务网站",
              "to": "开发现代电子商务平台"
            },
            "priority": {
              "from": "high",
              "to": "medium"
            }
          }
        }
      }
    ]
  }
}
```

### 6.7 添加任务附件

**端点**: `POST /tasks/{taskId}/attachments`

**权限**: 认证用户（任务相关人员）

**请求体** (multipart/form-data):

- `file`: 文件数据
- `description`: 文件描述（可选）

**响应** (201 Created):

```json
{
  "status": "success",
  "data": {
    "attachment": {
      "id": "att-123457",
      "taskId": "task-123456",
      "name": "需求规格说明.docx",
      "description": "详细的需求规格说明文档",
      "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "size": 512000,
      "url": "https://api.aiagents-collab.com/v1/files/att-123457",
      "uploadedBy": "u-123456",
      "uploadedAt": "2023-01-17T00:00:00Z"
    }
  }
}
```

## 7. 团队管理API

### 7.1 创建团队

**端点**: `POST /teams`

**权限**: 认证用户

**请求体**:

```json
{
  "name": "创新科技团队",
  "description": "负责企业创新项目的开发团队",
  "settings": {
    "visibility": "private",
    "memberApproval": "admin_only"
  }
}
```

**响应** (201 Created):

```json
{
  "status": "success",
  "data": {
    "team": {
      "id": "team-123456",
      "name": "创新科技团队",
      "description": "负责企业创新项目的开发团队",
      "createdBy": "u-123456",
      "createdAt": "2023-01-18T00:00:00Z",
      "settings": {
        "visibility": "private",
        "memberApproval": "admin_only"
      },
      "members": [
        {
          "userId": "u-123456",
          "role": "admin",
          "joinedAt": "2023-01-18T00:00:00Z"
        }
      ]
    }
  }
}
```

### 7.2 获取团队详情

**端点**: `GET /teams/{teamId}`

**权限**: 团队成员

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "team": {
      "id": "team-123456",
      "name": "创新科技团队",
      "description": "负责企业创新项目的开发团队",
      "createdBy": "u-123456",
      "createdAt": "2023-01-18T00:00:00Z",
      "members": [
        {
          "userId": "u-123456",
          "username": "john.doe",
          "firstName": "John",
          "lastName": "Doe",
          "role": "admin",
          "joinedAt": "2023-01-18T00:00:00Z"
        },
        {
          "userId": "u-123457",
          "username": "jane.smith",
          "firstName": "Jane",
          "lastName": "Smith",
          "role": "member",
          "joinedAt": "2023-01-19T00:00:00Z"
        }
      ],
      "settings": {
        "visibility": "private",
        "memberApproval": "admin_only"
      },
      "stats": {
        "memberCount": 2,
        "taskCount": 5,
        "completedTaskCount": 2
      }
    }
  }
}
```

### 7.3 更新团队信息

**端点**: `PATCH /teams/{teamId}`

**权限**: 团队管理员

**请求体**:

```json
{
  "name": "企业创新技术团队",
  "description": "专注于企业数字化转型和创新项目的技术团队",
  "settings": {
    "visibility": "public"
  }
}
```

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "team": {
      "id": "team-123456",
      "name": "企业创新技术团队",
      "description": "专注于企业数字化转型和创新项目的技术团队",
      "settings": {
        "visibility": "public",
        "memberApproval": "admin_only"
      },
      "updatedAt": "2023-01-20T00:00:00Z"
    }
  }
}
```

### 7.4 获取团队列表

**端点**: `GET /teams`

**权限**: 认证用户

**查询参数**:
- `role`: 用户在团队中的角色
- `visibility`: 团队可见性
- `search`: 搜索关键词

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "teams": [
      {
        "id": "team-123456",
        "name": "企业创新技术团队",
        "description": "专注于企业数字化转型和创新项目的技术团队",
        "memberCount": 2,
        "visibility": "public",
        "userRole": "admin",
        "createdAt": "2023-01-18T00:00:00Z"
      },
      {
        "id": "team-123457",
        "name": "市场营销团队",
        "description": "负责产品市场推广和营销策略的团队",
        "memberCount": 5,
        "visibility": "private",
        "userRole": "member",
        "createdAt": "2023-01-10T00:00:00Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "total": 5,
      "pages": 3,
      "page": 1,
      "limit": 2,
      "next": "/v1/teams?page=2&limit=2"
    }
  }
}
```

### 7.5 添加团队成员

**端点**: `POST /teams/{teamId}/members`

**权限**: 团队管理员

**请求体**:

```json
{
  "userId": "u-123458",
  "role": "member"
}
```

**响应** (201 Created):

```json
{
  "status": "success",
  "data": {
    "member": {
      "userId": "u-123458",
      "username": "robert.johnson",
      "firstName": "Robert",
      "lastName": "Johnson",
      "role": "member",
      "joinedAt": "2023-01-21T00:00:00Z"
    }
  }
}
```

### 7.6 更新团队成员角色

**端点**: `PATCH /teams/{teamId}/members/{userId}`

**权限**: 团队管理员

**请求体**:

```json
{
  "role": "admin"
}
```

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "member": {
      "userId": "u-123458",
      "username": "robert.johnson",
      "role": "admin",
      "updatedAt": "2023-01-22T00:00:00Z"
    }
  }
}
```

### 7.7 删除团队成员

**端点**: `DELETE /teams/{teamId}/members/{userId}`

**权限**: 团队管理员或自己（离开团队）

**响应** (204 No Content)

### 7.8 获取团队任务

**端点**: `GET /teams/{teamId}/tasks`

**权限**: 团队成员

**查询参数**:
- `status`: 任务状态筛选
- `priority`: 优先级筛选
- `page`: 页码
- `limit`: 每页项目数

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "tasks": [
      {
        "id": "task-123456",
        "title": "开发现代电子商务平台",
        "type": "development",
        "priority": "medium",
        "status": "in_progress",
        "progress": 35,
        "createdBy": "u-123456",
        "createdAt": "2023-01-15T00:00:00Z",
        "deadline": "2023-03-15T00:00:00Z"
      },
      {
        "id": "task-123460",
        "title": "设计新产品登陆页",
        "type": "design",
        "priority": "high",
        "status": "completed",
        "progress": 100,
        "createdBy": "u-123457",
        "createdAt": "2023-01-10T00:00:00Z",
        "completedAt": "2023-01-20T00:00:00Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "total": 5,
      "pages": 3,
      "page": 1,
      "limit": 2,
      "next": "/v1/teams/team-123456/tasks?page=2&limit=2"
    }
  }
}
```

## 8. 代理协作API

### 8.1 启动代理协作会话

**端点**: `POST /collaborations`

**权限**: 认证用户

**请求体**:

```json
{
  "taskId": "task-123456",
  "agents": [
    {
      "agentId": "agent-pm-001",
      "role": "product_manager"
    },
    {
      "agentId": "agent-dev-001",
      "role": "developer"
    },
    {
      "agentId": "agent-test-001",
      "role": "tester"
    }
  ],
  "collaborationSettings": {
    "mode": "autonomous",
    "humanIntervention": "on_request",
    "maxRounds": 50
  }
}
```

**响应** (201 Created):

```json
{
  "status": "success",
  "data": {
    "collaboration": {
      "id": "collab-123456",
      "taskId": "task-123456",
      "status": "initialized",
      "agents": [
        {
          "agentId": "agent-pm-001",
          "role": "product_manager",
          "status": "ready"
        },
        {
          "agentId": "agent-dev-001",
          "role": "developer",
          "status": "ready"
        },
        {
          "agentId": "agent-test-001",
          "role": "tester",
          "status": "ready"
        }
      ],
      "createdAt": "2023-01-25T00:00:00Z",
      "settings": {
        "mode": "autonomous",
        "humanIntervention": "on_request",
        "maxRounds": 50
      }
    }
  }
}
```

### 8.2 获取协作会话状态

**端点**: `GET /collaborations/{collaborationId}`

**权限**: 认证用户（任务相关人员）

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "collaboration": {
      "id": "collab-123456",
      "taskId": "task-123456",
      "status": "in_progress",
      "currentRound": 5,
      "agents": [
        {
          "agentId": "agent-pm-001",
          "role": "product_manager",
          "status": "waiting",
          "lastActiveAt": "2023-01-25T00:10:30Z"
        },
        {
          "agentId": "agent-dev-001",
          "role": "developer",
          "status": "processing",
          "lastActiveAt": "2023-01-25T00:15:45Z"
        },
        {
          "agentId": "agent-test-001",
          "role": "tester",
          "status": "idle",
          "lastActiveAt": "2023-01-25T00:05:20Z"
        }
      ],
      "createdAt": "2023-01-25T00:00:00Z",
      "startedAt": "2023-01-25T00:01:00Z",
      "estimatedCompletionAt": "2023-01-25T01:30:00Z",
      "progress": {
        "completedSteps": 12,
        "totalSteps": 35,
        "percentage": 34
      }
    }
  }
}
```

### 8.3 获取协作消息历史

**端点**: `GET /collaborations/{collaborationId}/messages`

**权限**: 认证用户（任务相关人员）

**查询参数**:
- `agentId`: 按代理ID筛选
- `startTime`: 开始时间
- `endTime`: 结束时间
- `page`: 页码
- `limit`: 每页项目数

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "messages": [
      {
        "id": "msg-123456",
        "collaborationId": "collab-123456",
        "senderId": "agent-pm-001",
        "senderName": "产品经理代理",
        "receiverId": "all",
        "content": "基于用户需求，我们需要开发一个包含以下功能的电子商务网站...",
        "contentType": "text/plain",
        "timestamp": "2023-01-25T00:01:30Z",
        "round": 1
      },
      {
        "id": "msg-123457",
        "collaborationId": "collab-123456",
        "senderId": "agent-dev-001",
        "senderName": "开发工程师代理",
        "receiverId": "agent-pm-001",
        "content": "我理解了需求，但对支付系统集成有几个问题需要澄清...",
        "contentType": "text/plain",
        "timestamp": "2023-01-25T00:02:45Z",
        "round": 1
      }
    ]
  },
  "meta": {
    "pagination": {
      "total": 24,
      "pages": 12,
      "page": 1,
      "limit": 2,
      "next": "/v1/collaborations/collab-123456/messages?page=2&limit=2"
    }
  }
}
```

### 8.4 用户干预协作

**端点**: `POST /collaborations/{collaborationId}/interventions`

**权限**: 认证用户（任务创建者或管理员）

**请求体**:

```json
{
  "type": "message",
  "targetAgentId": "agent-pm-001",
  "content": "请将登录功能的优先级提高，这是客户的关键需求。",
  "pauseCollaboration": false
}
```

**响应** (201 Created):

```json
{
  "status": "success",
  "data": {
    "intervention": {
      "id": "int-123456",
      "collaborationId": "collab-123456",
      "type": "message",
      "userId": "u-123456",
      "targetAgentId": "agent-pm-001",
      "content": "请将登录功能的优先级提高，这是客户的关键需求。",
      "timestamp": "2023-01-25T00:20:00Z",
      "status": "delivered"
    }
  }
}
```

### 8.5 暂停/恢复协作

**端点**: `POST /collaborations/{collaborationId}/status`

**权限**: 认证用户（任务创建者或管理员）

**请求体**:

```json
{
  "action": "pause",
  "reason": "需要等待客户提供更多信息"
}
```

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "collaboration": {
      "id": "collab-123456",
      "status": "paused",
      "pausedAt": "2023-01-25T00:30:00Z",
      "pausedBy": "u-123456",
      "pauseReason": "需要等待客户提供更多信息"
    }
  }
}
```

### 8.6 获取协作结果

**端点**: `GET /collaborations/{collaborationId}/results`

**权限**: 认证用户（任务相关人员）

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "results": {
      "collaborationId": "collab-123456",
      "taskId": "task-123456",
      "status": "completed",
      "completedAt": "2023-01-25T01:25:30Z",
      "duration": 5130, // 秒
      "artifacts": [
        {
          "id": "art-123456",
          "name": "需求规格说明书",
          "type": "document",
          "contentType": "application/pdf",
          "url": "https://api.aiagents-collab.com/v1/files/art-123456",
          "size": 1024000,
          "createdBy": "agent-pm-001",
          "createdAt": "2023-01-25T00:45:20Z"
        },
        {
          "id": "art-123457",
          "name": "系统架构设计",
          "type": "diagram",
          "contentType": "image/png",
          "url": "https://api.aiagents-collab.com/v1/files/art-123457",
          "size": 2048000,
          "createdBy": "agent-dev-001",
          "createdAt": "2023-01-25T01:10:15Z"
        }
      ],
      "summary": "团队成功完成了电子商务网站的初步设计，包括需求规格说明书和系统架构设计。下一步是开始实现核心功能模块。",
      "metrics": {
        "messageCount": 45,
        "agentPerformance": [
          {
            "agentId": "agent-pm-001",
            "responseTime": 3.2,  // 平均响应时间（秒）
            "messageCount": 15,
            "contributionScore": 0.85
          },
          {
            "agentId": "agent-dev-001",
            "responseTime": 5.7,
            "messageCount": 18,
            "contributionScore": 0.92
          },
          {
            "agentId": "agent-test-001",
            "responseTime": 2.8,
            "messageCount": 12,
            "contributionScore": 0.78
          }
        ]
      }
    }
  }
}
```

## 9. 知识库API

### 9.1 创建知识条目

**端点**: `POST /knowledge`

**权限**: 认证用户

**请求体**:

```json
{
  "title": "React最佳实践",
  "content": "React开发中的最佳实践包括组件设计、状态管理和性能优化等方面...",
  "type": "technical_guide",
  "tags": ["React", "前端开发", "JavaScript"],
  "visibility": "team",
  "teamId": "team-123456"
}
```

**响应** (201 Created):

```json
{
  "status": "success",
  "data": {
    "knowledge": {
      "id": "k-123456",
      "title": "React最佳实践",
      "content": "React开发中的最佳实践包括组件设计、状态管理和性能优化等方面...",
      "type": "technical_guide",
      "tags": ["React", "前端开发", "JavaScript"],
      "visibility": "team",
      "teamId": "team-123456",
      "createdBy": "u-123456",
      "createdAt": "2023-01-26T00:00:00Z",
      "version": 1
    }
  }
}
```

### 9.2 获取知识条目

**端点**: `GET /knowledge/{knowledgeId}`

**权限**: 认证用户（基于知识条目的可见性）

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "knowledge": {
      "id": "k-123456",
      "title": "React最佳实践",
      "content": "React开发中的最佳实践包括组件设计、状态管理和性能优化等方面...",
      "type": "technical_guide",
      "tags": ["React", "前端开发", "JavaScript"],
      "visibility": "team",
      "teamId": "team-123456",
      "createdBy": "u-123456",
      "createdAt": "2023-01-26T00:00:00Z",
      "updatedAt": "2023-01-26T00:00:00Z",
      "version": 1,
      "usageCount": 12,
      "rating": 4.5
    }
  }
}
```

### 9.3 更新知识条目

**端点**: `PATCH /knowledge/{knowledgeId}`

**权限**: 认证用户（知识条目创建者或管理员）

**请求体**:

```json
{
  "title": "React最佳实践 2023",
  "content": "更新后的React开发最佳实践，包括React 18新特性和性能优化技巧...",
  "tags": ["React", "前端开发", "JavaScript", "React 18"]
}
```

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "knowledge": {
      "id": "k-123456",
      "title": "React最佳实践 2023",
      "content": "更新后的React开发最佳实践，包括React 18新特性和性能优化技巧...",
      "tags": ["React", "前端开发", "JavaScript", "React 18"],
      "updatedAt": "2023-01-27T00:00:00Z",
      "version": 2
    }
  }
}
```

### 9.4 搜索知识库

**端点**: `GET /knowledge/search`

**权限**: 认证用户

**查询参数**:
- `query`: 搜索关键词
- `tags`: 标签筛选（逗号分隔）
- `type`: 知识类型筛选
- `creator`: 创建者ID
- `teamId`: 团队ID
- `page`: 页码
- `limit`: 每页项目数

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "results": [
      {
        "id": "k-123456",
        "title": "React最佳实践 2023",
        "snippet": "...包括React 18新特性和性能优化技巧...",
        "type": "technical_guide",
        "tags": ["React", "前端开发", "JavaScript", "React 18"],
        "createdBy": "u-123456",
        "createdAt": "2023-01-26T00:00:00Z",
        "updatedAt": "2023-01-27T00:00:00Z",
        "relevanceScore": 0.95
      },
      {
        "id": "k-123458",
        "title": "前端性能优化指南",
        "snippet": "...包括React应用性能分析和优化方法...",
        "type": "technical_guide",
        "tags": ["前端开发", "性能优化", "React"],
        "createdBy": "u-123457",
        "createdAt": "2023-01-20T00:00:00Z",
        "relevanceScore": 0.82
      }
    ]
  },
  "meta": {
    "pagination": {
      "total": 8,
      "pages": 4,
      "page": 1,
      "limit": 2,
      "next": "/v1/knowledge/search?query=React&page=2&limit=2"
    }
  }
}
```

### 9.5 评价知识条目

**端点**: `POST /knowledge/{knowledgeId}/ratings`

**权限**: 认证用户

**请求体**:

```json
{
  "rating": 5,
  "comment": "非常实用的指南，帮助我解决了几个棘手的React性能问题。"
}
```

**响应** (201 Created):

```json
{
  "status": "success",
  "data": {
    "rating": {
      "id": "r-123456",
      "knowledgeId": "k-123456",
      "userId": "u-123456",
      "rating": 5,
      "comment": "非常实用的指南，帮助我解决了几个棘手的React性能问题。",
      "createdAt": "2023-01-28T00:00:00Z"
    },
    "knowledgeRating": {
      "average": 4.7,
      "count": 15
    }
  }
}
```

### 9.6 获取知识条目历史版本

**端点**: `GET /knowledge/{knowledgeId}/versions`

**权限**: 认证用户（基于知识条目的可见性）

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "versions": [
      {
        "version": 2,
        "title": "React最佳实践 2023",
        "createdBy": "u-123456",
        "createdAt": "2023-01-27T00:00:00Z",
        "changeDescription": "更新内容，增加React 18相关最佳实践"
      },
      {
        "version": 1,
        "title": "React最佳实践",
        "createdBy": "u-123456",
        "createdAt": "2023-01-26T00:00:00Z",
        "changeDescription": "初始版本"
      }
    ]
  }
}
```

## 10. 系统管理API

### 10.1 获取系统状态

**端点**: `GET /system/status`

**权限**: 系统管理员

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "system": {
      "status": "operational",
      "version": "1.2.3",
      "uptime": 1209600, // 秒
      "lastUpdated": "2023-01-15T00:00:00Z",
      "services": [
        {
          "name": "代理协作引擎",
          "status": "operational",
          "performance": 0.92
        },
        {
          "name": "知识库服务",
          "status": "operational",
          "performance": 0.95
        },
        {
          "name": "任务管理服务",
          "status": "operational",
          "performance": 0.97
        }
      ],
      "metrics": {
        "activeUsers": 156,
        "activeCollaborations": 23,
        "completedTasksToday": 47,
        "avgResponseTime": 320 // 毫秒
      }
    }
  }
}
```

### 10.2 获取系统统计数据

**端点**: `GET /system/statistics`

**权限**: 系统管理员

**查询参数**:
- `period`: 时间范围（day, week, month, year）
- `startDate`: 开始日期
- `endDate`: 结束日期

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "statistics": {
      "period": "month",
      "startDate": "2023-01-01T00:00:00Z",
      "endDate": "2023-01-31T23:59:59Z",
      "users": {
        "total": 1250,
        "active": 876,
        "new": 125
      },
      "tasks": {
        "created": 1560,
        "completed": 1320,
        "cancelled": 105,
        "avgCompletionTime": 28800 // 秒
      },
      "collaborations": {
        "started": 2150,
        "completed": 1980,
        "avgMessagesPerCollaboration": 37,
        "avgAgentsPerCollaboration": 3.5
      },
      "agents": {
        "mostUsed": [
          {"id": "agent-pm-001", "name": "产品经理代理", "usageCount": 1450},
          {"id": "agent-dev-001", "name": "开发工程师代理", "usageCount": 1380},
          {"id": "agent-test-001", "name": "测试工程师代理", "usageCount": 1120}
        ],
        "performance": {
          "overall": 0.92,
          "byType": [
            {"type": "product_manager", "score": 0.94},
            {"type": "developer", "score": 0.91},
            {"type": "tester", "score": 0.89}
          ]
        }
      }
    }
  }
}
```

### 10.3 系统配置

**端点**: `GET /system/configuration`

**权限**: 系统管理员

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "configuration": {
      "general": {
        "siteName": "智能代理协作系统",
        "maintenanceMode": false,
        "defaultLanguage": "zh-CN"
      },
      "security": {
        "sessionTimeout": 3600,
        "passwordPolicy": {
          "minLength": 8,
          "requireSpecialChars": true,
          "requireNumbers": true,
          "requireUppercase": true
        },
        "mfaEnabled": true
      },
      "collaboration": {
        "defaultAgents": ["agent-pm-001", "agent-dev-001"],
        "maxAgentsPerTask": 5,
        "defaultTimeout": 3600
      },
      "tasks": {
        "autoAssignment": true,
        "reminderEnabled": true,
        "defaultPriority": "medium"
      }
    }
  }
}
```

### 10.4 更新系统配置

**端点**: `PATCH /system/configuration`

**权限**: 系统管理员

**请求体**:

```json
{
  "general": {
    "maintenanceMode": true,
    "maintenanceMessage": "系统正在升级，预计将在1小时后恢复。"
  },
  "security": {
    "sessionTimeout": 1800
  }
}
```

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "configuration": {
      "general": {
        "maintenanceMode": true,
        "maintenanceMessage": "系统正在升级，预计将在1小时后恢复。"
      },
      "security": {
        "sessionTimeout": 1800
      },
      "updatedAt": "2023-01-30T00:00:00Z"
    }
  }
}
```

### 10.5 系统日志

**端点**: `GET /system/logs`

**权限**: 系统管理员

**查询参数**:
- `level`: 日志级别（info, warning, error, critical）
- `service`: 服务名称
- `startDate`: 开始日期
- `endDate`: 结束日期
- `search`: 搜索关键词
- `page`: 页码
- `limit`: 每页项目数

**响应** (200 OK):

```json
{
  "status": "success",
  "data": {
    "logs": [
      {
        "id": "log-123456",
        "timestamp": "2023-01-30T10:15:30Z",
        "level": "error",
        "service": "代理协作引擎",
        "message": "代理响应超时",
        "details": {
          "collaborationId": "collab-123456",
          "agentId": "agent-dev-001",
          "timeout": 30,
          "requestId": "req-789012"
        }
      },
      {
        "id": "log-123457",
        "timestamp": "2023-01-30T10:20:15Z",
        "level": "info",
        "service": "用户管理",
        "message": "用户密码重置",
        "details": {
          "userId": "u-123458",
          "requestId": "req-789013",
          "source": "admin_action"
        }
      }
    ]
  },
  "meta": {
    "pagination": {
      "total": 1256,
      "pages": 628,
      "page": 1,
      "limit": 2,
      "next": "/v1/system/logs?page=2&limit=2"
    }
  }
}
```

## 11. 错误代码参考

系统API返回的错误使用统一的错误代码格式，便于客户端识别和处理。

### 11.1 通用错误代码

| 错误代码 | 描述 | HTTP状态码 |
|----------|------|------------|
| `INVALID_REQUEST` | 请求格式或参数无效 | 400 |
| `AUTHENTICATION_REQUIRED` | 需要认证 | 401 |
| `INVALID_CREDENTIALS` | 认证凭据无效 | 401 |
| `TOKEN_EXPIRED` | 访问令牌已过期 | 401 |
| `PERMISSION_DENIED` | 权限不足 | 403 |
| `RESOURCE_NOT_FOUND` | 请求的资源不存在 | 404 |
| `METHOD_NOT_ALLOWED` | 不允许的HTTP方法 | 405 |
| `CONFLICT` | 资源冲突 | 409 |
| `RATE_LIMIT_EXCEEDED` | 请求频率超限 | 429 |
| `INTERNAL_SERVER_ERROR` | 服务器内部错误 | 500 |
| `SERVICE_UNAVAILABLE` | 服务暂时不可用 | 503 |

### 11.2 业务逻辑错误代码

| 错误代码 | 描述 | HTTP状态码 |
|----------|------|------------|
| `USER_ALREADY_EXISTS` | 用户已存在 | 409 |
| `INVALID_USER_STATUS` | 用户状态无效 | 400 |
| `TASK_ALREADY_COMPLETED` | 任务已完成 | 409 |
| `INVALID_TASK_STATUS` | 任务状态无效 | 400 |
| `AGENT_UNAVAILABLE` | 代理不可用 | 409 |
| `COLLABORATION_LIMIT_REACHED` | 达到协作数量上限 | 400 |
| `INVALID_KNOWLEDGE_TYPE` | 知识类型无效 | 400 |
| `TEAM_MEMBER_LIMIT_REACHED` | 达到团队成员数量上限 | 400 |
| `INVALID_FILE_TYPE` | 文件类型无效 | 400 |
| `FILE_SIZE_EXCEEDED` | 文件大小超限 | 400 |

### 11.3 错误响应示例

```json
{
  "status": "error",
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "您没有权限执行此操作",
    "details": {
      "requiredRole": "admin",
      "currentRole": "user",
      "resource": "team-123456",
      "action": "update"
    }
  }
}
```

## 12. API使用示例

### 12.1 用户认证与任务创建

以下是使用API进行用户认证和创建任务的完整流程示例：

#### 12.1.1 获取访问令牌

```bash
curl -X POST https://api.aiagents-collab.com/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user@example.com",
    "password": "secure_password",
    "grant_type": "password"
  }'
```

响应:

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

#### 12.1.2 创建新任务

```bash
curl -X POST https://api.aiagents-collab.com/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "开发电子商务网站",
    "description": "需要一个现代化的电子商务网站，包含产品展示、购物车、支付和用户账户管理功能",
    "type": "development",
    "priority": "high",
    "deadline": "2023-03-01T00:00:00Z"
  }'
```

响应:

```json
{
  "status": "success",
  "data": {
    "task": {
      "id": "task-123456",
      "title": "开发电子商务网站",
      "description": "需要一个现代化的电子商务网站，包含产品展示、购物车、支付和用户账户管理功能",
      "type": "development",
      "priority": "high",
      "status": "pending",
      "createdBy": "u-123456",
      "createdAt": "2023-01-15T00:00:00Z",
      "deadline": "2023-03-01T00:00:00Z"
    }
  }
}
```

#### 12.1.3 启动代理协作会话

```bash
curl -X POST https://api.aiagents-collab.com/v1/collaborations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "taskId": "task-123456",
    "agents": [
      {
        "agentId": "agent-pm-001",
        "role": "product_manager"
      },
      {
        "agentId": "agent-dev-001",
        "role": "developer"
      },
      {
        "agentId": "agent-test-001",
        "role": "tester"
      }
    ],
    "collaborationSettings": {
      "mode": "autonomous",
      "humanIntervention": "on_request",
      "maxRounds": 50
    }
  }'
```

响应:

```json
{
  "status": "success",
  "data": {
    "collaboration": {
      "id": "collab-123456",
      "taskId": "task-123456",
      "status": "initialized",
      "agents": [
        {
          "agentId": "agent-pm-001",
          "role": "product_manager",
          "status": "ready"
        },
        {
          "agentId": "agent-dev-001",
          "role": "developer",
          "status": "ready"
        },
        {
          "agentId": "agent-test-001",
          "role": "tester",
          "status": "ready"
        }
      ],
      "createdAt": "2023-01-25T00:00:00Z",
      "settings": {
        "mode": "autonomous",
        "humanIntervention": "on_request",
        "maxRounds": 50
      }
    }
  }
}
```

### 12.2 JavaScript使用示例

以下是使用JavaScript与API交互的示例：

```javascript
// 用户认证
async function authenticate(username, password) {
  const response = await fetch('https://api.aiagents-collab.com/v1/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password,
      grant_type: 'password'
    })
  });
  
  const data = await response.json();
  if (data.status === 'error') {
    throw new Error(`认证失败: ${data.error.message}`);
  }
  
  return data.data;
}

// 创建任务
async function createTask(accessToken, taskData) {
  const response = await fetch('https://api.aiagents-collab.com/v1/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(taskData)
  });
  
  const data = await response.json();
  if (data.status === 'error') {
    throw new Error(`创建任务失败: ${data.error.message}`);
  }
  
  return data.data.task;
}

// 获取协作消息历史
async function getCollaborationMessages(accessToken, collaborationId, page = 1, limit = 20) {
  const response = await fetch(`https://api.aiagents-collab.com/v1/collaborations/${collaborationId}/messages?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const data = await response.json();
  if (data.status === 'error') {
    throw new Error(`获取协作消息失败: ${data.error.message}`);
  }
  
  return {
    messages: data.data.messages,
    pagination: data.meta.pagination
  };
}

// 使用示例
async function example() {
  try {
    // 1. 认证
    const authData = await authenticate('user@example.com', 'secure_password');
    const { access_token } = authData;
    
    // 2. 创建任务
    const task = await createTask(access_token, {
      title: "开发电子商务网站",
      description: "需要一个现代化的电子商务网站...",
      type: "development",
      priority: "high",
      deadline: "2023-03-01T00:00:00Z"
    });
    
    console.log(`创建任务成功，任务ID: ${task.id}`);
    
    // 3. 启动协作
    // ... 创建协作会话的代码 ...
    
    // 4. 获取协作消息
    // ... 获取协作会话后执行以下代码 ...
    const { messages } = await getCollaborationMessages(access_token, 'collab-123456');
    console.log(`获取到 ${messages.length} 条协作消息`);
    
  } catch (error) {
    console.error(`错误: ${error.message}`);
  }
}

example();
```

## 13. 结语

本API文档详细描述了智能代理协作系统的接口设计和使用方法。开发者可以基于这些API构建自己的应用，或将系统集成到现有工作流程中。

随着系统的发展，API可能会有更新和变化。请定期查看最新的API文档，以获取最新的功能和改进。

如有任何问题或建议，请联系我们的技术支持团队。 