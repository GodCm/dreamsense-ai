import { Webhook } from '@creem_io/nextjs';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  // 处理一次性支付成功事件
  onCheckoutCompleted: async ({ customer, product }) => {
    console.log(`支付成功: ${customer.email} 购买了 ${product.name}`);
    // 在这里更新数据库，标记订单为已支付
    await handleCheckoutCompleted({ customer, product });
  },
  // 处理支付失败事件
  onCheckoutFailed: async ({ customer, product, error }) => {
    console.log(`支付失败: ${customer.email} - ${error?.message || '未知错误'}`);
    await handleCheckoutFailed({ customer, product, error });
  },
  // 处理授权访问事件 (通常用于订阅)
  onGrantAccess: async ({ customer, metadata }) => {
    const userId = metadata?.referenceId as string;
    console.log(`授予访问权限: ${customer.email}, 用户ID: ${userId}`);
    // 授予用户高级功能访问权限
    await grantAccess(userId, customer.email);
  },
  // 处理撤销访问事件 (订阅取消)
  onRevokeAccess: async ({ customer, metadata }) => {
    const userId = metadata?.referenceId as string;
    console.log(`撤销访问权限: ${customer.email}, 用户ID: ${userId}`);
    // 撤销用户的高级功能访问权限
    await revokeAccess(userId);
  },
});

// 业务处理函数
async function handleCheckoutCompleted(data: {
  customer: { email: string };
  product: { id: string; name: string };
}) {
  const { customer, product } = data;
  // TODO: 更新数据库，记录支付信息
  // TODO: 激活用户订阅或积分
  console.log(`✅ 支付完成 - 用户: ${customer.email}, 产品: ${product.name}`);
}

async function handleCheckoutFailed(data: {
  customer: { email: string };
  product: { id: string };
  error?: { message: string };
}) {
  const { customer, product, error } = data;
  // TODO: 记录失败原因
  console.log(`❌ 支付失败 - 用户: ${customer.email}, 原因: ${error?.message || '未知'}`);
}

async function grantAccess(userId: string, email: string) {
  // TODO: 授予用户高级功能访问权限
  console.log(`✅ 授予访问权限 - 用户ID: ${userId}, 邮箱: ${email}`);
}

async function revokeAccess(userId: string) {
  // TODO: 撤销用户的高级功能访问权限
  console.log(`⚠️ 撤销访问权限 - 用户ID: ${userId}`);
}
