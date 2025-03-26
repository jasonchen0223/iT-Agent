/**
 * 数据处理工具
 * 
 * 提供JSON解析、格式转换、数据统计等功能
 */
import { TTool, TToolCategory } from '@/types/tool-types';

/**
 * 解析JSON字符串为对象
 * 
 * @param jsonString JSON字符串
 * @returns 解析后的对象
 */
export function parseJson(jsonString: string): any {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('JSON解析错误:', error);
        throw new Error(`JSON解析失败: ${error.message}`);
    }
}

/**
 * 将对象转换为JSON字符串
 * 
 * @param data 要转换的对象
 * @param pretty 是否格式化输出
 * @returns JSON字符串
 */
export function stringifyJson(data: any, pretty: boolean = false): string {
    try {
        return JSON.stringify(data, null, pretty ? 2 : undefined);
    } catch (error) {
        console.error('JSON字符串化错误:', error);
        throw new Error(`JSON字符串化失败: ${error.message}`);
    }
}

/**
 * 格式化日期
 * 
 * @param date 日期对象或日期字符串
 * @param format 格式化模式
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
    try {
        const d = new Date(date);
        
        if (isNaN(d.getTime())) {
            throw new Error('无效的日期');
        }
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', String(year))
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    } catch (error) {
        console.error('日期格式化错误:', error);
        throw new Error(`日期格式化失败: ${error.message}`);
    }
}

/**
 * 计算数组统计信息
 * 
 * @param arr 数字数组
 * @returns 统计信息对象
 */
export function calculateStats(arr: number[]): any {
    try {
        if (!Array.isArray(arr) || arr.length === 0) {
            throw new Error('输入必须是非空数组');
        }
        
        const sum = arr.reduce((a, b) => a + b, 0);
        const mean = sum / arr.length;
        const sortedArr = [...arr].sort((a, b) => a - b);
        const median = arr.length % 2 === 0
            ? (sortedArr[arr.length / 2 - 1] + sortedArr[arr.length / 2]) / 2
            : sortedArr[Math.floor(arr.length / 2)];
        
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        
        // 计算标准差
        const sumSquareDiff = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
        const stdDev = Math.sqrt(sumSquareDiff / arr.length);
        
        return {
            count: arr.length,
            sum,
            mean,
            median,
            min,
            max,
            range: max - min,
            stdDev
        };
    } catch (error) {
        console.error('统计计算错误:', error);
        throw new Error(`统计计算失败: ${error.message}`);
    }
}

/**
 * 对象路径访问器
 * 
 * @param obj 要访问的对象
 * @param path 访问路径，格式如 "user.profile.name"
 * @param defaultValue 默认值
 * @returns 路径对应的值或默认值
 */
export function getObjectValue(obj: any, path: string, defaultValue: any = undefined): any {
    try {
        const keys = path.split('.');
        let result = obj;
        
        for (const key of keys) {
            if (result === null || result === undefined || typeof result !== 'object') {
                return defaultValue;
            }
            result = result[key];
        }
        
        return result === undefined ? defaultValue : result;
    } catch (error) {
        console.error('对象路径访问错误:', error);
        throw new Error(`对象路径访问失败: ${error.message}`);
    }
}

/**
 * CSV字符串转换为对象数组
 * 
 * @param csvString CSV格式字符串
 * @param delimiter 分隔符，默认为逗号
 * @returns 对象数组
 */
export function csvToJson(csvString: string, delimiter: string = ','): any[] {
    try {
        const lines = csvString.split('\n');
        if (lines.length < 2) {
            throw new Error('CSV至少需要包含标题行和一行数据');
        }
        
        const headers = lines[0].split(delimiter).map(h => h.trim());
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(delimiter);
            const obj: Record<string, string> = {};
            
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = values[j] ? values[j].trim() : '';
            }
            
            result.push(obj);
        }
        
        return result;
    } catch (error) {
        console.error('CSV转JSON错误:', error);
        throw new Error(`CSV转JSON失败: ${error.message}`);
    }
}

/**
 * 对象数组转换为CSV字符串
 * 
 * @param data 对象数组
 * @param delimiter 分隔符，默认为逗号
 * @returns CSV格式字符串
 */
export function jsonToCsv(data: any[], delimiter: string = ','): string {
    try {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('输入必须是非空数组');
        }
        
        // 获取所有可能的标题
        const headers = Array.from(
            new Set(
                data.reduce((keys, obj) => [...keys, ...Object.keys(obj)], [] as string[])
            )
        );
        
        // 创建CSV内容
        const csvContent = [
            headers.join(delimiter),
            ...data.map(obj => 
                headers.map(header => {
                    const value = obj[header];
                    // 处理特殊字符
                    if (value === null || value === undefined) {
                        return '';
                    }
                    const strValue = String(value);
                    if (strValue.includes(delimiter) || strValue.includes('"') || strValue.includes('\n')) {
                        return `"${strValue.replace(/"/g, '""')}"`;
                    }
                    return strValue;
                }).join(delimiter)
            )
        ].join('\n');
        
        return csvContent;
    } catch (error) {
        console.error('JSON转CSV错误:', error);
        throw new Error(`JSON转CSV失败: ${error.message}`);
    }
}

/**
 * 数据处理工具定义
 */
export const dataTools: TTool[] = [
    {
        id: 'data-parse-json',
        name: 'JSON解析',
        description: '将JSON字符串解析为JavaScript对象',
        category: TToolCategory.ANALYSIS,
        tags: ['JSON', '解析', '数据处理'],
        isBuiltin: true,
        parameters: [
            {
                name: 'jsonString',
                type: 'string',
                description: 'JSON格式的字符串',
                required: true
            }
        ],
        returnType: '解析后的对象',
        examples: [
            'await tools.callTool("data-parse-json", { jsonString: \'{"name":"张三","age":30}\' })'
        ]
    },
    {
        id: 'data-stringify-json',
        name: 'JSON字符串化',
        description: '将JavaScript对象转换为JSON字符串',
        category: TToolCategory.ANALYSIS,
        tags: ['JSON', '字符串化', '数据处理'],
        isBuiltin: true,
        parameters: [
            {
                name: 'data',
                type: 'object',
                description: '要转换的对象',
                required: true
            },
            {
                name: 'pretty',
                type: 'boolean',
                description: '是否格式化输出',
                required: false,
                defaultValue: false
            }
        ],
        returnType: 'JSON字符串',
        examples: [
            'await tools.callTool("data-stringify-json", { data: { name: "张三", age: 30 } })',
            'await tools.callTool("data-stringify-json", { data: { name: "张三", age: 30 }, pretty: true })'
        ]
    },
    {
        id: 'data-format-date',
        name: '日期格式化',
        description: '将日期格式化为指定格式的字符串',
        category: TToolCategory.ANALYSIS,
        tags: ['日期', '格式化', '数据处理'],
        isBuiltin: true,
        parameters: [
            {
                name: 'date',
                type: 'string',
                description: '日期对象或日期字符串',
                required: true
            },
            {
                name: 'format',
                type: 'string',
                description: '格式化模式，如 "YYYY-MM-DD HH:mm:ss"',
                required: false,
                defaultValue: 'YYYY-MM-DD'
            }
        ],
        returnType: '格式化后的日期字符串',
        examples: [
            'await tools.callTool("data-format-date", { date: "2023-04-01" })',
            'await tools.callTool("data-format-date", { date: "2023-04-01", format: "YYYY年MM月DD日" })'
        ]
    },
    {
        id: 'data-calculate-stats',
        name: '统计计算',
        description: '计算数组的基本统计信息',
        category: TToolCategory.ANALYSIS,
        tags: ['统计', '计算', '数据分析'],
        isBuiltin: true,
        parameters: [
            {
                name: 'arr',
                type: 'array',
                description: '数字数组',
                required: true
            }
        ],
        returnType: '统计信息对象，包含计数、总和、平均值、中位数、最小值、最大值、范围和标准差',
        examples: [
            'await tools.callTool("data-calculate-stats", { arr: [1, 2, 3, 4, 5] })'
        ]
    },
    {
        id: 'data-get-object-value',
        name: '对象路径访问',
        description: '通过路径访问嵌套对象的属性值',
        category: TToolCategory.ANALYSIS,
        tags: ['对象', '路径', '数据访问'],
        isBuiltin: true,
        parameters: [
            {
                name: 'obj',
                type: 'object',
                description: '要访问的对象',
                required: true
            },
            {
                name: 'path',
                type: 'string',
                description: '访问路径，格式如 "user.profile.name"',
                required: true
            },
            {
                name: 'defaultValue',
                type: 'string',
                description: '当路径不存在时返回的默认值',
                required: false
            }
        ],
        returnType: '路径对应的值或默认值',
        examples: [
            'await tools.callTool("data-get-object-value", { obj: { user: { profile: { name: "张三" } } }, path: "user.profile.name" })',
            'await tools.callTool("data-get-object-value", { obj: { user: { } }, path: "user.profile.name", defaultValue: "未知" })'
        ]
    },
    {
        id: 'data-csv-to-json',
        name: 'CSV转JSON',
        description: '将CSV格式字符串转换为对象数组',
        category: TToolCategory.ANALYSIS,
        tags: ['CSV', 'JSON', '格式转换'],
        isBuiltin: true,
        parameters: [
            {
                name: 'csvString',
                type: 'string',
                description: 'CSV格式字符串',
                required: true
            },
            {
                name: 'delimiter',
                type: 'string',
                description: '分隔符，默认为逗号',
                required: false,
                defaultValue: ','
            }
        ],
        returnType: '对象数组',
        examples: [
            'await tools.callTool("data-csv-to-json", { csvString: "name,age\\n张三,30\\n李四,25" })',
            'await tools.callTool("data-csv-to-json", { csvString: "name;age\\n张三;30\\n李四;25", delimiter: ";" })'
        ]
    },
    {
        id: 'data-json-to-csv',
        name: 'JSON转CSV',
        description: '将对象数组转换为CSV格式字符串',
        category: TToolCategory.ANALYSIS,
        tags: ['JSON', 'CSV', '格式转换'],
        isBuiltin: true,
        parameters: [
            {
                name: 'data',
                type: 'array',
                description: '对象数组',
                required: true
            },
            {
                name: 'delimiter',
                type: 'string',
                description: '分隔符，默认为逗号',
                required: false,
                defaultValue: ','
            }
        ],
        returnType: 'CSV格式字符串',
        examples: [
            'await tools.callTool("data-json-to-csv", { data: [{ name: "张三", age: 30 }, { name: "李四", age: 25 }] })',
            'await tools.callTool("data-json-to-csv", { data: [{ name: "张三", age: 30 }, { name: "李四", age: 25 }], delimiter: ";" })'
        ]
    }
]; 