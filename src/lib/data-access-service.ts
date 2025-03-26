/**
 * 数据访问服务
 * 
 * 提供统一的数据访问接口，封装Prisma操作
 */
import { PrismaClient } from '@prisma/client';
import { prisma } from './db';

/**
 * 基础查询选项接口
 */
export interface IQueryOptions {
    page?: number;
    limit?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
}

/**
 * 基础过滤条件接口
 */
export interface IFilterCondition {
    field: string;
    operator: 'equals' | 'contains' | 'in' | 'gt' | 'gte' | 'lt' | 'lte';
    value: any;
}

/**
 * 数据访问服务类
 */
export class DataAccessService {
    private static instance: DataAccessService | null = null;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = prisma;
    }

    /**
     * 获取服务实例
     */
    public static getInstance(): DataAccessService {
        if (!DataAccessService.instance) {
            DataAccessService.instance = new DataAccessService();
        }
        return DataAccessService.instance;
    }

    /**
     * 构建查询条件
     * @param filters 过滤条件数组
     * @returns Prisma查询条件对象
     */
    private buildWhereClause(filters: IFilterCondition[] = []): any {
        const where: any = {};

        for (const filter of filters) {
            switch (filter.operator) {
                case 'equals':
                    where[filter.field] = filter.value;
                    break;
                case 'contains':
                    where[filter.field] = { contains: filter.value };
                    break;
                case 'in':
                    where[filter.field] = { in: filter.value };
                    break;
                case 'gt':
                    where[filter.field] = { gt: filter.value };
                    break;
                case 'gte':
                    where[filter.field] = { gte: filter.value };
                    break;
                case 'lt':
                    where[filter.field] = { lt: filter.value };
                    break;
                case 'lte':
                    where[filter.field] = { lte: filter.value };
                    break;
            }
        }

        return where;
    }

    /**
     * 构建排序条件
     * @param options 查询选项
     * @returns Prisma排序条件对象
     */
    private buildOrderByClause(options: IQueryOptions = {}): any {
        if (!options.orderBy) {
            return undefined;
        }

        return {
            [options.orderBy]: options.orderDirection || 'asc'
        };
    }

    /**
     * 通用查询方法
     * @param model 模型名称
     * @param filters 过滤条件
     * @param options 查询选项
     * @returns 查询结果和总数
     */
    public async query(
        model: string,
        filters: IFilterCondition[] = [],
        options: IQueryOptions = {}
    ): Promise<{ data: any[]; total: number }> {
        try {
            const where = this.buildWhereClause(filters);
            const orderBy = this.buildOrderByClause(options);
            
            // 计算分页
            const page = options.page || 1;
            const limit = options.limit || 10;
            const skip = (page - 1) * limit;

            // 获取总数
            const total = await (this.prisma as any)[model].count({ where });

            // 查询数据
            const data = await (this.prisma as any)[model].findMany({
                where,
                orderBy,
                skip,
                take: limit
            });

            return { data, total };
        } catch (error) {
            console.error(`查询${model}失败:`, error);
            throw error;
        }
    }

    /**
     * 通用创建方法
     * @param model 模型名称
     * @param data 创建数据
     * @returns 创建的记录
     */
    public async create(model: string, data: any): Promise<any> {
        try {
            return await (this.prisma as any)[model].create({
                data
            });
        } catch (error) {
            console.error(`创建${model}失败:`, error);
            throw error;
        }
    }

    /**
     * 通用更新方法
     * @param model 模型名称
     * @param id 记录ID
     * @param data 更新数据
     * @returns 更新的记录
     */
    public async update(model: string, id: string, data: any): Promise<any> {
        try {
            return await (this.prisma as any)[model].update({
                where: { id },
                data
            });
        } catch (error) {
            console.error(`更新${model}失败:`, error);
            throw error;
        }
    }

    /**
     * 通用删除方法
     * @param model 模型名称
     * @param id 记录ID
     * @returns 删除的记录
     */
    public async delete(model: string, id: string): Promise<any> {
        try {
            return await (this.prisma as any)[model].delete({
                where: { id }
            });
        } catch (error) {
            console.error(`删除${model}失败:`, error);
            throw error;
        }
    }

    /**
     * 通用批量创建方法
     * @param model 模型名称
     * @param dataArray 数据数组
     * @returns 创建的记录数组
     */
    public async createMany(model: string, dataArray: any[]): Promise<number> {
        try {
            const result = await (this.prisma as any)[model].createMany({
                data: dataArray
            });
            return result.count;
        } catch (error) {
            console.error(`批量创建${model}失败:`, error);
            throw error;
        }
    }

    /**
     * 通用批量更新方法
     * @param model 模型名称
     * @param where 更新条件
     * @param data 更新数据
     * @returns 更新的记录数
     */
    public async updateMany(model: string, where: any, data: any): Promise<number> {
        try {
            const result = await (this.prisma as any)[model].updateMany({
                where,
                data
            });
            return result.count;
        } catch (error) {
            console.error(`批量更新${model}失败:`, error);
            throw error;
        }
    }

    /**
     * 通用批量删除方法
     * @param model 模型名称
     * @param where 删除条件
     * @returns 删除的记录数
     */
    public async deleteMany(model: string, where: any): Promise<number> {
        try {
            const result = await (this.prisma as any)[model].deleteMany({
                where
            });
            return result.count;
        } catch (error) {
            console.error(`批量删除${model}失败:`, error);
            throw error;
        }
    }

    /**
     * 通用关联查询方法
     * @param model 模型名称
     * @param id 记录ID
     * @param include 包含的关联
     * @returns 查询结果
     */
    public async findWithRelations(
        model: string,
        id: string,
        include: Record<string, boolean>
    ): Promise<any> {
        try {
            return await (this.prisma as any)[model].findUnique({
                where: { id },
                include
            });
        } catch (error) {
            console.error(`查询${model}及关联数据失败:`, error);
            throw error;
        }
    }

    /**
     * 事务执行方法
     * @param callback 事务回调函数
     * @returns 事务执行结果
     */
    public async transaction<T>(
        callback: (prisma: PrismaClient) => Promise<T>
    ): Promise<T> {
        try {
            return await this.prisma.$transaction(callback);
        } catch (error) {
            console.error('事务执行失败:', error);
            throw error;
        }
    }
}

// 导出服务实例
export const dataAccessService = DataAccessService.getInstance(); 