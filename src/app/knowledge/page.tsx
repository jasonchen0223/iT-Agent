// app/knowledge/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { KnowledgeList } from '@/components/knowledge/KnowledgeList';
import { KnowledgeFilter } from '@/components/knowledge/KnowledgeFilter';
import { KnowledgeDetail } from '@/components/knowledge/KnowledgeDetail';
import { IKnowledgeItem, IKnowledgeCategory, IKnowledgeFilter } from '@/types/knowledge';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';

/**
 * 知识库页面
 * 
 * 展示并管理系统知识库
 * 
 * @returns {React.ReactElement} 知识库页面
 */
export default function KnowledgeBasePage() {
  // 状态管理
  const [selectedItem, setSelectedItem] = useState<IKnowledgeItem | null>(null);
  const [items, setItems] = useState<IKnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 筛选条件
  const [filters, setFilters] = useState<IKnowledgeFilter>({
    search: '',
    category: '',
    tags: [],
    sortBy: 'newest'
  });
  
  // 分类和标签数据
  const [categories, setCategories] = useState<IKnowledgeCategory[]>([
    { id: 'tech', name: '技术文档', count: 12 },
    { id: 'design', name: '设计规范', count: 8 },
    { id: 'project', name: '项目案例', count: 6 },
    { id: 'guide', name: '工具使用指南', count: 4 },
    { id: 'faq', name: '常见问题', count: 10 }
  ]);
  
  const [availableTags, setAvailableTags] = useState<string[]>([
    '前端', 'React', '设计', '架构', 'AutoGen', '工具', 'AI', '代理', '协作', '测试'
  ]);
  
  // 模拟加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 示例数据
        const mockData: IKnowledgeItem[] = [
          {
            id: '1',
            title: 'AutoGen 多代理协作框架指南',
            description: '详细介绍AutoGen框架的核心概念、代理类型及协作模式，包含实际案例。',
            tags: ['AutoGen', '架构'],
            category: '技术文档',
            categoryId: 'tech',
            updatedAt: '2天前',
            author: '系统管理员',
            importance: 'high',
            content: `
              <h2>AutoGen 框架概述</h2>
              <p>AutoGen是一个用于构建多代理协作系统的框架，支持代理间的自动化交互和人机混合协作。</p>
              <h3>核心组件</h3>
              <ul>
                <li>ConversableAgent - 基础代理类型，支持消息交互</li>
                <li>AssistantAgent - 基于大语言模型的助手代理</li>
                <li>UserProxyAgent - 代表用户的代理，可以执行代码和工具</li>
              </ul>
              <h3>协作模式</h3>
              <p>AutoGen支持多种协作模式，包括但不限于:</p>
              <ul>
                <li>一对一交互</li>
                <li>小组讨论</li>
                <li>链式协作</li>
                <li>工作流协作</li>
              </ul>
            `
          },
          {
            id: '2',
            title: 'Next.js App Router开发指南',
            description: '介绍Next.js App Router的使用方法，包括路由结构、数据获取和页面渲染策略。',
            tags: ['前端', 'React'],
            category: '技术文档',
            categoryId: 'tech',
            updatedAt: '1周前',
            author: '前端工程师',
            importance: 'medium'
          },
          {
            id: '3',
            title: '智能代理UI设计系统规范',
            description: '基于shadcn/ui的靛青主题宇宙星空设计系统详细规范，包含色彩、排版和组件设计准则。',
            tags: ['设计', 'UI'],
            category: '设计规范',
            categoryId: 'design',
            updatedAt: '2周前',
            author: 'UI设计师',
            importance: 'high'
          },
          {
            id: '4',
            title: '多代理协作模式实践案例',
            description: '探讨不同场景下的多代理协作模式选择与实践，包含实际项目案例分析。',
            tags: ['AutoGen', '协作', '代理'],
            category: '项目案例',
            categoryId: 'project',
            updatedAt: '3天前',
            author: '项目经理',
            importance: 'medium'
          },
          {
            id: '5',
            title: 'Prisma ORM使用指南',
            description: '详细介绍Prisma ORM的安装、配置和使用方法，包含常见错误处理和最佳实践。',
            tags: ['数据库', 'ORM'],
            category: '技术文档',
            categoryId: 'tech',
            updatedAt: '5天前',
            author: '后端工程师',
            importance: 'medium'
          },
        ];
        
        setItems(mockData);
      } catch (err) {
        console.error('加载知识库数据失败:', err);
        setError('加载知识库数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // 过滤知识项目
  const filteredItems = items.filter(item => {
    // 搜索过滤
    if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !item.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // 分类过滤
    if (filters.category && item.categoryId !== filters.category) {
      return false;
    }
    
    // 标签过滤
    if (filters.tags.length > 0) {
      if (!item.tags || !filters.tags.some(tag => item.tags?.includes(tag))) {
        return false;
      }
    }
    
    return true;
  });
  
  // 排序知识项目
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (filters.sortBy === 'newest') {
      return (a.updatedAt || '').localeCompare(b.updatedAt || '');
    } else if (filters.sortBy === 'oldest') {
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    }
    return 0;
  });
  
  // 处理筛选条件变更
  const handleFilterChange = (newFilters: IKnowledgeFilter) => {
    setFilters(newFilters);
  };
  
  // 处理知识项点击
  const handleItemClick = (item: IKnowledgeItem) => {
    setSelectedItem(item);
  };
  
  // 返回列表
  const handleBackToList = () => {
    setSelectedItem(null);
  };
  
  // 添加新知识项
  const handleAddKnowledge = () => {
    // TODO: 实现添加知识项功能
    console.log('添加新知识项');
  };
  
  // 编辑知识项
  const handleEditKnowledge = () => {
    // TODO: 实现编辑知识项功能
    console.log('编辑知识项:', selectedItem?.id);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title="知识库"
          description="管理和检索系统知识资源"
        />
        <Button onClick={handleAddKnowledge} className="flex items-center gap-1">
          <Plus size={16} />
          添加资料
        </Button>
      </div>

      {selectedItem ? (
        <KnowledgeDetail
          item={selectedItem}
          onBack={handleBackToList}
          onEdit={handleEditKnowledge}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* 左侧目录 */}
          <div className="md:col-span-3 space-card">
            <h2 className="text-lg font-semibold text-indigo-100 mb-3">
              知识分类
            </h2>
            <nav className="space-y-1">
              <a
                href="#"
                className={`block p-2 rounded-md ${!filters.category ? 'bg-indigo-700/30 text-white' : 'text-indigo-300 hover:bg-indigo-700/20'}`}
                onClick={() => handleFilterChange({...filters, category: ''})}
              >
                全部分类
              </a>
              {categories.map(category => (
                <a
                  key={category.id}
                  href="#"
                  className={`block p-2 rounded-md ${filters.category === category.id ? 'bg-indigo-700/30 text-white' : 'text-indigo-300 hover:bg-indigo-700/20'}`}
                  onClick={() => handleFilterChange({...filters, category: category.id})}
                >
                  {category.name}
                  {category.count !== undefined && (
                    <span className="text-indigo-400/60 text-xs ml-2">({category.count})</span>
                  )}
                </a>
              ))}
            </nav>

            <h3 className="text-lg font-semibold text-indigo-100 mt-6 mb-3">
              标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.slice(0, 8).map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                    filters.tags.includes(tag) 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-indigo-900/30 text-indigo-300 hover:bg-indigo-900/50'
                  }`}
                  onClick={() => {
                    if (filters.tags.includes(tag)) {
                      handleFilterChange({
                        ...filters, 
                        tags: filters.tags.filter(t => t !== tag)
                      });
                    } else {
                      handleFilterChange({
                        ...filters,
                        tags: [...filters.tags, tag]
                      });
                    }
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 中央文档列表 */}
          <div className="md:col-span-9">
            <KnowledgeFilter
              filters={filters}
              categories={categories}
              availableTags={availableTags}
              onFilterChange={handleFilterChange}
            />
            
            {error ? (
              <div className="p-6 bg-red-900/20 border border-red-700/40 rounded-lg text-center">
                <p className="text-red-300">{error}</p>
                <Button 
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    // 模拟重新加载
                    setTimeout(() => setLoading(false), 1000);
                  }}
                >
                  重试
                </Button>
              </div>
            ) : (
              <KnowledgeList
                items={sortedItems}
                onItemClick={handleItemClick}
                isLoading={loading}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
