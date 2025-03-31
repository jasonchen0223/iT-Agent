/**
 * 工具服务模块
 * 
 * 提供工具注册、获取和调用功能
 */
import { TTool, TToolCategory, TToolParameter } from '@/types/tool-types';
import { fileTools, readFile, writeFile, appendFile, deleteFile, createDirectory, listDirectory, getFileInfo } from '@/tools/file-tools';
import { httpTools, httpGet, httpPost, httpPut, httpDelete, httpUploadFile } from '@/tools/http-tools';
import { dataTools, parseJson, stringifyJson, formatDate, calculateStats, getObjectValue, csvToJson, jsonToCsv } from '@/tools/data-tools';
import { 
  ITool, 
  IToolExecuteRequest, 
  IToolExecuteResult, 
  IToolRegisterRequest, 
  IToolUpdateRequest,
  IToolConfig,
  IToolExecutionHistory,
  TToolStatus,
  IMcpToolWrapper
} from '@/types/tool';
import { ApiError } from '@/lib/errors';

/**
 * 工具调用参数验证错误
 */
class ToolParameterValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ToolParameterValidationError';
    }
}

/**
 * 工具服务接口
 * 
 * 提供工具注册、配置、执行和管理功能
 */
export interface IToolService {
  /**
   * 获取所有工具
   * 
   * @returns {Promise<ITool[]>} 工具列表
   */
  getAllTools(): Promise<ITool[]>;
  
  /**
   * 获取可用工具
   * 
   * @returns {Promise<ITool[]>} 可用工具列表
   */
  getAvailableTools(): Promise<ITool[]>;
  
  /**
   * 根据ID获取工具
   * 
   * @param {string} id - 工具ID
   * @returns {Promise<ITool | null>} 工具详情或null
   */
  getToolById(id: string): Promise<ITool | null>;
  
  /**
   * 根据类型获取工具
   * 
   * @param {string} type - 工具类型
   * @returns {Promise<ITool[]>} 工具列表
   */
  getToolsByType(type: string): Promise<ITool[]>;
  
  /**
   * 注册新工具
   * 
   * @param {IToolRegisterRequest} request - 工具注册请求
   * @returns {Promise<ITool>} 注册后的工具
   */
  registerTool(request: IToolRegisterRequest): Promise<ITool>;
  
  /**
   * 更新工具信息
   * 
   * @param {string} id - 工具ID
   * @param {IToolUpdateRequest} request - 工具更新请求
   * @returns {Promise<ITool>} 更新后的工具
   */
  updateTool(id: string, request: IToolUpdateRequest): Promise<ITool>;
  
  /**
   * 更新工具状态
   * 
   * @param {string} id - 工具ID
   * @param {TToolStatus} status - 新状态
   * @returns {Promise<ITool>} 更新后的工具
   */
  updateToolStatus(id: string, status: TToolStatus): Promise<ITool>;
  
  /**
   * 删除工具
   * 
   * @param {string} id - 工具ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  deleteTool(id: string): Promise<boolean>;
  
  /**
   * 执行工具
   * 
   * @param {IToolExecuteRequest} request - 执行请求
   * @returns {Promise<IToolExecuteResult>} 执行结果
   */
  executeTool(request: IToolExecuteRequest): Promise<IToolExecuteResult>;
  
  /**
   * 获取工具配置
   * 
   * @param {string} toolId - 工具ID
   * @returns {Promise<IToolConfig | null>} 工具配置或null
   */
  getToolConfig(toolId: string): Promise<IToolConfig | null>;
  
  /**
   * 更新工具配置
   * 
   * @param {string} toolId - 工具ID
   * @param {Record<string, any>} parameters - 配置参数
   * @returns {Promise<IToolConfig>} 更新后的配置
   */
  updateToolConfig(toolId: string, parameters: Record<string, any>): Promise<IToolConfig>;
  
  /**
   * 获取工具执行历史
   * 
   * @param {string} toolId - 工具ID
   * @param {number} limit - 限制数量
   * @returns {Promise<IToolExecutionHistory[]>} 执行历史记录
   */
  getToolExecutionHistory(toolId: string, limit?: number): Promise<IToolExecutionHistory[]>;
  
  /**
   * 安装MCP工具
   * 
   * @param {string} mcpToolId - MCP工具ID
   * @returns {Promise<ITool>} 安装后的工具
   */
  installMcpTool(mcpToolId: string): Promise<ITool>;
  
  /**
   * 检查工具更新
   * 
   * @param {string} toolId - 工具ID
   * @returns {Promise<{hasUpdate: boolean, latestVersion?: string}>} 更新信息
   */
  checkToolUpdate(toolId: string): Promise<{hasUpdate: boolean, latestVersion?: string}>;
  
  /**
   * 获取工具的完整权限列表
   * 
   * @param {string} toolId - 工具ID
   * @returns {Promise<string[]>} 权限列表
   */
  getToolPermissions(toolId: string): Promise<string[]>;
}

/**
 * 工具服务实现类
 * 
 * 提供工具注册、配置、执行和管理功能的实现
 */
export class ToolService implements IToolService {
  /**
   * API 基础路径
   */
  private baseUrl = '/api/tools';
  
  /**
   * 对API进行GET请求
   * 
   * @param {string} endpoint - API端点
   * @returns {Promise<any>} 响应数据
   * @private
   */
  private async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error || '请求工具API失败',
        errorData
      );
    }
    
    const data = await response.json();
    return data.data;
  }
  
  /**
   * 对API进行POST请求
   * 
   * @param {string} endpoint - API端点
   * @param {any} body - 请求体
   * @returns {Promise<any>} 响应数据
   * @private
   */
  private async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error || '请求工具API失败',
        errorData
      );
    }
    
    const data = await response.json();
    return data.data;
  }
  
  /**
   * 对API进行PUT请求
   * 
   * @param {string} endpoint - API端点
   * @param {any} body - 请求体
   * @returns {Promise<any>} 响应数据
   * @private
   */
  private async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error || '请求工具API失败',
        errorData
      );
    }
    
    const data = await response.json();
    return data.data;
  }
  
  /**
   * 对API进行DELETE请求
   * 
   * @param {string} endpoint - API端点
   * @returns {Promise<any>} 响应数据
   * @private
   */
  private async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error || '请求工具API失败',
        errorData
      );
    }
    
    const data = await response.json();
    return data.data;
  }
  
  /**
   * 获取所有工具
   * 
   * @returns {Promise<ITool[]>} 工具列表
   */
  public async getAllTools(): Promise<ITool[]> {
    return this.get<ITool[]>('');
  }
  
  /**
   * 获取可用工具
   * 
   * @returns {Promise<ITool[]>} 可用工具列表
   */
  public async getAvailableTools(): Promise<ITool[]> {
    return this.get<ITool[]>('/available');
  }
  
  /**
   * 根据ID获取工具
   * 
   * @param {string} id - 工具ID
   * @returns {Promise<ITool | null>} 工具详情或null
   */
  public async getToolById(id: string): Promise<ITool | null> {
    try {
      return await this.get<ITool>(`/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }
  
  /**
   * 根据类型获取工具
   * 
   * @param {string} type - 工具类型
   * @returns {Promise<ITool[]>} 工具列表
   */
  public async getToolsByType(type: string): Promise<ITool[]> {
    return this.get<ITool[]>(`/type/${type}`);
  }
  
  /**
   * 注册新工具
   * 
   * @param {IToolRegisterRequest} request - 工具注册请求
   * @returns {Promise<ITool>} 注册后的工具
   */
  public async registerTool(request: IToolRegisterRequest): Promise<ITool> {
    return this.post<ITool>('/register', request);
  }
  
  /**
   * 更新工具信息
   * 
   * @param {string} id - 工具ID
   * @param {IToolUpdateRequest} request - 工具更新请求
   * @returns {Promise<ITool>} 更新后的工具
   */
  public async updateTool(id: string, request: IToolUpdateRequest): Promise<ITool> {
    return this.put<ITool>(`/${id}`, request);
  }
  
  /**
   * 更新工具状态
   * 
   * @param {string} id - 工具ID
   * @param {TToolStatus} status - 新状态
   * @returns {Promise<ITool>} 更新后的工具
   */
  public async updateToolStatus(id: string, status: TToolStatus): Promise<ITool> {
    return this.put<ITool>(`/${id}/status`, { status });
  }
  
  /**
   * 删除工具
   * 
   * @param {string} id - 工具ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  public async deleteTool(id: string): Promise<boolean> {
    return this.delete<boolean>(`/${id}`);
  }
  
  /**
   * 执行工具
   * 
   * @param {IToolExecuteRequest} request - 执行请求
   * @returns {Promise<IToolExecuteResult>} 执行结果
   */
  public async executeTool(request: IToolExecuteRequest): Promise<IToolExecuteResult> {
    return this.post<IToolExecuteResult>('/execute', request);
  }
  
  /**
   * 获取工具配置
   * 
   * @param {string} toolId - 工具ID
   * @returns {Promise<IToolConfig | null>} 工具配置或null
   */
  public async getToolConfig(toolId: string): Promise<IToolConfig | null> {
    try {
      return await this.get<IToolConfig>(`/${toolId}/config`);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }
  
  /**
   * 更新工具配置
   * 
   * @param {string} toolId - 工具ID
   * @param {Record<string, any>} parameters - 配置参数
   * @returns {Promise<IToolConfig>} 更新后的配置
   */
  public async updateToolConfig(toolId: string, parameters: Record<string, any>): Promise<IToolConfig> {
    return this.put<IToolConfig>(`/${toolId}/config`, { parameters });
  }
  
  /**
   * 获取工具执行历史
   * 
   * @param {string} toolId - 工具ID
   * @param {number} limit - 限制数量
   * @returns {Promise<IToolExecutionHistory[]>} 执行历史记录
   */
  public async getToolExecutionHistory(toolId: string, limit = 10): Promise<IToolExecutionHistory[]> {
    return this.get<IToolExecutionHistory[]>(`/${toolId}/history?limit=${limit}`);
  }
  
  /**
   * 安装MCP工具
   * 
   * @param {string} mcpToolId - MCP工具ID
   * @returns {Promise<ITool>} 安装后的工具
   */
  public async installMcpTool(mcpToolId: string): Promise<ITool> {
    return this.post<ITool>('/mcp/install', { mcpToolId });
  }
  
  /**
   * 检查工具更新
   * 
   * @param {string} toolId - 工具ID
   * @returns {Promise<{hasUpdate: boolean, latestVersion?: string}>} 更新信息
   */
  public async checkToolUpdate(toolId: string): Promise<{hasUpdate: boolean, latestVersion?: string}> {
    return this.get<{hasUpdate: boolean, latestVersion?: string}>(`/${toolId}/check-update`);
  }
  
  /**
   * 获取工具的完整权限列表
   * 
   * @param {string} toolId - 工具ID
   * @returns {Promise<string[]>} 权限列表
   */
  public async getToolPermissions(toolId: string): Promise<string[]> {
    return this.get<string[]>(`/${toolId}/permissions`);
  }
  
  /**
   * 获取MCP工具包装器
   * 
   * @param {string} wrapperId - 包装器ID
   * @returns {Promise<IMcpToolWrapper | null>} 包装器详情或null
   */
  public async getMcpToolWrapper(wrapperId: string): Promise<IMcpToolWrapper | null> {
    try {
      return await this.get<IMcpToolWrapper>(`/mcp/wrapper/${wrapperId}`);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }
  
  /**
   * 创建MCP工具包装器
   * 
   * @param {IMcpToolWrapper} wrapper - 包装器详情
   * @returns {Promise<IMcpToolWrapper>} 创建后的包装器
   */
  public async createMcpToolWrapper(wrapper: Omit<IMcpToolWrapper, 'id' | 'createdAt' | 'updatedAt'>): Promise<IMcpToolWrapper> {
    return this.post<IMcpToolWrapper>('/mcp/wrapper', wrapper);
  }
  
  /**
   * 更新MCP工具包装器
   * 
   * @param {string} wrapperId - 包装器ID
   * @param {Partial<IMcpToolWrapper>} updates - 更新内容
   * @returns {Promise<IMcpToolWrapper>} 更新后的包装器
   */
  public async updateMcpToolWrapper(wrapperId: string, updates: Partial<Omit<IMcpToolWrapper, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IMcpToolWrapper> {
    return this.put<IMcpToolWrapper>(`/mcp/wrapper/${wrapperId}`, updates);
  }
  
  /**
   * 删除MCP工具包装器
   * 
   * @param {string} wrapperId - 包装器ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  public async deleteMcpToolWrapper(wrapperId: string): Promise<boolean> {
    return this.delete<boolean>(`/mcp/wrapper/${wrapperId}`);
  }
}

// 创建工具服务实例
export const toolService = new ToolService(); 