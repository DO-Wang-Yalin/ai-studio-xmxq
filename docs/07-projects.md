# G 用户项目阶段（Projects）

> 对齐标准：`dsphr_workspace`（以 `project_id` 作为各业务模块挂载点；鉴权风格；env）  
> 本文目标：把“项目 Project”的数据结构、接口与 `project_id` 生命周期写清楚，作为预算、合同、设计反馈的共同上游。工作台首页与导航见 `05-user-home.md`。

**小白说明**：**项目**可以理解成一个装修案子的“文件夹”；预算、订单、合同、设计反馈都挂在这个文件夹下。必须先有**项目**（拿到 `project_id`），后面的 04、08、09 阶段才能用；项目列表需登录后从后端拉取。

---

## 1. 模块是干嘛的（小白说明）

项目就是“一个案子的容器”。用户登录后拉取“我的项目列表”，选一个项目进入工作台（见 `05-user-home.md`）。项目可能由线索转化而来（见 `02-leads-collection.md`），也可能由其它流程创建。

---

## 2. 核心数据结构（B 粒度）

### 2.1 前端数据结构：`Project`（现状）

来源：如 `src/services/projects/projectsApi.ts`

```ts
export interface Project {
  id: string
  name: string
  location?: string
  createdAt?: string
}
```

现状存储（前端 mock）：`localStorage` key `ai-studio:user-projects:v1`。接后端后，列表改为登录后从服务器拉取。

### 2.2 接口层数据结构（后端标准建议）

#### 2.2.1 获取项目列表

- `GET /api/dsphr/v1/projects`
- Header：`Authorization: Bearer <token>`

响应（建议）：

```json
{
  "projects": [
    {
      "project_id": "p_123",
      "name": "静安·云境公寓",
      "city": "上海",
      "status": "active",
      "created_at": "2026-03-11T10:00:00Z"
    }
  ]
}
```

#### 2.2.2 获取项目详情

- `GET /api/dsphr/v1/projects/{project_id}`

响应（建议）：

```json
{
  "project_id": "p_123",
  "name": "静安·云境公寓",
  "city": "上海",
  "lead_id": "lead_456",
  "owner_user_id": "user_1",
  "status": "active",
  "created_at": "2026-03-11T10:00:00Z"
}
```

### 2.3 后端领域数据结构（数据库表建议，B 粒度）

#### 2.3.1 `projects`（项目主表）

字段（建议）：`id`（即 `project_id`）、`owner_user_id`（外键 → users.id）、`lead_id`（外键 → leads.id，可空）、`name`、`city`、`status`、`created_at` / `updated_at`。

索引：`idx_projects_owner_user_id (owner_user_id)`、`idx_projects_status (status)`；可选 `uniq_projects_owner_name (owner_user_id, name)`。

状态枚举（建议）：`active`、`archived`、`deleted`（软删除）。

#### 2.3.2 `project_members`（项目成员，可选）

若未来支持“一个项目多人协作/共享”，可增加此表：`id`、`project_id`、`user_id`、`role`（owner/viewer/editor）、`created_at`；唯一索引 `(project_id, user_id)`。

---

## 3. 关键流程（拓扑位置）

- 登录（`03-register`）拿到 token → 调用 `GET /projects` 拉取项目列表。
- 线索转化（可选）：提交线索后后端可自动创建项目（见 `02-leads-collection.md`）。
- 一旦有 `project_id`，即可进入工作台（`05-user-home`），并访问预算（`08-budget`）、合同（`04-contracts`）、设计反馈（`09-design-feedback`）。

---

## 4. 与其它阶段的关系

- **上游依赖**：`03-register`（项目列表/详情需登录态）；`02-leads-collection`（项目可从 lead 转化，可选）。
- **下游提供**：`05-user-home`、`08-budget`、`04-contracts`、`09-design-feedback` 均依赖 `project_id`。
