#!/usr/bin/env node

/**
 * 文档自动更新脚本
 * 
 * 该脚本用于在代码变更后自动更新项目文档，包括:
 * 1. 开发进度表更新
 * 2. 相关技术文档更新
 * 
 * 可以作为Git钩子使用，也可以手动运行
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const config = {
    // 开发进度表路径
    progressDocPath: path.join(__dirname, '../docs/1. 项目规划/development_progress.md'),
    // 文档目录
    docsDir: path.join(__dirname, '../docs'),
    // 代码目录
    codeDir: path.join(__dirname, '../src'),
    // 获取最近的Git提交信息的命令
    gitLogCommand: 'git log -1 --name-status --pretty=format:"%an|%ad|%s"',
    // 模块路径映射配置
    modulePathMapping: {
        'src/components': '前端开发',
        'src/pages': '前端开发',
        'src/app': '前端开发',
        'src/api': '后端开发',
        'src/lib/db': '数据和存储',
        'src/lib/agents': '代理引擎开发',
        'src/services': '后端开发',
        'prisma': '数据和存储',
        'scripts': '部署与开发运维',
        'config': '部署与开发运维'
    },
    // 对应于模块路径的文档路径映射
    docModuleMapping: {
        '前端开发': ['docs/2. 系统设计/ui-design.md', 'docs/3. 技术规范/frontend-guidelines.md'],
        '后端开发': ['docs/2. 系统设计/api-design.md', 'docs/3. 技术规范/backend-guidelines.md'],
        '代理引擎开发': ['docs/2. 系统设计/agent-architecture.md', 'docs/3. 技术规范/agent-guidelines.md'],
        '数据和存储': ['docs/2. 系统设计/data-model.md', 'docs/3. 技术规范/database-guidelines.md'],
        '部署与开发运维': ['docs/4. 开发指南/deployment_plan.md']
    }
};

/**
 * 获取最近的Git提交信息
 * @returns {Object} 提交信息对象，包含作者、日期、提交消息和变更文件
 */
function getLatestCommitInfo() {
    try {
        // 执行Git命令获取最新提交信息
        const gitLogOutput = execSync(config.gitLogCommand, { encoding: 'utf-8' });
        const [authorDateMsg, ...fileChanges] = gitLogOutput.split('\n');
        const [author, date, message] = authorDateMsg.split('|');

        // 解析变更的文件列表
        const changedFiles = fileChanges.map(line => {
            const [status, filePath] = line.trim().split(/\s+/);
            return { status, filePath };
        });

        return {
            author,
            date,
            message,
            changedFiles
        };
    } catch (error) {
        console.error('获取Git提交信息失败:', error.message);
        return null;
    }
}

/**
 * 确定变更文件所属的模块
 * @param {string} filePath 文件路径
 * @returns {string|null} 模块名称，如果没有匹配则返回null
 */
function determineModule(filePath) {
    if (!filePath) return null;
    
    for (const [pathPrefix, moduleName] of Object.entries(config.modulePathMapping)) {
        if (filePath.startsWith(pathPrefix)) {
            return moduleName;
        }
    }
    return null;
}

/**
 * 更新开发进度表
 * @param {Object} commitInfo 提交信息对象
 */
function updateProgressDoc(commitInfo) {
    if (!commitInfo || !fs.existsSync(config.progressDocPath)) {
        console.log('未找到开发进度表或无提交信息，跳过更新');
        return;
    }

    try {
        let progressContent = fs.readFileSync(config.progressDocPath, 'utf-8');
        
        // 识别每个变更文件所属的模块
        const affectedModules = new Set();
        commitInfo.changedFiles.forEach(file => {
            const module = determineModule(file.filePath);
            if (module) {
                affectedModules.add(module);
            }
        });

        if (affectedModules.size === 0) {
            console.log('没有找到受影响的模块，跳过更新开发进度表');
            return;
        }

        // 更新进度表中的进度记录部分
        const updateSection = `## 进度更新记录

| 日期 | 更新者 | 更新内容 | 影响模块 |
|------|-------|---------|---------|`;
        
        // 查找进度更新记录部分
        let newProgressContent;
        if (progressContent.includes(updateSection)) {
            // 已有更新记录，添加新记录
            const newUpdateEntry = `| ${new Date().toISOString().split('T')[0]} | ${commitInfo.author} | ${commitInfo.message} | ${Array.from(affectedModules).join(', ')} |`;
            newProgressContent = progressContent.replace(
                updateSection,
                `${updateSection}\n${newUpdateEntry}`
            );
        } else {
            // 没有更新记录部分，创建一个
            const newUpdateEntry = `| ${new Date().toISOString().split('T')[0]} | ${commitInfo.author} | ${commitInfo.message} | ${Array.from(affectedModules).join(', ')} |`;
            newProgressContent = `${progressContent}\n\n${updateSection}\n${newUpdateEntry}`;
        }

        // 更新各模块的进度
        for (const module of affectedModules) {
            // 使用正则表达式匹配模块在进度表中的行
            const moduleRegex = new RegExp(`\\|\\s*${module}\\s*\\|([^\\|]+)\\|([^\\|]+)\\|\\s*([0-9]+)%\\s*\\|`, 'g');
            const match = moduleRegex.exec(newProgressContent);
            
            if (match) {
                // 找到模块行，增加进度百分比（根据提交修改数量和重要性估算）
                const currentProgress = parseInt(match[3].trim(), 10);
                let newProgress = Math.min(currentProgress + 5, 100); // 默认增加5%，最大100%
                
                // 更新进度
                newProgressContent = newProgressContent.replace(
                    moduleRegex,
                    (line) => line.replace(`${currentProgress}%`, `${newProgress}%`)
                );
                
                console.log(`更新"${module}"模块进度：${currentProgress}% -> ${newProgress}%`);
            }
        }

        // 更新总体进度
        const overallProgressRegex = /当前完成度：\s*([0-9]+)%/;
        const overallMatch = overallProgressRegex.exec(newProgressContent);
        if (overallMatch) {
            const currentOverall = parseInt(overallMatch[1], 10);
            // 根据模块进度计算新的总体进度
            const moduleProgressRegex = /\|\s*.*\s*\|[^\|]+\|[^\|]+\|\s*([0-9]+)%\s*\|/g;
            let totalProgress = 0;
            let count = 0;
            let match;
            
            const progressContent = newProgressContent;
            while ((match = moduleProgressRegex.exec(progressContent)) !== null) {
                totalProgress += parseInt(match[1], 10);
                count++;
            }
            
            const newOverall = Math.round(totalProgress / (count || 1));
            newProgressContent = newProgressContent.replace(
                overallProgressRegex,
                `当前完成度：${newOverall}%`
            );
            
            console.log(`更新总体进度：${currentOverall}% -> ${newOverall}%`);
        }

        // 写入更新后的内容
        fs.writeFileSync(config.progressDocPath, newProgressContent, 'utf-8');
        console.log('开发进度表更新完成');
    } catch (error) {
        console.error('更新开发进度表失败:', error.message);
    }
}

/**
 * 更新相关技术文档
 * @param {Object} commitInfo 提交信息对象
 */
function updateTechDocs(commitInfo) {
    if (!commitInfo) {
        console.log('无提交信息，跳过技术文档更新');
        return;
    }

    // 识别每个变更文件所属的模块
    const affectedModules = new Set();
    commitInfo.changedFiles.forEach(file => {
        const module = determineModule(file.filePath);
        if (module) {
            affectedModules.add(module);
        }
    });

    if (affectedModules.size === 0) {
        console.log('没有找到受影响的模块，跳过更新技术文档');
        return;
    }

    // 查找并更新相关技术文档
    for (const module of affectedModules) {
        const relatedDocs = config.docModuleMapping[module] || [];
        
        for (const docPath of relatedDocs) {
            const fullPath = path.join(__dirname, '..', docPath);
            if (fs.existsSync(fullPath)) {
                try {
                    let docContent = fs.readFileSync(fullPath, 'utf-8');
                    
                    // 添加更新日志
                    const updateLog = `\n\n## 最近更新\n\n- ${new Date().toISOString().split('T')[0]} - ${commitInfo.author} - ${commitInfo.message}`;
                    
                    // 检查是否已有更新日志部分
                    if (docContent.includes('## 最近更新')) {
                        // 在现有更新日志部分添加新条目
                        docContent = docContent.replace(
                            /## 最近更新\n\n/,
                            `## 最近更新\n\n- ${new Date().toISOString().split('T')[0]} - ${commitInfo.author} - ${commitInfo.message}\n`
                        );
                    } else {
                        // 添加新的更新日志部分
                        docContent += updateLog;
                    }
                    
                    // 写入更新后的内容
                    fs.writeFileSync(fullPath, docContent, 'utf-8');
                    console.log(`已更新技术文档: ${docPath}`);
                } catch (error) {
                    console.error(`更新技术文档 ${docPath} 失败:`, error.message);
                }
            } else {
                console.log(`技术文档不存在，跳过更新: ${docPath}`);
            }
        }
    }
}

/**
 * 主函数
 */
function main() {
    console.log('开始文档自动更新...');
    
    // 获取最近的提交信息
    const commitInfo = getLatestCommitInfo();
    if (!commitInfo) {
        console.log('无法获取Git提交信息，中止文档更新');
        return;
    }
    
    // 更新开发进度表
    updateProgressDoc(commitInfo);
    
    // 更新相关技术文档
    updateTechDocs(commitInfo);
    
    console.log('文档自动更新完成');
}

// 执行主函数
main(); 