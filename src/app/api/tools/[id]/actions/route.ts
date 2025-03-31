import { NextResponse } from 'next/server';
import { mockTools } from '@/lib/mock-data';

/**
 * 工具操作列表API
 * 
 * 获取指定工具支持的所有操作清单
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

    // 模拟获取工具操作列表
    // 根据工具类型生成不同的操作列表
    const actions = [];
    
    // 为所有工具添加基础操作
    actions.push(
      {
        id: 'query',
        name: '查询',
        description: '使用工具查询信息',
        requiredParameters: ['query'],
        optionalParameters: ['limit', 'filter']
      }
    );
    
    // 根据工具类型添加特定操作
    if (tool.id === 'file-management') {
      actions.push(
        {
          id: 'list',
          name: '列出文件',
          description: '列出目录中的文件',
          requiredParameters: ['path'],
          optionalParameters: ['filter', 'recursive']
        },
        {
          id: 'read',
          name: '读取文件',
          description: '读取文件内容',
          requiredParameters: ['path'],
          optionalParameters: ['encoding', 'limit']
        },
        {
          id: 'write',
          name: '写入文件',
          description: '写入内容到文件',
          requiredParameters: ['path', 'content'],
          optionalParameters: ['encoding', 'append']
        }
      );
    }
    
    if (tool.id === 'database-query') {
      actions.push(
        {
          id: 'execute',
          name: '执行查询',
          description: '执行SQL查询',
          requiredParameters: ['query'],
          optionalParameters: ['params', 'timeout']
        },
        {
          id: 'describe',
          name: '描述表',
          description: '获取表结构',
          requiredParameters: ['table'],
          optionalParameters: []
        }
      );
    }
    
    if (tool.id === 'web-search') {
      actions.push(
        {
          id: 'search',
          name: '搜索',
          description: '执行网络搜索',
          requiredParameters: ['query'],
          optionalParameters: ['limit', 'region', 'safeSearch']
        },
        {
          id: 'news',
          name: '新闻搜索',
          description: '搜索最新新闻',
          requiredParameters: ['query'],
          optionalParameters: ['days', 'category']
        }
      );
    }

    // 返回工具操作列表
    return NextResponse.json({ 
      success: true, 
      data: { 
        toolId: tool.id,
        actions: actions 
      } 
    });
  } catch (error) {
    console.error('获取工具操作列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取工具操作列表失败' },
      { status: 500 }
    );
  }
}