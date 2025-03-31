/**
 * 知识项目接口
 * 
 * 定义知识库中的单个知识文档项目结构
 */
export interface IKnowledgeItem {
    id: string;
    title: string;
    description?: string;
    content?: string;
    category?: string;
    categoryId?: string;
    tags?: string[];
    author?: string;
    createdAt?: string;
    updatedAt?: string;
    importance?: 'low' | 'medium' | 'high';
    relatedItems?: {
        id: string;
        title: string;
        description?: string;
    }[];
    attachments?: {
        id: string;
        name: string;
        type: string;
        size?: number;
        url?: string;
    }[];
}

/**
 * 知识分类接口
 * 
 * 定义知识分类结构
 */
export interface IKnowledgeCategory {
    id: string;
    name: string;
    description?: string;
    parentId?: string;
    count?: number;
}

/**
 * 知识筛选条件接口
 * 
 * 定义知识库筛选条件
 */
export interface IKnowledgeFilter {
    search: string;
    category: string;
    tags: string[];
    sortBy: 'newest' | 'oldest' | 'relevance';
}

/**
 * 知识标签接口
 * 
 * 定义知识标签结构
 */
export interface IKnowledgeTag {
    id: string;
    name: string;
    count: number;
}

/**
 * 知识管理状态接口
 * 
 * 定义知识管理系统状态
 */
export interface IKnowledgeState {
    items: IKnowledgeItem[];
    categories: IKnowledgeCategory[];
    tags: IKnowledgeTag[];
    currentItem: IKnowledgeItem | null;
    filters: IKnowledgeFilter;
    loading: boolean;
    error: string | null;
}

/**
 * 知识来源类型
 * 
 * 定义知识来源类型
 */
export type TKnowledgeSource = 
    | 'manual' 
    | 'imported' 
    | 'session' 
    | 'agent' 
    | 'external';

/**
 * 知识项目类型
 * 
 * 定义知识项目类型
 */
export type TKnowledgeType = 
    | 'document' 
    | 'url' 
    | 'snippet' 
    | 'image' 
    | 'video' 
    | 'audio'; 