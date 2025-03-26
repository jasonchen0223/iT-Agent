/**
 * 消息安全服务
 * 
 * 提供消息加密、签名和验证等安全功能
 */
import { TMessage } from '@/types/message-types';

/**
 * 加密设置
 */
export interface IEncryptionSettings {
    /**
     * 是否启用加密
     */
    enabled: boolean;
    
    /**
     * 加密算法
     */
    algorithm: 'aes-gcm' | 'aes-cbc' | string;
    
    /**
     * 密钥格式
     */
    keyFormat: 'raw' | 'jwk' | string;
    
    /**
     * 密钥长度 (位)
     */
    keyLength: number;
}

/**
 * 签名设置
 */
export interface ISignatureSettings {
    /**
     * 是否启用签名
     */
    enabled: boolean;
    
    /**
     * 签名算法
     */
    algorithm: 'hmac' | 'rsa-pss' | 'ecdsa' | string;
    
    /**
     * 哈希算法
     */
    hashAlgorithm: 'sha-256' | 'sha-384' | 'sha-512' | string;
}

/**
 * 安全设置
 */
export interface ISecuritySettings {
    /**
     * 加密设置
     */
    encryption: IEncryptionSettings;
    
    /**
     * 签名设置
     */
    signature: ISignatureSettings;
    
    /**
     * 会话令牌超时时间 (毫秒)
     */
    sessionTokenTimeout: number;
    
    /**
     * 是否在传输中验证消息完整性
     */
    validateIntegrity: boolean;
}

/**
 * 默认安全设置
 */
const DEFAULT_SECURITY_SETTINGS: ISecuritySettings = {
    encryption: {
        enabled: false, // 默认不启用，需要显式开启
        algorithm: 'aes-gcm',
        keyFormat: 'raw',
        keyLength: 256
    },
    signature: {
        enabled: true,
        algorithm: 'hmac',
        hashAlgorithm: 'sha-256'
    },
    sessionTokenTimeout: 1000 * 60 * 60 * 24, // 24小时
    validateIntegrity: true
};

/**
 * 消息安全服务类
 * 
 * 负责消息的安全处理，包括加密、签名和验证
 */
export class MessageSecurityService {
    /**
     * 安全设置
     */
    private settings: ISecuritySettings;
    
    /**
     * 密钥映射表 - 会话ID到密钥的映射
     */
    private sessionKeys: Map<string, CryptoKey> = new Map();
    
    /**
     * 会话令牌映射表 - 会话ID到令牌的映射
     */
    private sessionTokens: Map<string, { token: string, expires: number }> = new Map();
    
    /**
     * 单例实例
     */
    private static instance: MessageSecurityService;
    
    /**
     * 获取服务实例
     */
    public static getInstance(): MessageSecurityService {
        if (!MessageSecurityService.instance) {
            MessageSecurityService.instance = new MessageSecurityService();
        }
        return MessageSecurityService.instance;
    }
    
    /**
     * 私有构造函数
     */
    private constructor() {
        this.settings = { ...DEFAULT_SECURITY_SETTINGS };
        console.log('消息安全服务初始化');
    }
    
    /**
     * 更新安全设置
     * 
     * @param settings 新的安全设置
     */
    public updateSettings(settings: Partial<ISecuritySettings>): void {
        this.settings = {
            ...this.settings,
            ...settings,
            encryption: {
                ...this.settings.encryption,
                ...(settings.encryption || {})
            },
            signature: {
                ...this.settings.signature,
                ...(settings.signature || {})
            }
        };
        
        console.log('安全设置已更新');
    }
    
    /**
     * 初始化会话安全
     * 
     * @param sessionId 会话ID
     * @returns 会话令牌
     */
    public async initializeSessionSecurity(sessionId: string): Promise<string> {
        // 生成新的会话密钥
        const key = await this.generateKey(this.settings.encryption);
        this.sessionKeys.set(sessionId, key);
        
        // 生成会话令牌
        const token = await this.generateSessionToken(sessionId);
        const expires = Date.now() + this.settings.sessionTokenTimeout;
        
        this.sessionTokens.set(sessionId, { token, expires });
        
        return token;
    }
    
    /**
     * 验证会话令牌
     * 
     * @param sessionId 会话ID
     * @param token 会话令牌
     * @returns 是否有效
     */
    public validateSessionToken(sessionId: string, token: string): boolean {
        const sessionToken = this.sessionTokens.get(sessionId);
        
        if (!sessionToken) {
            return false;
        }
        
        // 检查令牌是否过期
        if (sessionToken.expires < Date.now()) {
            this.sessionTokens.delete(sessionId);
            return false;
        }
        
        // 验证令牌是否匹配
        return sessionToken.token === token;
    }
    
    /**
     * 加密消息
     * 
     * @param message 要加密的消息
     * @param sessionId 会话ID
     * @param token 会话令牌
     * @returns 加密后的消息数据
     */
    public async encryptMessage(
        message: TMessage,
        sessionId: string,
        token: string
    ): Promise<{ encrypted: ArrayBuffer, iv: Uint8Array, signature?: string }> {
        // 验证会话令牌
        if (!this.validateSessionToken(sessionId, token)) {
            throw new Error('无效的会话令牌');
        }
        
        // 获取会话密钥
        const key = this.sessionKeys.get(sessionId);
        if (!key) {
            throw new Error('会话密钥不存在');
        }
        
        // 序列化消息为字符串
        const messageStr = JSON.stringify(message);
        
        // 转换为Uint8Array
        const data = new TextEncoder().encode(messageStr);
        
        // 生成随机初始向量
        const iv = crypto.getRandomValues(new Uint8Array(16));
        
        // 加密数据
        const encrypted = await this.encrypt(data, key, iv, this.settings.encryption);
        
        // 计算消息签名
        let signature: string | undefined;
        if (this.settings.signature.enabled) {
            signature = await this.signData(data, key, this.settings.signature);
        }
        
        return { encrypted, iv, signature };
    }
    
    /**
     * 解密消息
     * 
     * @param encryptedData 加密的数据
     * @param iv 初始向量
     * @param signature 签名（可选）
     * @param sessionId 会话ID
     * @param token 会话令牌
     * @returns 解密后的消息
     */
    public async decryptMessage(
        encryptedData: ArrayBuffer,
        iv: Uint8Array,
        signature: string | undefined,
        sessionId: string,
        token: string
    ): Promise<TMessage> {
        // 验证会话令牌
        if (!this.validateSessionToken(sessionId, token)) {
            throw new Error('无效的会话令牌');
        }
        
        // 获取会话密钥
        const key = this.sessionKeys.get(sessionId);
        if (!key) {
            throw new Error('会话密钥不存在');
        }
        
        // 解密数据
        const decrypted = await this.decrypt(encryptedData, key, iv, this.settings.encryption);
        
        // 解析JSON
        const messageStr = new TextDecoder().decode(decrypted);
        const message = JSON.parse(messageStr) as TMessage;
        
        // 验证消息完整性
        if (this.settings.validateIntegrity) {
            if (!this.validateMessageIntegrity(message)) {
                throw new Error('消息完整性验证失败');
            }
        }
        
        // 验证签名
        if (this.settings.signature.enabled && signature) {
            const isValid = await this.verifySignature(
                decrypted,
                signature,
                key,
                this.settings.signature
            );
            
            if (!isValid) {
                throw new Error('消息签名验证失败');
            }
        }
        
        return message;
    }
    
    /**
     * 保护消息（不加密，但添加完整性验证和签名）
     * 
     * @param message 要保护的消息
     * @param sessionId 会话ID
     * @param token 会话令牌
     * @returns 保护后的消息和签名
     */
    public async protectMessage(
        message: TMessage,
        sessionId: string,
        token: string
    ): Promise<{ protectedMessage: TMessage, signature?: string }> {
        // 验证会话令牌
        if (!this.validateSessionToken(sessionId, token)) {
            throw new Error('无效的会话令牌');
        }
        
        // 获取会话密钥
        const key = this.sessionKeys.get(sessionId);
        if (!key) {
            throw new Error('会话密钥不存在');
        }
        
        // 创建消息副本
        const protectedMessage = JSON.parse(JSON.stringify(message)) as TMessage;
        
        // 添加安全元数据
        if (!protectedMessage.metadata) {
            protectedMessage.metadata = {};
        }
        
        protectedMessage.metadata.securityTimestamp = Date.now();
        protectedMessage.metadata.sessionId = sessionId;
        
        // 计算消息签名
        let signature: string | undefined;
        if (this.settings.signature.enabled) {
            const data = new TextEncoder().encode(JSON.stringify(protectedMessage));
            signature = await this.signData(data, key, this.settings.signature);
        }
        
        return { protectedMessage, signature };
    }
    
    /**
     * 验证受保护的消息
     * 
     * @param message 受保护的消息
     * @param signature 签名
     * @param sessionId 会话ID
     * @param token 会话令牌
     * @returns 是否有效
     */
    public async verifyProtectedMessage(
        message: TMessage,
        signature: string,
        sessionId: string,
        token: string
    ): Promise<boolean> {
        // 验证会话令牌
        if (!this.validateSessionToken(sessionId, token)) {
            return false;
        }
        
        // 获取会话密钥
        const key = this.sessionKeys.get(sessionId);
        if (!key) {
            return false;
        }
        
        // 验证消息完整性
        if (this.settings.validateIntegrity) {
            if (!this.validateMessageIntegrity(message)) {
                return false;
            }
        }
        
        // 验证安全元数据
        if (!message.metadata || 
            !message.metadata.securityTimestamp || 
            !message.metadata.sessionId) {
            return false;
        }
        
        // 检查会话ID
        if (message.metadata.sessionId !== sessionId) {
            return false;
        }
        
        // 检查时间戳是否在合理范围内
        const timestamp = message.metadata.securityTimestamp as number;
        const now = Date.now();
        const maxAge = 5 * 60 * 1000; // 5分钟
        
        if (now - timestamp > maxAge) {
            return false;
        }
        
        // 验证签名
        if (this.settings.signature.enabled) {
            const data = new TextEncoder().encode(JSON.stringify(message));
            return this.verifySignature(
                data,
                signature,
                key,
                this.settings.signature
            );
        }
        
        return true;
    }
    
    /**
     * 终止会话安全
     * 
     * @param sessionId 会话ID
     */
    public terminateSessionSecurity(sessionId: string): void {
        this.sessionKeys.delete(sessionId);
        this.sessionTokens.delete(sessionId);
    }
    
    /**
     * 生成密钥
     * 
     * @param settings 加密设置
     * @returns 生成的密钥
     */
    private async generateKey(settings: IEncryptionSettings): Promise<CryptoKey> {
        // 定义密钥生成参数
        const algorithm: AesKeyGenParams = {
            name: settings.algorithm === 'aes-gcm' ? 'AES-GCM' : 'AES-CBC',
            length: settings.keyLength
        };
        
        // 生成密钥
        return window.crypto.subtle.generateKey(
            algorithm,
            true, // 可导出
            ['encrypt', 'decrypt'] // 允许的操作
        );
    }
    
    /**
     * 生成会话令牌
     * 
     * @param sessionId 会话ID
     * @returns 生成的令牌
     */
    private async generateSessionToken(sessionId: string): Promise<string> {
        // 创建随机数据
        const randomData = crypto.getRandomValues(new Uint8Array(32));
        
        // 与会话ID结合
        const data = new TextEncoder().encode(sessionId + '-' + Date.now());
        
        // 合并数据
        const combined = new Uint8Array(randomData.length + data.length);
        combined.set(randomData);
        combined.set(data, randomData.length);
        
        // 计算哈希
        const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
        
        // 转换为Base64
        return this.arrayBufferToBase64(hashBuffer);
    }
    
    /**
     * 加密数据
     * 
     * @param data 要加密的数据
     * @param key 密钥
     * @param iv 初始向量
     * @param settings 加密设置
     * @returns 加密后的数据
     */
    private async encrypt(
        data: Uint8Array,
        key: CryptoKey,
        iv: Uint8Array,
        settings: IEncryptionSettings
    ): Promise<ArrayBuffer> {
        // 定义加密参数
        const algorithm: AesGcmParams | AesCbcParams = settings.algorithm === 'aes-gcm'
            ? { name: 'AES-GCM', iv }
            : { name: 'AES-CBC', iv };
        
        // 加密数据
        return crypto.subtle.encrypt(
            algorithm,
            key,
            data
        );
    }
    
    /**
     * 解密数据
     * 
     * @param data 要解密的数据
     * @param key 密钥
     * @param iv 初始向量
     * @param settings 加密设置
     * @returns 解密后的数据
     */
    private async decrypt(
        data: ArrayBuffer,
        key: CryptoKey,
        iv: Uint8Array,
        settings: IEncryptionSettings
    ): Promise<Uint8Array> {
        // 定义解密参数
        const algorithm: AesGcmParams | AesCbcParams = settings.algorithm === 'aes-gcm'
            ? { name: 'AES-GCM', iv }
            : { name: 'AES-CBC', iv };
        
        // 解密数据
        const decrypted = await crypto.subtle.decrypt(
            algorithm,
            key,
            data
        );
        
        return new Uint8Array(decrypted);
    }
    
    /**
     * 签名数据
     * 
     * @param data 要签名的数据
     * @param key 密钥
     * @param settings 签名设置
     * @returns 签名字符串
     */
    private async signData(
        data: Uint8Array,
        key: CryptoKey,
        settings: ISignatureSettings
    ): Promise<string> {
        // 在实际应用中，应该使用专门的签名密钥而非加密密钥
        // 这里为了简化示例，使用相同的密钥
        
        // 计算HMAC
        const hmacParams = {
            name: 'HMAC',
            hash: settings.hashAlgorithm.toUpperCase()
        };
        
        // 导入HMAC密钥
        const hmacKey = await crypto.subtle.importKey(
            'raw',
            new Uint8Array(await crypto.subtle.exportKey('raw', key)),
            hmacParams,
            false,
            ['sign']
        );
        
        // 计算签名
        const signature = await crypto.subtle.sign(
            hmacParams,
            hmacKey,
            data
        );
        
        // 转换为Base64
        return this.arrayBufferToBase64(signature);
    }
    
    /**
     * 验证签名
     * 
     * @param data 原始数据
     * @param signature Base64编码的签名
     * @param key 密钥
     * @param settings 签名设置
     * @returns 是否有效
     */
    private async verifySignature(
        data: Uint8Array,
        signature: string,
        key: CryptoKey,
        settings: ISignatureSettings
    ): Promise<boolean> {
        // 在实际应用中，应该使用专门的签名密钥而非加密密钥
        // 这里为了简化示例，使用相同的密钥
        
        // 计算HMAC
        const hmacParams = {
            name: 'HMAC',
            hash: settings.hashAlgorithm.toUpperCase()
        };
        
        // 导入HMAC密钥
        const hmacKey = await crypto.subtle.importKey(
            'raw',
            new Uint8Array(await crypto.subtle.exportKey('raw', key)),
            hmacParams,
            false,
            ['verify']
        );
        
        // 解码签名
        const signatureBuffer = this.base64ToArrayBuffer(signature);
        
        // 验证签名
        return crypto.subtle.verify(
            hmacParams,
            hmacKey,
            signatureBuffer,
            data
        );
    }
    
    /**
     * 验证消息完整性
     * 
     * @param message 消息对象
     * @returns 是否有效
     */
    private validateMessageIntegrity(message: TMessage): boolean {
        // 检查必要字段
        if (!message.id || !message.type || !message.senderId || !message.senderRole) {
            return false;
        }
        
        // 检查时间戳
        if (!message.timestamp) {
            return false;
        }
        
        // 检查会话ID
        if (!message.sessionId) {
            return false;
        }
        
        return true;
    }
    
    /**
     * ArrayBuffer转Base64
     * 
     * @param buffer ArrayBuffer数据
     * @returns Base64字符串
     */
    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        
        return btoa(binary);
    }
    
    /**
     * Base64转ArrayBuffer
     * 
     * @param base64 Base64字符串
     * @returns ArrayBuffer数据
     */
    private base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        return bytes.buffer;
    }
}

/**
 * 消息安全服务实例
 */
export const messageSecurityService = MessageSecurityService.getInstance(); 