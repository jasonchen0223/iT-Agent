'use client';

import React, { useEffect, useRef, useState } from 'react';
import { IAgentNode, ICollaborationLink, ICollaborationSession } from '@/types/collaboration';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * 协作网络组件属性接口
 */
interface CollaborationNetworkProps {
    /** 协作会话数据 */
    session: ICollaborationSession;
    /** 选中节点ID */
    selectedNodeId?: string;
    /** 节点选择事件处理函数 */
    onNodeSelect?: (nodeId: string) => void;
    title?: string;
    description?: string;
}

/**
 * 代理协作网络可视化组件
 * 
 * 负责渲染代理节点之间的协作关系网络图
 * 
 * @param {CollaborationNetworkProps} props - 组件属性
 * @returns {React.ReactElement} 协作网络可视化组件
 */
export const CollaborationNetwork: React.FC<CollaborationNetworkProps> = ({
    session,
    selectedNodeId,
    onNodeSelect,
    title = '代理协作网络',
    description = '可视化展示代理之间的协作关系',
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [nodes, setNodes] = useState<(IAgentNode & { x: number, y: number, radius: number })[]>([]);
    const [links, setLinks] = useState<ICollaborationLink[]>([]);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedNode, setSelectedNode] = useState<IAgentNode | null>(null);
    const [hoveredNode, setHoveredNode] = useState<IAgentNode | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    
    // 根据节点类型获取颜色
    const getNodeColor = (type: string): string => {
        switch (type) {
            case 'leader':
                return '#8b5cf6'; // 紫色
            case 'coordinator':
                return '#3b82f6'; // 蓝色
            case 'specialist':
                return '#10b981'; // 绿色
            case 'executor':
                return '#f59e0b'; // 橙色
            default:
                return '#6b7280'; // 灰色
        }
    };
    
    // 根据链接类型获取颜色
    const getLinkColor = (type: string): string => {
        switch (type) {
            case 'command':
                return '#8b5cf6'; // 紫色
            case 'communication':
                return '#3b82f6'; // 蓝色
            case 'collaboration':
                return '#f59e0b'; // 橙色
            default:
                return '#4b5563'; // 灰色
        }
    };
    
    // 更新容器尺寸
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };
        
        // 初始尺寸
        updateDimensions();
        
        // 窗口尺寸变化时更新
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);
    
    // 计算节点位置
    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0 || !session.nodes) {
            return;
        }
        
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;
        const radius = Math.min(centerX, centerY) * 0.7;
        
        // 计算节点位置（圆形布局）
        const processedNodes = session.nodes.map((node, index) => {
            const angle = (index / session.nodes.length) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const nodeRadius = 30; // 基础节点半径
            
            return { 
                ...node, 
                x, 
                y, 
                radius: nodeRadius,
                color: node.color || getNodeColor(node.type)
            };
        });
        
        setNodes(processedNodes);
        setLinks(session.links.map(link => ({
            ...link,
            color: link.color || getLinkColor(link.type)
        })));
    }, [session.nodes, session.links, dimensions]);
    
    // 绘制网络图
    useEffect(() => {
        if (!canvasRef.current || nodes.length === 0) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // 设置canvas尺寸
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制连接线
        links.forEach(link => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);
            
            if (sourceNode && targetNode) {
                ctx.beginPath();
                ctx.moveTo(sourceNode.x, sourceNode.y);
                ctx.lineTo(targetNode.x, targetNode.y);
                ctx.strokeStyle = link.color;
                ctx.lineWidth = Math.min(3, Math.max(1, (link.messageCount || 1) / 10));
                ctx.stroke();
                
                // 绘制箭头（如果是command类型）
                if (link.type === 'command') {
                    // 箭头方向
                    const dx = targetNode.x - sourceNode.x;
                    const dy = targetNode.y - sourceNode.y;
                    const angle = Math.atan2(dy, dx);
                    
                    // 箭头位置（距离目标节点一段距离）
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const arrowX = sourceNode.x + dx * 0.6;
                    const arrowY = sourceNode.y + dy * 0.6;
                    
                    // 箭头大小
                    const arrowSize = 8;
                    
                    // 绘制箭头
                    ctx.beginPath();
                    ctx.moveTo(arrowX, arrowY);
                    ctx.lineTo(
                        arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
                        arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
                    );
                    ctx.lineTo(
                        arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
                        arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
                    );
                    ctx.closePath();
                    ctx.fillStyle = link.color;
                    ctx.fill();
                }
            }
        });
        
        // 绘制节点
        nodes.forEach(node => {
            // 节点圆形
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
            
            // 选中或悬停节点有特殊样式
            if (node.id === selectedNodeId || node.id === hoveredNodeId) {
                ctx.fillStyle = node.color;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
            } else {
                ctx.fillStyle = node.status === 'active' ? node.color : `${node.color}80`;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 1;
            }
            
            ctx.fill();
            ctx.stroke();
            
            // 节点文字
            ctx.font = '12px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.name, node.x, node.y);
            
            // 消息数量角标
            if (node.messageCount && node.messageCount > 0) {
                const badgeRadius = 12;
                const badgeX = node.x + node.radius * 0.7;
                const badgeY = node.y - node.radius * 0.7;
                
                ctx.beginPath();
                ctx.arc(badgeX, badgeY, badgeRadius, 0, 2 * Math.PI);
                ctx.fillStyle = '#ef4444';
                ctx.fill();
                
                ctx.font = '10px Arial';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                    node.messageCount > 99 ? '99+' : node.messageCount.toString(), 
                    badgeX, 
                    badgeY
                );
            }
        });
    }, [nodes, links, dimensions, selectedNodeId, hoveredNodeId]);
    
    // 处理鼠标移动事件
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 检查是否悬停在节点上
        let isHovering = false;
        for (const node of nodes) {
            const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
            if (distance <= node.radius) {
                setHoveredNodeId(node.id);
                canvas.style.cursor = 'pointer';
                isHovering = true;
                break;
            }
        }
        
        if (!isHovering) {
            setHoveredNodeId(null);
            canvas.style.cursor = 'default';
        }
    };
    
    // 处理鼠标离开事件
    const handleMouseLeave = () => {
        setHoveredNodeId(null);
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'default';
        }
    };
    
    // 处理鼠标点击事件
    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 检查是否点击在节点上
        for (const node of nodes) {
            const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
            if (distance <= node.radius) {
                onNodeSelect?.(node.id);
                break;
            }
        }
    };
    
    // 处理缩放
    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.1, 2));
    };
    
    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.1, 0.5));
    };
    
    // 处理全屏切换
    const handleFullscreenToggle = () => {
        setIsFullscreen(!isFullscreen);
    };
    
    // 重置视图
    const handleResetView = () => {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setSelectedNode(null);
    };
    
    return (
        <Card className={`bg-indigo-950/40 border-indigo-800/30 overflow-hidden ${isFullscreen ? 'fixed top-0 left-0 right-0 bottom-0 z-50 rounded-none' : ''}`}>
            <div className="p-4 border-b border-indigo-800/30 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-indigo-100">{title}</h3>
                    <p className="text-indigo-300/70 text-sm">{description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={handleZoomIn}
                    >
                        <ZoomIn size={16} />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={handleZoomOut}
                    >
                        <ZoomOut size={16} />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={handleResetView}
                    >
                        <span className="text-xs">⟲</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={handleFullscreenToggle}
                    >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </Button>
                </div>
            </div>
            
            <div 
                ref={containerRef}
                className={`relative ${isFullscreen ? 'h-[calc(100vh-64px)]' : 'h-[500px]'}`}
            >
                <canvas
                    ref={canvasRef}
                    className="w-full h-full cursor-move"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                />
                
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    <Badge className="bg-indigo-900/30 text-indigo-300 border-indigo-800/30">
                        节点: {session.nodes.length}
                    </Badge>
                    <Badge className="bg-indigo-900/30 text-indigo-300 border-indigo-800/30">
                        连接: {session.links.length}
                    </Badge>
                    <Badge className="bg-indigo-900/30 text-indigo-300 border-indigo-800/30">
                        缩放: {(zoom * 100).toFixed(0)}%
                    </Badge>
                </div>
                
                {selectedNode && (
                    <div className="absolute top-4 right-4 p-4 bg-indigo-950/80 border border-indigo-800/30 rounded-md max-w-[250px]">
                        <h4 className="text-indigo-100 font-medium">{selectedNode.name}</h4>
                        <p className="text-indigo-300/70 text-sm mt-1">
                            {selectedNode.description || `${selectedNode.type}类型代理`}
                        </p>
                        <div className="mt-2 text-xs text-indigo-300/70">
                            <div className="flex justify-between">
                                <span>类型:</span>
                                <span>{selectedNode.type}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span>状态:</span>
                                <span>{selectedNode.status || '激活'}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span>消息数:</span>
                                <span>{selectedNode.messageCount || 0}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}; 