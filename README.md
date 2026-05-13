# 写给远方的一封侨批

一座以电影《给阿嬷的情书》与"侨批"文化为主题的线上纪念馆 + 互动写信工具。

## 启动

```bash
cd qiaopi-letters
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 技术栈

- Next.js 14（App Router）+ React 18 + TypeScript
- Tailwind CSS（自定义 paper / ink / seal 三色系）
- Framer Motion（轻量滚动入场动画）
- html2canvas（将信纸 DOM 导出为 PNG）
- OpenSeadragon（侨批原件库的高清放大）
- Supabase（侨批元数据 + 公开侨批墙，未配置时优雅回退）
- **DeepSeek API**（"让那个年代的人帮我写"的 AI 写信助手；便宜 ~$0.0005/次）

## 页面

| 路由 | 内容 |
| --- | --- |
| `/` | 首页：标题、副标题、两个入口按钮，第二屏三句引言 |
| `/museum` | 线上展馆：五个展厅（什么是侨批 / 为什么下南洋 · 时间线 / 海路图 / 留在故乡的人 / 今天我们为什么还要写信） |
| `/archive` | **侨批原件库列表**：年代 / 寄出 / 收批 / 关系 / 主题筛选 + 关键字检索；顶部可切换到地图视图 |
| `/archive/[id]` | **侨批详情**：OpenSeadragon 高清放大、4 张图（信封正反 / 内信 / 汇款凭证）切换、原文转写、白话解读、历史注释、来源与版权；末尾有"也用这种语气写一封"跳到写信页并预填语境 |
| `/map` | **侨批地图**：把 12 条原件按"南洋寄出地 → 侨乡"画在海图上，弧线动画，hover 看预览，点击进详情 |
| `/write` | 写信表单：写给谁、寄出地、目的地、正文、语气（4 种）、主题（5 种）、是否公开 |
| `/generate` | 旧信纸视觉卡片 + 下载 PNG + 返回修改 + 挂上侨批墙 |
| `/wall` | 侨批墙：瀑布流卡片，可按主题筛选；点击卡片可放大查看全文 |

## 目录

```
src/
├── app/
│   ├── layout.tsx        # 字体注入 + 全局 Nav + Footer
│   ├── globals.css       # 旧纸背景、按钮、表单样式
│   ├── page.tsx          # 首页
│   ├── museum/page.tsx   # 展馆
│   ├── write/page.tsx    # 写信表单
│   ├── generate/page.tsx # 生成页 + PNG 导出
│   └── wall/page.tsx     # 侨批墙
├── components/
│   ├── Nav.tsx
│   ├── PaperTexture.tsx  # 复用纸面纹理
│   ├── RedSeal.tsx       # SVG 红印章（支持任意 1/2/4 字）
│   ├── Postmark.tsx      # SVG 圆形邮戳，城市名沿弧线
│   ├── SeaRoute.tsx      # SVG 海路地图（南洋 → 香港 → 侨乡）
│   ├── Timeline.tsx      # 展厅二的时间线
│   ├── ExhibitHall.tsx   # 展厅 section 通用容器
│   ├── FoldedLetter.tsx  # 首页折叠信纸装饰
│   ├── LetterCanvas.tsx  # ★ 旧信纸视觉，PNG 导出源
│   ├── ArchiveCard.tsx   # 原件库列表卡片
│   ├── ArchiveFilters.tsx# 原件库筛选条 + applyFilters 工具
│   ├── ArchiveViewer.tsx # OpenSeadragon 包装组件（动态导入）
│   ├── ArchiveViewSwitch.tsx # /archive ↔ /map 切换
│   └── QiaopiMap.tsx     # 侨批海图（SVG 海面 + 陆地 + 弧线动画 + hover 卡片）
└── lib/
    ├── types.ts          # Letter / Tone / Theme 类型与中文标签
    ├── storage.ts        # localStorage（公开信） + sessionStorage（草稿/待生成）
    ├── mockData.ts       # 6 封占位侨批（用于侨批墙）
    ├── archiveTypes.ts   # ★ QiaopiItem 类型 + 年代分桶 + KIND_LABELS
    ├── archiveImage.ts   # SVG 生成器（信封正背 / 内信 / 汇款凭证）
    ├── archiveMock.ts    # 12 条原件库示例（仿写，非真实馆藏）
    ├── supabaseClient.ts # Supabase 客户端（环境变量未设时为 null）
    └── archiveStore.ts   # fetchArchiveItems / fetchArchiveItemById（mock 回退）
```

## 设计约束

- 颜色：米黄 `paper-100/200`、深棕 `ink-300/400/500`、暗红 `seal-500`、墨黑 `ink-700`
- 字体：Noto Serif SC（正文）、Ma Shan Zheng / ZCOOL XiaoWei（点缀）
- 动画一律 `duration: 1.2~1.6s`、`ease: [0.4, 0, 0.2, 1]`，不弹不跳
- 不使用电影剧照与真实侨批原档：所有视觉（信纸、邮戳、印章、海路）均由 CSS + SVG 模拟

## html2canvas 注意

`LetterCanvas` 内的 SVG `feTurbulence` 噪声层在大部分现代浏览器中能被 html2canvas 渲染，但若遇到导出 PNG 上的颗粒不一致，可将该 `<svg>` 替换为 base64 噪声背景图（不影响布局）。

## 后续可接的真实后端

`saveLetter / loadLetters` 是唯一的存储入口。要接后端时，把 `src/lib/storage.ts` 改为请求 `/api/letters` 即可，UI 层无需改动。

## 侨批原件库

`/archive` 是新加入的"线上档案馆"模块。

### 数据来源

- 默认：`src/lib/archiveMock.ts` 中的 12 条占位条目，仿照真实侨批文体撰写，但**不对应任何真实馆藏，亦不使用真实馆藏编号**。
- 可选：在项目根目录建 `.env.local`，按 `.env.example` 填入 Supabase URL 与 anon key。`src/lib/archiveStore.ts` 会优先读 Supabase 表 `qiaopi_items`；表为空或失败时静默回退到 mock。

### 占位图

- 列表与详情页的图像均由 `src/lib/archiveImage.ts` 用 SVG 程序生成：旧纸纹理 + 邮戳 + 红印章 + 竖排原文。
- 每条 `QiaopiItem` 自带 4 张图（信封正面 / 信封背面 / 内信 / 汇款凭证），通过 `images[i].url = "generated:<kind>"` 标记走生成器。
- 接入 Supabase Storage / R2 后，把 `url` 改成真实图床地址即可；UI 与 OpenSeadragon 都无需改动。

### 版权 ⚠

12 条占位条目的内容均为本项目原创，每条 `rightsNote` 字段均明确标注"未对应任何真实档案"。如要接入真实侨批图像、转写或注释，**必须使用授权来源**（侨批档案馆等具备版权许可的机构）。这一点也在列表页顶部和每条详情页底部反复显示给用户。

## AI 写信助手（DeepSeek）

在 /write 页"想说的话"文本框下方有一个按钮 **「✦ 让那个年代的人帮我写」**：

- 用户写了 ≥ 20 字草稿 → 按钮变成「让那个年代的人帮我润色」，AI 在保留原意的前提下按当前语气改写
- 用户没写或写得很短 → AI 按当前主题 + 收信人 + 寄出/收批地 + 语气替你拟一封
- 旁边有「还原原稿」可以撤销

支持 4 种语气，每种都有专门的 system prompt（见 [src/lib/prompts.ts](src/lib/prompts.ts)）：

| 语气 | 笔触 |
| --- | --- |
| `classical` 旧式家书 | 1880-1950 南洋华侨写家书的样子。"母亲大人膝下""敬禀者""今寄叻币X元""祈代收讫""敬颂福安"…… |
| `gentle` 温柔家书 | 温柔、克制、短句，多用"你""我"，像在小声说话 |
| `restrained` 克制含蓄 | 极简、留白、不把话说尽、不写感叹号 |
| `modern` 现代白话 | 口语化日常笔触，但仍保持"信"的结构 |

后端实现：
- [src/app/api/compose/route.ts](src/app/api/compose/route.ts) —— Next.js Route Handler
- [src/lib/deepseekClient.ts](src/lib/deepseekClient.ts) —— 直接用 fetch 调 DeepSeek（OpenAI 兼容 schema）
- [src/lib/rateLimit.ts](src/lib/rateLimit.ts) —— 双层限流：单 IP 60s 内 4 次 + 全天 30 次

配置：把你的 DeepSeek key 写进 `.env.local`：
```bash
DEEPSEEK_API_KEY=sk-xxx
DEEPSEEK_MODEL=deepseek-chat        # 默认就是这个
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

## 公开侨批墙（Supabase）

侨批墙现在是真正的"留言墙"：任何访问者写完都能挂上去，任何后来人都能看到。

- 客户端通过 [src/lib/wallApi.ts](src/lib/wallApi.ts) 调 `POST /api/wall/letters` 写、`GET /api/wall/letters` 读
- 后端 [src/app/api/wall/letters/route.ts](src/app/api/wall/letters/route.ts) 用 Supabase service_role 写表 `public_letters`
- 双层限流：POST 单 IP 60s 内 1 次 + 全天 5 次；GET 60s 内 30 次

**未配置 Supabase 时自动回退**：
- POST 返回 503 → wallApi 把信存进当地 localStorage（用户自己能看见）
- GET 返回空列表 → 墙上仍能看到 6 封 mock + 用户本地的信
- 墙顶部会显示一行小字提示当前是"云端"还是"仅本地"

### 启用云端存储的步骤

1. 在 [Supabase](https://app.supabase.com) 建一个 free 项目
2. SQL editor 里整段粘贴 [supabase/schema.sql](supabase/schema.sql) 执行
3. Project Settings → API：复制 `URL` 和 `service_role` 两把 key
4. 写进 `.env.local`：
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx…           # 客户端可见的 anon key
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx…               # 仅服务端用，不要暴露
   ```
5. 重启 `npm run dev`

## 模块之间如何串起来

- 首页 → "原件库"引导段落 → `/archive` 或 `/map`
- `/archive` 顶部 ↔ `/map`（[ArchiveViewSwitch.tsx](src/components/ArchiveViewSwitch.tsx)）
- `/archive/[id]` 详情页底部 → "也用这种语气写一封" → `/write?to=母亲&tone=classical&theme=想念`
- `/write` 用 `useSearchParams` 读上面这串 query，预填表单并在顶部显示一条 "※ 从原件库带来：…" 的胶囊提示；从原件库进来时正文留空（让用户重新写）
- `/museum` 展厅五尾部 → `/write`
- `/wall` 顶部 → `/write`

侨批原件库的 SVG 占位图（[archiveImage.ts](src/lib/archiveImage.ts)）和侨批地图的城市坐标（[QiaopiMap.tsx](src/components/QiaopiMap.tsx) 顶部的 `COORDS`）是两处可以扩充的"知识点"：在新 mock 条目里增加未列入的城市时，记得把坐标也加进 `COORDS`，否则地图上该条会被静默跳过。
