#!/usr/bin/env node

/**
 * 组件文件名标准化脚本
 * 
 * 此脚本用于将组件文件名标准化为Shadcn UI命名约定
 * PascalCase格式的组件文件将被重命名为kebab-case格式
 * 并更新所有导入引用
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const UI_COMPONENTS_DIR = path.join(__dirname, '../src/components/ui');
const SRC_DIR = path.join(__dirname, '../src');

// 需要保留PascalCase的特殊组件（自定义星空主题组件）
const KEEP_PASCAL_CASE = [
    'Starfield',
    'SpaceTitle',
    'GlowCard',
    'StarBackground'
];

// 将PascalCase转换为kebab-case
function pascalToKebab(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}

// 将kebab-case转换为PascalCase
function kebabToPascal(str) {
    return str
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

// 获取所有组件文件
function getComponentFiles() {
    const files = fs.readdirSync(UI_COMPONENTS_DIR);
    return files.filter(file => {
        // 仅处理TSX和TS文件，排除index.ts和已标准化的文件
        const isValidExt = file.endsWith('.tsx') || file.endsWith('.ts'); 
        const isNotIndex = file !== 'index.ts';
        const isNotAlreadyKebab = !file.includes('-');
        return isValidExt && isNotIndex && isNotAlreadyKebab;
    });
}

// 检查文件是否需要重命名
function shouldRenameFile(filename) {
    // 从文件名中去除扩展名
    const baseName = path.basename(filename, path.extname(filename));
    
    // 检查是否在豁免列表中
    if (KEEP_PASCAL_CASE.includes(baseName)) {
        console.log(`保留文件名: ${filename} (特殊主题组件)`);
        return false;
    }
    
    // 检查是否已经是kebab-case
    if (baseName.includes('-') || baseName.toLowerCase() === baseName) {
        return false;
    }
    
    return true;
}

// 重命名文件并更新引用
function standardizeComponentNames() {
    const files = getComponentFiles();
    const renameMapping = {};
    
    // 第一步：创建重命名映射
    files.forEach(file => {
        if (shouldRenameFile(file)) {
            const oldName = path.basename(file, path.extname(file));
            const newName = pascalToKebab(oldName);
            const extension = path.extname(file);
            
            renameMapping[oldName] = {
                oldPath: path.join(UI_COMPONENTS_DIR, file),
                newPath: path.join(UI_COMPONENTS_DIR, `${newName}${extension}`),
                oldImport: `./${oldName}`,
                newImport: `./${newName}`,
                componentName: oldName
            };
        }
    });
    
    // 打印将要执行的更改
    console.log('将执行以下重命名操作:');
    Object.entries(renameMapping).forEach(([oldName, info]) => {
        console.log(`${path.basename(info.oldPath)} -> ${path.basename(info.newPath)}`);
    });
    
    // 第二步：更新index.ts中的引用
    const indexPath = path.join(UI_COMPONENTS_DIR, 'index.ts');
    if (fs.existsSync(indexPath)) {
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        
        Object.values(renameMapping).forEach(info => {
            const oldImportRegex = new RegExp(`from\\s+['"]${info.oldImport}['"]`, 'g');
            indexContent = indexContent.replace(oldImportRegex, `from '${info.newImport}'`);
        });
        
        fs.writeFileSync(indexPath, indexContent);
        console.log('已更新 index.ts 中的导入路径');
    }
    
    // 第三步：搜索并更新项目中所有文件的引用
    const updateImportsInProject = () => {
        const ignoreDirectories = ['node_modules', '.next', 'out', 'dist', '.git'];
        
        Object.values(renameMapping).forEach(info => {
            const oldFileName = path.basename(info.oldPath);
            const newFileName = path.basename(info.newPath);
            
            console.log(`\n更新对 ${oldFileName} 的引用...`);
            
            try {
                const grepCommand = `grep -r --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" "${info.componentName}" ${SRC_DIR} | grep -v "node_modules" | grep -v ".git"`;
                const grepResult = execSync(grepCommand, { encoding: 'utf8' });
                
                const affectedFiles = [...new Set(
                    grepResult.split('\n')
                        .filter(line => line.trim() !== '')
                        .map(line => line.split(':')[0])
                        .filter(file => {
                            // 排除我们正在重命名的文件和index.ts (已单独处理)
                            return file !== info.oldPath && !file.endsWith('index.ts');
                        })
                )];
                
                affectedFiles.forEach(file => {
                    let content = fs.readFileSync(file, 'utf8');
                    const oldImportRegex = new RegExp(`from\\s+['"](.*?\\/)${info.componentName}['"]`, 'g');
                    
                    content = content.replace(oldImportRegex, (match, p1) => {
                        return `from '${p1}${pascalToKebab(info.componentName)}'`;
                    });
                    
                    fs.writeFileSync(file, content);
                    console.log(`  已更新: ${file}`);
                });
            } catch (error) {
                if (!error.message.includes('No such file or directory')) {
                    console.error(`  更新引用时出错: ${error.message}`);
                } else {
                    console.log(`  没有找到对 ${info.componentName} 的引用`);
                }
            }
        });
    };
    
    updateImportsInProject();
    
    // 第四步：执行文件重命名
    Object.values(renameMapping).forEach(info => {
        try {
            fs.renameSync(info.oldPath, info.newPath);
            console.log(`已重命名: ${path.basename(info.oldPath)} -> ${path.basename(info.newPath)}`);
        } catch (error) {
            console.error(`重命名文件失败: ${error.message}`);
        }
    });
    
    console.log('\n组件标准化完成!');
}

// 执行脚本
standardizeComponentNames(); 