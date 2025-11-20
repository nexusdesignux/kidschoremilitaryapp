import { FC, useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { MISSION_CATEGORIES, DIFFICULTY, RECURRENCE_PATTERNS } from '../../utils/constants'
import { DEMO_USERS } from '../../utils/mockData'

interface MissionFormData {
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  assigned_to: string | null
  due_date: string
  recurring: boolean
  recurrence_pattern: string | null
  rank_points: number
  field_bonus: number | null
}

interface MissionFormProps {
  onSubmit: (data: MissionFormData) => void
  onCancel: () => void
  familyId: string
}

export const MissionForm: FC<MissionFormProps> = ({ onSubmit, onCancel, familyId }) => {
  const [formData, setFormData] = useState<MissionFormData>({
    title: '',
    description: '',
    category: 'cleaning',
    difficulty: 'medium',
    assigned_to: null,
    due_date: new Date().toISOString().split('T')[0],
    recurring: false,
    recurrence_pattern: null,
    rank_points: 25,
    field_bonus: null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get agents from demo data (in production, this would come from a query)
  const agents = Object.values(DEMO_USERS).filter(
    user => user.family_id === familyId && user.role === 'agent'
  )

  const categoryOptions = Object.values(MISSION_CATEGORIES).map(cat => ({
    value: cat.id,
    label: cat.label,
  }))

  const difficultyOptions = Object.values(DIFFICULTY).map(diff => ({
    value: diff.id,
    label: `${diff.label} (${diff.points} RP)`,
  }))

  const agentOptions = [
    { value: '', label: 'UNASSIGNED - ANY AGENT' },
    ...agents.map(agent => ({
      value: agent.id,
      label: `${agent.full_name.toUpperCase()} (${agent.agent_code})`,
    })),
  ]

  const recurrenceOptions = [
    { value: '', label: 'ONE-TIME MISSION' },
    { value: RECURRENCE_PATTERNS.DAILY, label: 'DAILY' },
    { value: RECURRENCE_PATTERNS.WEEKLY_WEEKDAY, label: 'WEEKDAYS (MON-FRI)' },
    { value: RECURRENCE_PATTERNS.WEEKLY_WEEKEND, label: 'WEEKENDS (SAT-SUN)' },
    { value: RECURRENCE_PATTERNS.WEEKLY_MONDAY, label: 'EVERY MONDAY' },
    { value: RECURRENCE_PATTERNS.WEEKLY_TUESDAY, label: 'EVERY TUESDAY' },
    { value: RECURRENCE_PATTERNS.WEEKLY_WEDNESDAY, label: 'EVERY WEDNESDAY' },
    { value: RECURRENCE_PATTERNS.WEEKLY_THURSDAY, label: 'EVERY THURSDAY' },
    { value: RECURRENCE_PATTERNS.WEEKLY_FRIDAY, label: 'EVERY FRIDAY' },
    { value: RECURRENCE_PATTERNS.WEEKLY_SATURDAY, label: 'EVERY SATURDAY' },
    { value: RECURRENCE_PATTERNS.WEEKLY_SUNDAY, label: 'EVERY SUNDAY' },
  ]

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard') => {
    const points = DIFFICULTY[difficulty.toUpperCase() as keyof typeof DIFFICULTY].points
    setFormData(prev => ({
      ...prev,
      difficulty,
      rank_points: points,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Mission title is required'
    }
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      ...formData,
      assigned_to: formData.assigned_to || null,
      recurrence_pattern: formData.recurrence_pattern || null,
      field_bonus: formData.field_bonus || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mission Title */}
      <Input
        label="Mission Title"
        placeholder="Operation: Clean Room"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        error={errors.title}
      />

      {/* Description */}
      <div className="w-full">
        <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-text-secondary font-mono">
          Mission Brief
        </label>
        <textarea
          placeholder="Detailed instructions for the mission..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 bg-bg-secondary border border-border-primary text-white placeholder-text-muted font-mono text-sm focus:outline-none focus:border-accent-primary focus:shadow-glow-green transition-all duration-200 resize-none"
        />
      </div>

      {/* Category and Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Category"
          options={categoryOptions}
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
        />
        <Select
          label="Difficulty"
          options={difficultyOptions}
          value={formData.difficulty}
          onChange={(e) => handleDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard')}
        />
      </div>

      {/* Assigned Agent */}
      <Select
        label="Assign To"
        options={agentOptions}
        value={formData.assigned_to || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, assigned_to: e.target.value || null }))}
      />

      {/* Due Date and Recurrence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Due Date"
          type="date"
          value={formData.due_date}
          onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
          error={errors.due_date}
        />
        <Select
          label="Recurrence"
          options={recurrenceOptions}
          value={formData.recurrence_pattern || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            recurrence_pattern: e.target.value || null,
            recurring: !!e.target.value,
          }))}
        />
      </div>

      {/* Points and Bonus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Rank Points"
          type="number"
          value={formData.rank_points}
          onChange={(e) => setFormData(prev => ({ ...prev, rank_points: parseInt(e.target.value) || 0 }))}
          helperText="Points earned on completion"
        />
        <Input
          label="Field Bonus (Optional)"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.field_bonus || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, field_bonus: parseFloat(e.target.value) || null }))}
          helperText="Cash bonus in dollars"
        />
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
          DEPLOY MISSION
        </Button>
      </div>
    </form>
  )
}
