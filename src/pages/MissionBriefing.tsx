import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export const MissionBriefing: FC = () => {
  const { id } = useParams()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-header text-gold uppercase tracking-wide mb-2">
          MISSION BRIEFING
        </h1>
        <p className="text-xl text-tactical-light uppercase tracking-wide">
          Classified Mission #{id}
        </p>
      </div>

      <Card>
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-header text-white uppercase mb-2">
                Operation: Clean Room
              </h2>
              <Badge variant="info">🟢 READY</Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 uppercase">Points</div>
              <div className="text-4xl font-header text-gold">+25</div>
            </div>
          </div>

          <div className="border-t-2 border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-tactical-light uppercase mb-3">Mission Details</h3>
            <p className="text-gray-300">
              This is a detailed mission description. Agent must complete all objectives to receive full points and commendations.
            </p>
          </div>

          <div className="flex space-x-4">
            <Button variant="primary" fullWidth>
              ACCEPT MISSION
            </Button>
            <Button variant="secondary" fullWidth>
              MARK COMPLETE
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default MissionBriefing
