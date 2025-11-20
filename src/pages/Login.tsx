import { FC, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-primary">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-accent-primary text-4xl mb-4">▲</div>
          <h1 className="text-2xl font-mono font-bold text-white mb-2 uppercase tracking-wider">
            ACCESS GRANTED
          </h1>
          <p className="text-sm font-mono text-text-muted uppercase tracking-wide">
            SECURE LOGIN PROTOCOL
          </p>
        </div>

        {/* Demo Accounts Banner */}
        {showDemoAccounts && (
          <div className="mb-6 bg-bg-secondary border border-accent-primary p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-sm font-mono font-bold text-accent-secondary uppercase mb-3">
                  DEMO MODE AVAILABLE
                </h3>
                <p className="text-xs text-text-secondary mb-4 font-mono">
                  Try the app without setting up Supabase. Click to select:
                </p>
                <div className="space-y-2">
                  {DEMO_ACCOUNTS.map((account) => (
                    <div
                      key={account.email}
                      className="bg-bg-tertiary border border-border-primary p-3 cursor-pointer hover:border-accent-primary transition-colors"
                      onClick={() => setFormData({ email: account.email, password: account.password })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white text-sm font-mono">{account.name}</div>
                          <div className="text-xs text-text-muted font-mono">
                            {account.email}
                          </div>
                        </div>
                        <div className="text-xs text-accent-primary uppercase font-bold font-mono">
                          SELECT
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowDemoAccounts(false)}
                className="text-text-muted hover:text-white text-xl ml-4 font-mono"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="bg-bg-secondary border border-border-primary p-8">
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
              <div className="bg-accent-danger bg-opacity-10 border border-accent-danger text-white px-4 py-3 text-sm font-mono">
                {error}
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
                className="w-full text-center text-accent-primary hover:text-white text-xs uppercase tracking-wide font-mono mt-2"
              >
                Show Demo Accounts
              </button>
            )}
          </form>

          <div className="mt-6 text-center border-t border-border-primary pt-6">
            <p className="text-text-muted text-sm font-mono">
              Not enlisted yet?{' '}
              <Link to="/" className="text-accent-primary hover:text-white font-bold">
                ENLIST YOUR SQUAD
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-text-muted font-mono">
          <p>SECURE CONNECTION • ENCRYPTED TRANSMISSION</p>
        </div>
      </div>
    </div>
  )
}

export default Login
