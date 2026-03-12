# ai-studio-xmxq 项目技术文档（含小白说明）

> 文档版本：v1.0  
> 最近更新：2026-03-11  
> 适用仓库：`ai-studio-xmxq`（当前这个前端项目）

---

## 阅读指南（建议先看这里）

- **这份文档写给谁看？**  
  写给你：可能是产品、设计、或刚接触这个项目的开发。不一定懂技术术语，所以文档里会穿插 **「小白说明」**，用大白话再讲一遍。

- **建议怎么读？**  
  - 第一次读：按顺序从第 1 章看到第 2 章，知道「项目是干什么的」和「用户怎么用」；  
  - 然后看 **「名词解释」** 一节，把常出现的词（FormData、Lead、接口、Mock 等）扫一眼；  
  - 再按兴趣跳着看：想改页面看第 4 章，想搞懂数据看第 5 章，想对接后端看第 11、12 章。  
  - 遇到 **小白说明** 就停下来读一句，能帮助理解上面那段技术描述在「人话」里是什么意思。

- **如果你发现写错或看不懂的地方**  
  可以在文档里直接标出来（例如在对应段落旁注明「这里看不懂」或「这里和实际不符」），方便后续一起修正。文档会持续根据反馈补充解释。

---

## 名词解释（常出现的词）

读正文时如果碰到不认识的词，可以先回这里查。按「人话」解释，不追求严谨定义。

| 词 | 通俗解释 |
|----|----------|
| **FormData** | 本项目中指「整份深度问卷」在代码里的那一大包数据。不是浏览器的 FormData，而是我们在 `src/types.ts` 里自己定义的一个「问卷总表」：里面有很多字段，比如姓名、项目名、预算、生活习惯等，每个字段对应问卷里的一道题或一个选项。所有步骤一起往这一张表里填。 |
| **CollectLeadData** | 提交到后端「线索/问卷」接口时用的数据格式。字段名是后端约定的（如 `user_name`、`project_area`），和前端的 FormData 字段名不完全一样，所以需要有一层「映射」把前端数据转成这种格式。 |
| **Lead（线索）** | 用户填的问卷/需求在业务上叫「线索」：还没正式成单，但已经有一条记录，方便后续跟进。后端可能会把一条 lead 存进数据库，将来再转化成「项目」。 |
| **Project（项目）** | 用户「我的项目」列表里的一条：一个具体的装修项目，有名字、地点等。目前前端的项目列表是假数据；将来会从后端按「当前登录用户」拉取。 |
| **Mock（假数据）** | 为了先把页面和流程跑通，不用等后端，在代码里写死或从本地存储读的数据。看起来像真的，但不是从服务器来的。 |
| **接口 / API** | 前端向服务器「要数据」或「提交数据」的入口地址和规矩。比如「发验证码」就是一个接口：前端往某个网址发手机号，后端去发短信。 |
| **token（令牌）** | 登录成功后后端发的一串字符，相当于「通行证」。之后前端每次请求都带上它，后端就知道是哪个用户。文档里说的「鉴权」多半就是检查你有没有带有效的 token。 |
| **前端** | 用户能在浏览器里看到、能点的部分：页面、表单、按钮、请求接口的代码等。本仓库目前只有前端。 |
| **后端** | 在服务器上跑的程序：管用户账号、存数据、发短信、算预算等。本仓库还没实现，文档第 11、12 章是「将来后端大概长什么样」的设计。 |
| **localStorage** | 浏览器自带的一块本地存储。关掉页面再打开，数据还在（除非用户清掉）。当前项目列表就存在这里，所以是「假持久化」，换设备就没了。 |

---

## 1. 项目背景与目标

### 1.1 项目背景

本项目用于c端用户接入产品的数字化流程，核心场景包括：

- 用户在**无需登录**的情况下完成 **家居风格测评**，并直接拿到测评结果（可保存/下载报告）；
- 用户在**登录/注册之后**完成 **深度需求测评（DeepEval）**，形成可落库的线索/需求数据；
- 用户通过 **手机验证码登录**，进入「我的项目」；
- 用户在 **项目工作台** 中查看与项目相关的需求、预算、合同、设计反馈等信息。

目前仓库内 **只包含前端代码**（React + Vite），并未在此仓库内实现真实后端服务和数据库。部分前端服务模块已经按照未来的后端接口设计好了调用方式，实际运行中多依赖 Mock 数据或浏览器本地存储。

### 1.2 项目目标

- 从产品视角：
  - 打通一条从 **需求采集 → 登录 → 选项目 → 项目工作台 → 设计反馈与预算展示** 的完整用户路径（即便部分数据是示意/Mock）。
- 从技术视角：
  - 搭建一套 **可扩展的前端架构**，方便日后接入真实后端；
  - 通过类型定义（TypeScript）与服务模块（services），提前约定好数据结构与接口形态；
  - 输出一份完整的 **项目级技术文档**，方便未来任何人接手。

### 1.3 小白说明

你可以把它想象成：

- 我们在做一个「装修公司给客户用的网页小程序」；
- 现在这个版本主要是「前端样机」：界面和交互都比较完整，但后台的真实数据暂时还没完全接上；
- 这份技术文档的目的，是：**把整个项目的想法和技术决策都记录下来**，方便你以后看得懂、改得动，而不只是给后端同学对接接口用。

---

## 2. 产品功能与用户路径

### 2.1 核心功能列表

1. **家居风格测评（无需登录） + 深度需求测评（登录后）**
   - 采集用户基础信息：姓名、称呼、年龄段、职业、所在城市、手机号等；
   - 采集项目信息：项目所在城市、房屋类型、面积、现状等；
   - 采集预算信息：每平方米预算区间、标准/子标准等；
   - 采集生活方式与空间偏好：核心成员、客厅习惯、聚餐习惯、收纳重点、风水禁忌、智能家居偏好、适老需求等；
   - 问卷被拆分为多个步骤（`steps.tsx` 中的多个 Step，对应 Q2-0 ~ Q2-21、DE-1/DE-2 等；**Q2-2、Q2-3 已取消**，项目类型/面积/预算仅来自 DeepEval）。  
   - **通俗说**：用户不是一页填完，而是「一页一页往下点」，每页只填几道题；所有这些页填的内容合起来，就是一份完整的「深度问卷」，在代码里用 FormData 这一大包数据表示。

2. **登录注册（手机验证码）**
   - 用户输入手机号，点击获取验证码；
   - 用户输入验证码后登录（或注册+登录）；
   - 当前在开发环境下支持「验证码不严格校验」的测试模式。

3. **项目列表页（我的项目）**
   - 展示当前用户的项目列表（目前为前端 Mock + `localStorage`）；
   - 用户点击项目后，进入对应的项目工作台。  
   - **通俗说**：就像「我的订单列表」一样，这里展示的是「我名下的装修项目」；目前列表是写死的示例 + 存在你浏览器里的数据，换一台电脑就看不到了，将来会改成从服务器按登录用户拉取。

4. **项目工作台**
   - **进入工作台后，默认显示的是「项目首页」**（当前待办 + 功能入口卡片），无需再点侧栏即可看到；
   - 左侧为可伸缩导航栏，**当前仅有五项**：项目首页、项目需求书、项目预算、项目订单、项目合同（**设计反馈不在侧栏中**，需从项目首页或项目订单等页面内的入口进入）；
   - **注意**：该侧栏使用 `hidden md:flex`，**在窄屏（如手机、小窗口）下会完全隐藏**，此时无法通过侧栏切换 tab；当前未提供移动端导航或抽屉，小屏下若切到其他 tab 后，仅部分页面（如需求书、设计反馈、ComingSoon）有「返回项目首页」按钮可回到首页；
   - 右侧主区域根据当前 tab 显示：
     - **项目首页**：当前待办（含「立即处理」跳设计反馈）、功能入口卡片（项目需求书 / 项目预算 / 设计反馈）；
     - **项目需求书**：`RequirementsDoc`，可「返回项目首页」；
     - **项目预算**：`BudgetConfirmPanel`（预算确认页 + 桑基图示意）；
     - **项目订单**：`OrderManagementSection`，订单列表 + 可跳设计反馈；
     - **项目合同**：`ContractsSection`，合同状态与签署信息；
     - **设计反馈**：仅通过首页或订单页入口进入后显示，主区域渲染 `DesignFeedbackApp`，可「返回项目首页」。

5. **设计反馈（DesignFeedbackApp）**
   - 模拟一个「按版本管理的设计稿反馈系统」；
   - 支持不同版本（V1/V2/V3…）、不同页面（客厅、卧室等）的批注和评论；
   - 当前数据为硬编码 Mock，用于展示交互与数据结构。

6. **预算桑基图（BudgetSankey）**
   - 使用桑基图的形式展示收入节点、里程碑（里程碑名称与预算区间）、订单与阶段状态关联；
   - 当前默认数据为示例数据，可通过 `props` 传入真实预算数据。

### 2.2 用户完整路径

典型用户使用流程：

1. 打开应用，默认进入 **表单测评模式**（`mode = 'form'`）；
2. 先完成**家居风格测评**拿到结果（可选），再在**登录/注册后**完成**深度需求测评（DeepEval）**（或仅填写关键步骤）；
3. 通过按钮进入登录页（`mode = 'login'`），完成手机验证；
4. 登录成功后进入 **项目列表页**（`mode = 'projects'`），看到「我的项目」；
5. 点击某个项目，进入对应的 **项目工作台**（`mode = 'workbench'`）；
6. 在工作台里，通过左侧导航查看需求书、预算、订单、合同；设计反馈需从项目首页或项目订单等页面内的入口进入；
7. 可从工作台返回项目列表，或退出回问卷流程。

### 2.3 小白说明

从一个普通用户的角度：

- 先「认真填一份装修问卷」，把自己和房子的情况说清楚；
- 再用手机验证码登录，看到「你名下有哪些项目」；
- 选一个项目，就来到「项目总控制台」，可以看预算、合同和设计进度；
- 虽然现在有些数据是示例，但路径已经打通，未来接上真实后端后，这套流程就可以直接用在正式系统中。

---

## 3. 前端技术栈与整体架构

### 3.1 技术栈

- **React 19**：用来搭页面的框架，把界面拆成一块块「组件」方便维护；
- **Vite 6**：用来在本地跑起来项目、以及最后打包成可部署文件的工具；
- **TypeScript ~5.8**：在 JavaScript 上加了一层「类型」，写错字段名或类型时编辑器会报错，减少低级错误；
- **Tailwind CSS 4**：用一串类名（比如 `rounded-xl`、`bg-white`）直接写样式，不用单独写很多 CSS 文件；
- **motion（motion/react）**：做页面切换、弹窗出现消失等动画效果；
- **lucide-react**：一套图标库，页面上的小图标（电话、地图等）来自这里；
- **@google/genai**：调用 Google Gemini 的库，目前项目里装了但业务还没用上，算预留。

**通俗说**：技术栈就是「这个项目是用哪些工具/语言写的」。上面这些你不用全会，只要知道：页面是 React 写的、样式用 Tailwind、逻辑用 TypeScript，跑起来靠 Vite 就行。

### 3.2 前端分层架构

大致可以分为 6 层：

1. **入口层**
   - `index.html`：提供 `#root` 容器；
   - `src/main.tsx`：创建 React 根并挂载 `App`。

2. **应用壳层（App）**
   - `src/App.tsx`：
     - 管理应用模式 `mode`（`'form' | 'login' | 'projects' | 'workbench'`）；
     - 管理主问卷数据 `FormData`；
     - 决定当前渲染的是问卷、多步表单、登录页、项目列表还是工作台。

3. **页面层（Pages）**
   - `src/pages/LoginPage.tsx`：登录；
   - `src/pages/ProjectPage.tsx`：项目列表；
   - `src/pages/WorkbenchPage.tsx`：项目工作台；
   - `src/pages/HomeStyleEval/*`：风格测评；
   - `src/pages/DesignFeedbackApp.tsx`：设计反馈工具页面。

4. **组件层（Components）**
   - `src/components/steps.tsx`：问卷各个 Step；
   - `src/components/DeepEvalForm.tsx`、`DeepEvalFormContext.tsx`：深度测评表单及其上下文；
   - `src/components/BudgetSankey.tsx`：预算桑基图；
   - `src/components/ui.tsx`：基础 UI 组件（输入框、单选、多选等）。

5. **服务层（Services）**
   - `src/services/auth/*`：登录、注册、发送验证码；
   - `src/services/leads/*`：Leads 选项获取与线索提交；
   - `src/services/projects/*`：本地项目列表持久化；
   - `src/services/designVoyage/*`：DeepEval 表单 → `CollectLeadData` 的数据映射与提交封装。

6. **类型与常量层**
   - `src/types.ts`：主问卷 `FormData` 类型和初始值；
   - `src/components/DeepEvalConstants.ts`：问卷选项常量；
   - `src/utils/constants.ts`：`API_BASE_URL` 等常量；
   - `src/vite-env.d.ts`：声明环境变量类型。

### 3.3 小白说明

可以把前端想象成「搭积木」：

- `App` 是最大的那块底板；
- 每个 Page 是一块稍大一点的积木（登录页、项目页、工作台等）；
- Page 里又拼了很多小积木（按钮、输入框、步骤卡片、图表）；
- `services` 这层就是「预留的水电管道」，将来要把这些管道接到真正的后端服务器上。

---

## 4. 目录结构与关键模块

### 4.1 关键顶层文件

- `index.html`：单页应用 HTML；
- `src/main.tsx`：React 入口；
- `src/App.tsx`：多模式控制 + 全局问卷状态；
- `vite.config.ts`：Vite 配置、别名与环境变量注入。

### 4.2 `src/pages/` 目录

- `LoginPage.tsx`：
  - 手机号 + 验证码登录逻辑；
  - 使用 `sendSmsCode` 和 `loginWithCode` 服务；
  - 在开发环境支持「验证码未通过也放行」的测试模式。

  **小白说明：`sendSmsCode` 和 `loginWithCode` 是什么？**
  - **`sendSmsCode(phone)`**：前端封装的「发短信验证码」函数。向接口 `POST {BASE}/auth/sms/send` 发送手机号，后端（若已实现）会向该手机发验证码。返回 `{ success, message? }`，前端据此提示发送成功或失败。
  - **`loginWithCode(phone, code)`**：前端封装的「用手机号 + 验证码登录」函数。向接口 `POST {BASE}/auth/login` 发送 `{ phone, code }`；成功则返回 `{ success: true }`，失败则解析后端的 `message`/`detail` 返回 `{ success: false, message }`。登录页的「获取验证码」按钮调前者，「登录」按钮调后者。

- `ProjectPage.tsx`：
  - 通过 `getProjects()` 获取项目列表；
  - 点击某项目时通过 `onSelectProject` 通知上层，触发 `mode` → `'workbench'`。

- `WorkbenchPage.tsx`：
  - 实现项目工作台整体布局：
    - **进入后默认 `active='home'`**，主区域直接显示项目首页（当前待办 + 功能入口）；
    - 左侧可伸缩导航栏（宽度/是否折叠存入 `localStorage`），**当前仅包含五项**：项目首页、项目需求书、项目预算、项目订单、项目合同（无「设计反馈」入口）；侧栏为 `hidden md:flex`，**中大屏才显示，小屏下隐藏**；
    - 设计反馈通过项目首页或项目订单等页面内的按钮进入，进入后在右侧主区域渲染 `DesignFeedbackApp`；
  - 接收：`userDisplayName`、`projectName`、合同字段等 props。

- `DesignFeedbackApp.tsx`：
  - 完整的设计反馈 UI，内部状态较复杂；
  - 数据源为硬编码的 `DESIGN_FEEDBACK_ORDER`。

- `HomeStyleEval/*`：
  - 风格测评页面及其问题、进度条、结果页等子组件。

### 4.3 `src/components/` 目录

- `steps.tsx`：
  - 定义了大量 Step 组件，每个 Step 代表问卷一部分；
  - 接收 `data: FormData` 和 `updateData`，只关心自己那几项字段；
  - 提供「下一步」等按钮逻辑。

- `DeepEvalForm.tsx`：
  - 深度评估专用表单版本；
  - 包含地理定位、反向地理编码、校验、提交等逻辑。

- `DeepEvalFormContext.tsx`：
  - 用 React Context 管理 DeepEval 表单数据与错误状态；
  - 对项目类型、位置、面积、预算、姓名、年龄段等做实时校验。

- `BudgetSankey.tsx`：
  - 预算桑基图组件；
  - 使用内置 `INCOME_ENTRIES`、`MILESTONES`、`ORDERS` 作为默认数据；
  - 暴露 `BudgetSankeyData` 类型，未来可从后端拉取真实数据填充。

- `ui.tsx`：
  - `StepWrapper`：包裹问卷步骤的壳组件，内有动画与卡片布局；
  - `TextInput` / `SegmentedRadio` / `RadioCard` / `IconRadioCard` 等基础输入与选择组件。

### 4.4 `src/services/` 目录

- `auth/index.ts`：
  - 导出：
    - `sendSmsCode(phone)`；
    - `registerWithCode(phone, code)`；
    - `loginWithCode(phone, code)`；
  - 内部通过 `fetch` 调用 `/auth/sms/send`、`/auth/register`、`/auth/login`。

- `leads/leadsApi.ts`：
  - 定义：
    - `LeadsOptionsResponse`：问卷选项类型；
    - `CollectLeadData`、`CollectLeadResponse`、`CollectLeadErrorBody` 等接口类型；
  - 提供：
    - `getLeadsOptions()` → `GET {BASE}/leads/options`；
    - `collectLead(data, attachments?)` → `POST {BASE}/leads`，`multipart/form-data`。

- `leads/index.ts`：
  - 统一导出 `getLeadsOptions`、`collectLead` 及相关类型。

- `projects/projectsApi.ts`：
  - `Project` 类型：`id`、`name`、`location`、`createdAt`；
  - `getProjects()`：从 `localStorage` 读取或使用 `MOCK_PROJECTS`；
  - `addProject(project)`：添加新项目并写入本地。

- `projects/index.ts`：
  - 导出 `getProjects`、`addProject` 和 `Project` 类型。

- `designVoyage/LeadsService.ts`：
  - `DesignVoyageFormData`：DeepEval 专用前端数据结构；
  - `buildDesignVoyageLeadPayload`：转换为后端 `CollectLeadData`；
  - `leadsApi.submitLead(data, attachments?)`：内部调用 `collectLead`。

### 4.5 类型与常量

- `src/types.ts`：
  - 定义主问卷 `FormData` 接口；
  - 定义 `initialFormData` 作为初始值。

- `src/components/DeepEvalConstants.ts`：
  - `PROJECT_TYPES`、`AGE_GROUPS`、`BUDGET_RANGES`、`INDUSTRIES` 常量数组。

- `src/utils/constants.ts`：
  - `API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dreamone.cloud/api'`。

### 4.6 Step 与 FormData 字段对应速查

改某一步的交互或校验时，可据此快速定位会读写 FormData 的哪些字段（以下为部分主要步骤，完整逻辑见 `steps.tsx`）：

| Step 组件 / 步骤 id | 主要读写的 FormData 字段 |
|---------------------|---------------------------|
| StepWelcome / welcome | （无 FormData 读写） |
| StepDeepEval1 / deep-eval-1 | 通过 DeepEvalFormContext 的 DesignVoyageFormData，提交时映射为 CollectLeadData |
| StepDeepEval2 / deep-eval-2 | 同上 |
| Step3 / q2-3 | projectType, projectLocation, projectArea, budgetStandard, projectName |
| Step3Sub / q3 | budgetSubStandard |
| Step4 / q2-4 | floorPlanUploaded |
| Step5 / q2-5 | lighting, ceilingHeight, ventilation, noise |
| Step6 / q2-6 | role, favoriteSpace, additionalMembers, daughterSpaces, sonSpaces, catSpaces, dogSpaces |
| Step7 / q2-7 | collaboration, involvement |
| Step8 / q2-8 | timeline |
| Step9 / q2-9 | coreSpaces, childGrowth, guestStay, futureChanges |
| StepContract / contract | contractAccepted, contractSignatureData, contractCustomText |
| 其他 Q2-xx | 对应名称的 FormData 字段（如 cookingHabit, diningCount, storageFocus, fengshui, smartHomeOptions 等） |

**小白说明**：改某一步的题目或选项时，先查这张表找到对应的 FormData 字段，再在 `steps.tsx` 里搜该字段名即可定位到具体组件和逻辑。

### 4.7 小白说明

你可以简单记住：

- 改「页面大布局」：看 `src/pages/`；
- 改「某一步问卷长什么样」：看 `src/components/steps.tsx`；
- 改「和后端/数据交互的逻辑」：看 `src/services/`；
- 改「问卷字段定义或下拉选项」：看 `src/types.ts` 和 `DeepEvalConstants.ts`。

---

## 5. 状态管理与数据模型

### 5.1 `FormData`（主问卷）

- **位置**：`src/types.ts` 里有一个 TypeScript 接口，名字叫 `FormData`。
- **含义（技术说）**：
  - 整个深度问卷所有字段的统一定义；
  - 包括用户信息、项目基础信息、预算参数、生活方式与空间偏好、智能家居、适老需求、旧物处理、其他需求、合同相关字段等。
- **`initialFormData`**：
  - 为每个字段提供默认值（空字符串、空数组等），程序一启动就用它来初始化「整份问卷」的那一包数据。

**什么是 FormData（通俗说）**  
可以把它想成「一张超级长的 Excel 表」：每一列是一道题或一个选项（比如姓名、项目名称、预算区间、是否要智能家居……），每一行就是「当前用户填的那一行」。只不过在程序里我们不用真的画表，而是用一个叫 `FormData` 的对象来装这些列；每个步骤的页面只负责填其中几列，最后拼起来就是用户填的整份问卷。所以当你看到文档里说「FormData」时，指的就是**这份问卷在代码里的完整形态**，而不是浏览器里那种用来提交表单的 FormData。

### 5.2 App 顶层状态管理

- 在 `src/App.tsx`：
  - `const [data, setData] = useState<FormData>(initialFormData);`  
    → 意思是：整份问卷只有「一份」数据，存在 App 里，名字叫 `data`，一开始是空表（initialFormData）。
  - 通过 `updateData(fields: Partial<FormData>)` 更新问卷部分字段；  
    → 意思是：某个步骤只改其中几列时，调用 `updateData({ projectName: 'xxx' })` 这类，把改动的列传进去，App 会把这几分合并进整张表。
  - 所有 Step 组件通过 props 拿到 `data` 和 `updateData`，对同一份 `FormData` 进行读写。  
    → 意思是：每个步骤页面都能看到整张表（data），也能用 updateData 改自己负责的那几列，所以大家改的是同一张表，不会乱。

### 5.3 DeepEval 专用数据与映射

- 在 `services/designVoyage/LeadsService.ts` 中：
  - **DesignVoyageFormData**：只包含「深度测评」那几条页面要填的字段（项目类型、项目位置、面积、预算、姓名、称呼、城市、手机号、年龄段、行业），是 FormData 的一个「精简版子集」。
  - **buildDesignVoyageLeadPayload(formData, options?)**：这是一个函数，负责把前端的填表内容变成后端要的格式。
    - 对手机号做简单清洗（去掉 `-`）；
    - 把前端字段名换成后端约定的名字（例如前端的 `name` → 后端的 `user_name`，前端的 `area` → 后端的 `project_area` 数字）；
    - 把风格、关注空间等额外信息放进 `extra` 对象；
    - 如果有定位得到的经纬度，放进 `project_location`。
  - **通俗说**：前端填的是「中文式」的字段名和格式，后端要的是另一套名字和格式；这个函数就是「翻译官」，把前者翻译成后者，这样提交到 `POST /leads` 时后端才能正确存下来。

### 5.4 项目 / 预算 / 设计反馈数据模型

- **项目（Project）**（在 `projectsApi.ts`）：  
  - 就是「我的项目」列表里的一条：有 id、名字、地点、创建时间。  
  - 技术上：`id: string; name: string; location?: string; createdAt?: string;`

- **预算（BudgetSankeyData）**（在 `BudgetSankey.tsx`）：  
  - 工作台里「项目预算」那一页用的数据：有哪些收款节点、哪些里程碑、哪些订单、总预算多少。  
  - 技术上：`incomeEntries`（每笔收入）、`milestones`（里程碑）、`orders`（订单）、`totalBudget`（总预算）。  
  - **通俗说**：桑基图要画「钱从哪来到哪去」，这些字段就是用来描述「来源、节点、去向」的。

- **设计反馈（DesignOrder / OrderVersion / PageSnapshot）**（在 `DesignFeedbackApp.tsx` 顶部）：  
  - 设计反馈功能里：一个设计订单下面有多个版本（V1、V2…），每个版本下有多页，每页有标题、文字、图、批注、评论。  
  - **通俗说**：就是「设计稿的版本 + 每一页长什么样 + 客户/设计师在页面上留的批注和评论」在代码里的结构。

### 5.5 数据之间的关系与连接

本节说明：**各块数据在前端如何连在一起**，以及**后端设计里实体之间的关联**。便于排查「改了一处，哪里会跟着变」。

#### 5.5.1 前端：唯一问卷源 FormData

- **存放位置**：`App.tsx` 中一份 `useState<FormData>(initialFormData)`，整份问卷共用。
- **谁在写**：各 Step 通过 `updateData(fields)` 只改自己相关字段（如 `userName`、`projectName`、`contractAccepted` 等）。
- **谁在读**：
  - 步骤表单：直接读 `data.xxx` 展示；
  - 进入工作台时：从 `data` 取出用户名、项目名（兜底）、合同相关字段，传给 `WorkbenchPage`。

因此：**所有问卷步骤 ↔ 同一份 FormData**（多块编辑同一张表）。

**通俗说**：问卷只有「一张总表」，每个步骤只改自己那几列；进工作台时，工作台从这张表里拿「用户名、项目名、合同有没有签」来显示，所以表里的内容会直接影响到工作台顶上显示的名字和合同状态。

#### 5.5.2 问卷提交：FormData / DesignVoyageFormData → CollectLeadData

- **主流程问卷（Q2-0～Q2-21 等）**：数据都在 `FormData` 里；当前代码**没有**把整份 `FormData` 转成 `CollectLeadData` 再调 `POST /leads`，即主流程未接提交接口。
- **DeepEval 流程**：使用精简结构 `DesignVoyageFormData`（项目类型、位置、面积、预算、姓名、称呼、城市、手机、年龄段、行业等）。
- **连接关系**：**DesignVoyageFormData** → 经 `buildDesignVoyageLeadPayload()` 映射 → **CollectLeadData** → `collectLead()` 发往 `POST /leads`。  
  即：**只有 DeepEval 这条线**把「表单数据」和「后端 Leads 接口」连在一起。

#### 5.5.3 项目列表与当前选中项目

- **Project 列表**：来自 `getProjects()`，目前是 **localStorage + Mock**，与 `FormData`、与登录接口**无绑定**（即不是从 FormData 算出，也不是按「当前登录用户」从接口拉取）。
- **选中项目**：在 `ProjectPage` 点击某项目 → `onSelectProject(project)` → App 中 `setSelectedProject({ id, name })` → 切到 `workbench`。
- **工作台展示用到的数据**：
  - `projectName`：优先 **selectedProject.name**，否则用 `data.projectName` 或 `data.projectLocation`（来自 FormData）；
  - `userDisplayName`：来自 FormData 的 **userName + userTitle**；
  - 合同相关：`contractAccepted`、`contractSignatureData`、`contractCustomText` 均来自 **FormData**。

即：**FormData 提供「用户显示名 + 合同」；selectedProject 提供「当前打开的是哪个项目」；若未选项目则用 FormData 里的项目名/位置兜底。**

#### 5.5.4 登录在数据上的作用（当前前端）

- `sendSmsCode` / `loginWithCode` 仅调用接口，**前端未持久化** token 或 userId。
- 登录成功后仅 `setMode('projects')` 并展示项目列表；项目列表仍是本地 Mock，与「登录的是谁」在数据上**无关联**。

#### 5.5.5 前端数据连接示意

```
App.tsx
  FormData (整份问卷)     selectedProject { id, name }     mode / currentStepIndex
         │                        │                              │
         │ updateData/读取        │ 选项目时写入                  │ 切换 form/login/projects/workbench
         ▼                        ▼                              ▼
  各 Step 组件               ProjectPage                    LoginPage
  (只读写 FormData)          getProjects()→localStorage     sendSmsCode / loginWithCode

  DeepEval 分支：DesignVoyageFormData → buildDesignVoyageLeadPayload() → CollectLeadData → POST /leads

进入 workbench 时：
  userDisplayName ← data.userName + data.userTitle
  projectName     ← selectedProject?.name ?? data.projectName ?? data.projectLocation
  contract*       ← data.contractAccepted, data.contractSignatureData, data.contractCustomText
```

#### 5.5.6 后端设计中的实体关系（目标形态）

若按文档第 12 章实现后端，实体之间的连接为：

```
users (用户，按手机号唯一)
  │
  ├── leads (线索/问卷)  ← user_id 外键指向 users；raw_payload 存整份问卷 JSON
  │
  └── projects (项目)    ← user_id 外键指向 users
         │
         ├── contracts (合同)           ← project_id → projects
         ├── financial_records (流水)   ← project_id → projects
         ├── milestones / orders        ← 关联到 project
         └── design_orders / versions   ← 关联到 project（设计反馈）
```

- **用户**：一个手机号一个 user；登录后接口通过 token 识别 user。
- **Leads**：每条 lead 属于一个 user（user_id），内容为前端提交的 CollectLeadData 或扩展 JSONB。
- **Projects**：每个 project 属于一个 user；合同、预算、订单、设计反馈均挂在 project 下。
- **当前前端尚未体现的「连接」**：没有「从某条 lead 自动生成一个 project」；项目列表也未按当前登录 user 从后端拉取。需后端提供 `GET /projects` 及业务规则（如「何时从 lead 创建 project」）后，才能把这条线接上。

#### 5.5.7 关系小结表

| 关系 | 说明 |
|------|------|
| FormData ↔ 步骤 | 一份 FormData，所有步骤共同读写，相当于多块编辑同一张表。 |
| FormData ↔ 工作台 | 工作台展示用 FormData 的用户名、项目名（兜底）、合同字段；当前选中的项目来自 selectedProject，不是从 FormData 推导。 |
| DesignVoyageFormData → CollectLeadData | 仅 DeepEval 通过 `buildDesignVoyageLeadPayload` 转成 CollectLeadData 并提交 POST /leads。 |
| Project 列表 | 当前与 FormData、登录用户均无绑定，来自 localStorage；接入后端后应由「当前 user」关联。 |
| 后端设计 | user → 多条 leads；user → 多个 projects；每个 project 下挂合同、预算、订单、设计反馈等。 |

### 5.6 小白说明（状态与数据）

简单比喻：

- **FormData**：就是一张「超长的问卷 Excel 表」，每一列是一道题，所有步骤页面都在往这张表里填；表只有一份，存在 App 里。
- **DesignVoyageFormData**：是从表里抽出来的「一小块」，只包含深度测评那几页要的字段，方便转成后端要的 CollectLeadData 格式。
- **Project / BudgetSankeyData / DesignOrder**：是工作台里各个模块要用的「数据长什么样」的约定；前端拿到符合这些结构的数据就能正确画列表、画桑基图、画设计反馈。

**数据之间怎么连？**

- 问卷里填的内容（FormData）会流到工作台顶部的「用户名」和「合同」；你当前点进的那个项目（selectedProject）决定工作台标题里的「项目名」。**这两条线是分开的**：项目列表并不是从问卷里自动生成的，所以你在列表里选的项目和问卷里填的「项目名」可能不是同一个东西，只是进工作台时如果没选项目，才用问卷里的项目名兜底。
- 只有「深度测评」那条流程会把填的内容转成后端要求的格式并提交；主流程的长问卷目前没有提交到后端的代码。
- 后端设计里：一个用户下有多条线索、多个项目；每个项目下再挂合同、预算、设计反馈等。将来接上后端后，项目列表就会和「当前登录用户」绑在一起，不再用本地假数据。

---

## 6. Mock 数据与未来接入后端的策略

### 6.1 当前 Mock 使用情况

- **项目列表**
  - 使用 `MOCK_PROJECTS` 作为初始数据；
  - 调用 `getProjects()` 时优先从 `localStorage` 读取，没有时退回到 `MOCK_PROJECTS`；
  - 通过 `addProject()` 向本地列表添加项目。  
  - **通俗说**：你现在看到的「我的项目」列表，要么是代码里写死的几条示例，要么是你之前在这台电脑的浏览器里「加」过的项目；没有从服务器拉，所以是「假」的列表。

- **设计反馈（DesignFeedback）**
  - 使用硬编码 `DESIGN_FEEDBACK_ORDER` 作为唯一数据源；
  - 所有版本/页面/批注/评论均为示例数据。  
  - **通俗说**：设计反馈里看到的订单、版本、批注全是写死在代码里的例子，用来演示「这个功能长什么样」，不能真的增删改。

- **预算桑基图**
  - 使用内部定义的 `INCOME_ENTRIES`、`MILESTONES`、`ORDERS` 等作为默认数据；
  - 暂未从外部注入真实预算数据。  
  - **通俗说**：预算图上的数字和节点也是示例数据，将来会改成从后端「某项目的预算接口」拉取真实数据。

### 6.2 已经实现的接口调用（前端侧）

- `leadsApi`：
  - `getLeadsOptions()`：获取问卷选项；
  - `collectLead(data, attachments?)`：提交 DeepEval 线索。

- `auth`：
  - `sendSmsCode(phone)`：发送短信验证码；
  - `registerWithCode(phone, code)`：注册；
  - `loginWithCode(phone, code)`：登录。

这些调用已经在 UI 流程中使用，真实是否有后端响应，取决于部署环境的 `VITE_API_BASE_URL` 和后端实现。

### 6.3 主流程问卷的提交策略（待定）

- **当前**：只有 **DeepEval** 流程通过 `buildDesignVoyageLeadPayload` 将表单转为 `CollectLeadData` 并调用 `POST /leads`。主流程（Q2-0～Q2-21）的 **FormData 未提交到后端**。
- **待产品/技术确认**：
  - **方案 A**：主流程也映射为 `CollectLeadData`（需新增 `FormData → CollectLeadData` 映射，因字段更多、部分需落进 `extra`），统一走 `POST /leads`。
  - **方案 B**：主流程使用单独接口（例如 `POST /requirements` 或更完整的 payload），与 DeepEval 的 lead 区分。
- **小白说明**：目前只有「深度测评」那条线会把填的内容提交到后端；主流程的长问卷都还在前端，将来用哪种方式提交需要和产品一起定。

### 6.4 推荐接入路线

1. 优先保障 **认证 + Leads 提交**：
   - 确保 `/auth/sms/send`、`/auth/login`、`/leads` 在测试环境可用；
   - 能够在真实后端落地一条 DeepEval 线索记录。

2. 其次替换 **项目列表**：
   - 提供 `GET /projects`、`POST /projects` 等接口；
   - 将 `services/projects` 从 localStorage Mock 迁移为真实接口。

3. 再接入 **预算与订单**：
   - 提供 `GET /projects/{id}/budget` 与 `GET /projects/{id}/orders`；
   - 将 `BudgetSankey` 默认数据替换为来自接口的结构。

4. 最后接入 **设计反馈系统**：
   - 提供设计订单、版本、页面、批注与评论的 CRUD 接口；
   - 将 `DesignFeedbackApp` 的数据源改为接口 + 本地状态管理。

### 6.5 小白说明

总结一句话：

> 现在用「假数据」是为了先把前端产品做出来，好让大家体验；等后端准备好了，再按模块一点一点把「假数据」换成「真数据」。

---

## 7. 表单校验、错误处理与用户体验

### 7.1 表单校验

- 手机号：
  - `LoginPage` / `DeepEvalForm` / `DeepEvalFormContext` 中均有正则校验；
  - 要求 11 位数字。

- 必填项：
  - 如 `projectType`、`projectPosition`、`area`、`budget`、`name`、`ageGroup`、`industry`、`city` 等；
  - 未填时会将错误信息写入 `errors` 状态，并在 UI 上展示提示。

### 7.2 地理定位与反向地理编码

- 使用 `navigator.geolocation` 获取用户经纬度；
- 调用 `https://api.bigdatacloud.net/data/reverse-geocode-client` 进行反向地理解析；
- 若失败，再尝试 `https://nominatim.openstreetmap.org/reverse`；
- 最终将得到的省市/城市信息映射到：
  - `projectPosition`（项目位置）；
  - 或 `city`（所在城市）。

### 7.3 接口错误处理

- `collectLead`：
  - 当 `response.ok` 为 false 时，尝试解析返回体的 `detail` 字段；
  - 若 `detail` 为字符串则直接抛出该文本，否则序列化为 JSON 字符串抛出；
  - 调用方捕获后显示「提交失败」类文案。

- `auth`：
  - 对 `sendSmsCode` / `registerWithCode` / `loginWithCode` 的返回结构进行解析；
  - 若后端返回 `message` 或 `detail` 字段，则展示为错误提示；
  - 在开发环境允许错误时继续流程（测试模式）。

### 7.4 小白说明

从用户视角：

- 填错手机号/没填必填项，页面会提示你哪里有问题，而不是直接白屏；
- 定位失败时，会告诉你「浏览器不支持」或「外部服务不可用」，并给出保底方案（用经纬度字符串）；
- 提交接口失败时，尽量从后端返回中提取可读的错误文案。

这些都属于「细节打磨」，让 Demo 虽然只连了部分后端，但已经有接近真实产品的体验。

---

## 8. 界面与交互设计（技术视角）

### 8.1 样式体系（Tailwind）

- 统一使用 Tailwind 类名管理样式：
  - 背景色多用 `#FDFCF8` 或接近米白色；
  - 强调色多用 `#D84936` 和 `#F39A25`；
  - 圆角、阴影、边框颜色在各组件中保持一致风格。

### 8.2 动效体系（motion）

- 使用 `motion.div` 和 `AnimatePresence` 实现：
  - 步骤切换时的淡入淡出、位移动画；
  - 弹窗（Modal）出现/消失的缩放与透明度变化。

### 8.3 布局设计（以 Workbench 为例）

- 左侧导航：
  - 宽度可拖拽，范围限制在一定区间（如 220–360）；
  - 折叠状态和宽度都存入 `localStorage`，刷新后仍可恢复；
  - 小屏幕/移动端时适配显示。

- 右侧内容：
  - 采用卡片+分栏布局，根据当前 tab 展示对应模块；**进入工作台时默认即为项目首页**，无需再点侧栏；
  - 设计反馈不在侧栏，从首页或订单页的按钮进入后，在右侧主区域展示 `DesignFeedbackApp`。
- **小屏说明**：左侧导航在窄屏下隐藏（`hidden md:flex`），当前无移动端主导航，小屏下部分 tab（如订单、预算）无「返回项目首页」按钮，可能无法从该 tab 回到首页，属已知限制。

### 8.4 小白说明

这些设计（颜色、圆角、阴影、动画、布局）看似只是「好看」，但本质是为了把 Demo 做得足够像正式产品，方便：

- 对外演示；
- 内部沟通需求；
- 未来直接在此基础上演进成真实线上系统。

---

## 9. 配置、环境与构建部署

### 9.1 环境变量

- **`.env.example` 建议内容**（本地开发时复制为 `.env.local` 或 `.env`）：

  ```bash
  # 后端 API 基地址（必配：对接真实后端时改为实际地址）
  VITE_API_BASE_URL=https://dreamone.cloud/api

  # Gemini AI（当前业务未使用，占位）
  GEMINI_API_KEY=your_gemini_key

  # 应用部署地址（占位，用于回调等）
  APP_URL=http://localhost:3000
  ```

  **说明**：Vite 只会把 **以 `VITE_` 开头的变量** 暴露给前端代码（`import.meta.env.VITE_xxx`），其他变量仅在构建时可用。因此后端地址必须用 `VITE_API_BASE_URL`。

- `src/vite-env.d.ts`：
  - 声明：
    - `VITE_API_BASE_URL?`：后端 API 基地址；
    - `VITE_MY_HOME_URL?`、`VITE_APP_HOME_URL?`：预留的 URL 配置项。

### 9.2 Vite 配置

位置：`vite.config.ts`

- 使用 `loadEnv` 加载环境变量；
- 在 `define` 中将 `process.env.GEMINI_API_KEY` 替换为构建时的值；
- 设置别名：
  - `@` → 项目根目录；
- 开发服务器：
  - 通过 `DISABLE_HMR` 控制是否启用 HMR（在 AI Studio 环境中做特殊处理）。

### 9.3 构建与运行命令

- `npm run dev`：本地开发（默认端口 3000）；
- `npm run build`：打包生产构建；
- `npm run preview`：预览打包后的构建结果；
- `npm run lint`：TypeScript 类型检查。

### 9.4 小白说明

最常用的是：

- 第一步：`npm install`（只需要执行一次，安装依赖）；
- 第二步：`npm run dev`（启动本地开发环境）；
- 如需生成可部署版本：`npm run build`；
- 想在本地模拟线上效果：`npm run preview`。

环境变量就是「不改代码，通过配置文件切换不同环境」的方式：  
比如开发环境连测试服，生产环境连正式服，都只用改 `.env` 文件里的地址。

---

## 10. 质量保证与后续演进

### 10.1 当前质量保障措施

- 使用 TypeScript 对数据结构进行静态检查；
- 在 services 中对接口返回值和错误做统一处理；
- 在关键逻辑（如 `buildDesignVoyageLeadPayload`）周围有较清晰的代码结构和类型约束。

### 10.2 风险点与注意事项

- `FormData` 字段较多，与 `CollectLeadData` 字段的映射需要保持同步；
- 登录流程在开发模式下支持「放行」，上线前要重新审查此逻辑；
- Mock 数据容易让人误以为是后端真实返回，需要在文档和 README 中显式标注。

### 10.3 后续演进建议

- **测试方面**：
  - 为 `buildDesignVoyageLeadPayload` 等关键函数编写单元测试；
  - 设计简单的端到端（E2E）测试，覆盖完整用户路径（从问卷到工作台）。

- **架构方面**：
  - 当后端成熟后，引入统一 API 客户端封装（例如统一加认证头、错误处理、重试策略等）；
  - 如有需要，可引入轻量状态管理库（如 Zustand 或 Redux Toolkit）管理跨页面共享状态。

### 10.4 小白说明

这一节可以理解成「未来给自己和同事的一些提醒」：

- 哪些地方改动要格外小心；
- 哪些地方值得补测试；
- 如果以后要把这个 Demo 真正上线，有哪些技术债需要先还掉。

---

## 11. 后端接口设计（作为整体架构的一部分）

> 注意：本节描述的是 **前端当前假设/使用的接口形态**，方便未来对接真实后端。当前仓库并不包含这些接口的后端实现。

### 11.1 Base URL 约定

- `BASE = (VITE_API_BASE_URL || 'https://dreamone.cloud/api').replace(/\/$/, '') + '/dsphr/v1'`

### 11.2 Leads 接口

- 获取选项：
  - `GET {BASE}/leads/options`
  - 响应（简化）：
    - `user_title: string[]`
    - `user_age_range: string[]`
    - `user_industry: string[]`
    - `project_type: string[]`
    - `project_budget_range: string[]`
    - `space_function: string[]`

- 提交线索：
  - `POST {BASE}/leads`
  - 请求：
    - `Content-Type: multipart/form-data`
    - 字段：
      - `data`：JSON 字符串，结构为 `CollectLeadData`
      - `attachments`：可选的多个文件
  - **鉴权与 user_id（待实现时确定）**：
    - **若允许匿名提交**：接口不要求 Bearer token；后端 `leads` 表 `user_id` 可空，后续用户登录后可由运营或接口将 lead 关联到 user。
    - **若必须登录后提交**：接口要求 Authorization，后端从 token 取 user_id 写入 lead。当前前端 DeepEval 可在未登录时提交，若采用「必须登录」则前端需先引导登录再开放提交。
  - 成功响应：
    - `{ success: boolean; message: string; id: number | null }`
  - 错误响应：
    - HTTP 4xx + JSON 体中 `detail` 或 `message` 字段。
  - **小白说明**：先填问卷再登录时，后端还没有「当前用户」；所以要么允许匿名交表（user_id 先空着），要么改成先登录再填，接口设计会不一样。

### 11.3 Auth 接口

- 发送验证码：
  - `POST {BASE}/auth/sms/send`
  - Body: `{ phone: string }`

- 注册：
  - `POST {BASE}/auth/register`
  - Body: `{ phone: string; code: string }`

- 登录：
  - `POST {BASE}/auth/login`
  - Body: `{ phone: string; code: string }`

### 11.4 Projects / 预算 / 设计反馈（建议形态）

- **GET {BASE}/projects**（获取当前用户项目列表）
  - **鉴权**：建议要求 `Authorization: Bearer <token>`，后端从 token 解析 userId，只返回该用户的项目。
  - **响应示例**：`{ projects: [{ id: string; name: string; location?: string; createdAt?: string }] }`（与前端 `Project` 类型一致）。前端 `getProjects()` 将改为请求此接口并解析 `res.projects`，替换当前 localStorage 逻辑。

- **POST {BASE}/projects**：创建新项目（Body 含 `name`、`location?` 等），鉴权同 GET。

- **GET {BASE}/projects/{id}/budget}**（预算桑基图数据）
  - 返回结构需与前端 **BudgetSankeyData** 一致，前端可直接传给 `<BudgetSankey data={...} />`。结构如下（TypeScript 定义来自 `BudgetSankey.tsx`）：
  - `incomeEntries: Array<{ id: string; date: string; displayDate: string; amount: number; status: StatusGroup; isToday?: boolean; isFuture?: boolean; isUnpaid?: boolean }>`，其中 `StatusGroup = '意向期'|'订购期'|'交付期'|'验收期'|'维保期'`；
  - `milestones: Array<{ id: string; name: string; budgetMin: number; budgetMax: number; dueDate: string }>`；
  - `orders: Array<{ id: string; number: string; title: string; status: StatusGroup; milestoneId: string; budget: number }>`；
  - `totalBudget: number`。
  - **小白说明**：后端按这个形状返回，前端的桑基图组件就能直接使用，无需再改组件。

- **GET {BASE}/projects/{id}/design-orders}** / **design-versions** / **design-pages**：提供给 `DesignFeedbackApp` 使用的真实数据接口。

### 11.5 前端鉴权接入清单（对接后端时必做）

对接真实后端时，前端需完成以下事项（当前均未实现）：

1. **登录成功后**：从登录接口响应中读取 token（如 `access_token` 或 `token`），存入内存或 `localStorage`/`sessionStorage`（注意 XSS 与持久化策略）。
2. **请求头**：所有调用需鉴权接口的请求（如 `GET /projects`、`GET /projects/{id}/budget`）在 header 中加上 `Authorization: Bearer <token>`。可在 `services` 层封装一个公共 `fetch` 或 axios 实例统一添加。
3. **401 处理**：当接口返回 401 时，清除本地 token 并跳转登录页（或提示重新登录）；若有 refresh token，可先尝试刷新再重试。
4. **可选**：实现 `POST /auth/refresh` 与前端 token 过期前的刷新逻辑。

**小白说明**：  
- **token**：登录成功后后端发的一串「通行证」，前端要存起来。  
- **鉴权**：就是「验明正身」——后端看请求里有没有带有效的 token，有就认为是某用户，没有就拒绝（返回 401）。  
- 所以登录成功后前端必须「记住」这张通行证，之后每次请求（比如拉项目列表、拉预算）都要在请求头里带上它，后端才知道「这是张三，只给张三的数据」；否则项目列表这类接口没法知道该返回谁的数据。

### 11.6 小白说明

这部分可以理解为：

> 「未来有一天，当你真的要把这个 Demo 接到一个后端服务上时，需要后端大致按这些地址和数据格式来实现接口。」

它不会影响你现在在前端里跑 Demo，但会极大降低以后「对接后端时反复沟通」的成本。

---

## 12. 后端整体技术架构设计（草案，待评审）

> 本节描述的是：**如果要把当前前端 Demo 升级为真正可落地的系统**，推荐采用的一套后端整体技术架构。你可以视为「设计草案」，后续和团队一起评估、删改。

### 12.1 后端总体目标

- 为前端提供一套 **稳定、清晰、可扩展的 API 服务**，支撑：
  - 深度问卷（Leads）提交与查询；
  - 手机号验证码登录与用户身份管理；
  - 项目列表、项目工作台各模块数据（预算、订单、合同、设计反馈等）。
- 保证：
  - **数据安全**：用户手机号、合同签名等敏感信息的安全存储与传输；
  - **可演进性**：问卷内容和业务字段在未来可以方便扩展，而不会频繁改表结构；
  - **与前端解耦**：前端通过清晰的 REST API 与后端交互，而不直接关心内部实现细节。

### 12.2 推荐技术选型（可按团队情况调整）

- **语言与框架（示例）**
  - Node.js + NestJS：
    - 完整 TypeScript 支持，可与前端共享类型；
    - 模块化清晰，适合按「领域」拆分（auth / leads / projects / contracts / budget / designFeedback）。

- **数据库**
  - PostgreSQL：
    - 存结构化业务数据（用户、项目、合同、预算流水等）；
    - 使用 JSONB 字段存储**多变的问卷答案**。

- **缓存与会话**
  - Redis：
    - 存储短信验证码（包含过期时间）；
    - 可缓存问卷选项、配置等只读数据。

- **认证与授权**
  - JWT（JSON Web Token）：
    - 登录成功后颁发 `access_token`；
    - 前端通过 `Authorization: Bearer <token>` 调用需鉴权接口。

- **部署与运维**
  - Docker 容器化：
    - 后端服务、PostgreSQL、Redis 各自一个容器；
  - 反向代理（Nginx / API Gateway 等）：
    - 统一处理 HTTPS、路由与静态资源。

### 12.3 模块划分（按业务领域拆分）

建议按「领域」拆分后端模块，每个模块有独立的 Controller / Service / Repository：

1. **Auth 模块**
   - 职责：短信验证码、用户注册、登录、Token 管理。
   - 主要接口：
     - `POST /auth/sms/send`：发送验证码（带频率限制和过期时间）；实际下发短信需对接第三方短信服务（详见 `03-register.md` 实现边界说明）；
     - `POST /auth/register`：验证码校验 + 注册；
     - `POST /auth/login`：验证码校验 + 登录 + 颁发 JWT。
   - 后续可扩展：
     - `POST /auth/refresh`：刷新 token；
     - `POST /auth/logout`：服务端记录登出事件（如黑名单）。

2. **Users 模块**
   - 职责：管理用户基础信息。
   - 数据示例：
     - 手机号、显示名称、称呼（先生/女士）、角色等。
   - 当前前端主要通过手机号识别用户，后端需保证手机号唯一。

3. **Leads 模块（登录后深度需求测评 DeepEval → 提交线索）**
   - 职责：接收前端提交的 `CollectLeadData`，并提供查询接口。
   - 接口示例：
     - `GET /leads/options`：返回问卷选项（可从配置表或 JSON 中读取）；
     - `POST /leads`：保存完整问卷一份。
   - 存储设计：
     - 关键字段单独建列（城市、面积、预算区间等）；
     - 原始完整问卷使用 JSONB 存入 `raw_payload` 字段，方便未来扩展问题。
     - **user_id**：若允许匿名提交，则 `user_id` 可空，后续可再关联；若必须登录后提交，则必填，从 token 解析。
   - **附件存储**：`POST /leads` 的 `attachments` 建议存对象存储（OSS/S3/GCS），数据库只存文件 URL 或单独 `lead_attachments` 表（lead_id + url）；不在应用服务器本地磁盘长期保存，以便扩展与备份。

4. **Projects 模块**
   - 职责：管理项目列表和项目基础信息。
   - 典型接口：
     - `GET /projects`：返回当前登录用户的项目列表（需鉴权）；
     - `GET /projects/{id}`：获取指定项目详情；
     - （可选）`POST /projects`：创建新项目；或 `POST /leads/{id}/convert-to-project`：从某条 lead 生成一个正式项目。
   - **Lead 与 Project 的业务关系（待产品确认）**：
     - 一条 lead（问卷/线索）**在什么时机、由谁**变成 project，文档中尚未定死，实现前需与产品对齐。常见几种：
       - **方案 A**：用户在某一步点击「创建项目」或「进入工作台」时，后端根据当前 lead（或 FormData）创建 project，并返回列表；
       - **方案 B**：支付/签约成功后自动由系统生成 project；
       - **方案 C**：运营在后台将某条 lead 转为 project。
     - 确定后，前端需在对应节点调用「创建项目」或「转换 lead」的接口，并刷新项目列表。

5. **Contracts 模块**
   - 职责：管理项目信息中的合同与签署状态。
   - 接口示例：
     - `GET /projects/{id}/contract`：获取项目合同详情与签署状态；
     - `POST /projects/{id}/contract/sign`：提交签名（签名图片、签名文本等）。
   - 存储建议：
     - 签名图片存在对象存储（OSS/GCS/S3），数据库只存 URL；
     - 合同模板与版本可存在单独表，用于版本管理。

6. **Budget & Orders 模块**
   - 职责：为前端 Workbench 的预算桑基图与订单列表提供数据。
   - 接口示例：
     - `GET /projects/{id}/budget`：
       - 返回结构可与前端 `BudgetSankeyData` 对齐；
     - `GET /projects/{id}/orders`：
       - 返回订单条目，包含阶段、金额、关联里程碑等。
   - 数据示例：
     - `financial_records`：每一笔收入/支出流水；
     - `milestones`：项目里程碑（名称、预算范围、时间）；
     - `orders`：订单（关联项目、milestone、金额、状态）。

7. **DesignFeedback 模块（未来扩展）**
   - 当需要将 `DesignFeedbackApp` 接入真实后端时：
     - `GET /projects/{id}/design-orders`：获取设计订单；
     - `GET /design-orders/{orderId}/versions`：获取版本列表；
     - `GET /design-versions/{versionId}/pages`：获取页面列表；
     - `POST /design-pages/{pageId}/annotations`：新增批注；
     - `POST /design-pages/{pageId}/comments`：新增评论。

### 12.4 数据库建模思路（以 PostgreSQL 为例）

> 以下为示意结构，真正落地时可以根据实际字段细化。

1. `users` 表
   - `id` (PK)
   - `phone` (unique)
   - `display_name`
   - `title`（先生/女士等）
   - `created_at`, `updated_at`

2. `leads` 表
   - `id` (PK)
   - `user_id` (FK → users.id，**可空**：若允许匿名提交 lead 则先为空，后续可关联)
   - `project_city`
   - `project_type`
   - `project_area`
   - `project_budget_range`
   - `raw_payload` (JSONB) —— 完整的 `CollectLeadData`
   - `created_at`, `updated_at`

3. `projects` 表
   - `id` (PK)
   - `user_id` (FK → users.id)
   - `name`
   - `location_city`
   - `status`（planning / in_progress / completed 等）
   - `created_at`, `updated_at`

4. `contracts` 表
   - `id` (PK)
   - `project_id` (FK → projects.id)
   - `status`（pending / signed / canceled）
   - `signature_image_url`
   - `signature_text`
   - `signed_at`
   - `created_at`, `updated_at`

5. `financial_records` 表（支撑预算）
   - `id` (PK)
   - `project_id` (FK → projects.id)
   - `amount`
   - `currency`
   - `phase`（意向期 / 订购期 / 交付期 / 验收期 / 维保期）
   - `occurred_on`
   - `meta` JSONB（可选字段）
   - `created_at`, `updated_at`

6. `milestones` / `orders` / `design_*` 系列表  
   - 根据现有前端数据结构对应设计；
   - 对不稳定/易变字段，尽量使用 JSONB 存储，减少频繁改表。

### 12.5 认证与安全设计（简要）

1. 验证码发送：
   - 生成随机验证码（如 6 位数字），存入 Redis，TTL 约 5 分钟；
   - 控制单手机号/单 IP 频率，防止刷接口；
   - **实际把短信发到用户手机**需调用第三方短信服务（如阿里云、腾讯云等），按条或包月；验证码的生成、存储、过期、校验均为本系统实现。

2. 注册/登录：
   - 校验验证码是否匹配且未过期；
   - 创建或查找用户记录；
   - 颁发 JWT Token（可包含 userId、角色等基本信息）。

3. API 鉴权：
   - 使用中间件统一校验 `Authorization` 头；
   - 将解析出的 `currentUser` 写入请求上下文，供各模块使用。

4. 传输安全：
   - 强制 HTTPS；
   - 对敏感数据（手机号、签名）采用脱敏展示和访问控制（例如只有该项目参与者可查看）。

### 12.6 与当前前端的对接关系

- 前端已在以下位置写好接口调用逻辑：
  - `src/services/auth/*`：Auth 相关；
  - `src/services/leads/*`：Leads 相关；
  - `src/services/projects/*`：Projects Mock（未来可替换为真实接口）；
  - `src/services/designVoyage/*`：DeepEval 提交映射。
- 后端如果按本章接口形态实现：
  - 前端只需要调整少量配置（例如 `VITE_API_BASE_URL`）即可完成对接；
  - 如需改动字段或路径，可在对接阶段统一更新，并同步修改本技术文档。

### 12.7 小白说明

你可以把这整章理解为：

- 我们在规划「后台这栋楼应该怎么建」：分几层、每层干什么、哪里是总控室、哪里是档案室；
- 前端就是在楼外面办事的窗口，知道每个窗口的门牌号（URL）和办事流程（请求/响应结构）；
- 这份设计不是要求「立刻就要全部实现」，而是为了：
  - 帮你看清**完整系统的终极长相**；
  - 评估每一块的复杂度和优先级；
  - 给未来实现后端的同事一个清晰的蓝图。

---

## 如何反馈文档问题

如果你在阅读时发现：

- **某一段看不懂**：可以在那段旁边注明「这里看不懂」或「希望解释一下 xxx」；
- **某处和实际不符**：例如代码里已经改了但文档还写旧逻辑，可以注明「此处与代码不一致」；
- **缺了某块解释**：例如某个词没在名词解释里、某章没有小白说明，可以指出「希望补充 xxx 的解释」。

把上述反馈记在文档里或单独整理给维护文档的人，方便后续一起增补和修正，让文档越来越容易懂。
