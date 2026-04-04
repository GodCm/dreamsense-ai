-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'TRIALING', 'CANCELED', 'EXPIRED', 'PAST_DUE', 'UNPAID', 'PAUSED', 'SCHEDULED_TO_CANCEL');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_subscribed" BOOLEAN NOT NULL DEFAULT false,
    "subscription_type" TEXT,
    "free_trial_used" BOOLEAN NOT NULL DEFAULT false,
    "device_fingerprint" TEXT,
    "registration_count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dreams" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "dream_text" TEXT NOT NULL,
    "interpretation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "conversation_rounds" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "dreams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "creem_payment_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "creem_subscription_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "product_id" TEXT,
    "product_name" TEXT,
    "current_period_end" TIMESTAMP(3),
    "trial_end" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "creem_refund_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "reason" TEXT,
    "status" "RefundStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disputes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "creem_dispute_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disputes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "payments_creem_payment_id_key" ON "payments"("creem_payment_id");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- CreateIndex
CREATE INDEX "payments_creem_payment_id_idx" ON "payments"("creem_payment_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_creem_subscription_id_key" ON "subscriptions"("creem_subscription_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_creem_subscription_id_idx" ON "subscriptions"("creem_subscription_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "refunds_creem_refund_id_key" ON "refunds"("creem_refund_id");

-- CreateIndex
CREATE INDEX "refunds_payment_id_idx" ON "refunds"("payment_id");

-- CreateIndex
CREATE INDEX "refunds_creem_refund_id_idx" ON "refunds"("creem_refund_id");

-- CreateIndex
CREATE UNIQUE INDEX "disputes_creem_dispute_id_key" ON "disputes"("creem_dispute_id");

-- CreateIndex
CREATE INDEX "disputes_user_id_idx" ON "disputes"("user_id");

-- CreateIndex
CREATE INDEX "disputes_creem_dispute_id_idx" ON "disputes"("creem_dispute_id");

-- AddForeignKey
ALTER TABLE "dreams" ADD CONSTRAINT "dreams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
