import { FC } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'

export const RewardsPage: FC = () => {
  const { user } = useAuthStore()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-header text-gold uppercase tracking-wide mb-2">
          🏆 REWARDS STORE 🏆
        </h1>
        <p className="text-xl text-tactical-light uppercase tracking-wide">
          Redeem Your Points for Epic Rewards
        </p>
        <div className="mt-4">
          <span className="text-lg text-gray-400">Your Balance: </span>
          <span className="text-3xl font-header text-gold">{user?.rank_points || 0} Points</span>
        </div>
      </div>

      {/* Empty State */}
      <Card>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎁</div>
          <div className="text-2xl font-header text-gray-400 uppercase tracking-wide mb-4">
            NO REWARDS YET - TIME TO CREATE SOME!
          </div>
          {user?.role === 'commander' && (
            <Button variant="gold">
              + CREATE REWARD
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

export default RewardsPage
