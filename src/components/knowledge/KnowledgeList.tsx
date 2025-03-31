import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { IKnowledgeItem } from '@/types/knowledge';

interface KnowledgeListProps {
    items: IKnowledgeItem[];
    onItemClick: (item: IKnowledgeItem) => void;
    isLoading?: boolean;
}

/**
 * 知识列表组件
 * 
 * 展示知识库中的文档列表
 * 
 * @param {KnowledgeListProps} props - 组件属性
 * @returns {React.ReactElement} 知识列表组件
 */
export const KnowledgeList: React.FC<KnowledgeListProps> = ({
    items,
    onItemClick,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-indigo-900/20 border-indigo-800/30 animate-pulse">
                        <CardContent className="p-4">
                            <div className="h-6 w-2/3 bg-indigo-800/50 rounded mb-3"></div>
                            <div className="h-4 w-full bg-indigo-800/40 rounded mb-3"></div>
                            <div className="h-4 w-5/6 bg-indigo-800/40 rounded"></div>
                            <div className="flex mt-3 gap-2">
                                <div className="h-6 w-16 bg-indigo-800/50 rounded-full"></div>
                                <div className="h-6 w-16 bg-indigo-800/50 rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <Card className="bg-indigo-900/20 border-indigo-800/30">
                <CardContent className="p-6 text-center">
                    <p className="text-indigo-300/70">暂无知识文档</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <Card 
                    key={item.id}
                    className="bg-indigo-900/20 border-indigo-800/30 hover:bg-indigo-900/30 transition-colors cursor-pointer"
                    onClick={() => onItemClick(item)}
                >
                    <CardContent className="p-4">
                        <div className="flex justify-between">
                            <h3 className="text-indigo-100 font-medium">{item.title}</h3>
                            <span className="text-indigo-300/70 text-sm">
                                {item.updatedAt ? `${item.updatedAt}更新` : ''}
                            </span>
                        </div>
                        <p className="text-indigo-300/70 mt-2 line-clamp-2">{item.description}</p>
                        <div className="flex mt-3 flex-wrap gap-2">
                            {item.tags?.map((tag, index) => (
                                <Badge 
                                    key={index}
                                    className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}; 