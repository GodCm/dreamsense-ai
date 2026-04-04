# Creem Webhook 更新 - 使用官方 SDK

## 更新时间
2026-04-05

## 改进内容

### 1. 安装官方 Next.js SDK
在 `package.json` 中添加了 `@creem_io/nextjs` 依赖。

### 2. 重写 Webhook 路由
将 `src/app/api/payments/webhook/route.ts` 改为使用官方推荐的 `Webhook` 助手。

**改进点：**
- ✅ 自动签名验证（HMAC-SHA256）
- ✅ 类型安全的事件处理
- ✅ 自动事件分发
- ✅ 更简洁的代码结构

### 3. 新增事件处理
现在支持以下事件：

- `onCheckoutCompleted` - 支付成功
- `onCheckoutFailed` - 支付失败
- `onGrantAccess` - 授予访问权限（订阅）
- `onRevokeAccess` - 撤销访问权限（取消订阅）

### 4. 代码示例

**Webhook 处理（新）：**
```typescript
import { Webhook } from '@creem_io/nextjs';

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  onCheckoutCompleted: async ({ customer, product }) => {
    console.log(`${customer.email} purchased ${product.name}`);
    // 更新数据库，激活用户权益
  },
  // ... 其他事件处理
});
```

**创建支付会话（保持不变）：**
```typescript
import { createCreem } from 'creem_io';

const creemClient = createCreem({
  apiKey: process.env.CREEM_API_KEY,
});

const checkout = await creemClient.checkouts.create({
  productId: priceId,
  successUrl: successUrl,
  metadata: { ... },
});
```

## 下一步操作

### 1. 安装依赖
```bash
cd C:/Users/wei/WorkBuddy/20260331181336/dreamsense-ai
npm install
```

### 2. 配置 Webhook Secret

在 Vercel 环境变量中添加：
```
CREEM_WEBHOOK_SECRET=your_webhook_secret_from_creem_dashboard
```

### 3. 在 Creem 后台配置 Webhook

1. 登录 Creem Dashboard
2. 进入 Developers → Webhooks
3. 添加 Webhook URL: `https://dreamsenseai.org/api/payments/webhook`
4. 选择要接收的事件类型：
   - `checkout.completed`
   - `checkout.failed`
   - `access.granted`
   - `access.revoked`

### 4. 测试 Webhook

使用 ngrok 暴露本地服务：
```bash
ngrok http 3000
```

在 Creem 后台配置测试 Webhook URL（如：`https://xxxx.ngrok-free.app/api/payments/webhook`），然后发送测试事件。

## 业务逻辑实现

目前 Webhook 处理函数中包含了 TODO 注释，需要根据实际业务需求实现：

### handleCheckoutCompleted
- 更新数据库，记录支付信息
- 激活用户订阅或积分
- 发送确认邮件

### handleCheckoutFailed
- 记录失败原因
- 通知用户
- 提供重试选项

### grantAccess
- 授予用户高级功能访问权限
- 更新用户权限表

### revokeAccess
- 撤销用户的高级功能访问权限
- 保留基础功能

## 技术细节

### 签名验证
SDK 自动使用 HMAC-SHA256 算法验证签名：
- 密钥：`webhookSecret`
- 签名位置：请求头 `creem-signature`
- 验证对象：原始请求体（raw body）

### 事件分发
SDK 根据事件类型自动调用对应的处理函数，无需手动 switch/case。

### 类型安全
所有事件处理函数都带有 TypeScript 类型定义，提供完整的类型提示。

## 注意事项

- 确保 `CREEM_WEBHOOK_SECRET` 环境变量已正确配置
- Webhook URL 必须是公网可访问的 HTTPS 地址
- 生产环境部署后记得更新 Creem 后台的 Webhook URL
- 建议 Webhook 处理失败时进行重试和记录日志

## 参考资料

- [Creem 官方文档](https://creem.io/docs)
- [Next.js SDK 文档](https://github.com/creem-io/nextjs-sdk)
- [Webhook 安全指南](https://creem.io/docs/webhooks/security)
