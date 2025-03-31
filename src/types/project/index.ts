/**
 * 项目相关类型定义
 */

/**
 * 项目状态枚举
 */
export enum ProjectStatus {
  Draft = 'draft',        // 草稿
  Active = 'active',      // 活跃
  Archived = 'archived',  // 已归档
  Completed = 'completed' // 已完成
}

/**
 * 项目类型接口
 */
export interface IProject {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  collaborators?: string[];
  thumbnail?: string;
  tags?: string[];
}

/**
 * 创建项目输入接口
 */
export interface ICreateProjectInput {
  name: string;
  description: string;
  status?: ProjectStatus;
  thumbnail?: string;
  tags?: string[];
}

/**
 * 更新项目输入接口
 */
export interface IUpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  thumbnail?: string;
  tags?: string[];
} 