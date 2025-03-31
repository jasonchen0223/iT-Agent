// 定义导航链接
export type NavLink = {
  title: string;
  href: string;
  icon: LucideIcon;
  submenu?: NavLink[];
  requireAdmin?: boolean;
};

export const navLinks: NavLink[] = [
  {
    title: "仪表盘",
    href: "/dashboard",
    icon: HomeIcon
  },
  {
    title: "代理管理",
    href: "/dashboard/agents",
    icon: RobotIcon,
    submenu: [
      {
        title: "代理列表",
        href: "/dashboard/agents",
        icon: ListIcon
      },
      {
        title: "创建代理",
        href: "/dashboard/agents/create",
        icon: PlusCircleIcon
      },
      {
        title: "代理模板",
        href: "/dashboard/agents/templates",
        icon: CopyIcon
      }
    ]
  },
  {
    title: "会话",
    href: "/dashboard/sessions",
    icon: MessageSquareIcon
  },
  {
    title: "协作",
    href: "/dashboard/collaborations",
    icon: UsersIcon
  },
  {
    title: "任务管理",
    href: "/dashboard/tasks",
    icon: CheckSquareIcon
  },
  {
    title: "工具管理",
    href: "/dashboard/tools",
    icon: ToolIcon
  },
  {
    title: "知识库",
    href: "/dashboard/knowledge",
    icon: BookOpenIcon
  },
  {
    title: "系统设置",
    href: "/dashboard/settings",
    icon: SettingsIcon,
    requireAdmin: true
  }
]; 