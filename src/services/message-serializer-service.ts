/**
 * 消息序列化服务
 * 
 * 提供消息的序列化和反序列化功能，支持消息持久化存储和网络传输
 */
import {
    TMessage,
    TMessageType,
    ITextMessage,
    ICommandMessage,
    IToolCallMessage,
    IToolResponseMessage,
    ISystemMessage,
    IThinkingMessage,
    IImageMessage,
    IFileMessage
} from '@/types/message-types';

/**
 * 序列化选项
 */
export interface ISerializeOptions {
    /**
     * 是否包含大型数据
     * 为false时，大型数据(如图片、文件内容)将被替换为引用
     */
    includeLargeData?: boolean;
    
    /**
     * 是否使用压缩
     */
    compress?: boolean;
    
    /**
     * 自定义处理函数
     */
    customProcess?: (message: TMessage) => any;
}

/**
 * 反序列化选项
 */
export interface IDeserializeOptions {
    /**
     * 是否解析大型数据引用
     * 为true时，尝试解析大型数据引用并加载实际内容
     */
    resolveLargeDataRefs?: boolean;
    
    /**
     * 数据加载器
     * 用于加载被引用的大型数据
     */
    dataLoader?: (ref: string) => Promise<any>;
    
    /**
     * 自定义处理函数
     */
    customProcess?: (data: any) => TMessage;
}

/**
 * 消息序列化服务类
 * 
 * 负责处理消息的序列化和反序列化
 */
export class MessageSerializerService {
    /**
     * 消息内容的大小阈值（字节）
     * 超过此阈值的内容将被视为大型数据
     */
    private static LARGE_DATA_THRESHOLD = 1024 * 100; // 100KB
    
    /**
     * 单例实例
     */
    private static instance: MessageSerializerService;
    
    /**
     * 获取服务实例
     */
    public static getInstance(): MessageSerializerService {
        if (!MessageSerializerService.instance) {
            MessageSerializerService.instance = new MessageSerializerService();
        }
        return MessageSerializerService.instance;
    }
    
    /**
     * 私有构造函数
     */
    private constructor() {
        console.log('消息序列化服务初始化');
    }
    
    /**
     * 序列化消息
     * 
     * @param message 要序列化的消息
     * @param options 序列化选项
     * @returns 序列化后的字符串
     */
    public serialize(message: TMessage, options: ISerializeOptions = {}): string {
        // 创建消息的副本以避免修改原始消息
        const messageCopy = JSON.parse(JSON.stringify(message));
        
        // 处理大型数据
        if (options.includeLargeData !== true) {
            this.replaceLargeData(messageCopy);
        }
        
        // 应用自定义处理
        const processedMessage = options.customProcess 
            ? options.customProcess(messageCopy)
            : messageCopy;
        
        // 添加序列化元数据
        const withMeta = {
            __meta: {
                version: '1.0',
                timestamp: Date.now(),
                compressed: !!options.compress,
                includeLargeData: !!options.includeLargeData
            },
            message: processedMessage
        };
        
        // 序列化为字符串
        const serialized = JSON.stringify(withMeta);
        
        // 如果需要压缩
        if (options.compress) {
            return this.compressString(serialized);
        }
        
        return serialized;
    }
    
    /**
     * 序列化多个消息
     * 
     * @param messages 要序列化的消息数组
     * @param options 序列化选项
     * @returns 序列化后的字符串
     */
    public serializeMessages(messages: TMessage[], options: ISerializeOptions = {}): string {
        // 创建消息数组副本
        const messagesCopy = JSON.parse(JSON.stringify(messages));
        
        // 处理大型数据
        if (options.includeLargeData !== true) {
            messagesCopy.forEach(message => this.replaceLargeData(message));
        }
        
        // 应用自定义处理
        const processedMessages = options.customProcess
            ? messagesCopy.map(message => options.customProcess!(message))
            : messagesCopy;
        
        // 添加序列化元数据
        const withMeta = {
            __meta: {
                version: '1.0',
                timestamp: Date.now(),
                compressed: !!options.compress,
                includeLargeData: !!options.includeLargeData,
                isArray: true,
                count: messages.length
            },
            messages: processedMessages
        };
        
        // 序列化为字符串
        const serialized = JSON.stringify(withMeta);
        
        // 如果需要压缩
        if (options.compress) {
            return this.compressString(serialized);
        }
        
        return serialized;
    }
    
    /**
     * 反序列化消息
     * 
     * @param data 序列化后的字符串
     * @param options 反序列化选项
     * @returns 反序列化后的消息或消息数组
     */
    public async deserialize(
        data: string, 
        options: IDeserializeOptions = {}
    ): Promise<TMessage | TMessage[]> {
        // 检查是否是压缩数据
        const isCompressed = data.startsWith('compressed:');
        let jsonStr = data;
        
        if (isCompressed) {
            jsonStr = this.decompressString(data);
        }
        
        // 解析JSON
        const parsed = JSON.parse(jsonStr);
        
        // 验证元数据
        if (!parsed.__meta) {
            throw new Error('无效的序列化消息：缺少元数据');
        }
        
        // 检查是否是消息数组
        if (parsed.__meta.isArray) {
            const messages = parsed.messages;
            
            // 恢复大型数据引用
            if (options.resolveLargeDataRefs && options.dataLoader) {
                for (let i = 0; i < messages.length; i++) {
                    messages[i] = await this.resolveLargeDataRefs(messages[i], options.dataLoader);
                }
            }
            
            // 应用自定义处理
            if (options.customProcess) {
                return messages.map(msg => options.customProcess!(msg));
            }
            
            return messages as TMessage[];
        } else {
            let message = parsed.message;
            
            // 恢复大型数据引用
            if (options.resolveLargeDataRefs && options.dataLoader) {
                message = await this.resolveLargeDataRefs(message, options.dataLoader);
            }
            
            // 应用自定义处理
            if (options.customProcess) {
                return options.customProcess(message);
            }
            
            return message as TMessage;
        }
    }
    
    /**
     * 替换消息中的大型数据为引用
     * 
     * @param message 消息对象
     */
    private replaceLargeData(message: any): void {
        if (!message || typeof message !== 'object') return;
        
        // 根据消息类型处理不同的大型数据字段
        switch (message.type) {
            case TMessageType.IMAGE:
                this.replaceImageData(message);
                break;
                
            case TMessageType.FILE:
                this.replaceFileData(message);
                break;
                
            case TMessageType.TEXT:
                this.replaceLargeText(message);
                break;
                
            case TMessageType.TOOL_RESPONSE:
                this.replaceLargeToolResponse(message);
                break;
        }
    }
    
    /**
     * 替换图片数据为引用
     * 
     * @param message 图片消息
     */
    private replaceImageData(message: any): void {
        if (!message.data || !message.data.src) return;
        
        const { src, imageType } = message.data;
        
        // 仅处理base64类型的图片数据
        if (imageType === 'base64' && src.length > MessageSerializerService.LARGE_DATA_THRESHOLD) {
            // 创建引用
            const ref = `ref:image:${message.id}`;
            
            // 存储原始数据的元数据
            message.data.__originalSize = src.length;
            
            // 替换为引用
            message.data.src = ref;
        }
    }
    
    /**
     * 替换文件数据为引用
     * 
     * @param message 文件消息
     */
    private replaceFileData(message: any): void {
        if (!message.data || !message.data.content) return;
        
        const { content, contentType, size } = message.data;
        
        // 仅处理base64类型的文件数据
        if (contentType === 'base64' && size > MessageSerializerService.LARGE_DATA_THRESHOLD) {
            // 创建引用
            const ref = `ref:file:${message.id}`;
            
            // 存储原始数据的元数据
            message.data.__originalSize = content.length;
            
            // 替换为引用
            message.data.content = ref;
        }
    }
    
    /**
     * 替换大型文本内容为引用
     * 
     * @param message 文本消息
     */
    private replaceLargeText(message: any): void {
        if (!message.data || !message.data.content) return;
        
        const { content } = message.data;
        
        if (content.length > MessageSerializerService.LARGE_DATA_THRESHOLD) {
            // 创建引用
            const ref = `ref:text:${message.id}`;
            
            // 存储原始数据的元数据
            message.data.__originalSize = content.length;
            message.data.__snippet = content.substring(0, 100) + '...';
            
            // 替换为引用
            message.data.content = ref;
        }
    }
    
    /**
     * 替换大型工具响应为引用
     * 
     * @param message 工具响应消息
     */
    private replaceLargeToolResponse(message: any): void {
        if (!message.data || !message.data.result) return;
        
        const result = message.data.result;
        const resultStr = typeof result === 'string' ? result : JSON.stringify(result);
        
        if (resultStr.length > MessageSerializerService.LARGE_DATA_THRESHOLD) {
            // 创建引用
            const ref = `ref:result:${message.id}`;
            
            // 存储原始数据的元数据
            message.data.__originalSize = resultStr.length;
            message.data.__snippet = typeof result === 'string' 
                ? result.substring(0, 100) + '...'
                : '大型结果数据';
            
            // 替换为引用
            message.data.result = ref;
        }
    }
    
    /**
     * 解析消息中的大型数据引用
     * 
     * @param message 消息对象
     * @param dataLoader 数据加载器
     * @returns 解析后的消息
     */
    private async resolveLargeDataRefs(
        message: any, 
        dataLoader: (ref: string) => Promise<any>
    ): Promise<any> {
        if (!message || typeof message !== 'object') return message;
        
        // 根据消息类型处理不同的引用字段
        switch (message.type) {
            case TMessageType.IMAGE:
                await this.resolveImageRef(message, dataLoader);
                break;
                
            case TMessageType.FILE:
                await this.resolveFileRef(message, dataLoader);
                break;
                
            case TMessageType.TEXT:
                await this.resolveTextRef(message, dataLoader);
                break;
                
            case TMessageType.TOOL_RESPONSE:
                await this.resolveToolResponseRef(message, dataLoader);
                break;
        }
        
        return message;
    }
    
    /**
     * 解析图片消息中的数据引用
     * 
     * @param message 图片消息
     * @param dataLoader 数据加载器
     */
    private async resolveImageRef(
        message: any, 
        dataLoader: (ref: string) => Promise<any>
    ): Promise<void> {
        if (!message.data || !message.data.src || !message.data.src.startsWith('ref:image:')) return;
        
        try {
            // 加载实际数据
            const imageData = await dataLoader(message.data.src);
            
            // 替换引用为实际数据
            message.data.src = imageData;
            
            // 删除元数据标记
            delete message.data.__originalSize;
        } catch (error) {
            console.error(`解析图片引用失败: ${message.data.src}`, error);
            // 保留引用，但添加错误标记
            message.data.__loadError = true;
        }
    }
    
    /**
     * 解析文件消息中的数据引用
     * 
     * @param message 文件消息
     * @param dataLoader 数据加载器
     */
    private async resolveFileRef(
        message: any, 
        dataLoader: (ref: string) => Promise<any>
    ): Promise<void> {
        if (!message.data || !message.data.content || !message.data.content.startsWith('ref:file:')) return;
        
        try {
            // 加载实际数据
            const fileData = await dataLoader(message.data.content);
            
            // 替换引用为实际数据
            message.data.content = fileData;
            
            // 删除元数据标记
            delete message.data.__originalSize;
        } catch (error) {
            console.error(`解析文件引用失败: ${message.data.content}`, error);
            // 保留引用，但添加错误标记
            message.data.__loadError = true;
        }
    }
    
    /**
     * 解析文本消息中的数据引用
     * 
     * @param message 文本消息
     * @param dataLoader 数据加载器
     */
    private async resolveTextRef(
        message: any, 
        dataLoader: (ref: string) => Promise<any>
    ): Promise<void> {
        if (!message.data || !message.data.content || !message.data.content.startsWith('ref:text:')) return;
        
        try {
            // 加载实际数据
            const textData = await dataLoader(message.data.content);
            
            // 替换引用为实际数据
            message.data.content = textData;
            
            // 删除元数据标记
            delete message.data.__originalSize;
            delete message.data.__snippet;
        } catch (error) {
            console.error(`解析文本引用失败: ${message.data.content}`, error);
            // 失败时使用片段（如果有）
            if (message.data.__snippet) {
                message.data.content = message.data.__snippet + ' [加载完整内容失败]';
            } else {
                message.data.content = '[大型文本内容加载失败]';
            }
            
            // 添加错误标记
            message.data.__loadError = true;
        }
    }
    
    /**
     * 解析工具响应消息中的数据引用
     * 
     * @param message 工具响应消息
     * @param dataLoader 数据加载器
     */
    private async resolveToolResponseRef(
        message: any, 
        dataLoader: (ref: string) => Promise<any>
    ): Promise<void> {
        if (!message.data || !message.data.result || !message.data.result.startsWith('ref:result:')) return;
        
        try {
            // 加载实际数据
            const resultData = await dataLoader(message.data.result);
            
            // 替换引用为实际数据
            message.data.result = resultData;
            
            // 删除元数据标记
            delete message.data.__originalSize;
            delete message.data.__snippet;
        } catch (error) {
            console.error(`解析工具响应引用失败: ${message.data.result}`, error);
            // 失败时使用片段（如果有）
            if (message.data.__snippet) {
                message.data.result = message.data.__snippet + ' [加载完整结果失败]';
            } else {
                message.data.result = '[大型结果数据加载失败]';
            }
            
            // 添加错误标记
            message.data.__loadError = true;
        }
    }
    
    /**
     * 压缩字符串
     * 
     * 简单的压缩实现，实际项目中可以替换为更高效的压缩算法
     * 例如使用pako、lz-string等库
     * 
     * @param str 要压缩的字符串
     * @returns 压缩后的字符串
     */
    private compressString(str: string): string {
        // 这里使用简单的base64编码作为示例
        // 实际项目中应该使用更好的压缩方法
        try {
            // 在实际应用中，这里应该使用真正的压缩算法
            const compressed = 'compressed:' + btoa(str);
            return compressed;
        } catch (error) {
            console.error('压缩字符串失败:', error);
            return str;
        }
    }
    
    /**
     * 解压字符串
     * 
     * @param str 要解压的字符串
     * @returns 解压后的字符串
     */
    private decompressString(str: string): string {
        if (!str.startsWith('compressed:')) {
            return str;
        }
        
        try {
            // 移除前缀
            const compressedData = str.substring('compressed:'.length);
            
            // 在实际应用中，这里应该使用真正的解压算法
            const decompressed = atob(compressedData);
            return decompressed;
        } catch (error) {
            console.error('解压字符串失败:', error);
            return str;
        }
    }
}

/**
 * 消息序列化服务实例
 */
export const messageSerializerService = MessageSerializerService.getInstance(); 