import { FC, useEffect } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiCelebrationProps {
  trigger: boolean
}

export const ConfettiCelebration: FC<ConfettiCelebrationProps> = ({ trigger }) => {
  useEffect(() => {
    if (trigger) {
      const duration = 3000
      const end = Date.now() + duration

      const colors = ['#3d8b40', '#52b556', '#ffc107', '#ffeb3b', '#ff6b35', '#4a90e2']

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }

      frame()
    }
  }, [trigger])

  return null
}
