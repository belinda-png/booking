import { useState } from 'react'
import app from "../firebase";
function AuthPage({ mode, onNavigate }) {
  const isRegister = mode === 'register'

  const [authMethod, setAuthMethod] = useState('email') // 'email' or 'google'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const title = isRegister ? 'Create your account' : 'Sign in to your account'

  // ✅ Password validation
  const validatePassword = (value) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/

    if (!regex.test(value)) {
      setError('Password must contain letters and numbers')
    } else {
      setError('')
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }

  // ✅ Simulated Google login
  const handleGoogleLogin = () => {
    setAuthMethod('google')
    setEmail('user@gmail.com') // simulate Google returning email
  }

  // ✅ Main submit logic
  const handleSubmit = (e) => {
    e.preventDefault()

    if (authMethod === 'email') {
      if (!email || !password) {
        alert('Please enter email and password')
        return
      }

      if (error) {
        alert('Fix password requirements')
        return
      }

      alert('Logged in with email + password')
      onNavigate('#home')
    }

    if (authMethod === 'google') {
      if (!password) {
        alert('Please set your password')
        return
      }

      if (error) {
        alert('Fix password requirements')
        return
      }

      alert(`Google account ${email} connected successfully`)
      onNavigate('#home')
    }
  }

  return (
    <div className="page-shell">
      <section className="auth-page">
        <div className="auth-panel">

          <h1>{title}</h1>

          {/* ✅ Google button */}
          <button type="button" onClick={handleGoogleLogin}>
            🌐 Continue with Google
          </button>

          <div style={{ margin: '10px 0' }}>OR</div>

          {/* ✅ Form */}
          <form onSubmit={handleSubmit}>

            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setAuthMethod('email') // switch back if user types
                  setEmail(e.target.value)
                }}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password"
                required
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <button type="submit">
              {authMethod === 'google'
                ? 'Continue with Google'
                : isRegister
                ? 'Register'
                : 'Sign In'}
            </button>

          </form>

          {/* ✅ Navigation */}
          <div style={{ marginTop: '10px' }}>
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button onClick={() => onNavigate('#signin')}>
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{' '}
                <button onClick={() => onNavigate('#register')}>
                  Create account
                </button>
              </>
            )}
          </div>

        </div>
      </section>
    </div>
  )
}

export default AuthPage