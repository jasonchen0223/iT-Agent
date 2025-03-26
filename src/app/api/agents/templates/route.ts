import { NextRequest, NextResponse } from 'next/server';
import AgentTemplateService, { TemplateCategory, ITemplateFilter } from '@/services/agent-template-service';

/**
 * 获取代理模板
 * GET /api/agents/templates - 获取所有模板
 * GET /api/agents/templates?popular=true - 获取热门模板
 * GET /api/agents/templates?recommended=true - 获取推荐模板
 * GET /api/agents/templates?rated=true - 获取高评分模板
 * GET /api/agents/templates?category=xxx - 按分类获取模板
 */
export async function GET(request: NextRequest) {
    try {
        const templateService = AgentTemplateService.getInstance();
        const searchParams = request.nextUrl.searchParams;
        
        // 获取热门模板
        if (searchParams.get('popular') === 'true') {
            const limit = parseInt(searchParams.get('limit') || '5', 10);
            const popularTemplates = templateService.getPopularTemplates(limit);
            return NextResponse.json({ success: true, data: popularTemplates });
        }
        
        // 获取推荐模板
        if (searchParams.get('recommended') === 'true') {
            const limit = parseInt(searchParams.get('limit') || '5', 10);
            const recommendedTemplates = templateService.getRecommendedTemplates(limit);
            return NextResponse.json({ success: true, data: recommendedTemplates });
        }
        
        // 获取高评分模板
        if (searchParams.get('rated') === 'true') {
            const limit = parseInt(searchParams.get('limit') || '5', 10);
            const topRatedTemplates = templateService.getTopRatedTemplates(limit);
            return NextResponse.json({ success: true, data: topRatedTemplates });
        }
        
        // 获取分类列表
        if (searchParams.get('categories') === 'true') {
            const categories = Object.values(TemplateCategory);
            return NextResponse.json({ success: true, data: categories });
        }
        
        // 获取按分类分组的模板
        if (searchParams.get('byCategory') === 'true') {
            const templatesByCategory = templateService.getTemplatesByCategory();
            return NextResponse.json({ success: true, data: templatesByCategory });
        }
        
        // 构建过滤器
        const filter: ITemplateFilter = {};
        
        if (searchParams.has('category')) {
            filter.category = searchParams.get('category') as TemplateCategory;
        }
        
        if (searchParams.has('role')) {
            filter.role = searchParams.get('role') as any;
        }
        
        if (searchParams.has('search')) {
            filter.searchQuery = searchParams.get('search')!;
        }
        
        if (searchParams.has('minRating')) {
            filter.minRating = parseFloat(searchParams.get('minRating')!);
        }
        
        if (searchParams.has('maxRating')) {
            filter.maxRating = parseFloat(searchParams.get('maxRating')!);
        }
        
        if (searchParams.has('officialOnly')) {
            filter.officialOnly = searchParams.get('officialOnly') === 'true';
        }
        
        if (searchParams.has('featuredOnly')) {
            filter.featuredOnly = searchParams.get('featuredOnly') === 'true';
        }
        
        if (searchParams.has('authorId')) {
            filter.authorId = searchParams.get('authorId')!;
        }
        
        const tags = searchParams.getAll('tag');
        if (tags.length > 0) {
            filter.tags = tags;
        }
        
        if (searchParams.has('sortBy')) {
            filter.sortBy = searchParams.get('sortBy') as any;
        }
        
        if (searchParams.has('sortOrder')) {
            filter.sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc';
        }
        
        // 获取模板列表（根据过滤器）
        const templates = Object.keys(filter).length > 0 
            ? templateService.searchTemplates(filter)
            : templateService.getAllTemplates();
        
        return NextResponse.json({ success: true, data: templates });
        
    } catch (error) {
        console.error('获取代理模板错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '获取代理模板失败' 
        }, { status: 500 });
    }
}

/**
 * 创建代理模板
 * POST /api/agents/templates - 创建新模板
 */
export async function POST(request: NextRequest) {
    try {
        const templateService = AgentTemplateService.getInstance();
        const body = await request.json();
        
        // 从配置创建模板
        if (body.fromConfig) {
            const { configId, templateName, authorId } = body;
            
            if (!configId || !templateName) {
                return NextResponse.json({ 
                    success: false, 
                    error: '缺少必要参数' 
                }, { status: 400 });
            }
            
            const templateId = templateService.cloneTemplate(configId, templateName, authorId || 'system');
            
            if (!templateId) {
                return NextResponse.json({ 
                    success: false, 
                    error: '未找到指定配置或创建失败' 
                }, { status: 404 });
            }
            
            const template = templateService.getTemplate(templateId);
            return NextResponse.json({ success: true, data: template }, { status: 201 });
        }
        
        // 导入模板
        if (body.importData) {
            const templateId = templateService.importTemplate(body.importData);
            
            if (!templateId) {
                return NextResponse.json({ 
                    success: false, 
                    error: '导入模板失败，格式可能不正确' 
                }, { status: 400 });
            }
            
            const template = templateService.getTemplate(templateId);
            return NextResponse.json({ success: true, data: template }, { status: 201 });
        }
        
        // 创建新模板
        if (!body.name || !body.role || !body.systemPrompt) {
            return NextResponse.json({ 
                success: false, 
                error: '缺少必要参数' 
            }, { status: 400 });
        }
        
        const templateId = templateService.createTemplate(body);
        const template = templateService.getTemplate(templateId);
        
        return NextResponse.json({ success: true, data: template }, { status: 201 });
        
    } catch (error) {
        console.error('创建代理模板错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '创建代理模板失败' 
        }, { status: 500 });
    }
}

/**
 * 更新代理模板元数据
 * PATCH /api/agents/templates/:id - 更新模板元数据
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { metadata } = body;
        
        if (!metadata) {
            return NextResponse.json({ 
                success: false, 
                error: '缺少元数据' 
            }, { status: 400 });
        }
        
        const updatedTemplate = agentTemplateService.updateTemplateMetadata(id, metadata);
        
        if (!updatedTemplate) {
            return NextResponse.json({ 
                success: false, 
                error: '未找到指定模板' 
            }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: updatedTemplate });
        
    } catch (error) {
        console.error('更新代理模板元数据错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '更新代理模板元数据失败' 
        }, { status: 500 });
    }
}

/**
 * 删除代理模板
 * DELETE /api/agents/templates/:id - 删除模板
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const success = agentTemplateService.deleteTemplate(id);
        
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