import { FC } from 'react'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'

export const RewardsPage: FC = () => {
  const { user } = useAuthStore()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-1">
          REWARDS STORE
        </h1>
        <p className="text-sm font-mono text-text-muted uppercase">
          Redeem Your Points for Rewards
        </p>
        <div className="mt-4">
          <span className="text-sm font-mono text-text-muted">Your Balance: </span>
          <span className="text-2xl font-mono font-bold text-accent-secondary">{user?.rank_points || 0}</span>
          <span className="text-sm font-mono text-text-muted ml-1">POINTS</span>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-bg-secondary border border-border-primary p-8">
        <div className="text-center py-16">
          <div className="text-accent-primary text-3xl mb-4">▲</div>
          <div className="text-sm font-mono text-text-muted uppercase tracking-wider mb-6">
            NO REWARDS YET - TIME TO CREATE SOME
          </div>
          {user?.role === 'commander' && (
            <Button variant="gold">
              + CREATE REWARD
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RewardsPage
