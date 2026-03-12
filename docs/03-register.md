# C 注册阶段（Auth / Register）

> 对齐标准：`dsphr_workspace`（JWT + Bearer 头；env 五件套；接口风格）  
> 本文目标：把“短信验证码登录/注册 + token 鉴权”相关的数据结构与接口写清楚，作为所有需要登录阶段的上游依赖。  
> **读文档时遇到不认识的词，先看下面「1.1 术语表」**。

**小白说明**：本篇讲两件事——**怎么登录/注册**（手机号 + 验证码），以及**登录后拿到的 token 怎么用**（访问预算、合同等都要带上它）。风格测评见 `01-style-eval.md`，线索采集见 `02-leads-collection.md`。

---

## 1. 模块是干嘛的（小白说明）

注册/认证模块解决两件事：

1. **你是谁**：用户用手机号 + 验证码登录/注册。
2. **你有没有权限**：登录成功后给你一个 **token**（通行证），之后每次请求都带上它，后端才允许你看预算、合同、设计反馈等。

---

## 1.1 术语表（看不懂的词先来这里查）

| 词 | 人话解释 |
|----|----------|
| **string / 字符串** | 一段文字。如手机号 `"13800138000"`。 |
| **接口 / API** | 前端向服务器“要数据”或“交数据”的入口地址和规矩。 |
| **请求 / 响应** | 请求：前端发给后端的数据；响应：后端返回的数据。 |
| **POST** | 一种“提交数据”的请求方式。 |
| **Header / 请求头** | 请求里除正文外的附加信息，如 `Authorization: Bearer xxx`。 |
| **鉴权** | 检查“你是不是你说的那个人”，通过 token 判断。 |
| **token / access_token** | 登录成功后的一串字符，相当于临时通行证。 |
| **Bearer** | 带 token 的写法：`Authorization: Bearer <你的 token>`。 |
| **JWT** | token 的常见格式，内含用户 ID、过期时间等。 |
| **payload** | JWT 里藏着的部分内容（如 subject_id、exp）。 |
| **expires_in** | token 多少秒后过期。 |
| **主键 / 外键** | 主键：唯一标识一行；外键：指向另一张表的某一行。 |
| **enum / 枚举** | 取值只能是事先规定的几个选项之一。 |
| **可空 / 不为空** | 可空：可不填；不为空：必须填。 |
| **索引** | 让数据库按某字段查得更快。 |
| **JSON / jsonb** | 带结构的文本，数据库可存键值对、数组等。 |
| **哈希 / 加盐** | 哈希：把内容变成不可逆的固定长度串；加盐：混入秘密再哈希，更安全。 |
| **TTL** | 存活时间，如 Redis key 多少秒后过期。 |
| **频控** | 限制同一手机号/IP 在短时间内发验证码的次数。 |
| **HTTP 状态码** | 200 成功，401 未授权，429 太频繁。 |

---

## 2. 统一约定（必须遵守）

### 2.1 鉴权头（Bearer token）

- **要带什么**：Header 里写 `Authorization: Bearer <access_token>`
- **什么时候带**：除“发送验证码”和“短信验证码登录/注册”外，其他需要身份的接口都要带。不带或带错可返回 401。

### 2.2 与前端现状的对照

- 发验证码：`POST ${AUTH_BASE}/auth/sms/send`
- 短信验证码登录/注册（统一接口）：`POST ${AUTH_BASE}/auth/sms/login`
- `AUTH_BASE` = 环境变量 `VITE_API_BASE_URL`（未配则用 `https://dreamone.cloud/api`）+ `/dsphr/v1`

### 2.3 实现约定

- **HTTP 状态码**：成功用 200；业务失败也可 200，响应体 `success: false`。未带或无效 token 可返回 401。频控可返回 429。
- **错误响应体**：`{ "success": false, "message": "可读文案" }`，可选 `code`。
- **手机号格式**：只接受大陆 11 位、1 开头，正则 `/^1\d{10}$/`。
- **JWT**：建议与 dsphr_workspace 对齐；payload 含 `subject_type`、`subject_id`、`iat`、`exp`；算法 HS256；过期时间由 `JWT_EXPIRE_SECONDS` 配置（如 30 天）。

### 2.4 环境变量

**后端**：`JWT_SECRET_KEY`（必填）、`JWT_EXPIRE_SECONDS`、数据库与短信服务相关变量。  
**前端**：`VITE_API_BASE_URL`。

---

## 3. 核心数据结构

### 3.1 发送验证码

- **入参**：`phone: string`
- **返回**：`{ success: boolean, message?: string }`

### 3.2 短信验证码登录/注册（统一接口）

- **入参**：`phone: string`、`code: string`。注册为干净注册，不包含风格测评、线索等；风格测评见 `01-style-eval.md`，线索见 `02-leads-collection.md`。
- **返回**：成功时 `success: true`，并带 `access_token`、`token_type`、`expires_in`；失败时 `success: false` + `message`。

```ts
export interface AuthResult {
  success: boolean
  message?: string
  access_token?: string
  token_type?: string
  expires_in?: number
}
```

---

## 4. 接口（请求/响应）

### 4.1 发送验证码

- **接口**：`POST /api/dsphr/auth/sms/send` 或 `POST /api/dsphr/v1/auth/sms/send`（与前端拼路一致即可）

**请求**：`{ "phone": "13800138000" }`

**响应**：`{ "success": true, "message": "ok" }`；失败：`{ "success": false, "message": "手机号格式不正确" }`

**实现要点**：验证码生成、存哈希不存明文、过期时间（建议 5 分钟）、校验、频控（如同一手机 60 秒内只能发一次）、新发码则旧码作废。

### 4.2 短信验证码登录/注册（统一接口）

- **接口**：`POST /api/dsphr/auth/sms/login` 或 `POST ${AUTH_BASE}/auth/sms/login`

**请求**：`{ "phone": "13800138000", "code": "123456" }`

**响应**（成功）：`{ "success": true, "access_token": "jwt-...", "token_type": "Bearer", "expires_in": 2592000 }`

失败：`success: false` + `message`。

---

## 5. 后端领域数据结构（数据库表）

### 5.1 `users`（用户表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | bigint | 主键、自增 | 用户唯一 ID，JWT 中 subject_id 即此值 |
| `phone` | varchar(11) | 非空、唯一 | 大陆 11 位手机号 |
| `created_at` / `updated_at` | datetime | 非空 | 创建/更新时间 |
| `last_login_at` | datetime | 可空 | 最近登录时间，可选 |

索引：唯一索引 `uniq_users_phone (phone)`。

### 5.2 `sms_codes`（短信验证码表，可选）

若用 Redis 存验证码则可不要此表。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | bigint | 主键、自增 | 主键 |
| `phone` | varchar(11) | 非空 | 手机号 |
| `code_hash` | varchar(64) | 非空 | 验证码哈希（不存明文） |
| `sent_at` | datetime | 非空 | 发送时间 |
| `expires_at` | datetime | 非空 | 过期时间，建议 sent_at + 5 分钟 |
| `status` | enum('sent','used','expired') | 非空 | 默认 sent |

status：校验通过设为 `used`；新发码时该手机号下旧 `sent` 改为 `expired`。  
索引：`idx_sms_codes_phone_expires_at (phone, expires_at)`。

---

## 6. 流程与状态机

1. **获取验证码**：前端发手机号，后端生成验证码、存哈希、设过期、发短信。
2. **输入验证码并提交**：前端发手机号+验证码；后端校验通过则：手机号已存在视为登录，不存在则先创建用户；再返回 token。
3. **后续访问**：前端存 token，请求头带 `Authorization: Bearer <token>`。

---

## 7. 常见错误与边界

- 手机号格式不对：`success: false` + message
- 验证码错误 / 过期：`success: false` + message
- 频控：`success: false` 或 429 + message（如「发送过于频繁，请稍后再试」）
