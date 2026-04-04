import { Webhook } from '@creem_io/nextjs';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,

  // ========== 支付相关事件 ==========
  // 处理一次性支付成功事件
  onCheckoutCompleted: async ({ customer, product }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    console.log(`支付成功: ${customer.email} 购买了 ${product.name}`);
    await handleCheckoutCompleted({ customer: { email: customer.email }, product });
  },

  // ========== 访问权限事件 ==========
  // 处理授权访问事件 (通常用于订阅)
  onGrantAccess: async ({ customer, metadata }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    const userId = metadata?.referenceId as string;
    console.log(`授予访问权限: ${customer.email}, 用户ID: ${userId}`);
    await grantAccess(userId, customer.email);
  },

  // 处理撤销访问事件 (订阅取消)
  onRevokeAccess: async ({ customer, metadata }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    const userId = metadata?.referenceId as string;
    console.log(`撤销访问权限: ${customer.email}, 用户ID: ${userId}`);
    await revokeAccess(userId);
  },

  // ========== 订阅状态事件 ==========
  // 订阅激活（包括新订阅和续订）
  onSubscriptionActive: async ({ subscription, customer }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    console.log(`订阅激活: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionActive({ subscription, customer: { email: customer.email } });
  },

  // 订阅试用期开始
  onSubscriptionTrialing: async ({ subscription, customer }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    console.log(`订阅试用期: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionTrialing({ subscription, customer: { email: customer.email } });
  },

  // 订阅取消（立即生效）
  onSubscriptionCanceled: async ({ subscription, customer }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    console.log(`订阅取消: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionCanceled({ subscription, customer: { email: customer.email } });
  },

  // 订阅计划取消（在当前计费周期结束时生效）
  onSubscriptionScheduledCancel: async ({ subscription, customer }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    console.log(`订阅计划取消: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionScheduledCancel({ subscription, customer: { email: customer.email } });
  },

  // 订阅支付成功
  onSubscriptionPaid: async ({ subscription, customer }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    console.log(`订阅支付成功: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionPaid({ subscription, customer: { email: customer.email } });
  },

  // 订阅过期（未续订）
  onSubscriptionExpired: async ({ subscription, customer }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    console.log(`订阅过期: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionExpired({ subscription, customer: { email: customer.email } });
  },

  // 订阅未支付
  onSubscriptionUnpaid: async ({ subscription, customer }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    console.log(`订阅未支付: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionUnpaid({ subscription, customer: { email: customer.email } });
  },

  // 订阅更新（升级/降级）
  onSubscriptionUpdated: async ({ subscription, customer }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    console.log(`订阅更新: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionUpdated({ subscription, customer: { email: customer.email } });
  },

  // 订阅逾期未支付
  onSubscriptionPastDue: async ({ subscription, customer }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    console.log(`订阅逾期: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionPastDue({ subscription, customer: { email: customer.email } });
  },

  // 订阅暂停
  onSubscriptionPaused: async ({ subscription, customer }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    console.log(`订阅暂停: ${customer.email} - 订阅ID: ${subscription.id}`);
    await handleSubscriptionPaused({ subscription, customer: { email: customer.email } });
  },

  // ========== 退款和争议事件 ==========
  // 退款创建
  onRefundCreated: async ({ refund, subscription, customer }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    console.log(`退款创建: ${customer.email} - 退款ID: ${refund.id}, 金额: ${refund.amount}`);
    await handleRefundCreated({ refund, subscription, customer: { email: customer.email } });
  },

  // 争议创建（用户通过银行拒绝支付）
  onDisputeCreated: async ({ dispute, customer }) => {
    if (!customer?.email) {
      console.error('❌ 缺少 customer.email');
      return;
    }
    console.log(`争议创建: ${customer.email} - 争议ID: ${dispute.id}, 金额: ${dispute.amount}`);
    await handleDisputeCreated({ dispute, customer: { email: customer.email } });
  },
});

// ========== 数据库导入和工具函数 ==========

// 动态导入 Prisma 客户端，避免构建时依赖
const { prisma } = await import('@/lib/db');

// 通过邮箱查找用户
async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

// 创建或更新支付记录
async function createPayment(data: {
  userId: string;
  creemPaymentId: string;
  amount: number;
  currency: string;
  status: string;
  productId: string;
  productName: string;
  customerEmail: string;
}) {
  return await prisma.payment.upsert({
    where: { creemPaymentId: data.creemPaymentId },
    update: {
      status: data.status as any,
      updatedAt: new Date(),
    },
    create: {
      userId: data.userId,
      creemPaymentId: data.creemPaymentId,
      amount: data.amount,
      currency: data.currency,
      status: data.status as any,
      productId: data.productId,
      productName: data.productName,
      customerEmail: data.customerEmail,
    },
  });
}

// 创建或更新订阅记录
async function createOrUpdateSubscription(data: {
  userId: string;
  creemSubscriptionId: string;
  status: string;
  productId?: string;
  productName?: string;
  currentPeriodEnd?: Date;
  trialEnd?: Date;
  canceledAt?: Date;
  endedAt?: Date;
}) {
  return await prisma.subscription.upsert({
    where: { creemSubscriptionId: data.creemSubscriptionId },
    update: {
      status: data.status as any,
      productId: data.productId,
      productName: data.productName,
      currentPeriodEnd: data.currentPeriodEnd,
      trialEnd: data.trialEnd,
      canceledAt: data.canceledAt,
      endedAt: data.endedAt,
      updatedAt: new Date(),
    },
    create: {
      userId: data.userId,
      creemSubscriptionId: data.creemSubscriptionId,
      status: data.status as any,
      productId: data.productId,
      productName: data.productName,
      currentPeriodEnd: data.currentPeriodEnd,
      trialEnd: data.trialEnd,
      canceledAt: data.canceledAt,
      endedAt: data.endedAt,
    },
  });
}

// ========== 支付相关处理函数 ==========

async function handleCheckoutCompleted(data: {
  customer: { email: string };
  product: { id: string; name: string };
  checkoutId?: string;
  amount?: number;
  currency?: string;
}) {
  const { customer, product, checkoutId, amount, currency } = data;

  try {
    // 查找或创建用户
    let user = await findUserByEmail(customer.email);

    if (!user) {
      // 如果用户不存在，记录日志但不创建用户（用户需要先注册）
      console.log(`⚠️ 用户 ${customer.email} 尚未注册，但支付已成功`);
      return;
    }

    // 创建支付记录
    if (checkoutId && amount) {
      await createPayment({
        userId: user.id,
        creemPaymentId: checkoutId,
        amount,
        currency: currency || 'USD',
        status: 'COMPLETED',
        productId: product.id,
        productName: product.name,
        customerEmail: customer.email,
      });
    }

    // 如果是订阅产品，激活用户订阅
    if (product.id.includes('subscription') || product.id.includes('monthly') || product.id.includes('yearly')) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isSubscribed: true,
          subscriptionType: product.id,
        },
      });
    }

    console.log(`✅ 支付完成 - 用户: ${customer.email}, 产品: ${product.name}`);
  } catch (error) {
    console.error('❌ 处理支付完成失败:', error);
    throw error;
  }
}

// ========== 访问权限处理函数 ==========

async function grantAccess(userId: string, email: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isSubscribed: true,
      },
    });

    console.log(`✅ 授予访问权限 - 用户ID: ${userId}, 邮箱: ${email}`);
  } catch (error) {
    console.error('❌ 授予访问权限失败:', error);
    throw error;
  }
}

async function revokeAccess(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isSubscribed: false,
        subscriptionType: null,
      },
    });

    console.log(`⚠️ 撤销访问权限 - 用户ID: ${userId}`);
  } catch (error) {
    console.error('❌ 撤销访问权限失败:', error);
    throw error;
  }
}

// ========== 订阅状态处理函数 ==========

async function handleSubscriptionActive(data: {
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: string;
    productId?: string;
    productName?: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;

  try {
    // 查找或创建用户
    let user = await findUserByEmail(customer.email);

    if (!user) {
      console.log(`⚠️ 用户 ${customer.email} 尚未注册`);
      return;
    }

    // 更新订阅记录
    await createOrUpdateSubscription({
      userId: user.id,
      creemSubscriptionId: subscription.id,
      status: 'ACTIVE',
      productId: subscription.productId,
      productName: subscription.productName,
      currentPeriodEnd: new Date(subscription.currentPeriodEnd),
    });

    // 更新用户状态
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isSubscribed: true,
        subscriptionType: subscription.productId || 'subscription',
      },
    });

    console.log(`✅ 订阅激活 - 用户: ${customer.email}, 到期时间: ${subscription.currentPeriodEnd}`);
  } catch (error) {
    console.error('❌ 处理订阅激活失败:', error);
    throw error;
  }
}

async function handleSubscriptionTrialing(data: {
  subscription: {
    id: string;
    status: string;
    trialEnd: string;
    productId?: string;
    productName?: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;

  try {
    // 查找或创建用户
    let user = await findUserByEmail(customer.email);

    if (!user) {
      console.log(`⚠️ 用户 ${customer.email} 尚未注册`);
      return;
    }

    // 更新订阅记录
    await createOrUpdateSubscription({
      userId: user.id,
      creemSubscriptionId: subscription.id,
      status: 'TRIALING',
      productId: subscription.productId,
      productName: subscription.productName,
      trialEnd: new Date(subscription.trialEnd),
    });

    // 更新用户状态
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isSubscribed: true,
        subscriptionType: subscription.productId || 'trial',
      },
    });

    console.log(`🎉 订阅试用期 - 用户: ${customer.email}, 试用结束: ${subscription.trialEnd}`);
  } catch (error) {
    console.error('❌ 处理订阅试用期失败:', error);
    throw error;
  }
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

  try {
    // 查找用户
    const user = await findUserByEmail(customer.email);

    if (!user) {
      console.log(`⚠️ 用户 ${customer.email} 尚未注册`);
      return;
    }

    // 更新订阅记录
    await createOrUpdateSubscription({
      userId: user.id,
      creemSubscriptionId: subscription.id,
      status: 'CANCELED',
      canceledAt: new Date(subscription.canceledAt),
    });

    // 撤销用户访问权限
    await revokeAccess(user.id);

    console.log(`🚫 订阅立即取消 - 用户: ${customer.email}, 取消时间: ${subscription.canceledAt}`);
  } catch (error) {
    console.error('❌ 处理订阅取消失败:', error);
    throw error;
  }
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

  try {
    // 查找用户
    const user = await findUserByEmail(customer.email);

    if (!user) {
      console.log(`⚠️ 用户 ${customer.email} 尚未注册`);
      return;
    }

    // 更新订阅记录
    await createOrUpdateSubscription({
      userId: user.id,
      creemSubscriptionId: subscription.id,
      status: 'SCHEDULED_TO_CANCEL',
      currentPeriodEnd: new Date(subscription.currentPeriodEnd),
    });

    console.log(`⏰ 订阅计划取消 - 用户: ${customer.email}, 到期时间: ${subscription.currentPeriodEnd}`);
  } catch (error) {
    console.error('❌ 处理订阅计划取消失败:', error);
    throw error;
  }
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

  try {
    // 查找用户
    const user = await findUserByEmail(customer.email);

    if (!user) {
      console.log(`⚠️ 用户 ${customer.email} 尚未注册`);
      return;
    }

    // 更新订阅记录
    await createOrUpdateSubscription({
      userId: user.id,
      creemSubscriptionId: subscription.id,
      status: 'ACTIVE',
      currentPeriodEnd: new Date(subscription.currentPeriodEnd),
    });

    console.log(`💰 订阅续费成功 - 用户: ${customer.email}, 新到期时间: ${subscription.currentPeriodEnd}`);
  } catch (error) {
    console.error('❌ 处理订阅续费失败:', error);
    throw error;
  }
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

  try {
    // 查找用户
    const user = await findUserByEmail(customer.email);

    if (!user) {
      console.log(`⚠️ 用户 ${customer.email} 尚未注册`);
      return;
    }

    // 更新订阅记录
    await createOrUpdateSubscription({
      userId: user.id,
      creemSubscriptionId: subscription.id,
      status: 'EXPIRED',
      endedAt: new Date(subscription.endedAt),
    });

    // 撤销用户访问权限
    await revokeAccess(user.id);

    console.log(`⏰ 订阅过期 - 用户: ${customer.email}, 过期时间: ${subscription.endedAt}`);
  } catch (error) {
    console.error('❌ 处理订阅过期失败:', error);
    throw error;
  }
}

async function handleSubscriptionUnpaid(data: {
  subscription: {
    id: string;
    status: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;

  try {
    // 查找用户
    const user = await findUserByEmail(customer.email);

    if (!user) {
      console.log(`⚠️ 用户 ${customer.email} 尚未注册`);
      return;
    }

    // 更新订阅记录
    await createOrUpdateSubscription({
      userId: user.id,
      creemSubscriptionId: subscription.id,
      status: 'UNPAID',
    });

    console.log(`💳 订阅未支付 - 用户: ${customer.email}`);
  } catch (error) {
    console.error('❌ 处理订阅未支付失败:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(data: {
  subscription: {
    id: string;
    status: string;
    productId?: string;
    productName?: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;

  try {
    // 查找用户
    const user = await findUserByEmail(customer.email);

    if (!user) {
      console.log(`⚠️ 用户 ${customer.email} 尚未注册`);
      return;
    }

    // 更新订阅记录
    await createOrUpdateSubscription({
      userId: user.id,
      creemSubscriptionId: subscription.id,
      status: subscription.status,
      productId: subscription.productId,
      productName: subscription.productName,
    });

    // 更新用户订阅类型
    if (subscription.productId) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionType: subscription.productId,
        },
      });
    }

    console.log(`🔄 订阅更新 - 用户: ${customer.email}, 新计划: ${subscription.productName}`);
  } catch (error) {
    console.error('❌ 处理订阅更新失败:', error);
    throw error;
  }
}

async function handleSubscriptionPastDue(data: {
  subscription: {
    id: string;
    status: string;
    nextPaymentDate?: string;
  };
  customer: { email: string };
}) {
  const { subscription, customer } = data;

  try {
    // 查找用户
    const user = await findUserByEmail(customer.email);

    if (!user) {
      console.log(`⚠️ 用户 ${customer.email} 尚未注册`);
      return;
    }

    // 更新订阅记录
    await createOrUpdateSubscription({
      userId: user.id,
      creemSubscriptionId: subscription.id,
      status: 'PAST_DUE',
    });

    console.log(`⚠️ 订阅逾期 - 用户: ${customer.email}, 下次付款: ${subscription.nextPaymentDate || '未知'}`);
  } catch (error) {
    console.error('❌ 处理订阅逾期失败:', error);
    throw error;
  }
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

  try {
    // 查找用户
    const user = await findUserByEmail(customer.email);

    if (!user) {
      console.log(`⚠️ 用户 ${customer.email} 尚未注册`);
      return;
    }

    // 更新订阅记录
    await createOrUpdateSubscription({
      userId: user.id,
      creemSubscriptionId: subscription.id,
      status: 'PAUSED',
    });

    console.log(`⏸️ 订阅暂停 - 用户: ${customer.email}, 暂停时间: ${subscription.pausedAt}`);
  } catch (error) {
    console.error('❌ 处理订阅暂停失败:', error);
    throw error;
  }
}

// ========== 退款和争议处理函数 ==========

async function handleRefundCreated(data: {
  refund: {
    id: string;
    amount: number;
    currency: string;
    reason?: string;
    paymentId?: string;
  };
  subscription?: { id: string };
  customer: { email: string };
}) {
  const { refund, subscription, customer } = data;

  try {
    // 查找用户
    const user = await findUserByEmail(customer.email);

    if (!user) {
      console.log(`⚠️ 用户 ${customer.email} 尚未注册`);
      return;
    }

    // 如果有关联的支付记录，更新支付状态
    if (refund.paymentId) {
      await prisma.payment.updateMany({
        where: { creemPaymentId: refund.paymentId },
        data: { status: 'REFUNDED' },
      });

      // 创建退款记录
      const payment = await prisma.payment.findFirst({
        where: { creemPaymentId: refund.paymentId },
      });

      if (payment) {
        await prisma.refund.create({
          data: {
            paymentId: payment.id,
            creemRefundId: refund.id,
            amount: refund.amount,
            currency: refund.currency,
            reason: refund.reason,
            status: 'COMPLETED',
          },
        });
      }
    }

    // 如果是订阅退款，撤销访问权限
    if (subscription) {
      await revokeAccess(user.id);
    }

    console.log(`💸 退款创建 - 用户: ${customer.email}, 金额: ${refund.amount} ${refund.currency}, 原因: ${refund.reason || '未指定'}`);
  } catch (error) {
    console.error('❌ 处理退款创建失败:', error);
    throw error;
  }
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

  try {
    // 查找用户
    const user = await findUserByEmail(customer.email);

    if (!user) {
      console.log(`⚠️ 用户 ${customer.email} 尚未注册`);
      return;
    }

    // 创建争议记录
    await prisma.dispute.create({
      data: {
        userId: user.id,
        creemDisputeId: dispute.id,
        amount: dispute.amount,
        currency: dispute.currency,
        reason: dispute.reason,
        status: dispute.status,
      },
    });

    console.log(`⚖️ 争议创建 - 用户: ${customer.email}, 金额: ${dispute.amount} ${dispute.currency}, 原因: ${dispute.reason}, 状态: ${dispute.status}`);
  } catch (error) {
    console.error('❌ 处理争议创建失败:', error);
    throw error;
  }
}
