import { NextRequest, NextResponse } from 'next/server';
import agentCapabilityService, { CapabilityType, ICapabilityFilter } from '@/services/agent-capability-service';

/**
 * 获取代理能力列表
 * GET /api/agents/capabilities - 获取所有能力
 * GET /api/agents/capabilities?type=tool - 按类型筛选能力
 * GET /api/agents/capabilities?search=关键词 - 按关键词搜索能力
 */
export async function GET(request: NextRequest) {
    try {
        // 确保服务已初始化
        await agentCapabilityService.initialize();
        
        const searchParams = request.nextUrl.searchParams;
        
        // 获取查询参数
        const typeParam = searchParams.get('type');
        const searchQuery = searchParams.get('search');
        const tagsParam = searchParams.get('tags');
        const builtinOnly = searchParams.get('builtinOnly') === 'true';
        
        // 根据参数确定要使用的方法
        if (typeParam === 'tool') {
            // 获取基于工具的能力
            const toolCapabilities = agentCapabilityService.getToolCapabilities();
            return NextResponse.json({ success: true, data: toolCapabilities });
        } else if (typeParam === 'reasoning') {
            // 获取推理能力
            const reasoningCapabilities = agentCapabilityService.getReasoningCapabilities();
            return NextResponse.json({ success: true, data: reasoningCapabilities });
        } else if (typeParam === 'knowledge') {
            // 获取知识能力
            const knowledgeCapabilities = agentCapabilityService.getKnowledgeCapabilities();
            return NextResponse.json({ success: true, data: knowledgeCapabilities });
        } else if (typeParam === 'communication') {
            // 获取通信能力
            const communicationCapabilities = agentCapabilityService.getCommunicationCapabilities();
            return NextResponse.json({ success: true, data: communicationCapabilities });
        } else if (searchQuery || tagsParam || typeParam || builtinOnly) {
            // 构建过滤器
            const filter: ICapabilityFilter = {};
            
            if (typeParam) {
                filter.type = typeParam as CapabilityType;
            }
            
            if (searchQuery) {
                filter.searchQuery = searchQuery;
            }
            
            if (tagsParam) {
                filter.tags = tagsParam.split(',');
            }
            
            filter.builtinOnly = builtinOnly;
            
            // 按条件搜索能力
            const capabilities = agentCapabilityService.searchCapabilities(filter);
            return NextResponse.json({ success: true, data: capabilities });
        } else {
            // 获取所有能力
            const capabilities = agentCapabilityService.getAllCapabilities();
            return NextResponse.json({ success: true, data: capabilities });
        }
    } catch (error) {
        console.error('获取代理能力错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '获取代理能力失败' 
        }, { status: 500 });
    }
}

/**
 * 注册新的代理能力
 * POST /api/agents/capabilities - 注册新能力
 */
export async function POST(request: NextRequest) {
    try {
        // 确保服务已初始化
        await agentCapabilityService.initialize();
        
        const body = await request.json();
        
        // 验证必需字段
        if (!body.name || !body.description || !body.type) {
            return NextResponse.json({ 
                success: false, 
                error: '能力名称、描述和类型为必填项' 
            }, { status: 400 });
        }
        
        // 注册能力
        const capabilityId = agentCapabilityService.registerCapability({
            name: body.name,
            description: body.description,
            type: body.type,
            toolId: body.toolId,
            tags: body.tags,
            isBuiltin: body.isBuiltin || false,
            params: body.params
        });
        
        // 获取创建的能力详情
        const capability = agentCapabilityService.getCapability(capabilityId);
        
        return NextResponse.json({ 
            success: true,
            data: capability 
        }, { status: 201 });
    } catch (error) {
        console.error('注册代理能力错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : '注册代理能力失败' 
        }, { status: 500 });
    }
} 