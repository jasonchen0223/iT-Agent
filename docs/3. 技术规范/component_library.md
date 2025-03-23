# 智能代理协作系统组件库规范

*基于AutoGen的多智能代理协作系统UI组件库设计规范*

## 1. 组件库概述

本文档详细描述智能代理协作系统的UI组件库，为单人开发者提供标准化的界面构建块，确保系统视觉和交互的一致性。组件遵循宇宙主题设计语言，在保持模块化的同时支持系统的扩展性。

### 1.1 设计原则

- **一致性**: 组件在视觉和行为上保持统一
- **可重用性**: 组件设计支持多场景应用
- **响应性**: 适应不同设备和屏幕尺寸
- **可访问性**: 符合WCAG 2.1 AA标准
- **性能优化**: 轻量高效，减少加载时间

### 1.2 技术栈选择

组件库基于以下技术栈实现：

- **框架**: React 18+
- **样式方案**: CSS-in-JS (styled-components)
- **状态管理**: React Context + Hooks
- **动画**: Framer Motion
- **图标**: 自定义SVG + Phosphor Icons
- **组件文档**: Storybook

## 2. 基础组件

### 2.1 按钮组件

```tsx
// 基本用法
<Button variant="primary" size="medium" onClick={handleClick}>
  创建项目
</Button>
```

#### 变体

| 变体名称 | 使用场景 | 视觉特性 |
|---------|---------|---------|
| primary | 主要操作 | 星空蓝渐变背景，白色文字 |
| secondary | 次要操作 | 半透明背景，边框发光 |
| ghost | 低强调操作 | 无背景，悬停时微光 |
| danger | 危险操作 | 红色渐变背景 |
| success | 确认/完成 | 绿色渐变背景 |

#### 尺寸

- `small`: 紧凑型界面，辅助按钮
- `medium`: 默认尺寸，适合大多数场景
- `large`: 强调性操作，引导流程

#### 状态

- 默认态
- 悬停态：亮度提升10%，微光扩散
- 激活态：亮度降低5%，轻微缩小
- 禁用态：降低不透明度至40%

#### 图标按钮

```tsx
<IconButton 
  icon={<PlanetIcon />} 
  variant="primary" 
  aria-label="查看代理详情"
/>
```

### 2.2 输入组件

#### 文本输入

```tsx
<Input
  label="项目名称"
  placeholder="输入项目名称"
  value={value}
  onChange={handleChange}
  helperText="使用简洁且描述性的名称"
  error={error}
/>
```

#### 特性

- 自动焦点光效
- 字符计数与限制
- 验证状态视觉反馈
- 可选前缀/后缀图标
- 内置清除按钮

#### 多行文本

```tsx
<TextArea
  label="项目描述"
  placeholder="描述你的项目需求..."
  rows={4}
  maxLength={500}
  showCount
  value={value}
  onChange={handleChange}
/>
```

#### 搜索输入

```tsx
<SearchInput
  placeholder="搜索知识库..."
  onSearch={handleSearch}
  loading={isSearching}
  suggestions={recentSearches}
/>
```

### 2.3 选择组件

#### 下拉选择

```tsx
<Select
  label="选择代理类型"
  options={agentOptions}
  value={selectedValue}
  onChange={handleChange}
  placeholder="选择一个代理类型"
/>
```

#### 复选框

```tsx
<Checkbox
  checked={isChecked}
  onChange={handleChange}
  label="启用自动保存"
/>
```

#### 单选按钮

```tsx
<RadioGroup
  name="viewMode"
  value={selectedValue}
  onChange={handleChange}
  options={[
    { value: 'simple', label: '简洁视图' },
    { value: 'detailed', label: '详细视图' },
    { value: 'technical', label: '技术视图' },
  ]}
/>
```

#### 开关

```tsx
<Switch
  checked={isEnabled}
  onChange={handleChange}
  label="实时更新"
/>
```

### 2.4 数据展示组件

#### 卡片

```tsx
<Card
  title="产品经理代理"
  icon={<ManagerIcon />}
  footer={<Button>配置</Button>}
>
  <p>负责需求分析和规划的代理</p>
</Card>
```

#### 标签

```tsx
<Tag color="blue" icon={<CodeIcon />}>
  开发中
</Tag>
```

#### 徽章

```tsx
<Badge count={5} dot={false} overflowCount={99}>
  <NotificationIcon />
</Badge>
```

#### 提示工具

```tsx
<Tooltip content="显示详细信息" placement="top">
  <InfoIcon />
</Tooltip>
```

#### 列表

```tsx
<List
  data={items}
  renderItem={(item) => (
    <ListItem
      key={item.id}
      title={item.name}
      description={item.description}
      avatar={item.avatar}
      actions={[
        <Button key="view">查看</Button>,
        <Button key="edit">编辑</Button>
      ]}
    />
  )}
/>
```

## 3. 复合组件

### 3.1 导航组件

#### 顶部导航栏

```tsx
<NavBar
  logo={<Logo />}
  primaryMenu={navItems}
  actions={[
    <SearchButton key="search" />,
    <NotificationsButton key="notifications" />,
    <UserMenu key="user" user={currentUser} />
  ]}
/>
```

#### 侧边导航

```tsx
<Sidebar
  items={sidebarItems}
  collapsed={isSidebarCollapsed}
  onCollapse={toggleSidebar}
  footer={<VersionInfo />}
/>
```

#### 标签页

```tsx
<Tabs
  activeKey={activeTab}
  onChange={handleTabChange}
  items={[
    { key: 'overview', label: '概览', children: <OverviewPanel /> },
    { key: 'details', label: '详情', children: <DetailsPanel /> },
    { key: 'history', label: '历史', children: <HistoryPanel /> },
  ]}
/>
```

#### 面包屑

```tsx
<Breadcrumb>
  <BreadcrumbItem href="/projects">项目</BreadcrumbItem>
  <BreadcrumbItem href="/projects/123">Web应用开发</BreadcrumbItem>
  <BreadcrumbItem>协作会话</BreadcrumbItem>
</Breadcrumb>
```

### 3.2 反馈组件

#### 对话框

```tsx
<Dialog
  title="确认删除"
  open={isOpen}
  onClose={handleClose}
  actions={[
    <Button key="cancel" variant="ghost" onClick={handleClose}>取消</Button>,
    <Button key="confirm" variant="danger" onClick={handleConfirm}>删除</Button>
  ]}
>
  <p>确定要删除这个项目吗？此操作无法撤销。</p>
</Dialog>
```

#### 抽屉

```tsx
<Drawer
  title="代理设置"
  placement="right"
  width={400}
  open={isOpen}
  onClose={handleClose}
>
  <AgentSettingsForm agent={selectedAgent} onSave={handleSave} />
</Drawer>
```

#### 通知提示

```tsx
// 程序调用
showNotification({
  type: 'success',
  message: '项目创建成功',
  description: '你可以开始添加代理了',
  duration: 5000,
});
```

#### 加载指示器

```tsx
<Spinner size="medium" />

// 或包装内容
<LoadingWrapper loading={isLoading} spinnerSize="large">
  <Content />
</LoadingWrapper>
```

#### 进度指示器

```tsx
<Progress 
  percent={75} 
  status="active" 
  type="line" 
  showInfo
/>

// 或步骤指示器
<Steps current={1}>
  <Step title="需求分析" description="收集和分析需求" />
  <Step title="设计方案" description="制定实现方案" />
  <Step title="开发实现" description="代码实现功能" />
</Steps>
```

### 3.3 协作专用组件

#### 代理卡片

```tsx
<AgentCard
  name="开发者代理"
  role="前端开发"
  avatar="/images/developer-agent.svg"
  status="active"
  metrics={[
    { label: "消息数", value: 28 },
    { label: "贡献度", value: "32%" }
  ]}
  onConfig={handleConfig}
/>
```

#### 消息气泡

```tsx
<MessageBubble
  sender="产品经理代理"
  content="我们应该先确定用户需求优先级"
  timestamp="10:24 AM"
  type="text"
  importance="high"
/>

// 代码类型消息
<MessageBubble
  sender="开发者代理"
  type="code"
  language="javascript"
  content={codeString}
  actions={[
    { label: "复制", onClick: handleCopy },
    { label: "应用", onClick: handleApply }
  ]}
/>
```

#### 时间线

```tsx
<Timeline>
  <TimelineItem 
    title="项目创建" 
    time="09:15 AM" 
    icon={<StarIcon />}
  >
    项目初始化完成
  </TimelineItem>
  <TimelineItem 
    title="需求分析" 
    time="09:45 AM" 
    icon={<DocumentIcon />}
    current
  >
    代理团队正在分析需求
  </TimelineItem>
  {/* 更多时间线项 */}
</Timeline>
```

#### 会话控制栏

```tsx
<SessionControls
  status="active"
  onPause={handlePause}
  onResume={handleResume}
  onStop={handleStop}
  speed={playbackSpeed}
  onSpeedChange={handleSpeedChange}
/>
```

## 4. 特效组件

### 4.1 宇宙效果

#### 粒子流

```tsx
<ParticleStream
  density={40}
  speed={1.5}
  color="blue"
  direction="horizontal"
  interactive
/>
```

#### 星球代理

```tsx
<AgentPlanet
  type="developer"
  size="medium"
  active={isActive}
  pulse={isPulsing}
  onClick={handleClick}
/>
```

#### 星系视图

```tsx
<GalaxyView
  agents={teamAgents}
  connections={agentConnections}
  focusedAgent={selectedAgent}
  onAgentClick={handleAgentSelect}
/>
```

### 4.2 微交互动效

#### 状态转换

```tsx
<StatusTransition
  from="planning"
  to="in_progress"
  duration={1200}
/>
```

#### 高亮提示

```tsx
<Highlight
  target={targetRef}
  active={isHighlightActive}
  message="点击这里添加代理"
  placement="bottom"
/>
```

#### 成就动画

```tsx
<Achievement
  title="首个项目完成"
  icon={<TrophyIcon />}
  confetti
  onComplete={handleAchievementShown}
/>
```

## 5. 页面模板

### 5.1 仪表板模板

```tsx
<DashboardTemplate
  header={<DashboardHeader title="我的项目" actions={headerActions} />}
  sidebar={<Sidebar items={sidebarItems} />}
  content={<ProjectGrid projects={userProjects} />}
  footer={<SystemStatus />}
/>
```

### 5.2 项目工作区模板

```tsx
<WorkspaceTemplate
  header={<WorkspaceHeader project={currentProject} />}
  primaryContent={<CollaborationSession session={activeSession} />}
  secondaryContent={<ContextPanel context={sessionContext} />}
  footer={<ControlPanel controls={sessionControls} />}
/>
```

### 5.3 结果展示模板

```tsx
<ResultTemplate
  header={<ResultHeader title={resultTitle} />}
  summary={<ResultSummary highlights={resultHighlights} />}
  content={<ResultTabs tabs={resultTabs} />}
  actions={<ResultActions actions={availableActions} />}
/>
```

## 6. 主题与样式系统

### 6.1 主题配置

```tsx
// 主题提供者包装应用
<ThemeProvider theme={cosmicTheme}>
  <App />
</ThemeProvider>

// 主题定义
const cosmicTheme = {
  colors: {
    primary: {
      main: '#3e68ff',
      light: '#5c7fff',
      dark: '#2a4bdb',
    },
    // 其他颜色定义...
  },
  space: [0, 4, 8, 16, 24, 32, 64],
  // 其他主题属性...
}
```

### 6.2 全局样式

```tsx
const GlobalStyles = createGlobalStyle`
  body {
    font-family: 'Inter', sans-serif;
    background: ${props => props.theme.colors.background.main};
    color: ${props => props.theme.colors.text.primary};
    margin: 0;
    padding: 0;
  }
  // 其他全局样式...
`;
```

### 6.3 响应式断点

```tsx
// 使用示例
const ResponsiveComponent = styled.div`
  padding: ${props => props.theme.space[3]}px;
  
  ${props => props.theme.breakpoints.down('sm')} {
    padding: ${props => props.theme.space[2]}px;
  }
`;
```

## 7. 实施指南

### 7.1 组件优先级

1. **核心组件** (P0)：按钮、输入框、卡片、对话框、加载指示器、基础布局
2. **重要组件** (P1)：导航组件、消息气泡、标签页、进度指示器、代理卡片
3. **增强组件** (P2)：宇宙特效、微交互、高级页面模板

### 7.2 组件实现路径

1. **基础阶段**：
   - 实现所有P0组件
   - 建立基础主题系统
   - 设置Storybook文档

2. **扩展阶段**：
   - 实现P1组件
   - 完善响应式设计
   - 添加基础动效

3. **优化阶段**：
   - 实现选定P2组件
   - 优化性能和可访问性
   - 完善文档和使用示例

### 7.3 复用策略

- 优先使用现有开源组件库基础组件（如Material UI或Chakra UI）
- 应用自定义样式实现宇宙主题
- 只为特殊需求开发完全自定义组件

## 8. 组件扩展规范

### 8.1 新增组件规则

1. 检查是否可通过组合现有组件实现
2. 遵循统一的文件和命名约定
3. 实现响应式和可访问性支持
4. 提供完整的Props文档和使用示例
5. 添加到Storybook并包含测试

### 8.2 组件版本管理

- 语义化版本控制 (SemVer)
- 向后兼容性保证
- 废弃策略和迁移路径

## 9. 组件库使用示例

### 9.1 协作会话界面示例

```tsx
function CollaborationSession({ sessionId }) {
  // 组件实现...
  
  return (
    <WorkspaceTemplate
      header={
        <SessionHeader 
          title="Web应用开发计划" 
          status={sessionStatus} 
        />
      }
      primaryContent={
        <MessageList messages={sessionMessages}>
          {messages.map(message => (
            <MessageBubble
              key={message.id}
              sender={message.agent}
              content={message.content}
              timestamp={message.time}
              type={message.type}
            />
          ))}
        </MessageList>
      }
      secondaryContent={
        <ContextPanel>
          <AgentList agents={sessionAgents} />
          <Timeline events={sessionEvents} />
          <KnowledgeResources resources={relevantResources} />
        </ContextPanel>
      }
      footer={
        <ControlPanel>
          <SessionControls
            status={sessionStatus}
            onPause={handlePause}
            onResume={handleResume}
          />
          <InterventionForm
            onSubmit={handleIntervention}
            targetAgent={selectedAgent}
          />
        </ControlPanel>
      }
    />
  );
}
```

## 10. 总结

本组件库规范为智能代理协作系统提供了一套完整的UI构建块，遵循宇宙主题设计语言，同时保持模块化和可扩展性。作为单人开发项目，组件库特别注重实现优先级和复用策略，确保能够高效地构建一致且用户友好的界面。

组件的设计充分考虑了系统的特殊需求，如代理协作可视化、会话控制和知识展示等，同时也包含了通用UI元素以支持完整的应用功能。通过这套组件库，可以构建出既美观又高效的智能代理协作平台。 