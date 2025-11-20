// SendGrid email client for themed reward delivery
// Note: In production, this would be called from a backend/edge function

export const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY || ''
export const SENDGRID_FROM_EMAIL = import.meta.env.VITE_SENDGRID_FROM_EMAIL || 'rewards@missioncommand.app'

interface RewardEmailData {
  recipientEmail: string
  recipientName: string
  agentCode: string
  rank: string
  totalPoints: number
  giftCardBrand: string
  giftCardDenomination: number
  giftCode: string
  redemptionUrl?: string
  missionsCompleted: number
}

// Generate military-themed HTML email for gift card delivery
export function generateRewardEmailHtml(data: RewardEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Courier New', monospace; background: #000; color: #fff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; }
    .header { background: #000; padding: 20px; text-align: center; border-bottom: 2px solid #00ff88; }
    .logo { color: #00ff88; font-size: 24px; font-weight: bold; }
    .content { padding: 30px; }
    .alert { background: #1a1a1a; border: 1px solid #00ff88; padding: 20px; text-align: center; margin-bottom: 20px; }
    .alert h1 { color: #00ff88; margin: 0 0 10px 0; font-size: 28px; text-transform: uppercase; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; }
    .stat { text-align: center; }
    .stat-value { font-size: 24px; color: #ffcc00; font-weight: bold; }
    .stat-label { font-size: 11px; color: #999; text-transform: uppercase; }
    .gift-card { background: #1a1a1a; border: 1px solid #333; padding: 20px; margin: 20px 0; }
    .gift-card h2 { color: #ffcc00; margin: 0 0 15px 0; font-size: 18px; }
    .code-box { background: #000; border: 2px solid #00ff88; padding: 15px; text-align: center; font-size: 20px; letter-spacing: 2px; margin: 15px 0; }
    .redeem-btn { display: inline-block; background: #00ff88; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 11px; border-top: 1px solid #333; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">▲ MISSION COMMAND</div>
      <div style="color: #999; font-size: 11px; text-transform: uppercase;">TACTICAL OPERATIONS SYSTEM</div>
    </div>
    <div class="content">
      <div class="alert">
        <h1>MISSION ACCOMPLISHED</h1>
        <p style="margin: 0; color: #999;">REWARD DELIVERED TO ${data.agentCode}</p>
      </div>

      <p>Agent <strong>${data.recipientName}</strong>,</p>
      <p>Your outstanding performance has earned you a reward. The following gift card has been authorized for immediate delivery:</p>

      <div class="gift-card">
        <h2>${data.giftCardBrand.toUpperCase()} - $${data.giftCardDenomination}</h2>
        <div class="code-box">${data.giftCode}</div>
        ${data.redemptionUrl ? `<p style="text-align: center;"><a href="${data.redemptionUrl}" class="redeem-btn">REDEEM NOW</a></p>` : ''}
      </div>

      <table style="width: 100%; margin: 20px 0;">
        <tr>
          <td style="text-align: center; padding: 10px;">
            <div class="stat-value">${data.rank}</div>
            <div class="stat-label">Current Rank</div>
          </td>
          <td style="text-align: center; padding: 10px;">
            <div class="stat-value">${data.totalPoints}</div>
            <div class="stat-label">Total Points</div>
          </td>
          <td style="text-align: center; padding: 10px;">
            <div class="stat-value">${data.missionsCompleted}</div>
            <div class="stat-label">Missions</div>
          </td>
        </tr>
      </table>

      <p style="color: #999; font-size: 13px;">Keep completing missions to earn more points and unlock greater rewards. Your next mission awaits.</p>
    </div>
    <div class="footer">
      <p>CLASSIFIED - MISSION COMMAND SYSTEM</p>
      <p>This message contains sensitive reward information. Do not share your gift code.</p>
    </div>
  </div>
</body>
</html>
  `
}

// Send reward email via SendGrid
export async function sendRewardEmail(data: RewardEmailData): Promise<boolean> {
  // In production, this would call SendGrid API from a backend function
  // For demo purposes, we'll just log the email
  console.log('Sending reward email:', {
    to: data.recipientEmail,
    subject: `MISSION ACCOMPLISHED - ${data.giftCardBrand} Gift Card Delivered`,
    html: generateRewardEmailHtml(data),
  })

  // Simulate API call
  return true
}
