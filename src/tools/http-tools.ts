/**
 * 网络请求工具
 * 
 * 提供基本的HTTP请求方法，包括GET、POST、PUT、DELETE等
 */
import { TTool, TToolCategory } from '@/types/tool-types';

/**
 * 发送GET请求
 * 
 * @param url 请求URL
 * @param headers 请求头
 * @returns 响应数据
 */
export async function httpGet(url: string, headers?: Record<string, string>): Promise<any> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers || {},
        });
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error('GET请求错误:', error);
        throw new Error(`GET请求失败: ${error.message}`);
    }
}

/**
 * 发送POST请求
 * 
 * @param url 请求URL
 * @param data 请求数据
 * @param headers 请求头
 * @returns 响应数据
 */
export async function httpPost(url: string, data: any, headers?: Record<string, string>): Promise<any> {
    try {
        const isJson = typeof data === 'object';
        const requestHeaders = {
            'Content-Type': isJson ? 'application/json' : 'text/plain',
            ...headers,
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: requestHeaders,
            body: isJson ? JSON.stringify(data) : data,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error('POST请求错误:', error);
        throw new Error(`POST请求失败: ${error.message}`);
    }
}

/**
 * 发送PUT请求
 * 
 * @param url 请求URL
 * @param data 请求数据
 * @param headers 请求头
 * @returns 响应数据
 */
export async function httpPut(url: string, data: any, headers?: Record<string, string>): Promise<any> {
    try {
        const isJson = typeof data === 'object';
        const requestHeaders = {
            'Content-Type': isJson ? 'application/json' : 'text/plain',
            ...headers,
        };
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: requestHeaders,
            body: isJson ? JSON.stringify(data) : data,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error('PUT请求错误:', error);
        throw new Error(`PUT请求失败: ${error.message}`);
    }
}

/**
 * 发送DELETE请求
 * 
 * @param url 请求URL
 * @param headers 请求头
 * @returns 响应数据
 */
export async function httpDelete(url: string, headers?: Record<string, string>): Promise<any> {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headers || {},
        });
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error('DELETE请求错误:', error);
        throw new Error(`DELETE请求失败: ${error.message}`);
    }
}

/**
 * 上传文件
 * 
 * @param url 上传URL
 * @param formData 表单数据
 * @param headers 请求头
 * @returns 响应数据
 */
export async function httpUploadFile(url: string, formData: FormData, headers?: Record<string, string>): Promise<any> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers || {},
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error('文件上传错误:', error);
        throw new Error(`文件上传失败: ${error.message}`);
    }
}

/**
 * 网络请求工具定义
 */
export const httpTools: TTool[] = [
    {
        id: 'http-get',
        name: 'GET请求',
        description: '发送HTTP GET请求获取数据',
        category: TToolCategory.COMMUNICATION,
        tags: ['HTTP', 'GET', '网络'],
        isBuiltin: true,
        parameters: [
            {
                name: 'url',
                type: 'string',
                description: '请求的URL',
                required: true
            },
            {
                name: 'headers',
                type: 'object',
                description: '请求头(可选)',
                required: false
            }
        ],
        returnType: '响应数据(JSON或文本)',
        examples: [
            'await tools.callTool("http-get", { url: "https://api.example.com/data" })',
            'await tools.callTool("http-get", { url: "https://api.example.com/data", headers: { "Authorization": "Bearer token" } })'
        ]
    },
    {
        id: 'http-post',
        name: 'POST请求',
        description: '发送HTTP POST请求提交数据',
        category: TToolCategory.COMMUNICATION,
        tags: ['HTTP', 'POST', '网络'],
        isBuiltin: true,
        parameters: [
            {
                name: 'url',
                type: 'string',
                description: '请求的URL',
                required: true
            },
            {
                name: 'data',
                type: 'object',
                description: '要提交的数据',
                required: true
            },
            {
                name: 'headers',
                type: 'object',
                description: '请求头(可选)',
                required: false
            }
        ],
        returnType: '响应数据(JSON或文本)',
        examples: [
            'await tools.callTool("http-post", { url: "https://api.example.com/data", data: { name: "张三", age: 30 } })',
            'await tools.callTool("http-post", { url: "https://api.example.com/data", data: "原始文本数据", headers: { "Content-Type": "text/plain" } })'
        ]
    },
    {
        id: 'http-put',
        name: 'PUT请求',
        description: '发送HTTP PUT请求更新数据',
        category: TToolCategory.COMMUNICATION,
        tags: ['HTTP', 'PUT', '网络'],
        isBuiltin: true,
        parameters: [
            {
                name: 'url',
                type: 'string',
                description: '请求的URL',
                required: true
            },
            {
                name: 'data',
                type: 'object',
                description: '要更新的数据',
                required: true
            },
            {
                name: 'headers',
                type: 'object',
                description: '请求头(可选)',
                required: false
            }
        ],
        returnType: '响应数据(JSON或文本)',
        examples: [
            'await tools.callTool("http-put", { url: "https://api.example.com/data/123", data: { name: "张三", age: 31 } })'
        ]
    },
    {
        id: 'http-delete',
        name: 'DELETE请求',
        description: '发送HTTP DELETE请求删除数据',
        category: TToolCategory.COMMUNICATION,
        tags: ['HTTP', 'DELETE', '网络'],
        isBuiltin: true,
        parameters: [
            {
                name: 'url',
                type: 'string',
                description: '请求的URL',
                required: true
            },
            {
                name: 'headers',
                type: 'object',
                description: '请求头(可选)',
                required: false
            }
        ],
        returnType: '响应数据(JSON或文本)',
        examples: [
            'await tools.callTool("http-delete", { url: "https://api.example.com/data/123" })'
        ]
    },
    {
        id: 'http-upload',
        name: '文件上传',
        description: '向服务器上传文件',
        category: TToolCategory.COMMUNICATION,
        tags: ['HTTP', '上传', '文件'],
        isBuiltin: true,
        parameters: [
            {
                name: 'url',
                type: 'string',
                description: '上传URL',
                required: true
            },
            {
                name: 'formData',
                type: 'object',
                description: '包含文件的FormData对象',
                required: true
            },
            {
                name: 'headers',
                type: 'object',
                description: '请求头(可选)',
                required: false
            }
        ],
        returnType: '响应数据(JSON或文本)',
        examples: [
            '// 在浏览器环境中:\nconst formData = new FormData();\nformData.append("file", 文件对象);\nawait tools.callTool("http-upload", { url: "https://api.example.com/upload", formData })'
        ]
    }
]; 