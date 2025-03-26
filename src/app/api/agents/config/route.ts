import { NextRequest, NextResponse } from 'next/server';
import { 
    getAllAgentConfigs, 
    getAgentConfigById, 
    createAgentConfig, 
    updateAgentConfig, 
    deleteAgentConfig, 
    cloneAgentConfig,
    getAgentTemplateByRole
} from '@/lib/agent-config-service';

/**
 * 获取代理配置
 * GET /api/agents/config - 获取所有代理配置
 * GET /api/agents/config?id=xxx - 获取特定代理配置
 * GET /api/agents/config?template=ROLE - 获取特定角色的代理模板
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        const template = searchParams.get('template');
        
        if (id) {
            const agent = await getAgentConfigById(id);
            
            if (!agent) {
                return NextResponse.json({ 
                    success: false, 
                    error: '未找到指定代理' 
                }, { status: 404 });
            }
            
            return NextResponse.json({ success: true, data: agent });
        }
        
        if (template) {
            try {
                const templateData = await getAgentTemplateByRole(template as any);
                return NextResponse.json({ success: true, data: templateData });
            } catch (error) {
                return NextResponse.json({ 
                    success: false, 
                    error: '无效的代理角色' 
                }, { status: 400 });
            }
        }
        
        const agents = await getAllAgentConfigs();
        return NextResponse.json({ success: true, data: agents });
        
    } catch (error) {
        console.error('获取代理配置错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '获取代理配置失败' 
        }, { status: 500 });
    }
}

/**
 * 创建新代理配置
 * POST /api/agents/config
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        if (!body.name || !body.role || !body.systemMessage) {
            return NextResponse.json({ 
                success: false, 
                error: '缺少必要参数' 
            }, { status: 400 });
        }
        
        const newAgent = await createAgentConfig(body);
        return NextResponse.json({ 
            success: true, 
            data: newAgent 
        }, { status: 201 });
        
    } catch (error) {
        console.error('创建代理配置错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '创建代理配置失败' 
        }, { status: 500 });
    }
}

/**
 * 更新代理配置
 * PUT /api/agents/config?id=xxx
 */
export async function PUT(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ 
                success: false, 
                error: '缺少代理ID' 
            }, { status: 400 });
        }
        
        const body = await request.json();
        const updatedAgent = await updateAgentConfig(id, body);
        
        if (!updatedAgent) {
            return NextResponse.json({ 
                success: false, 
                error: '未找到指定代理' 
            }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: updatedAgent });
        
    } catch (error) {
        console.error('更新代理配置错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '更新代理配置失败' 
        }, { status: 500 });
    }
}

/**
 * 删除代理配置
 * DELETE /api/agents/config?id=xxx
 */
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ 
                success: false, 
                error: '缺少代理ID' 
            }, { status: 400 });
        }
        
        const success = await deleteAgentConfig(id);
        
        if (!success) {
            return NextResponse.json({ 
                success: false, 
                error: '未找到指定代理' 
            }, { status: 404 });
        }
        
        return NextResponse.json({ 
            success: true, 
            message: '代理已成功删除' 
        });
        
    } catch (error) {
        console.error('删除代理配置错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '删除代理配置失败' 
        }, { status: 500 });
    }
}

/**
 * 克隆代理配置
 * POST /api/agents/config/clone?id=xxx
 */
export async function PATCH(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        const action = searchParams.get('action');
        
        if (!id) {
            return NextResponse.json({ 
                success: false, 
                error: '缺少代理ID' 
            }, { status: 400 });
        }
        
        if (action === 'clone') {
            const clonedAgent = await cloneAgentConfig(id);
            
            if (!clonedAgent) {
                return NextResponse.json({ 
                    success: false, 
                    error: '未找到指定代理' 
                }, { status: 404 });
            }
            
            return NextResponse.json({ 
                success: true, 
                data: clonedAgent 
            });
        }
        
        return NextResponse.json({ 
            success: false, 
            error: '未知操作' 
        }, { status: 400 });
        
    } catch (error) {
        console.error('操作代理配置错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '操作代理配置失败' 
        }, { status: 500 });
    }
} 