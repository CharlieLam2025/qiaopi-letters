# 上线部署

最少花你 10 分钟。三件事按顺序：

1. **推到 GitHub**（5 分钟）
2. **Vercel 一键部署**（3 分钟）
3. **接 Supabase 启用公开侨批墙**（5 分钟，可跳过）

---

## 0. 先在本机过一遍

确认 production build 能过：

```powershell
cd C:\Users\Administrator\qiaopi-letters
npm run build
```

应看到 `✓ Compiled successfully` 和 10 个路由的 size 表。如果报错先解决再继续。

---

## 1. 推到 GitHub

### 1.1 在 GitHub 建一个空 repo
- https://github.com/new
- 名字随便：`qiaopi-letters`
- 不要勾"Add README""Add .gitignore""License" 三个选项（本地已经有了）

### 1.2 在本地 init + 第一次 push
我已经替你 `git init` 并 commit 了第一版（见下文）。把 remote 接上：

```powershell
cd C:\Users\Administrator\qiaopi-letters
git remote add origin https://github.com/<你的用户名>/qiaopi-letters.git
git branch -M main
git push -u origin main
```

> ⚠ 检查 `.env.local` **没有**被推上去：
> ```powershell
> git ls-files | findstr ".env"
> ```
> 应该只看到 `.env.example`。如果看到 `.env.local` 立刻 `git rm --cached .env.local` 再 push。

---

## 2. Vercel 部署（推荐 · 最简单）

### 2.1 注册并 import
- https://vercel.com/signup
- 用 **"Continue with GitHub"** 登录最省事（会自动授权访问你的 repos）
- 登录后 → **Add New... → Project**
- 在 repo 列表里选 `qiaopi-letters` → **Import**

### 2.2 配置环境变量
**Configure Project** 页面 → 展开 **Environment Variables** → 把下列填进去：

| Name | Value | 说明 |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | `sk-xxx`（去 `.env.local` 里复制） | 你给我的那把 |
| `DEEPSEEK_MODEL` | `deepseek-chat` | 默认就行 |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | 默认就行 |
| `NEXT_PUBLIC_SUPABASE_URL` | （第 3 步获得） | 公开墙 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | （第 3 步获得） | 公开墙 |
| `SUPABASE_SERVICE_ROLE_KEY` | （第 3 步获得） | 公开墙 |

如果暂时跳过 Supabase，后三个先空着没关系，公开墙会回退到 localStorage，AI 写信不受影响。

### 2.3 Deploy
- 点 **Deploy**
- 等 ~90 秒
- 完成后会给你一个 `xxx.vercel.app` 域名，打开就是

### 2.4（可选）绑定自己的域名
- Vercel project → Settings → Domains → Add
- 跟着提示加 CNAME / A 记录就行

---

## 3. 启用云端公开侨批墙（Supabase）

不做也能上线，做了之后才是真正"任何访问者写完都能挂上去，后面来的人都能看到"。

### 3.1 建 Supabase 项目
- https://app.supabase.com → **New project**
- Name: `qiaopi-letters`
- Database Password: **记好**
- Region: 选离你近的（`Southeast Asia (Singapore)` / `Northeast Asia (Tokyo)`）
- Pricing: Free tier 够用

### 3.2 跑建表 SQL
- 项目侧栏 → **SQL Editor** → **New query**
- 整段粘贴 [`supabase/schema.sql`](supabase/schema.sql) → **Run**
- 应看到 "Success. No rows returned"

### 3.3 拿 keys 写回 Vercel
- 项目侧栏 → **Project Settings → API**
- 把这三个抄到 Vercel env vars：
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`
- Vercel → 你的 project → Settings → Environment Variables 改完后，**Deployments** → 最新那次 → **Redeploy**

⚠ `service_role` 绝对不要：1) 写进 client 代码 2) 推到 git 3) 在前端调。它只在 `/api/wall/letters` 这一个服务端路由里用。

### 3.4 验证云端打通
打开 `xxx.vercel.app/wall` —— 顶部应该显示 `※ 任何访问者写下的信都会出现在这里 ※`（云端启用状态）。如果还是 "云端未启用"，说明 env 还没生效，再 Redeploy 一次。

---

## 4. 给 DeepSeek 设上限（重要）

防止有人灌墙烧光你的钱：

1. https://platform.deepseek.com → 控制台 → **API Keys**
2. 找到那把 key → **Edit** → 设 **每月预算上限**（推荐先设 $5—10）
3. 设 **每分钟 RPM 上限**（推荐 60）

我们代码层也已经做了双层限流：
- `/api/compose`：单 IP 60s 内 4 次 + 全天 30 次
- `/api/wall/letters` POST：单 IP 60s 内 1 次 + 全天 5 次

DeepSeek 控制台上限是兜底。

---

## 5. 可选：用 Cloudflare Pages 而不是 Vercel

如果你已经在用 Cloudflare（看你之前的 `wenw-dashboard.pages.dev`），步骤大同小异，但 Next.js App Router 在 CF Pages 上要装适配器：

```powershell
npm install -D @cloudflare/next-on-pages
```

然后 `package.json` 加：
```json
"pages:build": "npx @cloudflare/next-on-pages"
```

CF Pages 控制台 → **Create project** → **Connect to Git** → 选 repo →
- Build command: `npx @cloudflare/next-on-pages`
- Build output: `.vercel/output/static`
- Env vars: 同上

但 Vercel 对 Next.js 是一等公民支持，**首次部署强烈推荐 Vercel**，跑稳了再考虑迁。

---

## 6. 上线之后的清单

- [ ] 在 GitHub 给 repo 加一段简短描述
- [ ] DeepSeek 控制台设月度上限
- [ ] Supabase 控制台开 **Daily Email Report**（免费）
- [ ] 在 Vercel project → Analytics 看流量（free tier 够用）
- [ ] 把 `.env.local` 备份到密码管理器（1Password / Bitwarden）
- [ ] 如果对话日志会被分享，DeepSeek 控制台 rotate 一把新 key，老 key 留本地开发用
