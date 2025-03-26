import { NextRequest, NextResponse } from 'next/server';
import AgentTemplateService from '@/services/agent-template-service';

/**
 * 获取特定模板
 * GET /api/agents/templates/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const templateService = AgentTemplateService.getInstance();
        const id = params.id;
        const template = templateService.getTemplate(id);
        
        if (!template) {
            return NextResponse.json({ 
                success: false, 
                error: '未找到指定模板' 
            }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: template });
        
    } catch (error) {
        console.error('获取代理模板错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '获取代理模板失败' 
        }, { status: 500 });
    }
}

/**
 * 更新模板
 * PATCH /api/agents/templates/[id]
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const templateService = AgentTemplateService.getInstance();
        const id = params.id;
        const body = await request.json();
        
        const updatedTemplate = templateService.updateTemplate(id, body);
        
        if (!updatedTemplate) {
            return NextResponse.json({ 
                success: false, 
                error: '未找到指定模板' 
            }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: updatedTemplate });
        
    } catch (error) {
        console.error('更新代理模板错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '更新代理模板失败' 
        }, { status: 500 });
    }
}

/**
 * 删除模板
 * DELETE /api/agents/templates/[id]
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const templateService = AgentTemplateService.getInstance();
        const id = params.id;
        const success = templateService.deleteTemplate(id);
        
        if (!success) {
            return NextResponse.json({ 
                success: false, 
                error: '未找到指定模板或删除失败' 
            }, { status: 404 });
        }
        
        return NextResponse.json({ success: true });
        
    } catch (error) {
        console.error('删除代理模板错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '删除代理模板失败' 
        }, { status: 500 });
    }
} 