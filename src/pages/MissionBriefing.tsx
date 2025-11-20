import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export const MissionBriefing: FC = () => {
  const { id } = useParams()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-wider mb-1">
          MISSION BRIEFING
        </h1>
        <p className="text-sm font-mono text-text-muted uppercase">
          Classified Mission #{id}
        </p>
      </div>

      <div className="bg-bg-secondary border border-border-primary p-6">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-mono font-bold text-white uppercase mb-2">
                Operation: Clean Room
              </h2>
              <Badge variant="ready">READY</Badge>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-text-muted uppercase">Points</div>
              <div className="text-3xl font-mono font-bold text-accent-secondary">+25</div>
            </div>
          </div>

          <div className="border-t border-border-primary pt-6">
            <h3 className="text-sm font-mono font-bold text-accent-primary uppercase mb-3">
              Mission Details
            </h3>
            <p className="text-sm font-mono text-text-secondary">
              This is a detailed mission description. Agent must complete all objectives to receive full points and commendations.
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button variant="primary" fullWidth>
              ACCEPT MISSION
            </Button>
            <Button variant="secondary" fullWidth>
              MARK COMPLETE
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MissionBriefing
