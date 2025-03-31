import { ITool, TToolStatus } from '@/components/tool';

/**
 * 模拟工具数据
 */
export const mockTools: ITool[] = [
  {
    id: 'web-search',
    name: '网络搜索',
    description: '允许代理搜索互联网获取信息',
    type: 'builtin',
    category: '信息获取',
    status: 'available' as TToolStatus,
    tags: ['搜索', '互联网', '信息'],
    isBuiltin: true,
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: '搜索查询字符串',
        required: true
      },
      {
        name: 'limit',
        type: 'number',
        description: '结果数量限制',
        required: false,
        default: 5
      }
    ],
    examples: [
      '搜索查询: "人工智能最新发展"',
      '搜索查询: "Python 多线程编程", 限制: 10'
    ]
  },
  {
    id: 'code-execution',
    name: '代码执行',
    description: '允许代理执行和测试代码',
    type: 'builtin',
    category: '开发工具',
    status: 'available' as TToolStatus,
    tags: ['代码', '执行', '开发'],
    isBuiltin: true,
    parameters: [
      {
        name: 'language',
        type: 'string',
        description: '编程语言',
        required: true,
        options: ['python', 'javascript', 'bash']
      },
      {
        name: 'code',
        type: 'string',
        description: '要执行的代码',
        required: true
      },
      {
        name: 'timeout',
        type: 'number',
        description: '执行超时时间(秒)',
        required: false,
        default: 30
      }
    ],
    examples: [
      '语言: "python", 代码: "print(\'Hello, World!\')"',
      '语言: "javascript", 代码: "console.log(new Date())"'
    ]
  },
  {
    id: 'document-analysis',
    name: '文档分析',
    description: '允许代理分析和处理文档内容',
    type: 'builtin',
    category: '数据处理',
    status: 'AVAILABLE' as TToolStatus,
    tags: ['文档', '分析', '内容提取'],
    isBuiltin: true,
    parameters: [
      {
        name: 'documentUrl',
        type: 'string',
        description: '文档URL或本地路径',
        required: true
      },
      {
        name: 'analysisType',
        type: 'string',
        description: '分析类型',
        required: true,
        options: ['summary', 'keywords', 'entities', 'sentiment']
      }
    ],
    examples: [
      '文档URL: "https://example.com/document.pdf", 分析类型: "summary"',
      '文档URL: "/uploads/report.docx", 分析类型: "entities"'
    ]
  },
  {
    id: 'data-visualization',
    name: '数据可视化',
    description: '生成数据的图表和可视化表示',
    type: 'addon',
    category: '数据处理',
    status: 'AVAILABLE' as TToolStatus,
    tags: ['数据', '图表', '可视化'],
    isBuiltin: false,
    parameters: [
      {
        name: 'data',
        type: 'object',
        description: '要可视化的数据',
        required: true
      },
      {
        name: 'chartType',
        type: 'string',
        description: '图表类型',
        required: true,
        options: ['bar', 'line', 'pie', 'scatter']
      },
      {
        name: 'title',
        type: 'string',
        description: '图表标题',
        required: false
      }
    ],
    examples: [
      '数据: {"labels": ["A", "B"], "values": [10, 20]}, 图表类型: "bar"',
      '数据: {"x": [1, 2, 3], "y": [10, 20, 30]}, 图表类型: "line", 标题: "趋势分析"'
    ]
  },
  {
    id: 'image-generation',
    name: '图像生成',
    description: '使用AI生成图像',
    type: 'addon',
    category: '创意工具',
    status: 'AVAILABLE' as TToolStatus,
    tags: ['图像', 'AI', '生成'],
    isBuiltin: false,
    parameters: [
      {
        name: 'prompt',
        type: 'string',
        description: '图像生成提示',
        required: true
      },
      {
        name: 'style',
        type: 'string',
        description: '图像风格',
        required: false,
        options: ['realistic', 'cartoon', 'abstract', 'sketch']
      },
      {
        name: 'size',
        type: 'string',
        description: '图像尺寸',
        required: false,
        options: ['small', 'medium', 'large'],
        default: 'medium'
      }
    ],
    examples: [
      '提示: "太空中的宇航员", 风格: "realistic"',
      '提示: "海滩上的城堡", 风格: "cartoon", 尺寸: "large"'
    ]
  },
  {
    id: 'text-to-speech',
    name: '文本转语音',
    description: '将文本转换为语音',
    type: 'addon',
    category: '媒体工具',
    status: 'AVAILABLE' as TToolStatus,
    tags: ['文本', '语音', '转换'],
    isBuiltin: false,
    parameters: [
      {
        name: 'text',
        type: 'string',
        description: '要转换的文本',
        required: true
      },
      {
        name: 'voice',
        type: 'string',
        description: '语音类型',
        required: false,
        options: ['male', 'female', 'child'],
        default: 'female'
      },
      {
        name: 'speed',
        type: 'number',
        description: '语速',
        required: false,
        default: 1.0
      }
    ],
    examples: [
      '文本: "这是一段示例文本", 语音: "female"',
      '文本: "欢迎使用文本转语音工具", 语音: "male", 语速: 0.8'
    ]
  },
  {
    id: 'language-translation',
    name: '语言翻译',
    description: '在不同语言之间翻译文本',
    type: 'builtin',
    category: '语言工具',
    status: 'AVAILABLE' as TToolStatus,
    tags: ['翻译', '语言', '文本'],
    isBuiltin: true,
    parameters: [
      {
        name: 'text',
        type: 'string',
        description: '要翻译的文本',
        required: true
      },
      {
        name: 'sourceLang',
        type: 'string',
        description: '源语言',
        required: false,
        options: ['auto', 'zh', 'en', 'ja', 'fr', 'de'],
        default: 'auto'
      },
      {
        name: 'targetLang',
        type: 'string',
        description: '目标语言',
        required: true,
        options: ['zh', 'en', 'ja', 'fr', 'de']
      }
    ],
    examples: [
      '文本: "Hello, world!", 目标语言: "zh"',
      '文本: "你好，世界！", 源语言: "zh", 目标语言: "en"'
    ]
  },
  {
    id: 'database-query',
    name: '数据库查询',
    description: '执行数据库查询',
    type: 'addon',
    category: '数据工具',
    status: 'INITIALIZING' as TToolStatus,
    tags: ['数据库', 'SQL', '查询'],
    isBuiltin: false,
    parameters: [
      {
        name: 'database',
        type: 'string',
        description: '数据库名称',
        required: true
      },
      {
        name: 'query',
        type: 'string',
        description: 'SQL查询',
        required: true
      },
      {
        name: 'params',
        type: 'array',
        description: '查询参数',
        required: false
      }
    ],
    examples: [
      '数据库: "users_db", 查询: "SELECT * FROM users LIMIT 10"',
      '数据库: "products_db", 查询: "SELECT * FROM products WHERE category = ?", 参数: ["electronics"]'
    ]
  },
  {
    id: 'file-management',
    name: '文件管理',
    description: '管理文件和目录',
    type: 'builtin',
    category: '系统工具',
    status: 'AVAILABLE' as TToolStatus,
    tags: ['文件', '目录', '管理'],
    isBuiltin: true,
    parameters: [
      {
        name: 'action',
        type: 'string',
        description: '操作类型',
        required: true,
        options: ['list', 'read', 'write', 'delete', 'move']
      },
      {
        name: 'path',
        type: 'string',
        description: '文件或目录路径',
        required: true
      },
      {
        name: 'content',
        type: 'string',
        description: '文件内容(用于写入操作)',
        required: false
      }
    ],
    examples: [
      '操作: "list", 路径: "/uploads"',
      '操作: "read", 路径: "/uploads/document.txt"',
      '操作: "write", 路径: "/uploads/new.txt", 内容: "这是新文件内容"'
    ]
  }
];