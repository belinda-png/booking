import { GoogleLogin } from '@react-oauth/google'
import { useState } from 'react'

function AuthPage({ mode, onNavigate }) {
  const isRegister = mode === 'register'

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="page-shell">
      <section className="auth-page">
        <div className="auth-panel">

          <h1>{isRegister ? 'Create your account' : 'Sign in to your account'}</h1>
          <p>Use your Google account to continue.</p>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-in was not completed. Please try again.')}
            useOneTap={!loading}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}

        </div>
      </section>
    </div>
  )
}

export default AuthPage