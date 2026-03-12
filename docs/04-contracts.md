# D 合同签约阶段（Contracts）

> 对齐标准：`dsphr_workspace` 的鉴权/env 规范（接口前缀与 token 传递方式）  
> 本文目标：把合同模块的“数据结构、签署流程、存储方式、接口与落库表结构（B 粒度）”写清楚。

**小白说明**：本篇讲**合同**在系统里怎么存、怎么签。合同会经历“草稿 → 待签署 → 已签署 → 归档”等状态；用户同意条款并签名后，签名要保存到后端，并和某个**项目**绑定。调用合同相关接口时需要带登录 token（见 `03-register.md`）。

---

## 1. 模块是干嘛的（小白说明）

合同模块解决“用户是否同意条款、是否完成签名、合同处于什么状态”。现实里合同通常还会生成 PDF、需要保存签名图片、需要能回看历史版本。

---

## 2. 核心数据结构（B 粒度）

### 2.1 前端数据结构（现状：问卷里暂存）

- `contractAccepted?: boolean`：是否勾选同意
- `contractSignatureData?: string`：签名数据（如 base64 图片）
- `contractCustomText?: string`：自定义条款/补充文字

接后端后，签名应提交到后端存储，并与项目绑定。

### 2.2 接口层数据结构（建议）

统一前缀：`/api/dsphr/v1`

#### 2.2.1 获取当前项目合同概览

- `GET /api/dsphr/v1/contracts/current?project_id=xxx`
- Header：`Authorization: Bearer <token>`

响应（建议）：

```json
{
  "contract_id": "c_123",
  "project_id": "p_123",
  "version": 2,
  "status": "awaiting_signature",
  "title": "设计服务合同",
  "content_md": "### 合同条款 ...",
  "signed_at": null,
  "signature_url": null,
  "created_at": "2026-03-11T10:00:00Z"
}
```

#### 2.2.2 提交签署（含签名）

- `POST /api/dsphr/v1/contracts/{contract_id}/sign`
- Header：`Authorization: Bearer <token>`

请求（JSON）：

```json
{
  "accepted": true,
  "signature_image_base64": "data:image/png;base64,....",
  "custom_text": "补充条款：..."
}
```

响应（建议）：`{ "success": true, "status": "signed", "signed_at": "...", "signature_url": "..." }`

#### 2.2.3 下载/预览合同 PDF（可选）

- `GET /api/dsphr/v1/contracts/{contract_id}/pdf`
- 返回：PDF 文件流或可下载 URL

---

## 3. 签署流程（状态机）

- **draft**：草稿，未准备好让用户签
- **awaiting_signature**：待签署，用户可见并签名
- **signed**：已签署，合同生效
- **archived**：归档，历史版本留存

---

## 4. 后端落库与存储建议（B 粒度）

### 4.1 `contracts`（合同主表）

字段（建议）：`id`、`project_id`（外键 → projects.id）、`user_id`（签署人）、`version`、`status`、`title`、`content_md`、`custom_text`、`signature_object_key`、`signature_url`、`pdf_object_key`、`signed_at`、`created_at` / `updated_at`。

索引：`uniq_contracts_project_version (project_id, version)`、`idx_contracts_project_status (project_id, status)`、`idx_contracts_user_id (user_id)`。

状态枚举：`draft`、`awaiting_signature`、`signed`、`archived`。

### 4.2 合同资源存储（对象存储）

签名图片、合同 PDF 存对象存储（COS 等）；数据库只存 `object_key`、`url`。

---

## 5. 与其它阶段的关系

- **上游依赖**：`03-register`（合同签署需 token）；`07-projects`（合同必须属于某项目，`project_id`）。
- **下游影响**：`08-budget` 可能根据合同签署状态决定是否允许下单/付款（按业务规则）。
