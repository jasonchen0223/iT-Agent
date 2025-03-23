#!/usr/bin/env node

/**
 * Git钩子安装脚本
 * 
 * 该脚本用于安装Git钩子，使文档自动更新脚本在代码提交后自动运行
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 项目根目录
const rootDir = path.join(__dirname, '..');
// Git钩子目录
const hooksDir = path.join(rootDir, '.git', 'hooks');
// post-commit钩子文件路径
const postCommitHookPath = path.join(hooksDir, 'post-commit');

/**
 * 安装post-commit钩子
 */
function installPostCommitHook() {
    console.log('正在安装post-commit钩子...');

    // 确保.git/hooks目录存在
    if (!fs.existsSync(hooksDir)) {
        console.error('Git hooks目录不存在，请确保这是一个Git仓库');
        process.exit(1);
    }

    // 创建post-commit钩子文件内容
    const hookContent = `#!/bin/sh
# 自动文档更新钩子
# 在每次提交后运行文档更新脚本

# 获取项目根目录
ROOT_DIR=\$(git rev-parse --show-toplevel)

# 运行文档更新脚本
node \${ROOT_DIR}/scripts/update-docs.js

exit 0
`;

    // 写入钩子文件
    fs.writeFileSync(postCommitHookPath, hookContent);
    
    // 设置执行权限
    try {
        execSync(`chmod +x ${postCommitHookPath}`);
        console.log('成功设置钩子文件执行权限');
    } catch (error) {
        console.error('设置钩子文件执行权限失败:', error.message);
        console.log('请手动执行: chmod +x .git/hooks/post-commit');
    }

    console.log('post-commit钩子安装完成！');
    console.log('现在每次提交代码后，文档将会自动更新');
}

/**
 * 主函数
 */
function main() {
    console.log('开始安装Git钩子...');
    
    // 确保update-docs.js脚本存在
    const updateScriptPath = path.join(__dirname, 'update-docs.js');
    if (!fs.existsSync(updateScriptPath)) {
        console.error('更新文档脚本不存在，请先创建scripts/update-docs.js');
        process.exit(1);
    }
    
    // 设置update-docs.js脚本的执行权限
    try {
        execSync(`chmod +x ${updateScriptPath}`);
        console.log('成功设置文档更新脚本执行权限');
    } catch (error) {
        console.error('设置文档更新脚本执行权限失败:', error.message);
        console.log('请手动执行: chmod +x scripts/update-docs.js');
    }
    
    // 安装post-commit钩子
    installPostCommitHook();
    
    console.log('Git钩子安装完成！');
}

// 执行主函数
main(); 