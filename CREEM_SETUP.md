# Creem 支付集成说明

## 已完成的集成

### 1. 安装依赖
已在 `package.json` 中添加 `@creem_io/nextjs` 依赖（Next.js 专用包）。

**运行以下命令安装：**
```bash
npm install
```

### 2. 配置文件
已创建以下文件：
- `src/lib/creem.ts` - Creem SDK 配置
- `src/app/api/payments/create-checkout/route.ts` - 创建支付会话 API
- `src/app/api/payments/webhook/route.ts` - 支付回调处理 API
- `.env.example` - 环境变量示例

### 3. 前端集成
已更新 `src/app/pricing/page.tsx`，添加支付功能：
- 为每个套餐添加了 `priceId`
- 点击按钮时调用支付 API
- 重定向到 Creem 支付页面

## 接下来需要做的

### 1. 安装依赖
在项目根目录运行：
```bash
npm install
```

### 2. 在 Vercel 中配置环境变量

登录 Vercel，进入项目设置 → Environment Variables，添加以下变量：

```
CREEM_API_KEY=creem_5GjMeIkjlxCjXuDWu7WMvs
```

如果 Creem 提供 Webhook Secret，也需要添加：
```
CREEM_WEBHOOK_SECRET=your_webhook_secret
```

### 3. 在 Creem 后台创建产品

登录 Creem Dashboard（creem.io），创建以下价格产品：

1. **Pay per Dream**
   - 价格: $1.99
   - ID: `price_single_dream`

2. **Monthly**
   - 价格: $9.99/月
   - ID: `price_monthly`

3. **Yearly**
   - 价格: $99.99/年
   - ID: `price_yearly`

### 4. 配置 Webhook（可选）

如果你想在支付成功后收到通知：

1. 在 Creem Dashboard 中配置 Webhook URL
2. URL: `https://dreamsenseai.org/api/payments/webhook`
3. 选择要接收的事件类型：
   - `checkout.session.completed` - 支付成功
   - `checkout.session.failed` - 支付失败

### 5. 更新数据库（可选）

如果需要记录支付信息，可以在 Prisma schema 中添加支付表：

```prisma
model Payment {
  id        String   @id @default(uuid())
  userId    String
  amount    Decimal
  currency  String
  status    String
  createdAt DateTime @default(now())

  @@index([userId])
}
```

然后运行：
```bash
npx prisma migrate dev --name add_payment_table
```

### 6. 部署到 Vercel

提交代码后，Vercel 会自动部署。

## 测试

1. 访问 https://dreamsenseai.org/pricing
2. 点击任意套餐的订阅按钮
3. 应该会跳转到 Creem 支付页面
4. 完成支付测试

## 注意事项

- 当前使用的是 Creem 提供的 API Key（`creem_5GjMeIkjlxCjXuDWu7WMvs`）
- 在生产环境中，建议在 Creem 后台创建新的 API Key 并妥善保管
- Webhook 功能目前是基础实现，可以根据业务需求扩展
- 支付成功后的用户权益激活逻辑需要根据实际业务需求实现
