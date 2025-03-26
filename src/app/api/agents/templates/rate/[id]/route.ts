import { NextRequest, NextResponse } from 'next/server';
import { agentTemplateService } from '@/services/agent-template-service';

/**
 * 为模板评分
 * POST /api/agents/templates/rate/[id]
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { rating } = body;
        
        if (rating === undefined || rating < 0 || rating > 5) {
            return NextResponse.json({ 
                success: false, 
                error: '评分必须在0-5之间' 
            }, { status: 400 });
        }
        
        const newRating = agentTemplateService.rateTemplate(id, rating);
        
        if (newRating === null) {
            return NextResponse.json({ 
                success: false, 
                error: '未找到指定模板' 
            }, { status: 404 });
        }
        
        return NextResponse.json({ 
            success: true, 
            data: { id, rating: newRating } 
        });
        
    } catch (error) {
        console.error('模板评分错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '模板评分失败' 
        }, { status: 500 });
    }
} 