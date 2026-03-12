# 基准A 风格测评阶段（Style Eval）

> 本文档说明风格测评相关的数据结构与接口。认证（登录/注册）不包含风格测评信息，见 `03-register.md`；用户可在**匿名**做完风格测评后再登录/注册，或**登录后**再上传/绑定测评结果。

**小白说明**：风格测评是用户答题后得到的一份“风格画像”（如理性构建者、包豪斯、硬装/软装建议等）。可以匿名做；**不建议仅存前端**（用户若不登录则数据会永久丢失），应调用后端接口将结果存入 MySQL，获得 `style_eval_session_id`。用户登录/注册后，可通过本模块的绑定接口把该结果绑定到账号上，在工作台等场景使用。

---

## 1. 模块是干嘛的

- **匿名测评**：用户未登录时完成测评。**不建议仅存前端**（用户若不登录会永久丢失），应提供接口将结果存入后端 MySQL（见下文「匿名测评结果保存」），以 `style_eval_session_id` 标识，便于用户登录后绑定到账号。
- **绑定到账号**：用户登录后，调用“导入/绑定”接口，把已有的一份风格测评结果（或通过 `style_eval_session_id` 从 MySQL 取回）写入该用户下，供工作台等使用。
- **依赖**：绑定接口需要用户已登录，请求头带 `Authorization: Bearer <token>`（见 `03-register.md`）。

---

## 2. 核心数据结构

### 2.1 风格画像对象（接口/前端用）

请求或响应里传递的 `style_profile` 建议包含以下字段（具体以产品/前端约定为准）：


| 字段                 | 类型     | 说明                                                   |
| ------------------ | ------ | ---------------------------------------------------- |
| `style_id`         | string | 风格色系基准id ，如 `DS14-MP01`                                     |
| `style_name`       | string | 风格色系人设名称，如「理性构建者」                                        |
| `core_label`       | string | 设计风格，如「DS14-包豪斯风格」                                          |
| `color_gene`       | string | 空间色系，如「MP01-浅色系（Light Tones）」                                          |
| `quote`            | string | 风格说明，如「 白纸上的几何实验。 空间基底是干净的白或浅灰。通过红、黄、蓝三原色的软装（地毯、单椅、画）来划分视觉重心。家具有大量的镀铬钢管和皮革，呈现出一种工业时代的理性与艺术美。」                                             |
| `suggestions_hard` | string | 硬装，如「 白色墙面、浅灰自流平/水磨石地面。」                                                  |
| `suggestions_soft` | string | 软装，如「 瓦西里椅、巴塞罗那椅、红黄蓝几何地毯、球形玻璃灯。」                                                  |
| `raw_inputs`       | object | 原始答题与分数，便于回溯（如 `answers`、`textAnswers`、`userScores`） |
| `created_at`       | string | ISO8601 时间，如 `2026-03-11T10:00:00Z`                  |


示例（请求/响应体中的 JSON）：

```json
{
  "style_id": "DS14-MP01",
  "style_name": "理性构建者",
  "core_label": "DS14-包豪斯风格",
  "color_gene": "MP01-浅色系（Light Tones）",
  "quote": "白纸上的几何实验。空间基底是干净的白或浅灰。通过红、黄、蓝三原色的软装（地毯、单椅、画）来划分视觉重心。家具有大量的镀铬钢管和皮革，呈现出一种工业时代的理性与艺术美。",
  "suggestions_hard": "白色墙面、浅灰自流平/水磨石地面。",
  "suggestions_soft": "瓦西里椅、巴塞罗那椅、红黄蓝几何地毯、球形玻璃灯。",
  "raw_inputs": {
    "answers": { "q1": ["A"] },
    "textAnswers": {},
    "userScores": [5, 1, 1, 2, 5, 5, 2]
  },
  "created_at": "2026-03-11T10:00:00Z"
}
```

### 2.1.1 测评结果页（组成结构）

**测评结果页**：用户完成风格测评答题后看到的展示页，用于呈现本次测评的风格画像。数据来源为上述 `style_profile`（或从接口/临时会话取回的同结构数据）。

**建议组成结构**（区块与 `style_profile` 字段对应关系）：

| 区块         | 说明           | 对应字段 |
| ------------ | -------------- | -------- |
| 风格名称/人设 | 主标题，如「理性构建者」 | `style_name` |
| 设计风格     | 副标题/标签，如「DS14-包豪斯风格」 | `core_label` |
| 空间色系     | 色系标签，如「MP01-浅色系（Light Tones）」 | `color_gene` |
| 风格说明     | 一段话描述风格氛围与特点 | `quote` |
| 硬装         | 硬装建议文案   | `suggestions_hard` |
| 软装         | 软装建议文案   | `suggestions_soft` |

**可选**：结果页底部可提供「保存结果」/「留下信息注册后绑定到账号」等操作入口；匿名用户可引导登录/注册后再绑定（见 §3.1、§3.3）。`style_id`、`raw_inputs`、`created_at` 一般用于后端或二次展示，可不单独占主视觉区块。

### 2.2 后端领域数据结构（数据库表建议）

#### `user_style_profiles`（用户风格画像表）

- **用途**：用户绑定到账号的风格测评结果，在工作台等场景展示（如理性构建者、包豪斯、硬装/软装建议等）。

字段（建议）：

- `id`：bigint/uuid，主键（可对外暴露为 `style_profile_id`）
- `user_id`：外键 → `users.id`（必填）
- `style_id`：varchar（风格色系基准 id，如 `DS14-MP01`）
- `style_name`：varchar（风格色系人设名称，如「理性构建者」）
- `core_label`：varchar（设计风格，如「DS14-包豪斯风格」）
- `color_gene`：varchar（空间色系，如「MP01-浅色系（Light Tones）」）
- `quote`：text，不为空（风格说明）
- `suggestions_hard`：text，不为空（硬装）
- `suggestions_soft`：text，不为空（软装）
- `raw_inputs_json`：json/jsonb，可空（保存原始答题与分数）
- `status`：enum（`active` / `archived`）
- `created_at` / `updated_at`：datetime

索引与约束：

- 索引：`idx_user_style_profiles_user_id (user_id)`
- 可选：每个用户仅保留一条 `active`（部分唯一索引或业务逻辑保证）

#### `style_eval_sessions`（匿名测评会话表，MySQL）

- **用途**：用户未登录时完成测评后，将结果临时存入此表，键为 `style_eval_session_id`；用户登录后可通过绑定接口取回并写入 `user_style_profiles`。不建议仅存前端，以免用户未登录时数据永久丢失。

字段（建议）：

- `id`：bigint/uuid，主键
- `session_id`：varchar，对外暴露为 `style_eval_session_id`，唯一索引，用于取回/绑定
- `style_id` / `style_name` / `core_label` / `color_gene` / `quote` / `suggestions_hard` / `suggestions_soft`：与风格画像一致
- `raw_inputs_json`：json/jsonb，可空
- `expires_at`：datetime，过期时间（建议创建后 24 小时内），便于定时清理
- `created_at`：datetime

索引：`idx_style_eval_sessions_session_id (session_id)`，`idx_style_eval_sessions_expires_at (expires_at)`（清理用）。

---

## 3. 接口

### 3.1 上传/绑定风格测评结果（已登录用户）

- **接口是干啥的**：用户已登录，有一份风格测评结果（来自前端刚完成或本地 JSON 文件），希望绑定到当前账号；后端将该结果写入 `user_style_profiles`，并关联当前用户。
- **建议接口**：`POST /api/dsphr/v1/style-eval/import`（或与项目统一前缀一致，如 `POST ${BASE}/style-eval/import`）
- **鉴权**：必须在请求头带 `Authorization: Bearer <token>`，否则 401。

**请求**：

```json
{
  "style_profile": {
    "style_id": "DS14-MP01",
    "style_name": "理性构建者",
    "core_label": "DS14-包豪斯风格",
    "color_gene": "MP01-浅色系（Light Tones）",
    "quote": "白纸上的几何实验。空间基底是干净的白或浅灰。通过红、黄、蓝三原色的软装（地毯、单椅、画）来划分视觉重心。家具有大量的镀铬钢管和皮革，呈现出一种工业时代的理性与艺术美。",
    "suggestions_hard": "白色墙面、浅灰自流平/水磨石地面。",
    "suggestions_soft": "瓦西里椅、巴塞罗那椅、红黄蓝几何地毯、球形玻璃灯。",
    "raw_inputs": {
      "answers": { "q1": ["A"] },
      "textAnswers": {},
      "userScores": [5, 1, 1, 2, 5, 5, 2]
    },
    "created_at": "2026-03-11T10:00:00Z"
  }
}
```

**响应**（建议）：

成功：

```json
{
  "success": true,
  "style_profile_id": "sp_123"
}
```

失败：`success: false` + `message`（如「未登录」「参数无效」等），未授权时可返回 401。

### 3.2 匿名测评结果保存（未登录，存 MySQL）

- **接口是干啥的**：用户**未登录**时完成风格测评后，调用本接口将结果存入 MySQL 表 `style_eval_sessions`，避免仅存前端导致用户未登录时数据永久丢失。后端生成并返回 `style_eval_session_id`，供用户登录后通过绑定接口取回并绑定到账号。
- **建议接口**：`POST /api/dsphr/v1/style-eval/session`（或与项目统一前缀一致）
- **鉴权**：无需登录，不校验 `Authorization`。

**请求**：Body 为 JSON，包含 `style_profile`（结构同 3.1）。

**响应**（建议）：

成功：

```json
{
  "success": true,
  "style_eval_session_id": "ses_abc123"
}
```

失败：`success: false` + `message`（如「参数无效」等）。

- **过期**：写入时设置 `expires_at`（建议 24 小时内），由定时任务或业务逻辑清理过期记录。

### 3.3 通过 session 绑定（已登录，可选）

- 绑定接口（3.1）除支持请求体直接传 `style_profile` 外，可同时支持传 `style_eval_session_id`：后端从 `style_eval_sessions` 按 `session_id` 取回 `style_profile`，写入当前用户的 `user_style_profiles`，并可选删除或标记该会话记录。

---

## 4. 与其它阶段的关系

- **注册（03-register）**：仅含手机号 + 短信验证码，不包含 `style_profile` 或 `style_eval_session_id`，保持注册干净。
- **风格测评**：独立于登录/注册；用户可先匿名测评再登录，或先登录再在本模块上传/绑定结果。绑定接口依赖 03-register 的 JWT 鉴权。

---

## 5. 常见错误与边界

- **匿名上传结果（§3.2）**：匿名测评结果保存接口无需鉴权，不校验 `Authorization`；用户未登录也可调用。
- **未带 token 或 token 无效**：绑定接口（§3.1）等需登录的接口，未带 token 或 token 无效时返回 401。
- **请求体缺少 `style_profile` 或必填字段不完整**：返回 `success: false` + 说明文案。
- **当前用户已有一条 active 风格画像**：由产品决定是覆盖、归档后新增，还是拒绝并提示；文档不强制，实现时统一即可。

