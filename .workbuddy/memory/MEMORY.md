# MEMORY.md - 项目长期记忆

## 项目信息

### DreamSense AI - 梦境解析网站
- **技术栈**：Next.js 14 + Prisma + PostgreSQL + TypeScript + Tailwind CSS
- **部署平台**：Vercel
- **域名**：dreamsenseai.org
- **Vercel 原域名**：dreamsense-ai.vercel.app

## Creem 支付集成

### 技术栈
- **支付创建**：使用 `creem_io` 包的 `createCreem()` 和 `checkouts.create()`
- **Webhook 处理**：使用官方 `@creem_io/nextjs` 包的 `Webhook` 助手

### 关键文件
- `src/lib/creem.ts` - Creem SDK 配置（创建支付会话）
- `src/app/api/payments/create-checkout/route.ts` - 创建支付会话 API
- `src/app/api/payments/webhook/route.ts` - 支付回调处理 API（使用官方 SDK）

### Webhook 事件处理
当前支持的事件：
- `onCheckoutCompleted` - 支付成功，需要实现数据库更新和用户权益激活
- `onCheckoutFailed` - 支付失败，需要记录失败原因
- `onGrantAccess` - 授予访问权限（订阅）
- `onRevokeAccess` - 撤销访问权限（订阅取消）

### 环境变量
需要在 Vercel 中配置：
- `CREEM_API_KEY` - Creem API 密钥
- `CREEM_WEBHOOK_SECRET` - Creem Webhook 密钥（用于签名验证）

### 业务逻辑 TODO
需要实现的业务逻辑：
1. `handleCheckoutCompleted` - 更新数据库，记录支付信息，激活用户订阅或积分
2. `handleCheckoutFailed` - 记录失败原因，通知用户
3. `grantAccess` - 授予用户高级功能访问权限
4. `revokeAccess` - 撤销用户的高级功能访问权限

## Vercel 部署关键配置

### 构建脚本
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```
**原因**：Vercel 构建时需要 Prisma 客户端，必须确保构建前生成。

### API 路由配置
所有 API 路由必须包含：
```typescript
export const dynamic = 'force-dynamic';
```

### 动态导入
src/lib/auth.ts 中 Prisma 使用动态导入以避免构建时依赖：
```typescript
const { prisma } = await import('./db');
```

## 域名 DNS 配置

### Namecheap DNS 记录
- **类型**: A Record
  - Host: @
  - Value: 76.76.21.21

- **类型**: CNAME Record
  - Host: www
  - Value: cname.vercel-dns.com

**注意**：不能有 parkingpage.namecheap.com 的 CNAME 记录。

## Git 提交记录

### 关键提交
- `4c776f4`: "feat: upgrade Creem webhook to use official @creem_io/nextjs SDK"
- `69688cf`: 之前的提交（需要查看完整记录）

## 未来注意事项
1. 任何涉及 Prisma schema 的修改后，需要重新生成客户端
2. 添加新 API 路由时，必须添加 `export const dynamic = 'force-dynamic';`
3. 部署问题优先检查 build 脚本中是否包含 `prisma generate`
4. 安装 `@creem_io/nextjs` 后需要运行 `npm install`
