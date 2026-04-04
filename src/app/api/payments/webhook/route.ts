import { Webhook } from '@creem_io/nextjs';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,

  // ========== 支付相关事件 ==========
  // 处理一次性支付成功事件
  onCheckoutCompleted: async ({ customer, product }) => {
    console.log(`支付成功: ${customer.email} 购买了 ${product.name}`);
    await handleCheckoutCompleted({ customer, product });
  },

  // 处理支付失败事件
  onCheckoutFailed: async ({ customer, product, error }) => {
    console.log(`支付失败: ${customer.email} - ${error?.message || '未知错误'}`);
    await handleCheckoutFailed({ customer, product, error });
  },

  // ========== 访问权限事件 ==========
  // 处理授权访问事件 (通常用于订阅)
  onGrantAccess: async ({ customer, metadata }) => {
    const userId = metadata?.referenceId as string;
    console.log(`授予访问权限: ${customer.email}, 用户ID: ${userId}`);
    await grantAccess(userId, customer.email);
  },

  // 处理撤销访问事件 (订阅取消)
  onRevokeAccess: async ({ customer, metadata }) => {
    const userId = metadata?.referenceId as string;
    console.log(`撤销访问权限: ${customer.email}, 用户ID: ${userId}`);
    await revokeAccess(userId);
  },

  // ========== 订阅状态事件 ==========
  // 订阅激活（包括新订阅和续订）
  onSubscriptionActive: async ({ subscription, customer }) => {
    console.log(`订阅激活: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionActive({ subscription, customer });
  },

  // 订阅试用期开始
  onSubscriptionTrialing: async ({ subscription, customer }) => {
    console.log(`订阅试用期: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionTrialing({ subscription, customer });
  },

  // 订阅取消（立即生效）
  onSubscriptionCanceled: async ({ subscription, customer }) => {
    console.log(`订阅取消: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionCanceled({ subscription, customer });
  },

  // 订阅计划取消（在当前计费周期结束时生效）
  onSubscriptionScheduledCancel: async ({ subscription, customer }) => {
    console.log(`订阅计划取消: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionScheduledCancel({ subscription, customer });
  },

  // 订阅支付成功
  onSubscriptionPaid: async ({ subscription, customer }) => {
    console.log(`订阅支付成功: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionPaid({ subscription, customer });
  },

  // 订阅过期（未续订）
  onSubscriptionExpired: async ({ subscription, customer }) => {
    console.log(`订阅过期: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionExpired({ subscription, customer });
  },

  // 订阅未支付
  onSubscriptionUnpaid: async ({ subscription, customer }) => {
    console.log(`订阅未支付: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionUnpaid({ subscription, customer });
  },

  // 订阅更新（升级/降级）
  onSubscriptionUpdated: async ({ subscription, customer }) => {
    console.log(`订阅更新: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionUpdated({ subscription, customer });
  },

  // 订阅逾期未支付
  onSubscriptionPastDue: async ({ subscription, customer }) => {
    console.log(`订阅逾期: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionPastDue({ subscription, customer });
  },

  // 订阅暂停
  onSubscriptionPaused: async ({ subscription, customer }) => {
    console.log(`订阅暂停: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionPaused({ subscription, customer });
  },

  // ========== 退款和争议事件 ==========
  // 退款创建
  onRefundCreated: async ({ refund, subscription, customer }) => {
    console.log(`退款创建: ${customer.email} - 退款ID: ${refund.id}, 金额: ${refund.amount}`);
    await handleRefundCreated({ refund, subscription, customer });
  },

  // 争议创建（用户通过银行拒绝支付）
  onDisputeCreated: async ({ dispute, customer }) => {
    console.log(`争议创建: ${customer.email} - 争议ID: ${dispute.id}, 金额: ${dispute.amount}`);
    await handleDisputeCreated({ dispute, customer });
  },
});

// ========== 支付相关处理函数 ==========

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
  // TODO: 通知用户并提供重试选项
  console.log(`❌ 支付失败 - 用户: ${customer.email}, 原因: ${error?.message || '未知'}`);
}

// ========== 访问权限处理函数 ==========

async function grantAccess(userId: string, email: string) {
  // TODO: 授予用户高级功能访问权限
  // TODO: 更新数据库中的用户权限状态
  console.log(`✅ 授予访问权限 - 用户ID: ${userId}, 邮箱: ${email}`);
}

async function revokeAccess(userId: string) {
  // TODO: 撤销用户的高级功能访问权限
  // TODO: 保留基础功能
  console.log(`⚠️ 撤销访问权限 - 用户ID: ${userId}`);
}

// ========== 订阅状态处理函数 ==========

async function handleSubscriptionActive(data: {
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: string;
    priceId?: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;
  // TODO: 更新订阅状态为激活
  // TODO: 设置订阅到期时间
  console.log(`✅ 订阅激活 - 用户: ${customer.email}, 到期时间: ${subscription.currentPeriodEnd}`);
}

async function handleSubscriptionTrialing(data: {
  subscription: {
    id: string;
    status: string;
    trialEnd: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;
  // TODO: 设置试用期标记
  // TODO: 发送试用欢迎邮件
  console.log(`🎉 订阅试用期 - 用户: ${customer.email}, 试用结束: ${subscription.trialEnd}`);
}

async function handleSubscriptionCanceled(data: {
  subscription: {
    id: string;
    status: string;
    canceledAt: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;
  // TODO: 立即撤销访问权限
  // TODO: 发送取消确认邮件
  console.log(`🚫 订阅立即取消 - 用户: ${customer.email}, 取消时间: ${subscription.canceledAt}`);
}

async function handleSubscriptionScheduledCancel(data: {
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;
  // TODO: 标记订阅将在到期时取消
  // TODO: 通知用户保留到当前计费周期结束
  console.log(`⏰ 订阅计划取消 - 用户: ${customer.email}, 到期时间: ${subscription.currentPeriodEnd}`);
}

async function handleSubscriptionPaid(data: {
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;
  // TODO: 更新订阅到期时间
  // TODO: 发送续费成功邮件
  console.log(`💰 订阅续费成功 - 用户: ${customer.email}, 新到期时间: ${subscription.currentPeriodEnd}`);
}

async function handleSubscriptionExpired(data: {
  subscription: {
    id: string;
    status: string;
    endedAt: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;
  // TODO: 撤销访问权限
  // TODO: 发送过期通知
  console.log(`⏰ 订阅过期 - 用户: ${customer.email}, 过期时间: ${subscription.endedAt}`);
}

async function handleSubscriptionUnpaid(data: {
  subscription: {
    id: string;
    status: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;
  // TODO: 标记订阅为未支付
  // TODO: 发送支付失败通知
  console.log(`💳 订阅未支付 - 用户: ${customer.email}`);
}

async function handleSubscriptionUpdated(data: {
  subscription: {
    id: string;
    status: string;
    priceId?: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;
  // TODO: 更新订阅计划
  // TODO: 发送计划变更通知
  console.log(`🔄 订阅更新 - 用户: ${customer.email}, 新计划: ${subscription.priceId}`);
}

async function handleSubscriptionPastDue(data: {
  subscription: {
    id: string;
    status: string;
    nextPaymentDate: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;
  // TODO: 发送逾期提醒
  // TODO: 提供立即支付选项
  console.log(`⚠️ 订阅逾期 - 用户: ${customer.email}, 下次付款: ${subscription.nextPaymentDate}`);
}

async function handleSubscriptionPaused(data: {
  subscription: {
    id: string;
    status: string;
    pausedAt: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;
  // TODO: 暂停订阅服务
  // TODO: 发送暂停通知
  console.log(`⏸️ 订阅暂停 - 用户: ${customer.email}, 暂停时间: ${subscription.pausedAt}`);
}

// ========== 退款和争议处理函数 ==========

async function handleRefundCreated(data: {
  refund: {
    id: string;
    amount: number;
    currency: string;
    reason?: string;
  };
  subscription?: { id: string };
  customer: { email: string };
}) {
  const { refund, subscription, customer } = data;
  // TODO: 更新订单状态为已退款
  // TODO: 撤销相关服务或积分
  // TODO: 发送退款确认邮件
  console.log(`💸 退款创建 - 用户: ${customer.email}, 金额: ${refund.amount} ${refund.currency}, 原因: ${refund.reason || '未指定'}`);
}

async function handleDisputeCreated(data: {
  dispute: {
    id: string;
    amount: number;
    currency: string;
    reason: string;
    status: string;
  };
  customer: { email: string };
}) {
  const { dispute, customer } = data;
  // TODO: 标记争议状态
  // TODO: 准备证据材料
  // TODO: 通知相关人员处理
  console.log(`⚖️ 争议创建 - 用户: ${customer.email}, 金额: ${dispute.amount} ${dispute.currency}, 原因: ${dispute.reason}, 状态: ${dispute.status}`);
}
