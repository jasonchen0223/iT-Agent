/**
 * 工具详情API路由
 * 
 * 根据ID获取单个工具的详细信息
 */
import { NextRequest } from 'next/server';
import { toolService } from '@/services/tool-service';
import { withErrorHandling, createSuccessResponse } from '@/lib/api-middleware';
import { NotFoundError, ValidationError } from '@/lib/errors';

/**
 * 获取工具详情
 * 
 * @param {NextRequest} request - 请求对象
 * @param {Object} params - 路由参数
 * @returns 包含工具详情的响应
 */
export const GET = withErrorHandling(async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    const toolId = params.id;
    
    if (!toolId) {
        throw new ValidationError('工具ID不能为空');
    }
    
    const tool = await toolService.getToolById(toolId);
    
    if (!tool) {
        throw new NotFoundError(`未找到ID为${toolId}的工具`);
    }
    
    return createSuccessResponse(tool);
}); 