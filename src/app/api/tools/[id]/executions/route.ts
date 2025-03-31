import { NextResponse } from 'next/server';
import { mockTools } from '@/lib/mock-data';

/**
 * 工具执行记录接口
 */
interface IToolExecution {
  id: string;
  toolId: string;
  action: string;
  parameters: any;
  status: string;
  result: any;
  error: string | null;
  startTime: string;
  endTime: string | null;
  executionTime: number | null;
  agentId: string;
  sessionId: string;
}

/**
 * 工具执行历史API
 * 
 * 获取指定工具的历史执行记录
 * 
 * @param request 请求对象
 * @param params 路由参数，包含工具ID
 * @returns 响应对象
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const url = new URL(request.url);
    
    // 从查询参数中获取分页和过滤参数
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const status = url.searchParams.get('status'); // 可选的状态过滤
    
    // 验证工具ID
    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少工具ID' },
        { status: 400 }
      );
    }

    // 查找匹配的工具
    const tool = mockTools.find(tool => tool.id === id);

    if (!tool) {
      return NextResponse.json(
        { success: false, error: '找不到指定工具' },
        { status: 404 }
      );
    }

    // 生成模拟的执行历史记录
    const mockExecutions = generateMockExecutions(tool.id, 50);
    
    // 应用状态过滤
    let filteredExecutions = mockExecutions;
    if (status) {
      filteredExecutions = mockExecutions.filter(exec => exec.status === status);
    }
    
    // 计算分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedExecutions = filteredExecutions.slice(startIndex, endIndex);
    
    // 返回结果
    return NextResponse.json({
      success: true,
      data: {
        executions: paginatedExecutions,
        pagination: {
          total: filteredExecutions.length,
          page,
          limit,
          totalPages: Math.ceil(filteredExecutions.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取工具执行历史失败:', error);
    return NextResponse.json(
      { success: false, error: '获取工具执行历史失败' },
      { status: 500 }
    );
  }
}

/**
 * 生成模拟的执行历史记录
 * 
 * @param toolId 工具ID
 * @param count 记录数量
 * @returns 模拟的执行历史记录数组
 */
function generateMockExecutions(toolId: string, count: number): IToolExecution[] {
  const statuses = ['success', 'error', 'running', 'timeout'];
  const actions = ['query', 'search', 'execute', 'list', 'read', 'write'];
  const mockExecutions: IToolExecution[] = [];
  
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // 创建随机的历史时间，越小的索引越接近现在
    const executionDate = new Date(now);
    executionDate.setMinutes(now.getMinutes() - i * 30); // 每条记录间隔30分钟
    
    // 随机生成状态和动作
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    // 生成执行时间（毫秒）
    const executionTime = Math.floor(Math.random() * 5000) + 500; // 500-5500ms
    
    mockExecutions.push({
      id: `exec-${toolId}-${i}`,
      toolId: toolId,
      action: action,
      parameters: generateMockParameters(toolId, action),
      status: status,
      result: status === 'success' ? generateMockResult(action) : null,
      error: status === 'error' ? '执行超时或参数无效' : null,
      startTime: executionDate.toISOString(),
      endTime: status !== 'running' ? new Date(executionDate.getTime() + executionTime).toISOString() : null,
      executionTime: status !== 'running' ? executionTime : null,
      agentId: `agent-${Math.floor(Math.random() * 5) + 1}`,
      sessionId: `session-${Math.floor(Math.random() * 10) + 1}`
    });
  }
  
  return mockExecutions;
}

/**
 * 根据工具ID和动作生成模拟参数
 * 
 * @param toolId 工具ID
 * @param action 动作名称
 * @returns 模拟参数对象
 */
function generateMockParameters(toolId: string, action: string) {
  const parameters: any = {};
  
  // 根据不同工具和动作生成不同的参数
  if (toolId === 'web-search') {
    if (action === 'search' || action === 'query') {
      parameters.query = ['人工智能', '机器学习', '深度学习', '区块链', '元宇宙'][Math.floor(Math.random() * 5)];
      parameters.limit = Math.floor(Math.random() * 10) + 5;
    } else if (action === 'news') {
      parameters.query = ['新技术', '科技新闻', '创业公司', '技术趋势'][Math.floor(Math.random() * 4)];
      parameters.days = Math.floor(Math.random() * 7) + 1;
    }
  } else if (toolId === 'file-management') {
    if (action === 'list') {
      parameters.path = ['/documents', '/downloads', '/projects', '/images'][Math.floor(Math.random() * 4)];
      parameters.recursive = Math.random() > 0.5;
    } else if (action === 'read') {
      parameters.path = ['/documents/report.txt', '/projects/readme.md', '/notes/todo.txt'][Math.floor(Math.random() * 3)];
    } else if (action === 'write') {
      parameters.path = ['/documents/new_file.txt', '/projects/log.md', '/notes/memo.txt'][Math.floor(Math.random() * 3)];
      parameters.content = '这是示例内容...';
    }
  } else if (toolId === 'database-query') {
    if (action === 'execute') {
      parameters.query = ['SELECT * FROM users LIMIT 10', 'SELECT count(*) FROM orders', 'SELECT * FROM products WHERE category = "electronics"'][Math.floor(Math.random() * 3)];
    } else if (action === 'describe') {
      parameters.table = ['users', 'orders', 'products', 'categories'][Math.floor(Math.random() * 4)];
    }
  }
  
  return parameters;
}

/**
 * 根据动作生成模拟结果
 * 
 * @param action 动作名称
 * @returns 模拟结果对象
 */
function generateMockResult(action: string) {
  if (action === 'search' || action === 'query' || action === 'news') {
    return {
      items: [
        { title: '示例结果 1', url: 'https://example.com/1', snippet: '这是第一个搜索结果的摘要...' },
        { title: '示例结果 2', url: 'https://example.com/2', snippet: '这是第二个搜索结果的摘要...' }
      ],
      total: Math.floor(Math.random() * 1000) + 100
    };
  } else if (action === 'list') {
    return {
      files: [
        { name: 'document1.txt', type: 'file', size: 1024 },
        { name: 'document2.pdf', type: 'file', size: 2048 },
        { name: 'images', type: 'directory' }
      ],
      count: 3
    };
  } else if (action === 'read') {
    return {
      content: '这是文件的内容示例...',
      size: Math.floor(Math.random() * 10000) + 1000,
      encoding: 'utf-8'
    };
  } else if (action === 'execute') {
    return {
      rows: [
        { id: 1, name: '示例1' },
        { id: 2, name: '示例2' }
      ],
      rowCount: 2,
      fields: ['id', 'name']
    };
  } else if (action === 'describe') {
    return {
      columns: [
        { name: 'id', type: 'INTEGER', nullable: false },
        { name: 'name', type: 'VARCHAR', nullable: false },
        { name: 'created_at', type: 'TIMESTAMP', nullable: true }
      ],
      primaryKey: ['id'],
      indexes: ['name_idx']
    };
  }
  
  return { message: '操作成功完成' };
} 