# Toast通知组件使用指南

本文档介绍如何在项目中使用统一的Toast通知组件。

## 引入方式

```tsx
// 推荐引入方式
import { useToast } from '@/components/ui/toast-unified';

// 兼容引入方式 (功能完全相同)
import { useToast } from '@/components/ui/use-toast';
```

## 基本用法

```tsx
const { toast } = useToast();

// 显示一个普通的通知
toast({
  title: "操作成功",
  description: "你的设置已保存",
  duration: 5000, // 可选，默认为5000毫秒
});

// 显示成功通知
toast.success({
  title: "保存成功",
  description: "你的配置已成功保存",
});

// 显示错误通知
toast.error({
  title: "操作失败",
  description: "发生了一个错误，请重试",
});

// 显示警告通知
toast.warning({
  title: "注意",
  description: "这个操作可能需要较长时间",
});

// 显示信息通知
toast.info({
  title: "提示",
  description: "你可以通过拖拽来调整位置",
});
```

## 高级用法

### 自定义操作按钮

```tsx
toast({
  title: "确认操作",
  description: "你确定要删除这个项目吗？",
  action: (
    <button 
      onClick={() => handleConfirmDelete()} 
      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
    >
      确认
    </button>
  ),
  duration: 0, // 设置为0或Infinity表示不会自动关闭
});
```

### Toast管理

```tsx
const { toast, dismiss, dismissAll } = useToast();

// 显示toast并获取其ID
const id = toast({
  title: "操作进行中...",
  description: "正在处理你的请求",
});

// 稍后关闭特定toast
dismiss(id);

// 关闭所有toast
dismissAll();

// 更新已有toast
const id = toast({
  title: "上传中...",
  description: "0%",
});

// 稍后更新这个toast
setTimeout(() => {
  toast.update(id, {
    description: "50%",
  });
}, 1000);

// 再次更新并改变类型
setTimeout(() => {
  toast.update(id, {
    title: "上传完成",
    description: "100%",
    type: "success",
  });
}, 2000);
```

## 在布局中安装Toast

Toast通知组件已在根布局中安装，无需在其他组件中再次添加。

如果你需要在非默认布局中使用，确保添加`ToastProvider`和`Toaster`组件：

```tsx
import { ToastProvider } from '@/components/ui/toast-unified';
import { Toaster } from '@/components/ui/toaster';

export default function CustomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
    </div>
  );
}
```

## 注意事项

1. 确保使用 `Toaster` 组件来显示通知，它应该在 `ToastProvider` 内部。

2. 对于错误处理相关的通知，可以使用 `useErrorHandler` 钩子和 `errorToToast` 函数。

3. Toast组件的样式已经适配了项目的宇宙星空主题，无需额外样式调整。

4. 输入框验证错误推荐使用表单内的错误提示，而不是Toast通知。

5. 成功/失败的用户操作结果应通过Toast通知用户，持续时间建议为3-5秒。 