// 创建测试账号脚本
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('test123456', 10);

  // 创建未订阅账号
  const freeUser = await prisma.user.upsert({
    where: { email: 'free@test.com' },
    update: {},
    create: {
      email: 'free@test.com',
      passwordHash: password,
      isSubscribed: false,
      freeTrialUsed: false,
      registrationCount: 1,
    },
  });
  console.log('✅ 未订阅账号已创建:', freeUser.email);

  // 创建已订阅账号
  const premiumUser = await prisma.user.upsert({
    where: { email: 'premium@test.com' },
    update: {},
    create: {
      email: 'premium@test.com',
      passwordHash: password,
      isSubscribed: true,
      subscriptionType: 'premium',
      freeTrialUsed: true,
      registrationCount: 1,
    },
  });
  console.log('✅ 已订阅账号已创建:', premiumUser.email);

  console.log('\n📋 测试账号信息：');
  console.log('─'.repeat(40));
  console.log('未订阅账号：');
  console.log('  邮箱: free@test.com');
  console.log('  密码: test123456');
  console.log('\n已订阅账号：');
  console.log('  邮箱: premium@test.com');
  console.log('  密码: test123456');
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
