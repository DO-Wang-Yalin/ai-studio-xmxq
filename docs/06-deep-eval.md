# F 深度测评阶段（Deep Eval / Requirements）

> 对齐标准：`dsphr_workspace`（接口前缀、鉴权风格）  
> 本文目标：把**深度需求测评**的数据来源、提交方式，以及**需求书（RequirementsDoc）**的字段来源与映射写清楚。线索采集见 `02-leads-collection.md`，项目与工作台见 `07-projects.md`、`05-user-home.md`。

**小白说明**：**深度测评**是用户**签完合同之后**（或登录后进入项目流程）做的那一套深度需求题（面积、预算、户型、空间偏好、智能家居等）。其结果用于**需求书**、工作台展示，**不做成线索**。需求书不是凭空生成的，而是“深度需求测评（DeepEval）+ 可选长问卷扩展字段 extra”的结构化汇总。

---

## 1. 模块是干嘛的（小白说明）

- **深度需求测评（DeepEval）**：登录后提交的那条链路（如 `DeepEvalFormContext` / `LeadsService`），对应后端 `CollectLeadData` 核心字段 + `extra`。产品上项目类型、实际面积、预算范围**仅来自 DeepEval（DE-1）**，不再在长问卷里重复收。
- **长问卷（Q2-0~Q2-21）**：更多字段在前端，需求书里很多“空间偏好/生活方式/设备偏好”来自这部分；建议后端落库进 `CollectLeadData.extra_json`（JSONB）或单独 `requirements` 表再逐步规范化。
- **需求书**：把上述信息整理成一份可阅读、可决策的总结，在工作台「项目需求书」中展示。

---

## 2. 数据来源分层（先搞清楚“数据从哪来”）

- **DeepEval（精简测评）**：真实提交后端的 leads 相关数据——`CollectLeadData` 的 `project_type`、`project_area`、`project_budget_range`、`user_*` 等 + `extra`。
- **长问卷（FormData / Q2-0~Q2-21）**：空间偏好、生活方式、设备偏好等；设计上 Q2-2（项目类型/面积/房型/现状）、Q2-3（预算范围）已取消，**项目类型、实际面积、预算范围仅来自 DeepEval（DE-1）**。
- **风格人设**：来自风格测评结果（见 `01-style-eval.md`），若已绑定则需求书可展示 `user_style_profiles.style_name` / `core_label`。

---

## 3. 需求书区块 → 字段来源（映射清单，B 粒度）

需求书各区块与数据来源对应关系（需求书区块 ← 字段来源）：

- **A. 基本信息（项目城市/类型/收房状态/面积/预算/周期）**  
  - 项目城市 ← `CollectLeadData.project_city` 或 `extra.project_city_text`（**DE-1 最顶部**）  
  - 项目类型 ← `CollectLeadData.project_type`（**仅 DeepEval DE-1**；Q2-2 已取消）  
  - 收房状态 ← `extra.handover_status`（**仅 DeepEval DE-1**；选项：毛坯、精装、旧房、土地）  
  - 实际面积 ← `CollectLeadData.project_area`（**仅 DeepEval DE-1**；Q2-2 已取消）  
  - 预算范围 ← `CollectLeadData.project_budget_range`（**仅 DeepEval DE-1**；Q2-3 已取消）  
  - 入住周期 ← `extra.timeline`（来自问卷 Q2-8）

- **B. 成员画像与“风格人设”**  
  - 业主姓名/称呼 ← `CollectLeadData.user_name`、`user_title`  
  - 年龄段/行业 ← `CollectLeadData.user_age_range`、`user_industry`  
  - 风格人设（如 Workbench 里 stylePersona）← `user_style_profiles.style_name` / `core_label`（若风格测评已绑定；否则为空）

- **C. 房屋现状（采光/通风/层高/噪音）**  
  - 采光 ← `extra.lighting`；通风 ← `extra.ventilation`；层高 ← `extra.ceilingHeight`；噪音 ← `extra.noise`

- **D. 空间偏好总结（客厅/餐厅/厨房/卫浴等）**  
  - 客厅习惯/特征 ← `extra.livingRoomActivity`、`extra.livingRoomFeature[]`（Q2-13）  
  - 餐厅就餐人数 ← `extra.diningCount`、`extra.festivalDiningCount`（Q2-12）  
  - 烹饪习惯/第二厨房 ← `extra.cookingHabit`、`extra.secondKitchen`（Q2-11）  
  - 干湿分离 ← `extra.dryWetSeparation`（Q2-15）  
  - 储物重点 ← `extra.storageFocus[]`（Q2-14）  
  - 风水禁忌 ← `extra.fengshui`（Q2-17）

- **E. 智能家居/设备/舒适系统**  
  - 智能家居倾向 ← `extra.smartHome`、`extra.smartHomeOptions[]`（Q2-18）  
  - 舒适系统 ← `extra.comfortSystems[]`（Q2-19）  
  - 特殊电器 ← `extra.devices[]`（Q2-20）

---

## 4. 需求书“每条信息”完整对照表（B 粒度）

设计约定：Q2-2、Q2-3 已取消；项目类型、实际面积、预算范围**仅来自 DeepEval（DE-1）**。下表为需求书展示内容与「旅程/题目」及「后端字段」的对应，便于实现与后端对接时按此取数。

| 序号 | 需求书里显示的内容（人能看懂） | 对应旅程/题目 | 建议后端字段（落库/extra） |
|------|--------------------------------|---------------|----------------------------|
| 1 | 项目城市 | DE-1 | `CollectLeadData.project_city` 或 `extra.project_city_text`（页面最顶部） |
| 2 | 项目类型 | DE-1 | `CollectLeadData.project_type` |
| 3 | 收房状态 | DE-1 | `extra.handover_status`（毛坯/精装/旧房/土地） |
| 4 | 实际面积（㎡） | DE-1 | `CollectLeadData.project_area` |
| 5 | 预算范围 | DE-1 | `CollectLeadData.project_budget_range` |
| 6 | 入住周期 | Q2-8 | `extra.timeline` |
| 7 | 房屋用途/居住定位 | 风格测评 q8 等 | `extra.houseUsage` 或风格测评结果字段 |
| 8 | 房屋现状：采光 | Q2-5 | `extra.lighting` |
| 9 | 房屋现状：通风 | Q2-5 | `extra.ventilation` |
| 10 | 房屋现状：层高 | Q2-5 | `extra.ceilingHeight` |
| 11 | 房屋现状：噪音 | Q2-5 | `extra.noise` |
| 12 | 家庭成员列表/画像 | 注册信息 + Q2-6-1 | `users` 表 / `extra.additionalMembers` 等 |
| 13 | 客厅：主要活动 | Q2-13 | `extra.livingRoomActivity` |
| 14 | 客厅：功能特征（多选） | Q2-13 | `extra.livingRoomFeature[]` |
| 15 | 餐厅：日常就餐人数 | Q2-11 | `extra.diningCount` |
| 16 | 餐厅：节假日最多人数 | Q2-11 | `extra.festivalDiningCount` |
| 17 | 厨房：烹饪习惯 | Q2-10 | `extra.cookingHabit` |
| 18 | 厨房：是否需要第二厨房/中西分厨 | Q2-10 | `extra.secondKitchen` |
| 19 | 卫浴：干湿分离偏好 | Q2-15 | `extra.dryWetSeparation` |
| 20 | 储物重点（多选） | Q2-14 | `extra.storageFocus[]` |
| 21 | 风水禁忌 | Q2-17 | `extra.fengshui` |
| 22 | 智能家居倾向 | Q2-18 | `extra.smartHome` |
| 23 | 智能家居选项（多选） | Q2-18 | `extra.smartHomeOptions[]` |
| 24 | 舒适系统（多选） | Q2-19 | `extra.comfortSystems[]` |
| 25 | 特殊设备/电器（多选） | Q2-20 | `extra.devices[]` |
| 26 | 风格人设（如：理性秩序派） | 风格测评（匿名）结果 | `user_style_profiles.style_name` / `core_label` |
| 27 | 交付目标/设计定位（结构卡片三条文案） | 固定文案，非问卷驱动 | 运营配置或前端常量 |

---

## 5. 现状 vs 待实现（避免文档误导）

- **现状（代码）**：工作台内需求书（如 `WorkbenchPage.tsx` 的 RequirementsDoc）的 `infoRows`、`projectStatus`、`spaceResultMap`、`personas` 等多为写死 mock。
- **待实现（对接后端）**：需求书渲染建议按优先级取数：  
  1) `GET /projects/{project_id}`（项目基础信息）  
  2) `GET /leads/{lead_id}` 或 `GET /requirements/current?project_id=...`（extra/需求字段）  
  3) `GET /users/me/style-profile` 或等价接口（风格画像，用于 stylePersona）

---

## 6. 与其它阶段的关系

- **上游**：`03-register`（需登录）；`02-leads-collection`（线索与深度测评分离：线索是意向信息，深度测评是深度问卷结果，用于需求书）。  
- **下游**：需求书在工作台（`05-user-home`）的「项目需求书」中展示；数据来自本阶段约定的字段与接口。
