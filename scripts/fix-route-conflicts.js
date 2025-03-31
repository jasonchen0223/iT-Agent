/**
 * Next.js路由冲突检测与修复脚本
 * 
 * 此脚本用于检测和修复项目中的Next.js路由冲突
 * 特别是处理dashboard和(dashboard)之间的冲突问题
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const APP_DIR = path.join(__dirname, '../src/app');
const ROUTES_TO_CHECK = [
    'dashboard',
    '(dashboard)'
];

// 检查路由冲突
function checkRouteConflicts() {
    console.log('检查路由冲突...');
    
    const conflictPairs = [];
    const routeDirectories = {};
    
    // 获取所有路由文件夹
    const directories = fs.readdirSync(APP_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    // 检查是否有冲突的路由组
    for (const route of ROUTES_TO_CHECK) {
        const routeVariants = directories.filter(dir => 
            dir === route || 
            dir === `(${route})` || 
            dir.startsWith(`${route}/`) || 
            dir.startsWith(`(${route})/`)
        );
        
        if (routeVariants.length > 1) {
            routeDirectories[route] = routeVariants;
            
            // 检查冲突的路由对
            for (let i = 0; i < routeVariants.length; i++) {
                for (let j = i + 1; j < routeVariants.length; j++) {
                    // 如果两个路由可能冲突
                    const route1 = routeVariants[i];
                    const route2 = routeVariants[j];
                    
                    // 判断是否可能冲突
                    // 例如 dashboard 和 (dashboard) 会冲突
                    // 或者 dashboard/settings 和 (dashboard)/settings
                    if (
                        (route1 === route && route2 === `(${route})`) ||
                        (route1 === `(${route})` && route2 === route) ||
                        (route1.startsWith(`${route}/`) && route2.startsWith(`(${route})/`)) ||
                        (route1.startsWith(`(${route})/`) && route2.startsWith(`${route}/`))
                    ) {
                        conflictPairs.push({
                            route1: path.join(APP_DIR, route1),
                            route2: path.join(APP_DIR, route2)
                        });
                    }
                }
            }
        }
    }
    
    return { conflictPairs, routeDirectories };
}

// 移动内容以解决冲突
function resolveConflicts(conflictPairs) {
    if (conflictPairs.length === 0) {
        console.log('未检测到路由冲突!');
        return false;
    }
    
    console.log(`检测到 ${conflictPairs.length} 对路由冲突:`);
    
    for (const [index, conflict] of conflictPairs.entries()) {
        console.log(`\n冲突 ${index + 1}:`);
        console.log(`- ${path.relative(APP_DIR, conflict.route1)}`);
        console.log(`- ${path.relative(APP_DIR, conflict.route2)}`);
        
        // 优先保留带括号的分组路由，移动非分组路由的内容
        const groupRoute = conflict.route1.includes('(') ? conflict.route1 : conflict.route2;
        const plainRoute = conflict.route1.includes('(') ? conflict.route2 : conflict.route1;
        
        console.log(`\n解决策略: 将 ${path.relative(APP_DIR, plainRoute)} 的内容移动到 ${path.relative(APP_DIR, groupRoute)}`);
        
        // 创建备份目录
        const backupDir = path.join(__dirname, '../backup-routes', path.basename(plainRoute));
        if (!fs.existsSync(path.dirname(backupDir))) {
            fs.mkdirSync(path.dirname(backupDir), { recursive: true });
        }
        
        // 备份非分组路由
        try {
            execSync(`cp -r ${plainRoute} ${backupDir}`);
            console.log(`已备份 ${path.relative(APP_DIR, plainRoute)} 到 backup-routes/`);
        } catch (error) {
            console.error(`备份失败: ${error.message}`);
            continue;
        }
        
        // 检查并移动文件
        try {
            // 获取需要移动的文件
            const filesToMove = getAllFiles(plainRoute);
            
            for (const file of filesToMove) {
                const relativePath = path.relative(plainRoute, file);
                const targetPath = path.join(groupRoute, relativePath);
                
                // 确保目标目录存在
                const targetDir = path.dirname(targetPath);
                if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir, { recursive: true });
                }
                
                // 如果目标文件已存在，需要手动合并或选择
                if (fs.existsSync(targetPath)) {
                    console.log(`警告: 目标文件已存在: ${path.relative(APP_DIR, targetPath)}`);
                    console.log(`       请手动合并或选择保留哪个文件`);
                    
                    // 创建带.conflict后缀的副本
                    const conflictPath = `${targetPath}.conflict`;
                    fs.copyFileSync(file, conflictPath);
                    console.log(`       已创建冲突副本: ${path.relative(APP_DIR, conflictPath)}`);
                } else {
                    // 如果目标文件不存在，直接复制
                    fs.copyFileSync(file, targetPath);
                    console.log(`已移动: ${path.relative(APP_DIR, file)} -> ${path.relative(APP_DIR, targetPath)}`);
                }
            }
            
            // 添加删除提示
            console.log(`\n提示: 检查移动后的文件是否正确，然后可以手动删除 ${path.relative(APP_DIR, plainRoute)} 目录`);
            console.log(`      如需还原更改，可以从 backup-routes/ 恢复文件`);
        } catch (error) {
            console.error(`移动文件失败: ${error.message}`);
        }
    }
    
    return true;
}

// 递归获取目录下所有文件
function getAllFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat && stat.isDirectory()) {
            // 递归获取子目录的文件
            results = results.concat(getAllFiles(filePath));
        } else {
            results.push(filePath);
        }
    }
    
    return results;
}

// 创建全局错误处理组件
function createErrorComponents() {
    console.log('\n创建全局错误处理组件...');
    
    const errorBoundaryPath = path.join(APP_DIR, 'error.tsx');
    const notFoundPath = path.join(APP_DIR, 'not-found.tsx');
    const globalErrorPath = path.join(APP_DIR, 'global-error.tsx');
    
    // 创建error.tsx (如果不存在)
    if (!fs.existsSync(errorBoundaryPath)) {
        const errorContent = `'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';

/**
 * 错误边界组件
 * 
 * 当路由内发生错误时显示的UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到错误报告服务
    console.error('路由错误:', error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-rose-500">出现了一些问题</h2>
        <p className="text-gray-300">
          很抱歉，加载此页面时发生了错误。我们已记录此问题，并将尽快修复。
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            重试
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
`;
        fs.writeFileSync(errorBoundaryPath, errorContent);
        console.log('已创建: error.tsx');
    } else {
        console.log('已存在: error.tsx');
    }
    
    // 创建not-found.tsx (如果不存在)
    if (!fs.existsSync(notFoundPath)) {
        const notFoundContent = `import Link from 'next/link';
import { Button } from '@/components/ui';

/**
 * 全局404页面
 * 
 * 当访问不存在的路由时显示
 */
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-blue-500">404</h1>
        <h2 className="text-2xl font-semibold">页面未找到</h2>
        <p className="text-gray-300">
          您访问的页面不存在或已被移动到其他位置。
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
`;
        fs.writeFileSync(notFoundPath, notFoundContent);
        console.log('已创建: not-found.tsx');
    } else {
        console.log('已存在: not-found.tsx');
    }
    
    // 创建global-error.tsx (如果不存在)
    if (!fs.existsSync(globalErrorPath)) {
        const globalErrorContent = `'use client';
 
import { useEffect } from 'react';
import { Button } from '@/components/ui';
 
/**
 * 全局错误处理组件
 * 
 * 当根布局中出现错误时显示的UI
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录严重错误到错误报告服务
    console.error('全局错误:', error);
  }, [error]);
 
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-950 text-white">
          <div className="space-y-6 max-w-md mx-auto text-center">
            <h1 className="text-3xl font-bold text-rose-500">严重错误</h1>
            <p className="text-gray-300">
              应用程序遇到了严重问题。我们已记录此错误，并将尽快修复。
            </p>
            <p className="text-sm text-gray-400">
              错误代码：{error.digest}
            </p>
            <div className="pt-4">
              <Button 
                onClick={() => reset()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                重试
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
`;
        fs.writeFileSync(globalErrorPath, globalErrorContent);
        console.log('已创建: global-error.tsx');
    } else {
        console.log('已存在: global-error.tsx');
    }
}

// 优化加载状态展示
function createLoadingComponents() {
    console.log('\n创建加载状态组件...');
    
    const loadingPath = path.join(APP_DIR, 'loading.tsx');
    
    // 创建loading.tsx (如果不存在)
    if (!fs.existsSync(loadingPath)) {
        const loadingContent = `import { Starfield } from '@/components/ui/Starfield';

/**
 * 全局加载状态组件
 * 
 * 当页面加载时显示的UI
 */
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 z-0">
        <Starfield starsCount={300} speed={0.5} />
      </div>
      <div className="z-10 flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        <p className="text-xl font-semibold text-blue-400">加载中...</p>
      </div>
    </div>
  );
}
`;
        fs.writeFileSync(loadingPath, loadingContent);
        console.log('已创建: loading.tsx');
    } else {
        console.log('已存在: loading.tsx');
    }
    
    // 检查分组路由中是否需要创建loading组件
    const groupRoutes = fs.readdirSync(APP_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('('))
        .map(dirent => path.join(APP_DIR, dirent.name));
    
    for (const route of groupRoutes) {
        const routeLoadingPath = path.join(route, 'loading.tsx');
        
        if (!fs.existsSync(routeLoadingPath)) {
            fs.writeFileSync(routeLoadingPath, loadingContent);
            console.log(`已创建: ${path.relative(APP_DIR, routeLoadingPath)}`);
        }
    }
}

// 主函数
function main() {
    try {
        console.log('Next.js路由冲突检测与修复工具\n');
        
        // 检查路由冲突
        const { conflictPairs, routeDirectories } = checkRouteConflicts();
        
        // 解决冲突
        const hasConflicts = resolveConflicts(conflictPairs);
        
        // 创建错误处理组件
        createErrorComponents();
        
        // 创建加载组件
        createLoadingComponents();
        
        console.log('\n路由优化完成!');
        
        if (hasConflicts) {
            console.log('\n注意事项:');
            console.log('1. 请验证路由合并后的功能是否正常');
            console.log('2. 可能需要手动调整一些导入路径和组件引用');
            console.log('3. 备份文件位于 backup-routes/ 目录下');
        }
    } catch (error) {
        console.error('发生错误:', error);
        process.exit(1);
    }
}

// 执行脚本
main(); 