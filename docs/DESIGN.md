# DREAM.ONE 深度定制需求采集 - 设计文档

> 文档版本：v1.0 | 更新日期：2026-03-11

---

## 1. 项目概述

### 1.1 产品定位

**DREAM.ONE 深度定制需求采集** 是一套面向家装/室内设计场景的移动端问卷系统，用于收集客户的房屋装修需求、生活方式偏好及预算信息，并作为后续交付与沟通的工作台入口。

### 1.2 核心目标

- 收集客户基础信息、项目概况、预算范围
- 完成深度需求测评（生活方式、空间规划、功能偏好等）
- 支持意向金合同签署与支付
- 提供项目工作台，整合需求书、预算、订单、合同、设计反馈等功能

### 1.3 技术栈

| 类别 | 技术选型 |
|------|----------|
| 框架 | React 19 + Vite 6 |
| 语言 | TypeScript 5.8 |
| 样式 | Tailwind CSS 4 |
| 动画 | Motion (Framer Motion 继任者) |
| 图标 | Lucide React |
| 构建 | Vite |
| AI | @google/genai (Gemini API) |

---

## 2. 架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                          应用层 (App.tsx)                            │
│  模式切换: form | login | projects | workbench                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌─────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│  form 模式      │    │  login 模式         │    │  workbench 模式     │
│  多步骤问卷流程  │    │  LoginPage          │    │  WorkbenchPage      │
│  (steps)        │    │  验证码登录          │    │  项目工作台          │
└─────────────────┘    └─────────────────────┘    └─────────────────────┘
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        服务层 (services/)                            │
│  auth | projects | leads | designVoyage                             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    数据层 (FormData + localStorage)                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 目录结构

```
src/
├── App.tsx                    # 根应用，模式路由与步骤编排
├── main.tsx                   # 入口
├── index.css                  # 全局样式
├── types.ts                   # FormData 及 initialFormData
├── utils/
│   └── constants.ts           # 常量
├── pages/
│   ├── LoginPage.tsx          # 登录页
│   ├── ProjectPage.tsx        # 项目列表页
│   ├── WorkbenchPage.tsx      # 项目工作台（核心）
│   ├── DesignFeedbackApp.tsx  # 设计反馈应用
│   └── HomeStyleEval/         # 家居风格测评
│       ├── HomeStyleEval.tsx
│       ├── data/questions.ts
│       └── components/
│           ├── QuestionCard.tsx
│           ├── ProgressBar.tsx
│           ├── ResultPage.tsx
│           └── WelcomePage.tsx
├── components/
│   ├── steps.tsx              # 所有测评步骤组件
│   ├── ui.tsx                 # 通用 UI 组件
│   ├── BudgetSankey.tsx       # 预算桑基图
│   ├── DeepEvalForm.tsx       # 深度测评表单
│   ├── DeepEvalFormContext.tsx # 深度测评 Context
│   └── DeepEvalConstants.ts   # 深度测评常量
├── services/
│   ├── auth/                  # 认证
│   │   ├── index.ts
│   │   ├── registerApi.ts
│   │   └── loginApi.ts
│   ├── projects/              # 项目
│   │   ├── index.ts
│   │   └── projectsApi.ts
│   ├── leads/                 # 线索
│   │   ├── index.ts
│   │   └── leadsApi.ts
│   └── designVoyage/          # Design Voyage 相关
│       ├── LeadsService.ts
│       └── LeadsOptionsService.ts
└── assets/
    ├── contract-flow.png      # 合同流程图
    └── img/logo.png           # Logo
```

---

## 3. 核心功能模块

### 3.1 应用模式 (App.tsx)

| 模式 | 说明 |
|------|------|
| `form` | 主流程：欢迎页 → 注册 → 深度测评步骤 → 合同 → 支付 |
| `login` | 手机验证码登录 |
| `projects` | 我的项目列表，选择项目进入工作台 |
| `workbench` | 项目工作台，包含首页、需求书、预算、订单、合同、设计反馈 |

### 3.2 测评步骤流程 (steps.tsx)

步骤按 `StepConfig` 顺序编排，支持：

- **显隐控制**：`hiddenByDefault` + `stepVisibility` 可隐藏不需要的步骤
- **元数据覆盖**：`stepMetaOverrides` 支持编辑标题、编码（qId），持久化到 localStorage

**主要步骤：**

| 步骤 ID | 标题 | 说明 |
|---------|------|------|
| welcome | 欢迎 | 四个入口卡片：风格测评、注册、深度定制、我的首页 |
| home-style-eval | 家居风格测评 | 风格倾向与氛围偏好测评 |
| design-feedback | 项目设计反馈 | 设计稿反馈与批注 |
| register | 注册 | 手机号 + 验证码 |
| deep-eval-1/2 | 深度测评 | 项目概况、用户信息 |
| （Q2-2/Q2-3 已取消） | Q2-5 ~ Q2-21 等 | 房型/现状/预算改由 DeepEval；其余为成员、习惯等 |
| contract | 意向金合同 | 合同展示与签署 |
| payment | 支付账号 | 完成支付 |
| budget-confirm-preview | 预算确认页预览 | 预算可视化 |

### 3.3 项目工作台 (WorkbenchPage)

工作台作为项目交付与沟通的入口，包含以下导航模块：

| 模块 | 功能 |
|------|------|
| 项目首页 | 项目概览、快捷入口 |
| 项目需求书 | 汇总需求与填写内容 |
| 项目预算 | BudgetSankey 桑基图，收入/里程碑/订单可视化 |
| 项目订单 | 订单列表与状态 |
| 项目合同 | 合同与签署记录 |
| 项目设计反馈 | DesignFeedbackApp 嵌入 |

侧边栏支持：

- 可调节宽度 (220px ~ 360px)
- 折叠/展开
- 宽度与折叠状态持久化到 localStorage

### 3.4 家居风格测评 (HomeStyleEval)

独立问卷流程：

- 题目来自 `data/questions.ts`
- 支持单选、多选、数量型作答
- 进度条、前后导航、结果页
- 完成后可跳转深度测评或返回欢迎页

### 3.5 设计反馈 (DesignFeedbackApp)

设计稿版本与批注管理：

- **PageSnapshot**：页面快照（文本、图片、批注、评论）
- **OrderVersion**：订单版本（版本号、状态）
- 支持图片点位批注、文本描述批注
- 页面锁定、版本状态（draft/published/completed/archived）

### 3.6 预算桑基图 (BudgetSankey)

- 收入时间线、里程碑、订单三层数据
- 状态分组：意向期、订购期、交付期、验收期、维保期
- 支持传入 `BudgetSankeyData` 或使用内置 mock 数据

---

## 4. 数据模型

### 4.1 FormData（测评表单数据）

```typescript
interface FormData {
  // 用户信息 (Q2-0)
  userName, userTitle, userAgeRange, userHeight, userIndustry, userCity, userPhone
  // 项目概况 (Q2-1；Q2-2 已取消，类型/面积来自 DeepEval)
  projectLocation, projectName, projectType, projectArea, houseType, houseCondition
  // 预算 (Q2-3 已取消，来自 DeepEval)
  budgetStandard, budgetSubStandard
  // 房型 (Q2-4)
  floorPlanUploaded
  // 房屋现状 (Q2-5) ~ 其他需求 (Q2-21)
  lighting, ceilingHeight, ventilation, noise, role, favoriteSpace, ...
  // 合同
  contractAccepted?, contractSignatureData?, contractCustomText?
}
```

### 4.2 项目 (Project)

```typescript
interface Project {
  id: string
  name: string
  location?: string
  createdAt?: string
}
```

### 4.3 预算桑基图数据

```typescript
interface BudgetSankeyData {
  incomeEntries: IncomeEntry[]   // 收入时间线
  milestones: Milestone[]       // 里程碑
  orders: Order[]              // 订单
  totalBudget: number
}
```

### 4.4 设计反馈数据

```typescript
interface PageSnapshot {
  snapshotId, versionId, pageId, order, title, text, imageUrl
  annotations: Annotation[]
  comments: Comment[]
  lock: PageLock
}

interface OrderVersion {
  id, versionNumber, name, status: VersionStatus
  pages: PageSnapshot[]
  ...
}
```

---

## 5. 服务层设计

### 5.1 认证服务 (services/auth)

| API | 说明 |
|-----|------|
| `sendSmsCode(phone)` | 发送验证码 |
| `registerWithCode(phone, code)` | 验证码注册 |
| `loginWithCode(phone, code)` | 验证码登录 |

### 5.2 项目服务 (services/projects)

| API | 说明 |
|-----|------|
| `getProjects()` | 获取用户项目列表 |
| `addProject(project)` | 新增项目 |

当前为 mock 实现，使用 localStorage + 默认示例数据。

### 5.3 线索/Design Voyage 服务

- `LeadsService`、`LeadsOptionsService` 用于 Design Voyage 相关业务逻辑。

---

## 6. UI 与交互设计

### 6.1 设计规范

- **主色**：`#D84936`（强调、进度、当前步骤）
- **深色**：`#302E2B`（按钮、标题）
- **背景**：`#FDFCF8`（浅米色）
- **辅助**：`#F4F3F0`（输入框背景）

### 6.2 通用组件 (ui.tsx)

| 组件 | 说明 |
|------|------|
| StepWrapper | 步骤容器，支持 noCard |
| TextInput | 文本输入 |
| RadioCard | 单选卡片 |
| CheckboxCard | 多选卡片 |
| SegmentedRadio | 分段单选 |
| IconRadioCard | 带图标的单选卡片 |
| SquareRadioCard / SquareCheckboxCard | 方形单选/多选 |
| Counter | 数字增减 |
| SubQuestion | 子问题容器 |

### 6.3 动画

- 使用 `motion/react` 的 `AnimatePresence`、`motion.div` 实现步骤切换、弹窗过渡
- 目录模态框、编辑元数据模态框均有入场/出场动画

---

## 7. 状态与持久化

### 7.1 全局状态

- **data**：`FormData`，贯穿整个 form 流程
- **currentStepIndex**：当前步骤索引
- **mode**：应用模式
- **selectedProject**：当前选中项目
- **stepVisibility**：步骤显隐
- **stepMetaOverrides**：步骤标题/编码覆盖

### 7.2 localStorage 持久化

| Key | 用途 |
|-----|------|
| `ai-studio:stepMetaOverrides:v1` | 步骤元数据覆盖 |
| `ai-studio:user-projects:v1` | 用户项目列表 |
| `ai-studio:workbench:sidebarWidth:v1` | 工作台侧边栏宽度 |
| `ai-studio:workbench:sidebarCollapsed:v1` | 工作台侧边栏折叠状态 |

---

## 8. 配置与部署

### 8.1 环境变量

| 变量 | 说明 |
|------|------|
| `GEMINI_API_KEY` | Gemini AI API 密钥 |
| `APP_URL` | 应用部署 URL |

### 8.2 运行与构建

```bash
npm install
npm run dev      # 开发：http://localhost:3000
npm run build    # 生产构建
npm run preview  # 预览构建产物
npm run lint     # TypeScript 检查
```

### 8.3 AI Studio 集成

- 项目为 AI Studio 应用模板
- AI Studio 会自动注入 `GEMINI_API_KEY`、`APP_URL` 等
- 参考：https://ai.studio/apps/b3ae36b4-4e1e-4be9-957f-4caf962aa7fc

---

## 9. 扩展与演进建议

1. **后端接入**：将 projects、auth、leads 等 API 接真实后端，替换 localStorage mock
2. **路由**：引入 React Router，支持 URL 步骤跳转与分享
3. **状态管理**：若流程更复杂，可考虑 Zustand/Redux 等
4. **国际化**：如需多语言，可抽离文案到 i18n
5. **可访问性**：补充 ARIA 属性、键盘导航、焦点管理

---

## 10. 附录：关键文件索引

| 文件 | 职责 |
|------|------|
| `App.tsx` | 模式路由、步骤编排、目录与元数据编辑 |
| `types.ts` | FormData 定义 |
| `components/steps.tsx` | 所有 Step 组件 |
| `components/ui.tsx` | 表单 UI 组件 |
| `pages/WorkbenchPage.tsx` | 项目工作台 |
| `components/BudgetSankey.tsx` | 预算桑基图 |
| `pages/DesignFeedbackApp.tsx` | 设计反馈应用 |
| `services/auth/*` | 认证 API |
| `services/projects/*` | 项目 API |
