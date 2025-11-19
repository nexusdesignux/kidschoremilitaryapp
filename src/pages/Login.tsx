import { FC, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { DEMO_ACCOUNTS } from '../utils/mockData'

export const Login: FC = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDemoAccounts, setShowDemoAccounts] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      await login(formData.email, formData.password)
      navigate('/command-center')
    } catch (err) {
      setError('Invalid credentials. Access denied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-navy via-navy-dark to-black">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-5xl font-header text-gold mb-2 uppercase tracking-wide">
            ACCESS GRANTED
          </h1>
          <p className="text-xl text-tactical-light font-bold uppercase tracking-wide">
            SECURE LOGIN
          </p>
        </div>

        {/* Demo Accounts Banner */}
        {showDemoAccounts && (
          <Card className="mb-6 bg-tactical bg-opacity-10 border-tactical-light">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-header text-gold uppercase mb-3">
                  🎮 DEMO MODE AVAILABLE
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Try the app without setting up Supabase! Use these test accounts:
                </p>
                <div className="space-y-2">
                  {DEMO_ACCOUNTS.map((account) => (
                    <div
                      key={account.email}
                      className="bg-navy-dark rounded p-3 cursor-pointer hover:bg-navy transition-colors"
                      onClick={() => setFormData({ email: account.email, password: account.password })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">{account.name}</div>
                          <div className="text-xs text-gray-400">
                            {account.email} / {account.password}
                          </div>
                        </div>
                        <div className="text-xs text-tactical-light uppercase font-bold">
                          Click to fill
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowDemoAccounts(false)}
                className="text-gray-400 hover:text-white text-2xl ml-4"
              >
                ×
              </button>
            </div>
          </Card>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            {error && (
              <div className="bg-mission-red bg-opacity-20 border-2 border-mission-red text-white px-4 py-3 rounded-lg">
                🔒 {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS COMMAND CENTER'}
            </Button>

            {!showDemoAccounts && (
              <button
                type="button"
                onClick={() => setShowDemoAccounts(true)}
                className="w-full text-center text-tactical-light hover:text-tactical text-sm uppercase tracking-wide"
              >
                Show Demo Accounts
              </button>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Not enlisted yet?{' '}
              <Link to="/" className="text-tactical-light hover:text-tactical font-bold">
                ENLIST YOUR SQUAD →
              </Link>
            </p>
          </div>
        </Card>

        {/* Security Notice */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>🔐 SECURE CONNECTION • ENCRYPTED TRANSMISSION</p>
        </div>
      </div>
    </div>
  )
}

export default Login
