# UI组件使用指南

本文档介绍如何在项目中统一使用UI组件，遵循Shadcn UI的最佳实践。

## 导入方式

### 推荐导入方式

我们推荐使用统一的导入方式，从一个位置导入所有UI组件：

```tsx
import { Button, Card, useToast } from '@/components/ui';
```

这种方式有以下优点：
- 简化导入语句，减少代码行数
- 统一管理组件依赖
- 便于组件更新和维护
- 与Shadcn UI的最佳实践保持一致

### 兼容性导入方式

为了保持与已有代码的兼容性，仍然支持直接从组件文件导入：

```tsx
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/toast-unified';
```

但我们建议在新代码中逐步迁移到统一导入方式。

## 组件分类

我们的UI组件按照功能分为以下几类：

### 布局组件

用于页面和内容的布局：

```tsx
import { Card } from '@/components/ui';
```

### 表单组件

用于用户输入和表单交互：

```tsx
import { Button, Input, Select, Label } from '@/components/ui';
```

### 反馈组件

用于提供用户反馈：

```tsx
import { useToast, Toaster } from '@/components/ui';
```

### 导航组件

用于页面导航：

```tsx
import { Tabs } from '@/components/ui';
```

### 对话组件

用于模态对话框和弹出窗口：

```tsx
import { Dialog, Modal } from '@/components/ui';
```

## Toast组件

Toast组件有专门的使用指南，详见 [Toast使用指南](./toast-usage-guide.md)。

## 样式定制

所有组件都已经适配了项目的宇宙星空主题，默认使用暗色模式。如需定制样式，可以通过以下方式：

1. 使用`className`属性添加Tailwind类：

```tsx
<Button className="bg-purple-800 hover:bg-purple-700">
  自定义按钮
</Button>
```

2. 对于更复杂的定制，可以在`tailwind.config.js`中添加自定义主题配置

## 响应式设计

所有组件都支持响应式设计，默认遵循移动优先原则。可以使用Tailwind的响应式前缀：

```tsx
<Card className="p-4 md:p-6 lg:p-8">
  响应式卡片
</Card>
```

## 最佳实践

1. 优先使用统一导入方式
2. 保持组件使用的一致性
3. 不要在多个位置重复定义相同功能的组件
4. 为组件添加适当的中文注释，说明其用途
5. 遵循项目的错误处理模式
6. 对于表单验证，使用表单级别的错误提示，而非Toast 