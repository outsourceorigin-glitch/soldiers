import { CurrentPlanName, PlanType } from '@prisma/client'
import { db } from './db'

/**
 * Check if specific soldier is unlocked
 */
// export async function isSoldierUnlocked(
//   workspaceId: string,
//   soldierName: string
// ): Promise<boolean> {
//   try {
//     const subscription = await db.billingSubscription.findUnique({
//       where: { workspaceId },
//     })

//     // If no subscription exists, soldier is locked
//     if (!subscription) {
//       return false
//     }

//     // Check if subscription is active (not cancelled) and not expired
//     const isActive = subscription.status === 'ACTIVE'
//     const notExpired = new Date() < subscription.currentPeriodEnd

//     if (!isActive || !notExpired) {
//       return false
//     }

//     // Check if this specific soldier is unlocked
//     return subscription.unlockedSoldiers?.includes(soldierName) || false
//   } catch (error) {
//     console.error('Error checking soldier unlock:', error)
//     return false
//   }
// }

/**
 * Check if workspace has active subscription
 */
// export async function hasActiveSubscription(
//   workspaceId: string
// ): Promise<boolean> {
//   try {
//     const subscription = await db.billingSubscription.findUnique({
//       where: { workspaceId },
//     })

//     // If no subscription exists, return false
//     if (!subscription) {
//       return false
//     }

//     // Check if subscription is active (not cancelled) and not expired
//     const isActive = subscription.status === 'ACTIVE'
//     const notExpired = new Date() < subscription.currentPeriodEnd

//     return isActive && notExpired
//   } catch (error) {
//     console.error('Error checking subscription:', error)
//     return false
//   }
// }

/**
 * Get workspace subscription details
 */
// export async function getSubscription(workspaceId: string) {
//   try {
//     return await db.billingSubscription.findUnique({
//       where: { workspaceId },
//     })
//   } catch (error) {
//     console.error('Error getting subscription:', error)
//     return null
//   }
// }

/**
 * Get unlocked soldiers for workspace
 */
export async function getUnlockedSoldiers(userId: string): Promise<string[]> {
  try {
    const subscription = await db.billingSubscription.findUnique({
      where: { clerkId: userId },
    })

    // If no subscription exists, return empty array
    if (!subscription) {
      return []
    }

    return subscription.unlockedSoldiers || []
  } catch (error) {
    console.error('Error getting unlocked soldiers:', error)
    return []
  }
}

/**
 * Check if workspace can access premium features
 */
// export async function canAccessPremiumFeatures(
//   workspaceId: string
// ): Promise<boolean> {
//   return await hasActiveSubscription(workspaceId)
// }

interface StoreStripePaymentInDB {
  clerkUserId: string
  customerId: string
  stripeSessionId: string
  totalAmount: number
  paymentIntent: string
  emailAddress: string
  currency: string
  subscriptionId: string
  subscriptionStartDate: Date
  subscriptionEndDate: Date
  unlockedAgents: string[]
  planType: string
  planId: 'STARTER' | 'PROFESSIONAL' | 'SINGLE' | 'SOLDIERSX'
  priceId: string
}

export const storeStripePaymentInDB = async ({
  clerkUserId,
  customerId,
  emailAddress,
  currency,
  subscriptionEndDate,
  subscriptionStartDate,
  paymentIntent,
  stripeSessionId,
  subscriptionId,
  totalAmount,
  unlockedAgents,
  planId,
  planType,
  priceId,
}: StoreStripePaymentInDB) => {
  await db.payment.create({
    data: {
      email: emailAddress,
      clerkId: clerkUserId,
      stripeCustomerId: customerId as string,
      stripeSessionId: stripeSessionId,
      amount: totalAmount || 0,
      currency: currency || 'usd',
      status: 'SUCCEEDED',
      paymentIntentId: paymentIntent || null,
    },
  })
  await db.user.update({
    where: {
      clerkId: clerkUserId,
    },
    data: {
      stripeCustomerId: customerId as string,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: subscriptionId,
      subscriptionStartDate,
      subscriptionEndDate,
      subscriptionStatus: 'ACTIVE',
      currentPlanName:
        planId === 'STARTER' ? 'MONTHLY' : ('YEARLY' as CurrentPlanName),
      cancelAtPeriodEnd: true,
    },
  })
  await db.billingSubscription.create({
    data: {
      planId: planId,
      planType: planType as PlanType,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      unlockedSoldiers: unlockedAgents,
      status: 'ACTIVE',
      currentPeriodStart: subscriptionStartDate,
      currentPeriodEnd: subscriptionEndDate,
      clerkId: clerkUserId,
      cancelAtPeriodEnd: true,
      email: emailAddress || '',
      interval: planId === 'STARTER' ? 'MONTH' : 'YEAR',
    },
  })
}
