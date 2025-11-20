// Tremendous API client for digital gift card fulfillment
// https://www.tremendous.com/docs

const TREMENDOUS_API_KEY = import.meta.env.VITE_TREMENDOUS_API_KEY || ''
const TREMENDOUS_BASE_URL = import.meta.env.VITE_TREMENDOUS_BASE_URL || 'https://testflight.tremendous.com/api/v2'

interface TremendousProduct {
  id: string
  name: string
  description: string
  category: string
  skus: { min: number; max: number }[]
  images: { src: string }[]
}

interface TremendousOrder {
  id: string
  rewards: TremendousReward[]
}

interface TremendousReward {
  id: string
  value: { denomination: number; currency_code: string }
  delivery: { method: string; status: string }
  recipient: { email: string; name: string }
}

// Create headers for Tremendous API requests
const getHeaders = () => ({
  'Authorization': `Bearer ${TREMENDOUS_API_KEY}`,
  'Content-Type': 'application/json',
})

// Get available products/gift cards
export async function getProducts(): Promise<TremendousProduct[]> {
  const response = await fetch(`${TREMENDOUS_BASE_URL}/products`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }

  const data = await response.json()
  return data.products || []
}

// Create an order for a gift card
export async function createOrder(params: {
  productId: string
  denomination: number
  recipientEmail: string
  recipientName: string
  campaignId?: string
  fundingSourceId?: string
}): Promise<TremendousOrder> {
  const response = await fetch(`${TREMENDOUS_BASE_URL}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      payment: {
        funding_source_id: params.fundingSourceId || import.meta.env.VITE_TREMENDOUS_FUNDING_SOURCE_ID,
      },
      rewards: [{
        value: {
          denomination: params.denomination,
          currency_code: 'USD',
        },
        delivery: {
          method: 'EMAIL',
        },
        recipient: {
          email: params.recipientEmail,
          name: params.recipientName,
        },
        products: [params.productId],
        campaign_id: params.campaignId || import.meta.env.VITE_TREMENDOUS_CAMPAIGN_ID,
      }],
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to create order: ${error.message || response.statusText}`)
  }

  const data = await response.json()
  return data.order
}

// Get order status
export async function getOrder(orderId: string): Promise<TremendousOrder> {
  const response = await fetch(`${TREMENDOUS_BASE_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch order: ${response.statusText}`)
  }

  const data = await response.json()
  return data.order
}

// Get reward details (includes the actual gift code)
export async function getReward(rewardId: string): Promise<TremendousReward & { credential: { value: string } }> {
  const response = await fetch(`${TREMENDOUS_BASE_URL}/rewards/${rewardId}`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch reward: ${response.statusText}`)
  }

  const data = await response.json()
  return data.reward
}

// Calculate pricing
export function calculatePricing(denomination: number, pointCostPerDollar: number, markup: number) {
  const pointsRequired = denomination * pointCostPerDollar
  const tremendousFee = denomination * 0.05 // 5% Tremendous fee
  const tremendousCost = denomination + tremendousFee
  const parentCost = denomination * (1 + markup)
  const profit = parentCost - tremendousCost

  return {
    pointsRequired,
    parentCost: Math.round(parentCost * 100) / 100,
    tremendousCost: Math.round(tremendousCost * 100) / 100,
    profit: Math.round(profit * 100) / 100,
  }
}
