import { NextRequest, NextResponse } from 'next/server';
import AgentTemplateService from '@/services/agent-template-service';

/**
 * 导出模板
 * GET /api/agents/templates/[id]/export
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const templateService = AgentTemplateService.getInstance();
        const id = params.id;
        const exported = templateService.exportTemplate(id);
        
        if (!exported) {
            return NextResponse.json({ 
                success: false, 
                error: '未找到指定模板或导出失败' 
            }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: exported });
        
    } catch (error) {
        console.error('导出代理模板错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '导出代理模板失败' 
        }, { status: 500 });
    }
} 