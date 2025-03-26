/**
 * 代理模板服务
 * 
 * 管理代理模板的服务，提供模板的创建、读取、更新、删除等功能
 * 支持模板分类、标签和搜索查询
 */

import { v4 as uuidv4 } from 'uuid';
import { TAgentRole } from '@/types/agent-types';
import { IAgentConfig } from './agent-config-service';

/**
 * 模板分类枚举
 */
export enum TemplateCategory {
    /**
     * 通用 - 适用于多种场景的通用模板
     */
    GENERAL = 'general',
    
    /**
     * 开发 - 适用于软件开发场景的模板
     */
    DEVELOPMENT = 'development',
    
    /**
     * 创意 - 适用于创意写作和内容创作的模板
     */
    CREATIVE = 'creative',
    
    /**
     * 分析 - 适用于数据分析和研究的模板
     */
    ANALYSIS = 'analysis',
    
    /**
     * 教育 - 适用于教育和学习场景的模板
     */
    EDUCATION = 'education',
    
    /**
     * 商业 - 适用于商业和市场营销的模板
     */
    BUSINESS = 'business',
    
    /**
     * 客服 - 适用于客户服务的模板
     */
    CUSTOMER_SERVICE = 'customer_service',
    
    /**
     * 自定义 - 用户自定义分类
     */
    CUSTOM = 'custom'
}

/**
 * 模板元数据接口
 */
export interface ITemplateMetadata {
    /**
     * 分类
     */
    category: TemplateCategory;
    
    /**
     * 标签列表
     */
    tags: string[];
    
    /**
     * 难度等级(1-5)
     * 1: 初级 - 简单易用
     * 5: 高级 - 需要专业知识
     */
    difficultyLevel?: number;
    
    /**
     * 平均评分(1-5)
     */
    averageRating?: number;
    
    /**
     * 评分人数
     */
    ratingCount?: number;
    
    /**
     * 使用次数
     */
    usageCount?: number;
    
    /**
     * 推荐顺序
     */
    recommendationOrder?: number;
    
    /**
     * 是否官方模板
     */
    isOfficial?: boolean;
    
    /**
     * 是否精选模板
     */
    isFeatured?: boolean;
    
    /**
     * 兼容的模型列表
     */
    compatibleModels?: string[];
    
    /**
     * 作者ID
     */
    authorId?: string;
    
    /**
     * 作者名称
     */
    authorName?: string;
    
    /**
     * 自定义分类名称
     */
    customCategoryName?: string;
    
    /**
     * 额外元数据
     */
    extra?: Record<string, any>;
}

/**
 * 代理模板接口
 */
export interface IAgentTemplate extends IAgentConfig {
    /**
     * 模板元数据
     */
    templateMetadata: ITemplateMetadata;
}

/**
 * 模板搜索过滤器接口
 */
export interface ITemplateFilter {
    /**
     * 角色
     */
    role?: TAgentRole;
    
    /**
     * 分类
     */
    category?: TemplateCategory;
    
    /**
     * 标签列表(任意一个匹配即可)
     */
    tags?: string[];
    
    /**
     * 搜索关键词(匹配名称或描述)
     */
    searchQuery?: string;
    
    /**
     * 最低评分
     */
    minRating?: number;
    
    /**
     * 最高评分
     */
    maxRating?: number;
    
    /**
     * 是否只显示官方模板
     */
    officialOnly?: boolean;
    
    /**
     * 是否只显示精选模板
     */
    featuredOnly?: boolean;
    
    /**
     * 作者ID
     */
    authorId?: string;
    
    /**
     * 排序字段
     */
    sortBy?: 'name' | 'createdAt' | 'usageCount' | 'rating';
    
    /**
     * 排序方向
     */
    sortOrder?: 'asc' | 'desc';
}

/**
 * 模板评分输入接口
 */
export interface ITemplateRatingInput {
    /**
     * 模板ID
     */
    templateId: string;
    
    /**
     * 用户ID
     */
    userId: string;
    
    /**
     * 评分(1-5)
     */
    rating: number;
    
    /**
     * 评论
     */
    comment?: string;
}

/**
 * 代理模板服务类
 */
export class AgentTemplateService {
    /**
     * 模板存储
     */
    private templates: Map<string, IAgentTemplate> = new Map();
    
    /**
     * 用户评分记录
     */
    private userRatings: Map<string, Map<string, number>> = new Map();
    
    /**
     * 单例实例
     */
    private static instance: AgentTemplateService;
    
    /**
     * 获取服务实例
     */
    public static getInstance(): AgentTemplateService {
        if (!AgentTemplateService.instance) {
            AgentTemplateService.instance = new AgentTemplateService();
        }
        
        return AgentTemplateService.instance;
    }
    
    /**
     * 私有构造函数
     */
    private constructor() {
        this.initializeDefaultTemplates();
    }
    
    /**
     * 初始化默认模板
     */
    private initializeDefaultTemplates(): void {
        // 通用助手模板
        this.createTemplate({
            id: 'general-assistant',
            name: '通用助手',
            description: '全能的AI助手，可以回答问题、提供建议和协助各种任务',
            role: TAgentRole.ASSISTANT,
            systemPrompt: '你是一个全能的AI助手。你的任务是回答用户问题、提供有用信息，并协助完成各种任务。保持友好、专业和有帮助的态度。',
            tools: [],
            permissions: {
                allowedTools: ['*'],
                allowedRecipients: ['*'],
                canCreateSession: true,
                canEndSession: true,
                isAdmin: false
            },
            modelConfig: {
                modelName: 'CLAUDE_3_SONNET',
                temperature: 0.7,
                maxTokens: 4096
            },
            templateMetadata: {
                category: TemplateCategory.GENERAL,
                tags: ['助手', '通用', '入门'],
                difficultyLevel: 1,
                isOfficial: true,
                isFeatured: true,
                usageCount: 0,
                ratingCount: 0,
                recommendationOrder: 1
            }
        });
        
        // 代码助手模板
        this.createTemplate({
            id: 'code-assistant',
            name: '代码助手',
            description: '专业的编程助手，可以帮助编写、调试和优化代码',
            role: TAgentRole.EXPERT,
            systemPrompt: '你是一个专业的编程助手。你的任务是帮助用户编写、调试和优化代码。提供清晰的解释，并遵循最佳编程实践。优先考虑代码的可读性、效率和安全性。',
            tools: ['terminal-command', 'file-reader', 'file-writer'],
            permissions: {
                allowedTools: ['terminal-command', 'file-reader', 'file-writer', 'http-request'],
                allowedRecipients: ['*'],
                canCreateSession: true,
                canEndSession: true,
                isAdmin: false
            },
            modelConfig: {
                modelName: 'CLAUDE_3_OPUS',
                temperature: 0.3,
                maxTokens: 4096
            },
            templateMetadata: {
                category: TemplateCategory.DEVELOPMENT,
                tags: ['编程', '代码', '开发', '技术'],
                difficultyLevel: 3,
                isOfficial: true,
                isFeatured: true,
                usageCount: 0,
                ratingCount: 0,
                recommendationOrder: 2,
                compatibleModels: ['CLAUDE_3_OPUS', 'CLAUDE_3_SONNET', 'GPT4']
            }
        });
        
        // 创意写作助手模板
        this.createTemplate({
            id: 'creative-writer',
            name: '创意写作助手',
            description: '专注于创意写作的助手，可以帮助创作故事、诗歌和各种文学作品',
            role: TAgentRole.EXPERT,
            systemPrompt: '你是一个创意写作助手。你的任务是帮助用户创作故事、诗歌、剧本和各种文学作品。提供创意建议，帮助完善写作风格，并激发灵感。注重表达的独特性和艺术性。',
            tools: [],
            permissions: {
                allowedTools: ['file-reader', 'file-writer'],
                allowedRecipients: ['*'],
                canCreateSession: true,
                canEndSession: true,
                isAdmin: false
            },
            modelConfig: {
                modelName: 'CLAUDE_3_OPUS',
                temperature: 0.9,
                maxTokens: 8192
            },
            templateMetadata: {
                category: TemplateCategory.CREATIVE,
                tags: ['写作', '创意', '文学', '艺术'],
                difficultyLevel: 2,
                isOfficial: true,
                isFeatured: true,
                usageCount: 0,
                ratingCount: 0,
                recommendationOrder: 3
            }
        });
        
        // 数据分析师模板
        this.createTemplate({
            id: 'data-analyst',
            name: '数据分析师',
            description: '专业的数据分析助手，可以帮助分析数据、生成报告和可视化',
            role: TAgentRole.EXPERT,
            systemPrompt: '你是一个专业的数据分析师。你的任务是帮助用户分析数据、识别模式和趋势，并生成有意义的见解。提供准确的统计分析和数据解释，并建议适当的可视化方法。',
            tools: ['file-reader', 'data-processor'],
            permissions: {
                allowedTools: ['file-reader', 'data-processor', 'http-request'],
                allowedRecipients: ['*'],
                canCreateSession: true,
                canEndSession: true,
                isAdmin: false
            },
            modelConfig: {
                modelName: 'CLAUDE_3_OPUS',
                temperature: 0.2,
                maxTokens: 4096
            },
            templateMetadata: {
                category: TemplateCategory.ANALYSIS,
                tags: ['数据', '分析', '统计', '报告'],
                difficultyLevel: 4,
                isOfficial: true,
                isFeatured: false,
                usageCount: 0,
                ratingCount: 0,
                recommendationOrder: 4
            }
        });
        
        // 项目协调员模板
        this.createTemplate({
            id: 'project-coordinator',
            name: '项目协调员',
            description: '专注于项目管理和团队协调的助手',
            role: TAgentRole.COORDINATOR,
            systemPrompt: '你是一个项目协调员。你的任务是帮助管理项目进度、协调团队成员工作、制定计划和跟踪任务完成情况。提供清晰的沟通，确保项目按时高质量完成。',
            tools: [],
            permissions: {
                allowedTools: ['file-reader', 'file-writer', 'http-request'],
                allowedRecipients: ['*'],
                canCreateSession: true,
                canEndSession: true,
                isAdmin: false
            },
            modelConfig: {
                modelName: 'CLAUDE_3_SONNET',
                temperature: 0.5,
                maxTokens: 4096
            },
            templateMetadata: {
                category: TemplateCategory.BUSINESS,
                tags: ['项目管理', '协调', '团队', '组织'],
                difficultyLevel: 3,
                isOfficial: true,
                isFeatured: false,
                usageCount: 0,
                ratingCount: 0,
                recommendationOrder: 5
            }
        });
    }
    
    /**
     * 创建新模板
     * 
     * @param template 模板数据
     * @returns 创建的模板ID
     */
    public createTemplate(template: Partial<IAgentTemplate> & { name: string; role: TAgentRole; systemPrompt: string }): string {
        const id = template.id || uuidv4();
        const now = new Date();
        
        const newTemplate: IAgentTemplate = {
            id,
            name: template.name,
            description: template.description || '',
            role: template.role,
            systemPrompt: template.systemPrompt,
            tools: template.tools || [],
            permissions: template.permissions || {
                allowedTools: [],
                allowedRecipients: []
            },
            modelConfig: template.modelConfig || {
                modelName: 'CLAUDE_3_SONNET'
            },
            createdAt: template.createdAt || now,
            updatedAt: template.updatedAt || now,
            templateMetadata: template.templateMetadata || {
                category: TemplateCategory.CUSTOM,
                tags: [],
                usageCount: 0,
                ratingCount: 0
            },
            ...template
        };
        
        this.templates.set(id, newTemplate);
        return id;
    }
    
    /**
     * 获取模板
     * 
     * @param id 模板ID
     * @returns 模板对象或null
     */
    public getTemplate(id: string): IAgentTemplate | null {
        return this.templates.get(id) || null;
    }
    
    /**
     * 更新模板
     * 
     * @param id 模板ID
     * @param updates 更新的字段
     * @returns 更新后的模板对象或null
     */
    public updateTemplate(id: string, updates: Partial<IAgentTemplate>): IAgentTemplate | null {
        const template = this.templates.get(id);
        if (!template) return null;
        
        const updatedTemplate = {
            ...template,
            ...updates,
            updatedAt: new Date(),
            templateMetadata: {
                ...template.templateMetadata,
                ...(updates.templateMetadata || {})
            }
        };
        
        this.templates.set(id, updatedTemplate);
        return updatedTemplate;
    }
    
    /**
     * 删除模板
     * 
     * @param id 模板ID
     * @returns 是否删除成功
     */
    public deleteTemplate(id: string): boolean {
        return this.templates.delete(id);
    }
    
    /**
     * 获取所有模板
     * 
     * @returns 所有模板的数组
     */
    public getAllTemplates(): IAgentTemplate[] {
        return Array.from(this.templates.values());
    }
    
    /**
     * 根据过滤条件搜索模板
     * 
     * @param filter 搜索过滤条件
     * @returns 符合条件的模板数组
     */
    public searchTemplates(filter: ITemplateFilter = {}): IAgentTemplate[] {
        let results = this.getAllTemplates();
        
        // 按角色筛选
        if (filter.role) {
            results = results.filter(template => template.role === filter.role);
        }
        
        // 按分类筛选
        if (filter.category) {
            results = results.filter(template => template.templateMetadata.category === filter.category);
        }
        
        // 按标签筛选
        if (filter.tags && filter.tags.length > 0) {
            results = results.filter(template => 
                filter.tags!.some(tag => template.templateMetadata.tags.includes(tag))
            );
        }
        
        // 按关键词搜索
        if (filter.searchQuery) {
            const query = filter.searchQuery.toLowerCase();
            results = results.filter(template => 
                template.name.toLowerCase().includes(query) || 
                template.description.toLowerCase().includes(query)
            );
        }
        
        // 按评分范围筛选
        if (filter.minRating !== undefined) {
            results = results.filter(template => 
                (template.templateMetadata.averageRating || 0) >= filter.minRating!
            );
        }
        
        if (filter.maxRating !== undefined) {
            results = results.filter(template => 
                (template.templateMetadata.averageRating || 5) <= filter.maxRating!
            );
        }
        
        // 按官方模板筛选
        if (filter.officialOnly) {
            results = results.filter(template => template.templateMetadata.isOfficial);
        }
        
        // 按精选模板筛选
        if (filter.featuredOnly) {
            results = results.filter(template => template.templateMetadata.isFeatured);
        }
        
        // 按作者筛选
        if (filter.authorId) {
            results = results.filter(template => template.templateMetadata.authorId === filter.authorId);
        }
        
        // 排序
        if (filter.sortBy) {
            results.sort((a, b) => {
                let valueA: any;
                let valueB: any;
                
                switch (filter.sortBy) {
                    case 'name':
                        valueA = a.name;
                        valueB = b.name;
                        break;
                    case 'createdAt':
                        valueA = a.createdAt;
                        valueB = b.createdAt;
                        break;
                    case 'usageCount':
                        valueA = a.templateMetadata.usageCount || 0;
                        valueB = b.templateMetadata.usageCount || 0;
                        break;
                    case 'rating':
                        valueA = a.templateMetadata.averageRating || 0;
                        valueB = b.templateMetadata.averageRating || 0;
                        break;
                    default:
                        valueA = a.name;
                        valueB = b.name;
                }
                
                if (filter.sortOrder === 'desc') {
                    return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
                } else {
                    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
                }
            });
        }
        
        return results;
    }
    
    /**
     * 获取推荐模板
     * 
     * @param limit 限制数量
     * @returns 推荐模板数组
     */
    public getRecommendedTemplates(limit: number = 5): IAgentTemplate[] {
        return this.getAllTemplates()
            .filter(template => template.templateMetadata.isFeatured)
            .sort((a, b) => 
                (a.templateMetadata.recommendationOrder || 999) - 
                (b.templateMetadata.recommendationOrder || 999)
            )
            .slice(0, limit);
    }
    
    /**
     * 获取热门模板
     * 
     * @param limit 限制数量
     * @returns 热门模板数组
     */
    public getPopularTemplates(limit: number = 5): IAgentTemplate[] {
        return this.getAllTemplates()
            .sort((a, b) => 
                (b.templateMetadata.usageCount || 0) - 
                (a.templateMetadata.usageCount || 0)
            )
            .slice(0, limit);
    }
    
    /**
     * 获取高评分模板
     * 
     * @param limit 限制数量
     * @returns 高评分模板数组
     */
    public getTopRatedTemplates(limit: number = 5): IAgentTemplate[] {
        return this.getAllTemplates()
            .filter(template => (template.templateMetadata.ratingCount || 0) > 0)
            .sort((a, b) => 
                (b.templateMetadata.averageRating || 0) - 
                (a.templateMetadata.averageRating || 0)
            )
            .slice(0, limit);
    }
    
    /**
     * 获取按分类分组的模板
     * 
     * @returns 分类模板映射
     */
    public getTemplatesByCategory(): Record<TemplateCategory, IAgentTemplate[]> {
        const result: Record<TemplateCategory, IAgentTemplate[]> = {} as any;
        
        // 初始化所有分类
        Object.values(TemplateCategory).forEach(category => {
            result[category] = [];
        });
        
        // 将模板分组到对应分类
        this.getAllTemplates().forEach(template => {
            const category = template.templateMetadata.category;
            result[category].push(template);
        });
        
        return result;
    }
    
    /**
     * 增加模板使用计数
     * 
     * @param id 模板ID
     */
    public incrementUsageCount(id: string): void {
        const template = this.templates.get(id);
        if (template) {
            const currentCount = template.templateMetadata.usageCount || 0;
            template.templateMetadata.usageCount = currentCount + 1;
            this.templates.set(id, template);
        }
    }
    
    /**
     * 对模板进行评分
     * 
     * @param input 评分输入
     * @returns 更新后的平均评分
     */
    public rateTemplate(input: ITemplateRatingInput): number | null {
        const { templateId, userId, rating } = input;
        
        // 验证参数
        if (rating < 1 || rating > 5) {
            throw new Error('评分必须在1到5之间');
        }
        
        const template = this.templates.get(templateId);
        if (!template) return null;
        
        // 获取用户之前的评分
        if (!this.userRatings.has(userId)) {
            this.userRatings.set(userId, new Map());
        }
        
        const userRatingsMap = this.userRatings.get(userId)!;
        const previousRating = userRatingsMap.get(templateId);
        
        // 更新用户评分
        userRatingsMap.set(templateId, rating);
        
        // 更新模板评分统计
        const metadata = template.templateMetadata;
        const ratingCount = metadata.ratingCount || 0;
        const totalRating = (metadata.averageRating || 0) * ratingCount;
        
        let newTotalRating: number;
        let newRatingCount: number;
        
        if (previousRating) {
            // 更新已有评分
            newTotalRating = totalRating - previousRating + rating;
            newRatingCount = ratingCount;
        } else {
            // 新增评分
            newTotalRating = totalRating + rating;
            newRatingCount = ratingCount + 1;
        }
        
        const newAverageRating = newRatingCount > 0 ? newTotalRating / newRatingCount : 0;
        
        // 更新模板元数据
        template.templateMetadata.averageRating = newAverageRating;
        template.templateMetadata.ratingCount = newRatingCount;
        this.templates.set(templateId, template);
        
        return newAverageRating;
    }
    
    /**
     * 克隆模板
     * 
     * @param id 源模板ID
     * @param newName 新模板名称
     * @param authorId 作者ID
     * @returns 新模板ID
     */
    public cloneTemplate(id: string, newName: string, authorId: string): string | null {
        const template = this.templates.get(id);
        if (!template) return null;
        
        const newTemplateId = uuidv4();
        const now = new Date();
        
        const clonedTemplate: IAgentTemplate = {
            ...template,
            id: newTemplateId,
            name: newName,
            createdAt: now,
            updatedAt: now,
            templateMetadata: {
                ...template.templateMetadata,
                authorId,
                isOfficial: false,
                isFeatured: false,
                usageCount: 0,
                ratingCount: 0,
                averageRating: undefined
            }
        };
        
        this.templates.set(newTemplateId, clonedTemplate);
        return newTemplateId;
    }
    
    /**
     * 导出模板
     * 
     * @param id 模板ID
     * @returns 模板JSON字符串
     */
    public exportTemplate(id: string): string | null {
        const template = this.templates.get(id);
        if (!template) return null;
        
        return JSON.stringify(template, null, 2);
    }
    
    /**
     * 导入模板
     * 
     * @param jsonData 模板JSON字符串
     * @returns 导入的模板ID
     */
    public importTemplate(jsonData: string): string | null {
        try {
            const templateData = JSON.parse(jsonData) as IAgentTemplate;
            const id = uuidv4();
            
            const now = new Date();
            const importedTemplate: IAgentTemplate = {
                ...templateData,
                id,
                createdAt: now,
                updatedAt: now,
                templateMetadata: {
                    ...templateData.templateMetadata,
                    isOfficial: false,
                    usageCount: 0,
                    ratingCount: 0,
                    averageRating: undefined
                }
            };
            
            this.templates.set(id, importedTemplate);
            return id;
        } catch (error) {
            console.error('导入模板失败:', error);
            return null;
        }
    }
}

export default AgentTemplateService; 