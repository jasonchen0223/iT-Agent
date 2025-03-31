'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/card';
import { TAgentRole, TAgentStatus, IAgentConfig } from '@/types/agent';

/**
 * 代理卡片属性接口
 */
export interface IAgentCardProps {
    /**
     * 代理配置对象
     */
    agent: IAgentConfig;
    /**
     * 点击事件
     */
    onClick?: () => void;
}

/**
 * 获取代理角色对应的emoji
 * 
 * @param role 代理角色
 * @returns emoji表情
 */
const getAgentEmoji = (role: TAgentRole): string => {
    switch (role) {
        case TAgentRole.USER:
            return '👤';
        case TAgentRole.ASSISTANT:
            return '🧑‍💼';
        case TAgentRole.PLANNER:
            return '📝';
        case TAgentRole.EXECUTOR:
            return '🚀';
        case TAgentRole.ORCHESTRATOR:
            return '🔄';
        case TAgentRole.CRITIC:
            return '🔍';
        case TAgentRole.RESEARCHER:
            return '🔬';
        case TAgentRole.CODER:
            return '👨‍💻';
        case TAgentRole.TESTER:
            return '🧪';
        case TAgentRole.REVIEWER:
            return '📋';
        case TAgentRole.CUSTOM:
        default:
            return '🤖';
    }
};

/**
 * 代理卡片组件
 * 
 * 显示代理信息的卡片组件
 * 
 * @param {IAgentCardProps} props - 代理卡片属性
 * @returns {React.ReactElement} 代理卡片组件
 */
export const AgentCard: React.FC<IAgentCardProps> = ({
    agent,
    onClick
}) => {
    const {
        id,
        name,
        role,
        description,
        status,
        color = '#6366f1'
    } = agent;
    
    // 状态颜色映射
    const statusColors = {
        [TAgentStatus.IDLE]: 'bg-gray-400',
        [TAgentStatus.THINKING]: 'bg-yellow-400 animate-pulse',
        [TAgentStatus.WORKING]: 'bg-green-400 animate-pulse',
        [TAgentStatus.WAITING]: 'bg-blue-400',
        [TAgentStatus.DONE]: 'bg-green-600',
        [TAgentStatus.ERROR]: 'bg-red-600',
    };
    
    // 角色显示名称
    const roleDisplayNames = {
        [TAgentRole.USER]: '用户',
        [TAgentRole.ASSISTANT]: '助手',
        [TAgentRole.PLANNER]: '规划者',
        [TAgentRole.EXECUTOR]: '执行者',
        [TAgentRole.ORCHESTRATOR]: '协调者',
        [TAgentRole.CRITIC]: '批评者',
        [TAgentRole.RESEARCHER]: '研究者',
        [TAgentRole.CODER]: '编码者',
        [TAgentRole.TESTER]: '测试者',
        [TAgentRole.REVIEWER]: '审查者',
        [TAgentRole.CUSTOM]: '自定义',
    };
    
    // 根据状态确定颜色
    const getStatusColor = () => {
        switch (status) {
            case TAgentStatus.IDLE:
                return 'bg-blue-900/30 text-blue-300';
            case TAgentStatus.THINKING:
                return 'bg-purple-900/30 text-purple-300';
            case TAgentStatus.WORKING:
                return 'bg-green-900/30 text-green-300';
            case TAgentStatus.WAITING:
                return 'bg-yellow-900/30 text-yellow-300';
            case TAgentStatus.DONE:
                return 'bg-indigo-900/30 text-indigo-300';
            case TAgentStatus.ERROR:
                return 'bg-red-900/30 text-red-300';
            default:
                return 'bg-gray-900/30 text-gray-300';
        }
    };

    // 根据状态返回中文状态文本
    const getStatusText = () => {
        switch (status) {
            case TAgentStatus.IDLE:
                return '空闲';
            case TAgentStatus.THINKING:
                return '思考中';
            case TAgentStatus.WORKING:
                return '工作中';
            case TAgentStatus.WAITING:
                return '等待中';
            case TAgentStatus.DONE:
                return '完成';
            case TAgentStatus.ERROR:
                return '错误';
            default:
                return '未知';
        }
    };

    // 获取代理角色emoji
    const roleEmoji = getAgentEmoji(role);

    return (
        <div onClick={onClick} className="cursor-pointer transition-all duration-300">
            <Card className="bg-indigo-950/30 backdrop-blur-sm hover:border-indigo-500/50">
                <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl bg-indigo-900/20"
                                style={{ backgroundColor: `${color}30` }} // 使用颜色的透明版本
                            >
                                {roleEmoji}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-indigo-100">{name}</h3>
                                <p className="text-sm text-indigo-300/70">{roleDisplayNames[role] || role}</p>
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor()}`}>
                            {getStatusText()}
                        </span>
                    </div>
                    
                    <p className="text-indigo-300/70 text-sm line-clamp-3">{description}</p>
                    
                    {agent.capability && agent.capability.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                            {agent.capability.slice(0, 2).map((cap) => (
                                <span 
                                    key={cap} 
                                    className="px-2 py-0.5 bg-indigo-900/30 text-indigo-300/70 text-xs rounded-full"
                                >
                                    {cap}
                                </span>
                            ))}
                            {agent.capability.length > 2 && (
                                <span className="px-2 py-0.5 bg-indigo-900/20 text-indigo-300/50 text-xs rounded-full">
                                    +{agent.capability.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                    
                    <div className="pt-2 flex justify-end">
                        <Link 
                            href={`/agents/${id}`}
                            className="text-xs text-indigo-400 hover:text-indigo-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            查看详情
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}; 