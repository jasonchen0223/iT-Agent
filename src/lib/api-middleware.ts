/**
 * API中间件
 * 
 * 提供API请求处理和错误处理的中间件函数
 */

import { NextRequest, NextResponse } from 'next/server';
import { errorManager, ValidationError } from './errors';

/**
 * 请求处理器类型
 */
type RequestHandler = (
    request: NextRequest,
    context: { params?: any }
) => Promise<NextResponse | Response>;

/**
 * 创建带错误处理的API处理器
 * 
 * @param handler 原始请求处理函数
 * @returns 包装后的请求处理函数
 */
export function withErrorHandling(handler: RequestHandler): RequestHandler {
    return async (request: NextRequest, context: { params?: any }) => {
        try {
            return await handler(request, context);
        } catch (error) {
            console.error('API请求处理错误:', error);
            
            // 使用错误管理器格式化错误
            const errorResponse = errorManager.formatErrorForResponse(error as Error);
            const statusCode = errorManager.getStatusCodeForError(error as Error);
            
            return NextResponse.json(errorResponse, { status: statusCode });
        }
    };
}

/**
 * 验证请求体
 * 
 * @param body 请求体对象
 * @param requiredFields 必需的字段列表
 * @throws {ValidationError} 如果缺少必需字段
 */
export function validateRequestBody(
    body: any,
    requiredFields: string[]
): void {
    const missingFields = requiredFields.filter(field => {
        // 检查字段是否存在且不为null或undefined
        return body[field] === undefined || body[field] === null;
    });
    
    if (missingFields.length > 0) {
        throw new ValidationError(
            `请求缺少必需字段: ${missingFields.join(', ')}`,
            { missingFields }
        );
    }
}

/**
 * 标准API响应格式
 */
export function createSuccessResponse<T>(data: T, meta?: Record<string, any>): NextResponse {
    return NextResponse.json({
        success: true,
        data,
        meta
    });
}

/**
 * 创建分页响应
 */
export function createPaginatedResponse<T>(
    items: T[],
    page: number,
    limit: number,
    total: number
): NextResponse {
    return NextResponse.json({
        success: true,
        data: items,
        meta: {
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    });
} 