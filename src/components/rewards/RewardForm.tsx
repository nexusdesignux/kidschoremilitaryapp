import { FC, useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

interface RewardFormData {
  title: string
  description: string
  cost_in_points: number
  reward_type: 'experience' | 'privilege' | 'item'
}

interface RewardFormProps {
  onSubmit: (data: RewardFormData) => void
  onCancel: () => void
}

export const RewardForm: FC<RewardFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<RewardFormData>({
    title: '',
    description: '',
    cost_in_points: 50,
    reward_type: 'experience',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const rewardTypeOptions = [
    { value: 'experience', label: 'EXPERIENCE (Trip, Event, Activity)' },
    { value: 'privilege', label: 'PRIVILEGE (Screen Time, Stay Up Late)' },
    { value: 'item', label: 'ITEM (Toy, Game, Treat)' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Reward title is required'
    }
    if (formData.cost_in_points <= 0) {
      newErrors.cost_in_points = 'Cost must be greater than 0'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Reward Title */}
      <Input
        label="Reward Title"
        placeholder="Ice Cream Trip"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        error={errors.title}
      />

      {/* Description */}
      <div className="w-full">
        <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-text-secondary font-mono">
          Description (Optional)
        </label>
        <textarea
          placeholder="Details about the reward..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 bg-bg-secondary border border-border-primary text-white placeholder-text-muted font-mono text-sm focus:outline-none focus:border-accent-primary focus:shadow-glow-green transition-all duration-200 resize-none"
        />
      </div>

      {/* Reward Type */}
      <Select
        label="Reward Type"
        options={rewardTypeOptions}
        value={formData.reward_type}
        onChange={(e) => setFormData(prev => ({ ...prev, reward_type: e.target.value as 'experience' | 'privilege' | 'item' }))}
      />

      {/* Cost in Points */}
      <Input
        label="Cost in Points"
        type="number"
        min="1"
        value={formData.cost_in_points}
        onChange={(e) => setFormData(prev => ({ ...prev, cost_in_points: parseInt(e.target.value) || 0 }))}
        error={errors.cost_in_points}
        helperText="How many points agents need to redeem this reward"
      />

      {/* Quick Point Presets */}
      <div>
        <div className="text-xs font-mono text-text-muted uppercase mb-2">QUICK PRESETS</div>
        <div className="flex flex-wrap gap-2">
          {[25, 50, 75, 100, 150, 200].map((points) => (
            <button
              key={points}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, cost_in_points: points }))}
              className={`px-3 py-2 text-xs font-mono font-bold transition-colors ${
                formData.cost_in_points === points
                  ? 'bg-accent-primary text-black'
                  : 'bg-bg-tertiary text-white border border-border-primary hover:border-accent-primary'
              }`}
            >
              {points} RP
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={onCancel}
        >
          CANCEL
        </Button>
        <Button
          type="submit"
          variant="gold"
          fullWidth
        >
          CREATE REWARD
        </Button>
      </div>
    </form>
  )
}
