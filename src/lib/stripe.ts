import { loadStripe, Stripe } from '@stripe/stripe-js'

// Initialize Stripe
let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      console.warn('Stripe publishable key not found')
      return Promise.resolve(null)
    }
    stripePromise = loadStripe(key)
  }
  return stripePromise
}

// Stripe price IDs - these should match your Stripe dashboard
export const STRIPE_PRICES = {
  MONTHLY: import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID || 'price_monthly_12',
  ANNUAL: import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID || 'price_annual_120',
}

// Pricing constants
export const PRICING = {
  MONTHLY_PRICE: 12,
  ANNUAL_PRICE: 120,
  ANNUAL_SAVINGS: 24, // $12 * 12 - $120 = $24 saved
  TRIAL_DAYS: 14,
}

// Create a checkout session for subscription
export const createCheckoutSession = async (
  familyId: string,
  email: string,
  priceType: 'monthly' | 'annual' = 'monthly'
): Promise<{ sessionId: string; url: string } | null> => {
  try {
    // In production, this would call your backend API which creates the Stripe checkout session
    // For now, we'll return a placeholder
    const priceId = priceType === 'monthly' ? STRIPE_PRICES.MONTHLY : STRIPE_PRICES.ANNUAL

    // This should be an API call to your backend
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        family_id: familyId,
        email,
        price_id: priceId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const session = await response.json()
    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return null
  }
}

// Redirect to Stripe checkout
export const redirectToCheckout = async (sessionId: string): Promise<void> => {
  const stripe = await getStripe()
  if (!stripe) {
    throw new Error('Stripe not initialized')
  }

  const { error } = await stripe.redirectToCheckout({ sessionId })
  if (error) {
    throw error
  }
}

// Create a customer portal session for managing subscription
export const createCustomerPortalSession = async (
  customerId: string
): Promise<{ url: string } | null> => {
  try {
    // This should be an API call to your backend
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: customerId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create portal session')
    }

    const session = await response.json()
    return session
  } catch (error) {
    console.error('Error creating portal session:', error)
    return null
  }
}

// Format price for display
export const formatPrice = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Calculate subscription status display
export const getSubscriptionStatusDisplay = (status: string): {
  label: string
  variant: 'complete' | 'verification' | 'danger'
} => {
  switch (status) {
    case 'active':
      return { label: 'ACTIVE', variant: 'complete' }
    case 'trial':
      return { label: 'TRIAL', variant: 'verification' }
    case 'past_due':
      return { label: 'PAST DUE', variant: 'danger' }
    case 'cancelled':
      return { label: 'CANCELLED', variant: 'danger' }
    default:
      return { label: status.toUpperCase(), variant: 'verification' }
  }
}
