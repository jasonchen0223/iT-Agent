/**
 * Python桥接模块
 * 
 * 提供与Python代码的交互能力
 */
import { spawn, SpawnOptions } from 'child_process';
import path from 'path';
import fs from 'fs';

/**
 * Python执行结果接口
 */
export interface IPythonResult {
    /**
     * 是否成功
     */
    success: boolean;
    /**
     * 执行结果
     */
    result?: any;
    /**
     * 错误信息
     */
    error?: string;
    /**
     * 标准输出
     */
    stdout?: string;
    /**
     * 标准错误
     */
    stderr?: string;
}

/**
 * 执行Python脚本
 * 
 * @param {string} scriptPath - 脚本路径
 * @param {string[]} args - 命令行参数
 * @returns {Promise<IPythonResult>} 执行结果
 */
export async function executePythonScript(
    scriptPath: string, 
    args: string[] = []
): Promise<IPythonResult> {
    return new Promise((resolve) => {
        const options: SpawnOptions = {
            cwd: process.cwd(),
            env: process.env,
            stdio: 'pipe',
        };

        // 检查文件是否存在
        const fullPath = path.resolve(process.cwd(), scriptPath);
        if (!fs.existsSync(fullPath)) {
            return resolve({
                success: false,
                error: `脚本文件不存在: ${fullPath}`,
            });
        }

        // 执行Python脚本
        const process = spawn('python', [fullPath, ...args], options);
        
        let stdout = '';
        let stderr = '';
        
        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        process.on('close', (code) => {
            if (code === 0) {
                // 尝试解析JSON输出
                try {
                    const result = JSON.parse(stdout);
                    resolve({
                        success: true,
                        result,
                        stdout,
                        stderr,
                    });
                } catch (e) {
                    // 如果不是JSON格式，返回原始输出
                    resolve({
                        success: true,
                        result: stdout,
                        stdout,
                        stderr,
                    });
                }
            } else {
                resolve({
                    success: false,
                    error: `执行失败，退出码: ${code}`,
                    stdout,
                    stderr,
                });
            }
        });
        
        process.on('error', (err) => {
            resolve({
                success: false,
                error: `执行异常: ${err.message}`,
                stderr: err.toString(),
            });
        });
    });
}

/**
 * 检查AutoGen安装状态
 * 
 * @returns {Promise<IPythonResult>} 安装状态信息
 */
export async function checkAutoGenInstallation(): Promise<IPythonResult> {
    // 创建一个临时Python脚本来检查AutoGen
    const tempScript = `
import json
try:
    import autogen
    print(json.dumps({
        "installed": True,
        "version": autogen.__version__,
        "status": "正常"
    }))
except Exception as e:
    print(json.dumps({
        "installed": False,
        "error": str(e),
        "status": "错误"
    }))
    `;
    
    const tempFilePath = path.join(process.cwd(), 'temp_check_autogen.py');
    
    try {
        // 写入临时文件
        fs.writeFileSync(tempFilePath, tempScript);
        
        // 执行检查
        const result = await executePythonScript(tempFilePath);
        
        // 删除临时文件
        fs.unlinkSync(tempFilePath);
        
        return result;
    } catch (error) {
        // 确保临时文件被删除
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        
        return {
            success: false,
            error: `检查失败: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
} 