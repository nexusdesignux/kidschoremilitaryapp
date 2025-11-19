import { useState } from 'react';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Badge from './components/ui/Badge';
import ProgressBar from './components/ui/ProgressBar';
import StatusIndicator from './components/ui/StatusIndicator';

function App() {
  const [missionProgress, setMissionProgress] = useState(65);

  return (
    <div className="min-h-screen p-8">
      {/* Top Header */}
      <header className="mb-8 border-b-3 border-military-gold-500 pb-6">
        <div className="classified-header mb-4">
          <h1 className="text-mission text-center py-4">
            MISSION COMMAND HQ
          </h1>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <Badge variant="rank" icon="⭐">AGENT STATUS: ACTIVE</Badge>
          </div>
          <div className="flex gap-4">
            <Badge variant="military">CLEARANCE: LEVEL 5</Badge>
            <Badge variant="alert" pulse>3 ALERTS</Badge>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Agent Stats Panel */}
        <Card
          variant="hud"
          title="AGENT PROFILE"
          badge="ELITE"
          cornerBrackets
          className="lg:col-span-1"
        >
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto bg-military-navy-800 border-3 border-military-gold-500 rounded-full flex items-center justify-center mb-3">
                <span className="text-4xl">🎖️</span>
              </div>
              <h3 className="text-rank mb-2">AGENT 7349</h3>
              <Badge variant="rank">FIELD AGENT</Badge>
            </div>

            <div className="space-y-3">
              <ProgressBar label="RANK PROGRESS" progress={missionProgress} />
              <ProgressBar label="WEEKLY MISSIONS" progress={80} />
              <ProgressBar label="COMBAT RECORD" progress={95} />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="hud-panel p-3 text-center">
                <div className="text-2xl font-tactical text-military-gold-bright">245</div>
                <div className="text-xs font-stencil text-gray-400 uppercase">Total XP</div>
              </div>
              <div className="hud-panel p-3 text-center">
                <div className="text-2xl font-tactical text-military-green-bright">12</div>
                <div className="text-xs font-stencil text-gray-400 uppercase">Missions</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Missions */}
        <Card
          variant="military"
          title="ACTIVE MISSIONS"
          className="lg:col-span-2"
          scanlines
        >
          <div className="space-y-4">
            {/* Mission 1 */}
            <div className="card-mission p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-tactical text-military-gold-bright mb-1">
                    OPERATION: CLEAN ROOM
                  </h4>
                  <p className="text-sm text-gray-300 font-body normal-case tracking-normal">
                    Secure and sanitize designated living quarters
                  </p>
                </div>
                <Badge variant="military" icon="⚡">HIGH PRIORITY</Badge>
              </div>
              <div className="flex justify-between items-center mt-4">
                <StatusIndicator status="in-progress" />
                <div className="flex gap-2">
                  <span className="text-xs font-mono text-military-gold-bright">+50 XP</span>
                  <span className="text-xs font-mono text-military-green-bright">DUE: 18:00</span>
                </div>
              </div>
            </div>

            {/* Mission 2 */}
            <div className="card-mission p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-tactical text-military-gold-bright mb-1">
                    OPERATION: KITCHEN DUTY
                  </h4>
                  <p className="text-sm text-gray-300 font-body normal-case tracking-normal">
                    Execute dishwashing protocol and sanitize surfaces
                  </p>
                </div>
                <Badge variant="military">MEDIUM PRIORITY</Badge>
              </div>
              <div className="flex justify-between items-center mt-4">
                <StatusIndicator status="ready" />
                <div className="flex gap-2">
                  <span className="text-xs font-mono text-military-gold-bright">+30 XP</span>
                  <span className="text-xs font-mono text-military-green-bright">DUE: 19:30</span>
                </div>
              </div>
            </div>

            {/* Mission 3 - Overdue */}
            <div className="card-mission p-4 border-military-red-500/50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-tactical text-military-red-500 mb-1">
                    OPERATION: HOMEWORK PROTOCOL
                  </h4>
                  <p className="text-sm text-gray-300 font-body normal-case tracking-normal">
                    Complete math assignment and submit for verification
                  </p>
                </div>
                <Badge variant="alert" pulse icon="⚠">OVERDUE</Badge>
              </div>
              <div className="flex justify-between items-center mt-4">
                <StatusIndicator status="critical" />
                <div className="flex gap-2">
                  <span className="text-xs font-mono text-military-gold-bright">+75 XP</span>
                  <span className="text-xs font-mono text-military-red-500 animate-blink">OVERDUE!</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievement Showcase */}
      <Card
        variant="hud"
        title="RECENT ACHIEVEMENTS"
        className="mb-8"
        cornerBrackets
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="hud-panel p-4 text-center hover:border-military-gold-500 transition-all cursor-pointer">
            <div className="text-4xl mb-2 animate-rank-up">🏆</div>
            <div className="text-xs font-stencil text-military-gold-bright uppercase">Week Warrior</div>
          </div>
          <div className="hud-panel p-4 text-center hover:border-military-gold-500 transition-all cursor-pointer">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-xs font-stencil text-military-green-bright uppercase">Speedster</div>
          </div>
          <div className="hud-panel p-4 text-center hover:border-military-gold-500 transition-all cursor-pointer">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-xs font-stencil text-military-blue-500 uppercase">Sharpshooter</div>
          </div>
          <div className="hud-panel p-4 text-center hover:border-military-gold-500 transition-all cursor-pointer opacity-50">
            <div className="text-4xl mb-2">🔒</div>
            <div className="text-xs font-stencil text-gray-500 uppercase">Locked</div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <Button variant="military" size="lg" icon="✓">
          ACCEPT MISSION
        </Button>
        <Button variant="commander" size="lg" icon="⭐">
          VIEW REWARDS
        </Button>
        <Button variant="tactical" size="lg" icon="📊">
          CHECK STATS
        </Button>
        <Button variant="alert" size="lg" icon="⚠">
          PRIORITY ALERT
        </Button>
      </div>

      {/* Command Terminal */}
      <Card variant="military" title="COMMAND TERMINAL" scanlines>
        <div className="font-mono text-sm space-y-2 text-military-green-bright">
          <div className="flex gap-2">
            <span className="text-military-gold-bright">{'>'}</span>
            <span>SYSTEM STATUS: OPERATIONAL</span>
          </div>
          <div className="flex gap-2">
            <span className="text-military-gold-bright">{'>'}</span>
            <span>ACTIVE AGENTS: 3</span>
          </div>
          <div className="flex gap-2">
            <span className="text-military-gold-bright">{'>'}</span>
            <span>MISSIONS DEPLOYED: 12</span>
          </div>
          <div className="flex gap-2">
            <span className="text-military-gold-bright">{'>'}</span>
            <span className="animate-blink">AWAITING COMMANDER INPUT...</span>
          </div>
        </div>

        {/* Input Field */}
        <div className="mt-6">
          <input
            type="text"
            className="input-military"
            placeholder="ENTER COMMAND..."
          />
        </div>
      </Card>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <div className="inline-block">
          <div className="flex items-center gap-3 text-xs font-mono text-military-camo-medium">
            <div className="w-2 h-2 bg-military-green-500 rounded-full animate-pulse-slow"></div>
            <span>SECURE CONNECTION ESTABLISHED</span>
            <div className="w-2 h-2 bg-military-green-500 rounded-full animate-pulse-slow"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
