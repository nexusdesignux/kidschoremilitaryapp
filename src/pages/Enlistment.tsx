import { FC, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'

export const Enlistment: FC = () => {
  const navigate = useNavigate()
  const { enlist } = useAuthStore()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    familyName: '',
    commanderName: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      await enlist(formData.email, formData.password, formData.familyName, formData.commanderName)
      navigate('/command-center')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enlist. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-navy via-navy-dark to-black">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎖️</div>
          <h1 className="text-5xl font-header text-gold mb-2 uppercase tracking-wide">
            MISSION COMMAND
          </h1>
          <p className="text-xl text-tactical-light font-bold uppercase tracking-wide">
            ENLIST YOUR SQUADRON
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Commander Email"
              type="email"
              placeholder="commander@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <Input
              label="Family Name"
              type="text"
              placeholder="e.g., Smith Squadron"
              value={formData.familyName}
              onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
              required
            />

            <Input
              label="Commander Name"
              type="text"
              placeholder="Your full name"
              value={formData.commanderName}
              onChange={(e) => setFormData({ ...formData, commanderName: e.target.value })}
              required
            />

            {error && (
              <div className="bg-mission-red bg-opacity-20 border-2 border-mission-red text-white px-4 py-3 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            <Button
              type="submit"
              variant="gold"
              fullWidth
              disabled={loading}
            >
              {loading ? 'ENLISTING...' : 'ENLIST NOW'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already enlisted?{' '}
              <Link to="/login" className="text-tactical-light hover:text-tactical font-bold">
                ACCESS GRANTED →
              </Link>
            </p>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center space-y-2 text-sm text-gray-400">
          <p>✓ 14-Day Free Trial</p>
          <p>✓ Unlimited Agents (Kids)</p>
          <p>✓ Gamified Chore Management</p>
        </div>
      </div>
    </div>
  )
}

export default Enlistment
