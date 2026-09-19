import { GoogleLogin } from '@react-oauth/google'
import { useState } from 'react'

function AuthPage({ mode, onNavigate }) {
  const isRegister = mode === 'register'

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '' })

  const handleGoogleSuccess = async ({ credential }) => {
    if (!credential) {
      setError('Google did not return an account credential. Please try again.')
      return
    }

    try {
      setLoading(true)
      setError('')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      const response = await fetch(`${apiUrl}/api/v1/auth/google/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.detail || 'Google sign-in failed.')
      }

      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('refreshToken', data.refresh)
      localStorage.setItem('googleUser', JSON.stringify(data.user))
      onNavigate('#home')
    } catch (authError) {
      setError(authError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      if (isRegister) {
        const response = await fetch(`${apiUrl}/api/v1/users/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: form.username, email: form.email, password: form.password, role: 'user' }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.detail || Object.values(data).flat().join(' ') || 'Registration failed.')
        setError('Account created. You can now sign in.')
        onNavigate('#signin')
        return
      }

      const response = await fetch(`${apiUrl}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Email or password is incorrect.')
      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('refreshToken', data.refresh)
      onNavigate('#home')
    } catch (authError) {
      setError(authError.message)
    } finally {
      setLoading(false)
    }
  }

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  return (
    <div className="auth-page-shell">
      <div className="auth-brand"><span className="auth-brand-mark">B</span><strong>Booking</strong></div>
      <main className="auth-page">
        <section className="auth-panel">
          <div className="auth-head">
            <span className="auth-kicker">Your next journey starts here</span>
            <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
            <p className="auth-subtitle">{isRegister ? 'Join thousands of travelers finding better stays and experiences.' : 'Sign in to manage your trips, bookings, and saved stays.'}</p>
          </div>

          <div className="auth-social-grid">
            <div className="google-login-wrap"><GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-in was not completed. Please try again.')} useOneTap={!loading} width="340" /></div>
            <button type="button" className="auth-provider-button" onClick={() => setError('GitHub sign-in is not connected yet.')}> <span className="provider-icon">GH</span> Continue with GitHub</button>
          </div>

          <div className="auth-divider"><span>or continue with email</span></div>

          {!showEmail ? <button type="button" className="auth-email-button" onClick={() => setShowEmail(true)}>Continue with email <span>→</span></button> : <form className="auth-form" onSubmit={handleEmailSubmit}>
            {isRegister && <div className="form-field"><label htmlFor="username">Username</label><input id="username" name="username" value={form.username} onChange={updateField} required autoComplete="username" placeholder="Choose a username" /></div>}
            <div className="form-field"><label htmlFor="email">{isRegister ? 'Email address' : 'Username'}</label><input id="email" name="username" value={form.username} onChange={updateField} required autoComplete="username" placeholder={isRegister ? 'you@example.com' : 'Enter your username'} /></div>
            {isRegister && <input type="hidden" name="email" value={form.email} />}
            {isRegister && <div className="form-field"><label htmlFor="register-email">Email address</label><input id="register-email" name="email" value={form.email} onChange={updateField} required type="email" autoComplete="email" placeholder="you@example.com" /></div>}
            <div className="form-field"><div className="password-label"><label htmlFor="password">Password</label>{!isRegister && <a href="#forgot" onClick={(event) => { event.preventDefault(); setError('Please contact support to reset your password.') }}>Forgot password?</a>}</div><input id="password" name="password" value={form.password} onChange={updateField} required type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder="Enter your password" /></div>
            <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'} <span>→</span></button>
          </form>}

          {error && <p className={`auth-message ${error.startsWith('Account created') ? 'success' : ''}`}>{error}</p>}
          <p className="auth-switch">{isRegister ? 'Already have an account?' : "Don't have an account?"} <button type="button" onClick={() => onNavigate(isRegister ? '#signin' : '#register')}>{isRegister ? 'Sign in' : 'Sign up'}</button></p>
        </section>
        <p className="auth-legal">By continuing, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</p>
      </main>
    </div>
  )
}

export default AuthPage