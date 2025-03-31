import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface KnowledgeFilterProps {
    filters: {
        search: string;
        category: string;
        tags: string[];
        sortBy: 'newest' | 'oldest' | 'relevance';
    };
    categories: { id: string; name: string }[];
    availableTags: string[];
    onFilterChange: (newFilters: KnowledgeFilterProps['filters']) => void;
}

/**
 * 知识筛选组件
 * 
 * 用于筛选和排序知识库内容
 * 
 * @param {KnowledgeFilterProps} props - 组件属性
 * @returns {React.ReactElement} 知识筛选组件
 */
export const KnowledgeFilter: React.FC<KnowledgeFilterProps> = ({
    filters,
    categories,
    availableTags,
    onFilterChange,
}) => {
    // 处理搜索输入变化
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({
            ...filters,
            search: e.target.value,
        });
    };

    // 处理分类选择变化
    const handleCategoryChange = (value: string) => {
        onFilterChange({
            ...filters,
            category: value,
        });
    };

    // 处理排序方式变化
    const handleSortChange = (value: 'newest' | 'oldest' | 'relevance') => {
        onFilterChange({
            ...filters,
            sortBy: value,
        });
    };

    // 添加标签
    const handleAddTag = (tag: string) => {
        if (!filters.tags.includes(tag)) {
            onFilterChange({
                ...filters,
                tags: [...filters.tags, tag],
            });
        }
    };

    // 移除标签
    const handleRemoveTag = (tag: string) => {
        onFilterChange({
            ...filters,
            tags: filters.tags.filter(t => t !== tag),
        });
    };

    // 清空所有筛选条件
    const handleClearFilters = () => {
        onFilterChange({
            search: '',
            category: '',
            tags: [],
            sortBy: 'newest',
        });
    };

    // 计算筛选条件数量
    const filterCount = (filters.search ? 1 : 0) + 
                        (filters.category ? 1 : 0) + 
                        filters.tags.length;

    return (
        <div className="space-card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Input
                        className="pl-10 bg-indigo-900/20 border-indigo-800/30 text-indigo-100"
                        placeholder="搜索知识库..."
                        value={filters.search}
                        onChange={handleSearchChange}
                    />
                    <svg 
                        className="w-5 h-5 absolute left-3 top-2.5 text-indigo-300/70"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                <Select
                    value={filters.category}
                    onValueChange={handleCategoryChange}
                >
                    <SelectTrigger className="w-[180px] bg-indigo-900/20 border-indigo-800/30 text-indigo-100">
                        <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent className="bg-indigo-950 border-indigo-800/30">
                        <SelectItem value="">全部分类</SelectItem>
                        {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.sortBy}
                    onValueChange={handleSortChange}
                >
                    <SelectTrigger className="w-[180px] bg-indigo-900/20 border-indigo-800/30 text-indigo-100">
                        <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent className="bg-indigo-950 border-indigo-800/30">
                        <SelectItem value="newest">最新添加</SelectItem>
                        <SelectItem value="oldest">最早添加</SelectItem>
                        <SelectItem value="relevance">相关程度</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {filterCount > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-indigo-300/70">当前筛选：</span>
                    
                    {filters.category && categories.find(c => c.id === filters.category) && (
                        <Badge className="bg-indigo-900/30 text-indigo-300 flex items-center gap-1">
                            分类: {categories.find(c => c.id === filters.category)?.name}
                            <X 
                                size={14} 
                                className="cursor-pointer" 
                                onClick={() => handleCategoryChange('')}
                            />
                        </Badge>
                    )}
                    
                    {filters.tags.map(tag => (
                        <Badge key={tag} className="bg-indigo-900/30 text-indigo-300 flex items-center gap-1">
                            {tag}
                            <X 
                                size={14} 
                                className="cursor-pointer" 
                                onClick={() => handleRemoveTag(tag)}
                            />
                        </Badge>
                    ))}
                    
                    {filterCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-indigo-300 hover:text-indigo-200"
                            onClick={handleClearFilters}
                        >
                            清除筛选
                        </Button>
                    )}
                </div>
            )}

            {availableTags.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm text-indigo-300/70 mb-2">常用标签：</p>
                    <div className="flex flex-wrap gap-2">
                        {availableTags
                            .filter(tag => !filters.tags.includes(tag))
                            .slice(0, 10)
                            .map(tag => (
                                <Badge 
                                    key={tag} 
                                    className="bg-indigo-900/20 text-indigo-300 cursor-pointer hover:bg-indigo-900/30"
                                    onClick={() => handleAddTag(tag)}
                                >
                                    {tag}
                                </Badge>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}; 