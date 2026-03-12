# B 线索采集阶段（Leads Collection）

> 对齐标准：`dsphr_workspace`（接口前缀、env、鉴权风格）  
> 本文目标：把**线索采集**阶段的数据结构与接口写清楚。**线索 = 用户在线索采集界面填写的那份意向信息**（姓名、城市、项目名、面积、预算等）；不称“注册”，注册见 `03-register.md`。  
> 术语（接口、token、主键等）可先看《03 注册》1.1 术语表。

**小白说明**：**线索采集**是用户填写意向信息的过程——谁、项目叫什么、在哪、多大、预算大概多少。这份信息一提交就形成一条线索，后端存起来，以后可转成“项目”。**本阶段不包含户型图、参考图**；附件在后续流程（如转项目后）再上传。**深度需求测评**在签完合同之后，由 `06-deep-eval.md` 约定，不属于本阶段。

---

## 1. 模块是干嘛的（小白说明）

**用人话说**：**线索 = 用户在线索采集时填的那份信息**。用户填写：我是谁（姓名、称呼、城市、手机号等）、项目叫什么、在哪、多大、预算大概多少。这一份在线索采集时提交的表单信息，就是一条线索（lead）。

你可以把“线索”想成：**用户留下的“意向单”**——还没正式签单，但我们已经知道他是谁、想做什么项目。这份单子要能：

- **被后端保存下来**：存进数据库，供跟进或分配。
- **关联到该用户**：提交时若已登录则挂在该用户下（或与手机号关联）。
- **将来可以转化为“项目”**：线索确认成单后变为“项目 project”，后续预算、合同、设计反馈挂在该项目下。户型图、参考图在后续流程再上传，不在线索采集时收集。

### 线索采集 vs 注册 vs 深度测评

- **线索采集（本文档）**：用户填写的意向信息（姓名、项目、面积、预算等），提交后落库为 lead。不称“注册”。
- **注册（03-register）**：短信验证码登录/注册，拿到 token。
- **深度需求测评（06-deep-eval）**：签完合同之后做的深度问卷，用于需求书等，不做成线索。

---

## 2. 核心数据结构（B 粒度）

### 2.1 前端数据结构：表单数据（线索采集时填的信息）

- **来源**：如 `src/types.ts` 中的类型定义。  
- **注意**：此处“表单数据”表示线索采集流程中收集的那一整套结构，**不是**浏览器自带的 `FormData`。

字段（节选）：

- **用户信息**：`userName`、`userTitle`、`userAgeRange`、`userIndustry`、`userCity`、`userPhone` 等
- **项目信息**：`projectName`、`projectLocation`、`projectType`、`projectArea` 等
- **预算/偏好**：`budgetStandard`、`budgetSubStandard` 等；若本阶段也收集空间偏好等，可有 `favoriteSpace[]`、`storageFocus[]` 等

提交时，前端将上述内容整理成后端规定的格式（见 2.2）作为线索发出。

### 2.2 接口层数据结构：`CollectLeadData`（提交线索时发给后端）

- **来源**：如 `src/services/leads/leadsApi.ts`。  
- 后端收**蛇形命名**字段（如 `user_name`、`project_area`），前端在提交前做一次映射（见第 3 节）。

```ts
export interface ProjectLocation {
  latitude: number
  longitude: number
}

export interface CollectLeadData {
  user_name: string
  user_city: string
  user_phone: string
  user_title: string
  user_age_range: string
  user_industry: string
  project_name: string
  project_city: string
  project_type: string
  project_area: number        // 数字，单位平方米
  project_budget_range: string
  project_location?: ProjectLocation
  extra?: Record<string, unknown>
}
```

- `project_area`：**number**（平方米），前端若为字符串（如 `"120"`）需在提交前转为数字。
- `extra`：扩展包，暂未单独建列的题目可放进此处（后端用 JSONB 存）。

### 2.3 提交形态（仅表单，无户型图/参考图）

- 线索采集阶段只提交 **JSON**（即 `CollectLeadData`），不传图片文件。  
- 请求体：`Content-Type: application/json`，无需 multipart。

---

## 3. 字段映射：前端表单 → `CollectLeadData`

建议映射（在 service 层完成）：

- `userName` → `user_name`
- `userCity` → `user_city`
- `userPhone` → `user_phone`（去掉分隔符）
- `userTitle` → `user_title`
- `userAgeRange` → `user_age_range`
- `userIndustry` → `user_industry`
- `projectName` → `project_name`
- `projectLocation`（文本）→ `project_city` 或 `extra.project_location_text`
- `projectType` → `project_type`
- `projectArea`（string）→ `project_area`（number）
- `budgetStandard` / `budgetSubStandard` → `project_budget_range` 或 extra

### 3.2 extra 结构（示例）

未单独建列的答案可放入 `extra`，后端用 JSONB 存，例如：

```json
{
  "houseType": "一梯一户",
  "houseCondition": "毛坯",
  "budgetStandard": "舒适",
  "budgetSubStandard": "偏品质",
  "favoriteSpace": ["客厅", "厨房"],
  "storageFocus": ["玄关", "衣帽间"],
  "smartHome": "需要",
  "otherNeeds": "有老人同住"
}
```

---

## 4. 接口清单（对齐 dsphr_workspace）

### 4.1 获取下拉选项：`GET /api/dsphr/v1/leads/options`

- **用途**：线索采集表单中的单选题/下拉题选项（称呼、项目类型、预算范围等）由后端返回。

**响应**（建议）：

```ts
export interface LeadsOptionsResponse {
  user_title: string[]
  user_age_range: string[]
  user_industry: string[]
  project_type: string[]
  project_budget_range: string[]
  space_function: string[]
}
```

### 4.2 提交线索：`POST /api/dsphr/v1/leads`

- **用途**：用户在线索采集流程中填完信息后点“提交”，前端将 `CollectLeadData` 以 JSON 发至此接口。后端保存线索并返回是否成功及线索 id。**不包含户型图、参考图**。

**请求**：JSON body，即 `CollectLeadData`。

**响应**（成功时）：

```ts
export interface CollectLeadResponse {
  success: boolean
  message: string
  id: number | null   // 新建的线索 id
}
```

**失败时**：建议响应体带 `detail` 等字段说明错误原因。

---

## 5. 后端落库结构建议（B 粒度）

### 5.1 `leads`（线索主表）

- **用途**：线索采集提交一次即插入一行。含用户信息、项目信息、预算、extra、状态。不存图片。

字段（建议）：

- `id`：主键
- `user_id`：可空；若已登录则填对应用户 id
- `user_name`、`user_city`、`user_phone`、`user_title`、`user_age_range`、`user_industry`：varchar
- `project_name`、`project_city`、`project_type`、`project_budget_range`：varchar
- `project_area`：int（平方米）
- `project_location_lat`、`project_location_lng`：decimal，可空
- `extra_json`：json/jsonb，可空
- `status`：enum（见下）
- `created_at`、`updated_at`

状态枚举（建议）：`new`（刚提交）、`contacting`（跟进中）、`converted`（已转项目）、`closed`（关闭）。

索引建议：`idx_leads_user_phone`、`idx_leads_user_id_created_at`、`idx_leads_status_created_at`。

### 5.2 `lead_attachments`（线索附件表，预留）

- **用途**：本阶段不提交户型图/参考图；本表预留，用于后续流程（如转项目后）补传的户型图、参考图等。文件存对象存储，本表只记 lead_id、文件名、mime_type、object_key、url 等。

---

## 6. 与其它阶段的关系

- **上游**：可与 **03-register** 配合——线索采集与注册的先后顺序由产品定；若带 `Authorization: Bearer <token>`，后端可将线索的 `user_id` 填上。
- **下游**：**07-projects**：线索确认成单后转化为项目（生成 `project_id`）。深度需求测评见 **06-deep-eval**，不写入线索表。
