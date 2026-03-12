# I 设计反馈阶段（Design Feedback）

> 现状来源：`src/pages/DesignFeedbackApp.tsx`（完整 mock 数据结构 + 交互）  
> 对齐标准：`dsphr_workspace` 的鉴权/env 规范（token、前缀）  
> 本文目标：把“设计版本/页面快照/批注/评论/锁定”这套反馈系统的数据结构、接口与后端落库表（B 粒度）写清楚。

**小白说明**：本篇讲“看设计图 → 在图上写意见 → 设计师改稿 → 出新版本 → 再确认”这一套**设计反馈**功能。系统里会有**版本**（V1/V2/V3）、**页面**（每版里的多页）、**批注/评论**（可点在图上或纯文字）。设计反馈的入口**不在工作台侧栏**，而在用户首页、订单页等处的按钮里（见 `05-user-home.md`）；窄屏下侧栏会隐藏，需从这些入口进入。

---

## 1. 模块是干嘛的（小白说明）

设计反馈模块就是“你看设计图 → 在某个位置写意见 → 设计师按意见改 → 出新版本 → 你再确认”的工具。

它解决三类信息：

- **版本**：V1/V2/V3…（每次改稿就是一个新版本）
- **页面**：一个版本里可能有多页（客厅、卧室、厨房…）
- **反馈**：你对某一页写的意见（可以指向图片上的点，也可以是文字描述）

---

## 2. 前端现状：入口与导航（非常关键）

来源：`src/pages/WorkbenchPage.tsx`

- Workbench 侧栏 `navItems` **不包含**“设计反馈”（见 `05-user-home.md`）
- 进入设计反馈的入口在：
  - 项目首页「当前待办：立即处理」
  - 功能入口卡片「设计反馈：进入反馈」
  - 订单页 `OrderManagementSection` 的入口
- 窄屏下侧栏隐藏（`hidden md:flex`），更容易出现“进了某个页回不去”的体验问题

---

## 3. 核心数据结构（B 粒度）

### 3.1 前端类型定义（现状）

来源：`src/pages/DesignFeedbackApp.tsx`

#### 3.1.1 基础枚举

- `TargetType`：`image_point`（点在图上）/ `text_description`（纯文字）
- `VersionStatus`：`draft`、`published`、`completed`、`archived`
- `LockAction`：`next`（继续下一步）、`satisfied`（满意）

#### 3.1.2 点位（百分比坐标）

```ts
export type Point = { x: number; y: number } // 0-100 的百分比
```

#### 3.1.3 设计注释（设计师标注）：`Annotation`

- id、targetType、point?、content、createdAt、updatedAt?

#### 3.1.4 客户评论：`Comment`

- id、targetType、point?、content、createdAt、updatedAt?

#### 3.1.5 页面锁定：`PageLock`

- isLocked、lockedAt?、action?（LockAction）

#### 3.1.6 页面快照：`PageSnapshot`

- snapshotId、versionId、pageId、order、title、text、imageUrl、annotations、comments、lock

#### 3.1.7 版本：`OrderVersion`

- id、versionNumber、name、status、createdAt、publishedAt?、basedOnVersionId?、pages

#### 3.1.8 设计反馈单：`DesignOrder`

- id、orderNumber、orderName、clientName、currentVersionId?、versions

---

## 4. 接口清单（建议，对齐 dsphr_workspace 风格）

统一前缀：`/api/dsphr/v1`；鉴权：`Authorization: Bearer <token>`（见 `03-register.md`）。设计反馈属于项目维度，接口均带 `project_id` 或在路径中体现。

### 4.1 获取项目的设计反馈概览

- `GET /api/dsphr/v1/design-feedback/orders?project_id=xxx`

响应（建议）：`{ "orders": [ { "design_order_id", "project_id", "order_no", "order_name", "client_name", "current_version_id", "status" } ] }`

### 4.2 获取某个反馈单的版本列表

- `GET /api/dsphr/v1/design-feedback/orders/{design_order_id}/versions`

响应：`{ "versions": [ { "version_id", "version_number", "name", "status", "created_at", "published_at", "based_on_version_id" } ] }`

### 4.3 获取某个版本的页面列表（轻量）

- `GET /api/dsphr/v1/design-feedback/versions/{version_id}/pages`

响应：`{ "pages": [ { "page_snapshot_id", "page_id", "order", "title", "text", "image_url", "lock" } ] }`

### 4.4 获取某页的反馈详情（含批注与评论）

- `GET /api/dsphr/v1/design-feedback/pages/{page_snapshot_id}`

响应：`{ "page_snapshot_id", "annotations", "comments" }`

### 4.5 新增客户评论

- `POST /api/dsphr/v1/design-feedback/pages/{page_snapshot_id}/comments`  
  body：`{ "target_type", "point?", "content" }`  
  响应：`{ "success": true, "comment_id": "c_1001" }`

### 4.6 新增设计批注

- `POST /api/dsphr/v1/design-feedback/pages/{page_snapshot_id}/annotations`  
  body：`{ "target_type", "content" }`

### 4.7 锁定页面

- `POST /api/dsphr/v1/design-feedback/pages/{page_snapshot_id}/lock`  
  body：`{ "action": "next" | "satisfied" }`  
  响应：`{ "success": true }`

---

## 5. 后端落库结构建议（B 粒度）

- **design_orders**：id、project_id、order_id（可空）、order_no、order_name、client_name、current_version_id、status、created_at/updated_at
- **design_versions**：id、design_order_id、version_number、name、status、based_on_version_id、created_at、published_at
- **design_page_snapshots**：id、version_id、page_id、order_index、title、text、image_object_key、image_url、lock_is_locked、lock_action、locked_at、created_at
- **design_annotations**：id、page_snapshot_id、author_user_id、target_type、point_x/point_y、content、created_at/updated_at
- **design_comments**：id、page_snapshot_id、author_user_id、target_type、point_x/point_y、content、created_at/updated_at

索引与约束见原 06 文档对应小节。

---

## 6. 关键流程（版本迭代）

发布版本 → 客户评论 → 设计师批注 → 锁定页面 → 出新版本（based_on_version_id）→ 再发布。

---

## 7. 与其它阶段的关系

- **上游依赖**：`03-register`（评论/锁定需用户身份）；`07-projects`（设计反馈必须挂到项目 project_id）；`08-budget` 可选关联订单（order_id/order_no），用于“某个订单的设计确认”）。
- **入口**：见 `05-user-home.md`（用户首页、订单页等入口）。
