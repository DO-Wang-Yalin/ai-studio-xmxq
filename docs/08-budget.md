# H 项目预算阶段（Budget & Orders）

> 对齐标准：`dsphr_workspace/README.md` 中已明确的“全案预算控制 API（用户端）”  
> 本文目标：写清楚预算/订单模块的核心数据结构、接口、状态流转，并把前端 `BudgetSankeyData` 与后端预算方案/订单数据模型对齐。

**小白说明**：本篇讲**预算**（项目总共要花多少钱、分在哪些阶段）和**订单**（具体买了哪些服务/工程项、处于什么阶段）。页面上看到的“桑基图”就是把入金、总预算、里程碑、订单串起来展示。后端金额一般用“分”存，前端用“万元”展示，需做单位转换。依赖 `03-register`（token）、`07-projects`（project_id）。

---

## 1. 模块是干嘛的（小白说明）

预算模块回答“这个项目总共要花多少钱、分在哪些阶段、每个阶段有哪些订单”。订单模块回答“具体买了/签了哪些服务或工程项，它们处于什么阶段”。桑基图把**入金**、**总预算**、**里程碑**、**订单**串起来，让用户一眼看懂“钱与进度”。

---

## 2. 核心数据结构（B 粒度）

### 2.1 前端数据结构：`BudgetSankeyData`

来源：如 `src/components/BudgetSankey.tsx`

- `StatusGroup`：`'意向期' | '订购期' | '交付期' | '验收期' | '维保期'`
- `IncomeEntry`：id、date、displayDate、amount（**万元**）、status、isToday、isFuture、isUnpaid
- `Milestone`：id、name、budgetMin、budgetMax、dueDate
- `Order`：id、number、title、status、milestoneId、budget（万元）
- `BudgetSankeyData`：incomeEntries、milestones、orders、totalBudget

### 2.2 接口数据结构（对齐 dsphr_workspace）

统一前缀：`/api/dsphr/v1`；鉴权：`Authorization: Bearer <token>`（见 `03-register.md`）

- **获取预算项目列表**：`GET /budget/projects`  
  响应：`{ "projects": [ { "project_id", "name", "status" } ] }`

- **获取当前预算方案**：`GET /budget/plans/current?project_id=xxx`  
  响应：plan_id、project_id、version、status、total_budget_cents、allocations_json、created_at

- **生成新预算版本**：`POST /budget/plans/generate`，body `{ "project_id": "p_123" }`

- **提交反馈并模拟重算**：`POST /budget/plans/{plan_id}/feedback`，body `{ "feedback_text": "..." }`  
  响应：`{ "success": true, "new_plan_id": "plan_124" }`

- **确认方案生效**：`POST /budget/plans/{plan_id}/confirm`，响应 `{ "success": true }`

---

## 3. 映射：后端预算方案 → 前端 BudgetSankeyData

- 后端建议用 `cents`（分）或 `yuan`（元）存储与传输；前端桑基图用“万元”展示：`w = cents / 100 / 10000`。
- `budget_plan.total_budget_cents` → `BudgetSankeyData.totalBudget`
- `budget_plan.allocations_json.milestones[]` → `BudgetSankeyData.milestones[]`
- 项目订单列表 → `BudgetSankeyData.orders[]`
- 项目入金流水 → `BudgetSankeyData.incomeEntries[]`

---

## 4. 后端落库结构建议（B 粒度）

- **budget_plans**：id、project_id、version、status（draft/confirmed/archived）、total_budget_cents、allocations_json、created_at/updated_at。索引：project_id+version、project_id+status。
- **budget_plan_feedbacks**：id、plan_id、project_id、user_id、feedback_text、created_at。
- **orders**：id、project_id、order_no、title、status、milestone_id、amount_cents、created_at/updated_at。
- **payments**（可选）：id、project_id、paid_at、amount_cents、status_group、channel、created_at。

---

## 5. 关键流程（状态机）

拉取项目列表 → 获取当前预算方案 → 可生成新版本 → 可提交反馈重算 → 确认方案生效。

---

## 6. 与其它阶段的关系

- **上游依赖**：`03-register`（预算接口需 JWT）；`07-projects`（必须有 project_id）。
- **下游影响**：`04-contracts` 可能根据合同签署状态决定是否允许下单/付款；`09-design-feedback` 的设计变更可能触发预算调整（按业务规则）。
