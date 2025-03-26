import { NextRequest, NextResponse } from 'next/server';
import AgentTemplateService, { ITemplateRatingInput } from '@/services/agent-template-service';

/**
 * 对模板进行评分
 * POST /api/agents/templates/rate
 */
export async function POST(request: NextRequest) {
    try {
        const templateService = AgentTemplateService.getInstance();
        const body = await request.json();
        
        const { templateId, userId, rating, comment } = body;
        
        if (!templateId || !userId || !rating) {
            return NextResponse.json({ 
                success: false, 
                error: '缺少必要参数' 
            }, { status: 400 });
        }
        
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json({ 
                success: false, 
                error: '评分必须是1到5之间的数字' 
            }, { status: 400 });
        }
        
        const ratingInput: ITemplateRatingInput = {
            templateId,
            userId,
            rating,
            comment
        };
        
        const newRating = templateService.rateTemplate(ratingInput);
        
        if (newRating === null) {
            return NextResponse.json({ 
                success: false, 
                error: '未找到指定模板' 
            }, { status: 404 });
        }
        
        return NextResponse.json({ 
            success: true, 
            data: { 
                templateId, 
                averageRating: newRating 
            } 
        });
        
    } catch (error) {
        console.error('评分代理模板错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '评分代理模板失败' 
        }, { status: 500 });
    }
} 