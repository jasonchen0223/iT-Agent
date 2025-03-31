import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IKnowledgeItem } from '@/types/knowledge';
import { CalendarIcon, Clock, Edit, FileText, Star, Tags, User } from 'lucide-react';

interface KnowledgeDetailProps {
    item: IKnowledgeItem;
    onEdit?: () => void;
    onBack: () => void;
}

/**
 * 知识详情组件
 * 
 * 展示知识项的详细内容
 * 
 * @param {KnowledgeDetailProps} props - 组件属性
 * @returns {React.ReactElement} 知识详情组件
 */
export const KnowledgeDetail: React.FC<KnowledgeDetailProps> = ({
    item,
    onEdit,
    onBack,
}) => {
    return (
        <div className="space-card">
            <div className="flex justify-between items-start mb-6">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-indigo-300"
                    onClick={onBack}
                >
                    ← 返回列表
                </Button>
                
                {onEdit && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={onEdit}
                    >
                        <Edit size={16} />
                        编辑
                    </Button>
                )}
            </div>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-indigo-100 mb-2">{item.title}</h1>
                
                <div className="flex flex-wrap gap-4 text-indigo-300/70 text-sm mt-4">
                    {item.createdAt && (
                        <div className="flex items-center gap-1">
                            <CalendarIcon size={16} />
                            创建于 {item.createdAt}
                        </div>
                    )}
                    
                    {item.updatedAt && (
                        <div className="flex items-center gap-1">
                            <Clock size={16} />
                            更新于 {item.updatedAt}
                        </div>
                    )}
                    
                    {item.author && (
                        <div className="flex items-center gap-1">
                            <User size={16} />
                            作者: {item.author}
                        </div>
                    )}
                    
                    {item.category && (
                        <div className="flex items-center gap-1">
                            <FileText size={16} />
                            分类: {item.category}
                        </div>
                    )}
                    
                    {item.importance && (
                        <div className="flex items-center gap-1">
                            <Star size={16} />
                            重要性: {item.importance}
                        </div>
                    )}
                </div>
                
                {item.tags && item.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-4">
                        <Tags size={16} className="text-indigo-300/70" />
                        <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag, index) => (
                                <Badge 
                                    key={index}
                                    className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-indigo-800/30 pt-6 mb-6">
                <div className="prose prose-invert prose-indigo max-w-none">
                    {item.content && (
                        <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    )}
                    
                    {!item.content && item.description && (
                        <p className="text-indigo-300/70">{item.description}</p>
                    )}
                    
                    {!item.content && !item.description && (
                        <p className="text-indigo-300/70 italic">暂无内容</p>
                    )}
                </div>
            </div>

            {item.relatedItems && item.relatedItems.length > 0 && (
                <div className="border-t border-indigo-800/30 pt-6">
                    <h3 className="text-lg font-semibold text-indigo-100 mb-4">相关知识</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {item.relatedItems.map((related, index) => (
                            <div 
                                key={index}
                                className="p-3 bg-indigo-900/20 rounded-md hover:bg-indigo-900/30 transition-colors cursor-pointer"
                            >
                                <h4 className="text-indigo-100 font-medium">{related.title}</h4>
                                <p className="text-indigo-300/70 text-sm mt-1 line-clamp-2">{related.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {item.attachments && item.attachments.length > 0 && (
                <div className="border-t border-indigo-800/30 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-indigo-100 mb-4">附件</h3>
                    <div className="space-y-2">
                        {item.attachments.map((attachment, index) => (
                            <div 
                                key={index}
                                className="p-3 bg-indigo-900/20 rounded-md hover:bg-indigo-900/30 transition-colors cursor-pointer flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <FileText size={18} className="text-indigo-300" />
                                    <span className="text-indigo-100">{attachment.name}</span>
                                </div>
                                <Button variant="ghost" size="sm" className="text-indigo-300">
                                    下载
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}; 