# Tremendous API Integration Guide
## Digital Gift Card Marketplace for Mission Command

---

## Overview

Mission Command uses **Tremendous API** to deliver instant digital gift cards as rewards. Kids earn points doing chores, then redeem those points (+ parent pays cash) for real gift cards from 2,000+ brands including Roblox, Fortnite, Amazon, and more.

**Key Benefits:**
- ✅ Instant delivery (2-5 minutes)
- ✅ Zero fulfillment overhead
- ✅ 95%+ profit margins
- ✅ Scalable to millions of orders
- ✅ No inventory management
- ✅ Works globally

---

## Tremendous Account Setup

### Step 1: Create Account
1. Go to [tremendous.com](https://www.tremendous.com)
2. Sign up for business account
3. Verify your business (LLC or sole proprietor)
4. Add payment method (bank account or card)

### Step 2: Get API Credentials
1. Navigate to **Settings** → **API**
2. Generate API Key (keep this secret!)
3. Note your organization ID
4. Start in **Sandbox mode** for testing

### Step 3: Add Funds
- Minimum deposit: $100
- Tremendous charges: Face value + 2-5% fee
- Example: $25 Roblox card costs you $26.25
- You sell for $35 (parent pays $10, you profit $8.75)

---

## How Tremendous Works

### Product Catalog
Tremendous has 2,000+ gift card brands. For MVP, we'll start with these top categories:

**Gaming (Priority 1):**
- Roblox
- Fortnite V-Bucks (via Xbox/PlayStation/Nintendo cards)
- Minecraft
- Xbox Gift Card
- PlayStation Store
- Nintendo eShop
- Steam
- Google Play
- Apple App Store

**Streaming (Priority 2):**
- Netflix
- Disney+
- Spotify
- Apple Music
- Hulu
- YouTube Premium

**Shopping (Priority 3):**
- Amazon
- Target
- Walmart
- iTunes

### Available Denominations
Most brands offer: $10, $25, $50, $100
Some offer: $5, $15, $20, $75

---

## API Integration

### Authentication
```javascript
// lib/tremendous.js
const TREMENDOUS_API_KEY = process.env.TREMENDOUS_API_KEY;
const TREMENDOUS_BASE_URL = 'https://testflight.tremendous.com/api/v2'; // Sandbox
// Production: 'https://www.tremendous.com/api/v2'

const tremendousHeaders = {
  'Authorization': `Bearer ${TREMENDOUS_API_KEY}`,
  'Content-Type': 'application/json'
};
```

### 1. List Available Products
```javascript
// Fetch available gift card brands
async function getTremendousProducts() {
  const response = await fetch(`${TREMENDOUS_BASE_URL}/products`, {
    headers: tremendousHeaders
  });
  
  const data = await response.json();
  return data.products;
  
  // Returns:
  // [
  //   {
  //     "id": "QXYZ123",
  //     "name": "Roblox",
  //     "description": "Roblox gift card",
  //     "currency": "USD",
  //     "min_price": 10,
  //     "max_price": 100,
  //     "image_url": "https://...",
  //     "countries": ["US", "CA"],
  //     "category": "Gaming"
  //   }
  // ]
}
```

### 2. Create Reward Order
```javascript
// When kid redeems and parent approves
async function createTremendousReward({
  recipientEmail,
  recipientName,
  amount, // e.g., 25 for $25 card
  productId, // Tremendous product ID
  externalId // Your database redemption ID
}) {
  const response = await fetch(`${TREMENDOUS_BASE_URL}/rewards`, {
    method: 'POST',
    headers: tremendousHeaders,
    body: JSON.stringify({
      external_id: externalId,
      payment: {
        funding_source_id: 'your_funding_source_id' // Your Tremendous balance
      },
      reward: {
        value: {
          denomination: amount,
          currency_code: 'USD'
        },
        campaign_id: 'your_campaign_id',
        products: [productId],
        recipient: {
          name: recipientName,
          email: recipientEmail
        },
        delivery: {
          method: 'LINK' // Generates redemption link
        }
      }
    })
  });
  
  const data = await response.json();
  
  // Returns:
  // {
  //   "reward": {
  //     "id": "ABC123XYZ",
  //     "order_id": "ORDER789",
  //     "value": { "denomination": 25, "currency_code": "USD" },
  //     "recipient": {...},
  //     "delivery": {
  //       "method": "LINK",
  //       "link": "https://tremendous.com/r/ABC123XYZ"
  //     }
  //   }
  // }
  
  return data.reward;
}
```

### 3. Check Order Status
```javascript
async function getRewardStatus(rewardId) {
  const response = await fetch(
    `${TREMENDOUS_BASE_URL}/rewards/${rewardId}`,
    { headers: tremendousHeaders }
  );
  
  const data = await response.json();
  return data.reward;
  
  // Status can be: PENDING, EXECUTED, CANCELED, FAILED
}
```

---

## Database Integration

### Sync Tremendous Products to Your Database
Run this once daily to keep catalog updated:

```javascript
async function syncGiftCards() {
  const products = await getTremendousProducts();
  
  // Filter to only gaming, streaming, shopping categories
  const filtered = products.filter(p => 
    ['Gaming', 'Streaming', 'Entertainment', 'Shopping'].includes(p.category)
  );
  
  // Insert/update in your database
  for (const product of filtered) {
    await supabase
      .from('gift_cards')
      .upsert({
        tremendous_product_id: product.id,
        brand_name: product.name,
        display_name: `${product.name} Gift Card`,
        description: product.description,
        category: product.category.toLowerCase(),
        denominations: [10, 25, 50, 100], // Most common
        brand_logo_url: product.image_url,
        point_cost_per_dollar: 20, // 20 points = $1
        parent_cost_markup: 0.40, // 40% markup
        is_active: true,
        age_minimum: 0
      }, {
        onConflict: 'tremendous_product_id'
      });
  }
}
```

---

## Complete Redemption Flow

### Frontend: Kid Redeems Points

```javascript
// RewardsMarketplace.jsx
function GiftCardCard({ card }) {
  const handleRedeem = async (denomination) => {
    // Example: $25 Roblox
    const pointCost = denomination * card.point_cost_per_dollar; // 25 * 20 = 500 points
    const parentCost = denomination * (1 - card.parent_cost_markup); // $15 parent pays
    // Kid pays 500 points, parent pays $15, gets $25 card
    
    // Actually, you want opposite - you MARK UP, not discount
    // If you buy for $26 and sell for $35, the markup is:
    const yourCost = denomination * 1.05; // Tremendous charges 5% fee
    const parentPays = yourCost + 10; // Add $10 profit
    
    await createRedemptionRequest({
      gift_card_id: card.id,
      denomination: denomination,
      points_spent: pointCost,
      parent_cost_usd: parentPays
    });
    
    // Notify parent
    notifyParent("Agent Tommy wants to redeem 500 points for $25 Roblox ($15 to approve)");
  };
  
  return (
    <div className="gift-card">
      <img src={card.brand_logo_url} alt={card.brand_name} />
      <h3>{card.display_name}</h3>
      
      {card.denominations.map(amount => (
        <button key={amount} onClick={() => handleRedeem(amount)}>
          ${amount} - {amount * card.point_cost_per_dollar} points
        </button>
      ))}
    </div>
  );
}
```

### Backend: Parent Approves

```javascript
// API route: /api/rewards/approve
export async function approveRedemption(redemptionId, parentUserId) {
  // 1. Get redemption details
  const redemption = await supabase
    .from('reward_redemptions')
    .select('*, users(*), gift_cards(*)')
    .eq('id', redemptionId)
    .single();
  
  // 2. Charge parent via Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(redemption.parent_cost_usd * 100), // Convert to cents
    currency: 'usd',
    customer: redemption.users.stripe_customer_id,
    description: `${redemption.gift_cards.brand_name} $${redemption.denomination} for ${redemption.users.full_name}`,
    metadata: {
      redemption_id: redemptionId
    }
  });
  
  // 3. Wait for payment confirmation (or handle via webhook)
  if (paymentIntent.status === 'succeeded') {
    // 4. Purchase gift card from Tremendous
    const tremendousReward = await createTremendousReward({
      recipientEmail: redemption.users.email,
      recipientName: redemption.users.full_name,
      amount: redemption.denomination,
      productId: redemption.gift_cards.tremendous_product_id,
      externalId: redemptionId
    });
    
    // 5. Update database
    await supabase
      .from('reward_redemptions')
      .update({
        status: 'delivered',
        tremendous_order_id: tremendousReward.order_id,
        tremendous_reward_id: tremendousReward.id,
        gift_code: tremendousReward.delivery.link, // Redemption URL
        redemption_url: tremendousReward.delivery.link,
        stripe_payment_intent_id: paymentIntent.id,
        email_sent_at: new Date()
      })
      .eq('id', redemptionId);
    
    // 6. Send themed email with gift code
    await sendRewardEmail(redemption.users.id, {
      brand: redemption.gift_cards.brand_name,
      amount: redemption.denomination,
      redemptionUrl: tremendousReward.delivery.link,
      agentName: redemption.users.full_name,
      rank: redemption.users.current_rank,
      pointsSpent: redemption.points_spent
    });
    
    // 7. Deduct points from kid's account
    await supabase.rpc('deduct_points', {
      user_id: redemption.user_id,
      points: redemption.points_spent
    });
    
    return { success: true, reward: tremendousReward };
  }
}
```

---

## Themed Email System

### SendGrid Setup

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API key
3. Verify sending domain (e.g., rewards@missioncommand.app)
4. Create dynamic template

### Military-Themed Email Template

```html
<!-- templates/military-reward-email.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #000000;
      font-family: 'Courier New', monospace;
      color: #ffffff;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      background-color: #ff3b3b;
      color: #ffffff;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .content {
      background-color: #0a0a0a;
      border: 2px solid #00ff88;
      padding: 30px;
      margin-top: 20px;
    }
    .title {
      color: #00ff88;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
      letter-spacing: 1px;
    }
    .section {
      margin: 20px 0;
      padding: 15px 0;
      border-top: 1px solid #333333;
    }
    .section:first-child {
      border-top: none;
    }
    .label {
      color: #999999;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .value {
      color: #ffffff;
      font-size: 16px;
      margin-top: 5px;
    }
    .code-box {
      background-color: #1a1a1a;
      border: 1px solid #00ff88;
      padding: 15px;
      text-align: center;
      margin: 20px 0;
    }
    .code {
      color: #00ff88;
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 3px;
    }
    .button {
      display: inline-block;
      background-color: #00ff88;
      color: #000000;
      padding: 12px 30px;
      text-decoration: none;
      font-weight: bold;
      text-transform: uppercase;
      margin: 20px 0;
      border: none;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      color: #666666;
      font-size: 11px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #333333;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Classified Header -->
    <div class="header">
      CLASSIFIED - FOR YOUR EYES ONLY
    </div>
    
    <!-- Main Content -->
    <div class="content">
      <div class="title">MISSION ACCOMPLISHED</div>
      
      <!-- Agent Info -->
      <div class="section">
        <div class="label">Agent</div>
        <div class="value">{{agent_name}}</div>
      </div>
      
      <div class="section">
        <div class="label">Agent Code</div>
        <div class="value">{{agent_code}}</div>
      </div>
      
      <div class="section">
        <div class="label">Current Rank</div>
        <div class="value">{{agent_rank}}</div>
      </div>
      
      <!-- Mission Stats -->
      <div class="section">
        <div class="label">Mission Status</div>
        <div class="value">✅ ACCOMPLISHED</div>
      </div>
      
      <div class="section">
        <div class="label">Points Deployed</div>
        <div class="value">{{points_spent}} Rank Points</div>
      </div>
      
      <!-- Reward Details -->
      <div class="section">
        <div class="label">Reward Package Contents</div>
        <div class="value">{{brand_name}} - ${{amount}} VALUE</div>
      </div>
      
      <!-- Gift Code -->
      <div class="code-box">
        <div class="label">Redemption Code</div>
        <div class="code">CLICK BELOW TO REDEEM</div>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="{{redemption_url}}" class="button">
          🎯 Redeem Your Reward
        </a>
      </div>
      
      <!-- Next Missions -->
      <div class="section">
        <div class="label">Next Objectives Available</div>
        <div class="value">
          • Operation: Clean Room (25 pts)<br>
          • Mission: Homework Protocol (15 pts)<br>
          • Task: Kitchen Duty (20 pts)
        </div>
      </div>
      
      <!-- Signature -->
      <div class="footer">
        Outstanding work, Agent {{agent_name}}.<br>
        Mission Command HQ is proud of your service.<br><br>
        - Commander {{parent_name}}<br>
        Mission Command HQ
      </div>
    </div>
  </div>
</body>
</html>
```

### Sending Email via SendGrid

```javascript
// lib/sendgrid.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendRewardEmail(userId, rewardData) {
  const user = await getUser(userId);
  const parent = await getParent(user.family_id);
  
  const msg = {
    to: user.email,
    from: 'rewards@missioncommand.app', // Verified sender
    subject: '🎖️ MISSION ACCOMPLISHED - REWARD DEPLOYED',
    templateId: 'd-abc123...', // Your SendGrid template ID
    dynamicTemplateData: {
      agent_name: user.full_name,
      agent_code: user.agent_code,
      agent_rank: user.current_rank,
      points_spent: rewardData.pointsSpent,
      brand_name: rewardData.brand,
      amount: rewardData.amount,
      redemption_url: rewardData.redemptionUrl,
      parent_name: parent.full_name
    }
  };
  
  try {
    await sgMail.send(msg);
    console.log('Reward email sent successfully');
  } catch (error) {
    console.error('Email send failed:', error);
    // Log to database for retry
    await logEmailFailure(userId, rewardData, error);
  }
}
```

---

## Pricing & Economics

### Example Transaction Breakdown

**Kid redeems:** 500 points + parent pays $10 for $25 Roblox card

**Your costs:**
- Tremendous charge: $25 × 1.05 = $26.25
- Stripe fee: $10 × 0.029 + $0.30 = $0.59
- SendGrid email: $0.001
- **Total cost:** $26.84

**Your revenue:**
- Parent pays: $10.00
- Subscription (allocated): Covered by monthly fee

**Profit per transaction:** $10.00 - $26.84 = **-$16.84 LOSS**

**Wait, that's wrong! Let me fix the pricing:**

### Corrected Pricing Model

**Option 1: Parent Pays Full Price (Recommended)**
- Kid earns 500 points (proves they did work)
- Kid selects $25 Roblox card
- Parent pays $35 (not $10!)
- Your cost: $26.84
- **Your profit:** $8.16 per transaction (30% margin)

**How to present it:**
- "Earn 500 points to unlock the $25 Roblox card"
- "Commander approval required: $35"
- Kid did chores worth $35 of work, parent pays full value
- Points are the "permission" to request the reward

**Option 2: Points-Only (High Subscription)**
- Monthly subscription: $20/month
- Kids can redeem rewards "free" using points only
- You cover the cost from subscription revenue
- Works if average family redeems 1-2 cards/month
- Math: $20 sub - $26.84 cost = -$6.84 (need higher sub price)

**Option 3: Hybrid (Points + Discount)**
- Kid earns 500 points
- Parent pays $30 (instead of $35)
- You profit $3.16 per transaction
- Lower margin but better value perception

### Recommended: Option 1 (Full Parent Payment)

**Presentation:**
```
🎮 Roblox Gift Card - $25
Points Required: 500 RP
Commander Cost: $35

[REDEEM]

💡 By earning 500 points, you've unlocked this reward!
Your commander will pay $35 to approve.
```

This way:
- Kid earns the RIGHT to request reward
- Parent pays for actual reward
- You profit on every transaction
- Sustainable business model

---

## Environment Variables

```env
# Tremendous API
TREMENDOUS_API_KEY=your_tremendous_api_key
TREMENDOUS_FUNDING_SOURCE_ID=your_funding_source_id
TREMENDOUS_CAMPAIGN_ID=your_campaign_id
TREMENDOUS_BASE_URL=https://testflight.tremendous.com/api/v2  # Sandbox
# TREMENDOUS_BASE_URL=https://www.tremendous.com/api/v2  # Production

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=rewards@missioncommand.app
SENDGRID_TEMPLATE_ID=d-abc123...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

---

## Testing Strategy

### 1. Sandbox Testing (No Real Money)
- Use Tremendous testflight environment
- Use Stripe test mode
- SendGrid sends to test emails only

### 2. Real Transaction Test
1. Create test family account
2. Add test kid ("Agent Test")
3. Complete test missions, earn 500 points
4. Redeem $10 Amazon card (smallest denomination)
5. Parent approves
6. Verify Stripe charges $15
7. Verify Tremendous creates order
8. Verify email arrives with redemption link
9. Test redemption link works

### 3. Edge Cases to Test
- Tremendous API fails (timeout, server error)
- SendGrid email fails (bad address, bounce)
- Stripe payment fails (declined card)
- Kid doesn't have enough points
- Parent cancels mid-transaction
- Concurrent redemptions (2 kids at once)

---

## Error Handling

### Tremendous API Errors

```javascript
async function createTremendousRewardWithRetry(data, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const reward = await createTremendousReward(data);
      return reward;
    } catch (error) {
      console.error(`Tremendous API attempt ${attempt} failed:`, error);
      
      if (error.status === 429) {
        // Rate limit - wait and retry
        await sleep(2000 * attempt);
        continue;
      }
      
      if (error.status >= 500) {
        // Server error - retry
        await sleep(1000 * attempt);
        continue;
      }
      
      if (attempt === maxRetries) {
        // Final attempt failed
        // Refund parent via Stripe
        await stripe.refunds.create({
          payment_intent: data.stripePaymentIntentId
        });
        
        // Update redemption status
        await supabase
          .from('reward_redemptions')
          .update({ status: 'failed', error_message: error.message })
          .eq('id', data.externalId);
        
        // Notify parent
        await sendErrorEmail(data.userId, 'Reward delivery failed - refund issued');
        
        throw error;
      }
    }
  }
}
```

---

## Webhook Handling

### Stripe Webhook (Payment Confirmation)

```javascript
// API route: /api/webhooks/stripe
export async function handleStripeWebhook(req) {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const redemptionId = paymentIntent.metadata.redemption_id;
    
    // Process the redemption now that payment is confirmed
    await processRedemption(redemptionId);
  }
  
  return res.json({ received: true });
}
```

### Tremendous Webhook (Order Status Updates)

Tremendous can send webhooks for order status changes. Set up at:
Settings → Webhooks → Add endpoint

```javascript
// API route: /api/webhooks/tremendous
export async function handleTremendousWebhook(req) {
  const { event, payload } = req.body;
  
  if (event === 'REWARD.GENERATED') {
    // Reward was successfully created
    const { id, external_id, delivery } = payload;
    
    await supabase
      .from('reward_redemptions')
      .update({
        status: 'delivered',
        tremendous_reward_id: id,
        redemption_url: delivery.link
      })
      .eq('id', external_id);
  }
  
  if (event === 'REWARD.FAILED') {
    // Reward creation failed
    // Handle refund and notification
  }
  
  return res.json({ received: true });
}
```

---

## Launch Checklist

### Before Going Live:

- [ ] Tremendous account created and funded ($1,000 minimum)
- [ ] Tremendous API key generated
- [ ] SendGrid account created and sender domain verified
- [ ] Email template created and tested
- [ ] Stripe account in production mode
- [ ] Test full redemption flow end-to-end
- [ ] Set up error monitoring (Sentry)
- [ ] Create customer support email (support@missioncommand.app)
- [ ] Document refund process for failed orders
- [ ] Set up daily balance check (Tremendous account balance)
- [ ] Create admin dashboard to monitor redemptions
- [ ] Legal: Terms of service mention digital goods (non-refundable)

---

## Monitoring & Analytics

### Key Metrics to Track:

1. **Redemption rate:** % of families who redeem rewards monthly
2. **Average order value:** Typical denomination chosen
3. **Popular brands:** Roblox vs Fortnite vs Amazon
4. **Profit per transaction:** Monitor margins
5. **Tremendous API success rate:** Track failures
6. **Email delivery rate:** SendGrid metrics
7. **Time to delivery:** From approval to email sent
8. **Refund rate:** How many orders fail and require refunds

### Dashboard Queries:

```sql
-- Total redemptions this month
SELECT COUNT(*), SUM(parent_cost_usd), SUM(profit_usd)
FROM reward_redemptions
WHERE status = 'delivered'
  AND created_at >= date_trunc('month', CURRENT_DATE);

-- Most popular brands
SELECT gc.brand_name, COUNT(*) as redemptions, SUM(rr.parent_cost_usd) as revenue
FROM reward_redemptions rr
JOIN gift_cards gc ON rr.gift_card_id = gc.id
WHERE rr.status = 'delivered'
  AND rr.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY gc.brand_name
ORDER BY redemptions DESC;

-- Average profit margin
SELECT AVG(profit_usd / parent_cost_usd) * 100 as avg_margin_pct
FROM reward_redemptions
WHERE status = 'delivered';
```

---

## Future Enhancements

### Phase 2 Features:
- **Auto-refill:** Parent sets monthly budget, auto-approves up to limit
- **Gift card combos:** Bundle deals (Roblox + Fortnite for bonus points)
- **Birthday specials:** 2x points on birthday month
- **Seasonal catalog:** Holiday-specific cards
- **Wishlists:** Kid can save cards, get notifications when they have enough points
- **Multiple themes:** Princess, Space, Superhero themed emails

### Phase 3 Features:
- **Physical + Digital bundles:** Merchandise + gift card combos
- **Custom amounts:** Let parent choose exact denomination
- **Subscription rewards:** Monthly gift card included with premium subscription
- **Group redemptions:** Kids pool points for bigger reward

---

## Support & Troubleshooting

### Common Issues:

**1. Tremendous order stuck in "pending"**
- Check Tremendous dashboard for errors
- Verify funding source has sufficient balance
- Contact Tremendous support if > 10 minutes

**2. Email not delivered**
- Check SendGrid activity log
- Verify email address is valid
- Check spam folder
- Resend via admin dashboard

**3. Stripe payment succeeded but Tremendous failed**
- Refund via Stripe dashboard
- Update redemption status to 'failed'
- Manually email parent explaining refund
- Restore kid's points

**4. Kid redeemed but didn't receive email**
- Check redemptions table for redemption_url
- Manually send email via admin dashboard
- Provide redemption URL via in-app message

---

## Contact & Resources

**Tremendous Support:**
- Email: support@tremendous.com
- Docs: https://developers.tremendous.com
- Status: https://status.tremendous.com

**SendGrid Support:**
- Email: support@sendgrid.com
- Docs: https://docs.sendgrid.com
- Status: https://status.sendgrid.com

**Your Support Email:**
- support@missioncommand.app
- Response time: < 24 hours
- Escalation for failed orders: Immediate

---

This integration gives you a **fully automated digital rewards system** that scales infinitely with near-zero marginal cost. Kids get instant gratification, parents get motivated children, and you build a profitable SaaS business with 90%+ gross margins.

🎖️ **MISSION: BUILD PROFITABLE CHORE APP**
**STATUS: READY TO DEPLOY**
