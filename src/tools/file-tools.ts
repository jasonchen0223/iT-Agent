/**
 * 文件操作工具
 * 
 * 提供基本的文件读写、目录操作等功能
 */
import fs from 'fs/promises';
import path from 'path';
import { TTool, TToolCategory } from '@/types/tool-types';

/**
 * 读取文件内容
 * 
 * @param filePath 文件路径
 * @returns 文件内容
 */
export async function readFile(filePath: string): Promise<string> {
    try {
        return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        console.error('读取文件错误:', error);
        throw new Error(`读取文件失败: ${error.message}`);
    }
}

/**
 * 写入文件内容
 * 
 * @param filePath 文件路径
 * @param content 文件内容
 * @returns 成功消息
 */
export async function writeFile(filePath: string, content: string): Promise<string> {
    try {
        await fs.writeFile(filePath, content, 'utf-8');
        return `成功写入文件: ${filePath}`;
    } catch (error) {
        console.error('写入文件错误:', error);
        throw new Error(`写入文件失败: ${error.message}`);
    }
}

/**
 * 追加文件内容
 * 
 * @param filePath 文件路径
 * @param content 追加内容
 * @returns 成功消息
 */
export async function appendFile(filePath: string, content: string): Promise<string> {
    try {
        await fs.appendFile(filePath, content, 'utf-8');
        return `成功追加内容到文件: ${filePath}`;
    } catch (error) {
        console.error('追加文件内容错误:', error);
        throw new Error(`追加文件内容失败: ${error.message}`);
    }
}

/**
 * 删除文件
 * 
 * @param filePath 文件路径
 * @returns 成功消息
 */
export async function deleteFile(filePath: string): Promise<string> {
    try {
        await fs.unlink(filePath);
        return `成功删除文件: ${filePath}`;
    } catch (error) {
        console.error('删除文件错误:', error);
        throw new Error(`删除文件失败: ${error.message}`);
    }
}

/**
 * 创建目录
 * 
 * @param dirPath 目录路径
 * @returns 成功消息
 */
export async function createDirectory(dirPath: string): Promise<string> {
    try {
        await fs.mkdir(dirPath, { recursive: true });
        return `成功创建目录: ${dirPath}`;
    } catch (error) {
        console.error('创建目录错误:', error);
        throw new Error(`创建目录失败: ${error.message}`);
    }
}

/**
 * 列出目录内容
 * 
 * @param dirPath 目录路径
 * @returns 目录内容列表
 */
export async function listDirectory(dirPath: string): Promise<string[]> {
    try {
        return await fs.readdir(dirPath);
    } catch (error) {
        console.error('列出目录内容错误:', error);
        throw new Error(`列出目录内容失败: ${error.message}`);
    }
}

/**
 * 获取文件信息
 * 
 * @param filePath 文件路径
 * @returns 文件信息对象
 */
export async function getFileInfo(filePath: string): Promise<any> {
    try {
        const stats = await fs.stat(filePath);
        return {
            path: filePath,
            size: stats.size,
            isDirectory: stats.isDirectory(),
            isFile: stats.isFile(),
            created: stats.birthtime,
            modified: stats.mtime,
            accessed: stats.atime,
        };
    } catch (error) {
        console.error('获取文件信息错误:', error);
        throw new Error(`获取文件信息失败: ${error.message}`);
    }
}

/**
 * 文件操作工具定义
 */
export const fileTools: TTool[] = [
    {
        id: 'file-read',
        name: '读取文件',
        description: '读取指定路径的文件内容',
        category: TToolCategory.DEVELOPMENT,
        tags: ['文件', '读取'],
        isBuiltin: true,
        parameters: [
            {
                name: 'filePath',
                type: 'string',
                description: '文件的完整路径',
                required: true
            }
        ],
        returnType: '文件内容字符串',
        examples: [
            'await tools.callTool("file-read", { filePath: "/path/to/file.txt" })'
        ]
    },
    {
        id: 'file-write',
        name: '写入文件',
        description: '将内容写入指定路径的文件',
        category: TToolCategory.DEVELOPMENT,
        tags: ['文件', '写入'],
        isBuiltin: true,
        parameters: [
            {
                name: 'filePath',
                type: 'string',
                description: '文件的完整路径',
                required: true
            },
            {
                name: 'content',
                type: 'string',
                description: '要写入的内容',
                required: true
            }
        ],
        returnType: '成功消息',
        examples: [
            'await tools.callTool("file-write", { filePath: "/path/to/file.txt", content: "文件内容" })'
        ]
    },
    {
        id: 'file-append',
        name: '追加文件内容',
        description: '将内容追加到指定路径的文件末尾',
        category: TToolCategory.DEVELOPMENT,
        tags: ['文件', '追加'],
        isBuiltin: true,
        parameters: [
            {
                name: 'filePath',
                type: 'string',
                description: '文件的完整路径',
                required: true
            },
            {
                name: 'content',
                type: 'string',
                description: '要追加的内容',
                required: true
            }
        ],
        returnType: '成功消息',
        examples: [
            'await tools.callTool("file-append", { filePath: "/path/to/file.txt", content: "追加内容" })'
        ]
    },
    {
        id: 'file-delete',
        name: '删除文件',
        description: '删除指定路径的文件',
        category: TToolCategory.DEVELOPMENT,
        tags: ['文件', '删除'],
        isBuiltin: true,
        parameters: [
            {
                name: 'filePath',
                type: 'string',
                description: '文件的完整路径',
                required: true
            }
        ],
        returnType: '成功消息',
        examples: [
            'await tools.callTool("file-delete", { filePath: "/path/to/file.txt" })'
        ]
    },
    {
        id: 'dir-create',
        name: '创建目录',
        description: '创建指定路径的目录',
        category: TToolCategory.DEVELOPMENT,
        tags: ['目录', '创建'],
        isBuiltin: true,
        parameters: [
            {
                name: 'dirPath',
                type: 'string',
                description: '目录的完整路径',
                required: true
            }
        ],
        returnType: '成功消息',
        examples: [
            'await tools.callTool("dir-create", { dirPath: "/path/to/directory" })'
        ]
    },
    {
        id: 'dir-list',
        name: '列出目录内容',
        description: '列出指定目录中的所有文件和子目录',
        category: TToolCategory.DEVELOPMENT,
        tags: ['目录', '列表'],
        isBuiltin: true,
        parameters: [
            {
                name: 'dirPath',
                type: 'string',
                description: '目录的完整路径',
                required: true
            }
        ],
        returnType: '文件和目录名称数组',
        examples: [
            'await tools.callTool("dir-list", { dirPath: "/path/to/directory" })'
        ]
    },
    {
        id: 'file-info',
        name: '获取文件信息',
        description: '获取指定文件的详细信息',
        category: TToolCategory.DEVELOPMENT,
        tags: ['文件', '信息'],
        isBuiltin: true,
        parameters: [
            {
                name: 'filePath',
                type: 'string',
                description: '文件的完整路径',
                required: true
            }
        ],
        returnType: '文件信息对象',
        examples: [
            'await tools.callTool("file-info", { filePath: "/path/to/file.txt" })'
        ]
    }
]; 