import { useState } from 'react'

function AuthPage({ mode, onNavigate }) {
  const isRegister = mode === 'register'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [message, setMessage] = useState('')

  const validatePassword = (value) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/

    if (!regex.test(value)) {
      setError("Password must contain both letters and numbers")
    } else {
      setError("")
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }

  const title = isRegister ? 'Create your account' : 'Sign in to your account'
  const subtitle = isRegister
    ? 'Register with Google, Facebook, or email and verify with a code.'
    : 'Use Google, Facebook, or your email and verify with a code to sign in.'

  const handleSocialSign = (provider) => {
    alert(`${provider} sign-in is ready.`)
  }

  const sendVerificationCode = (event) => {
    event.preventDefault()

    if (!email) {
      alert('Please enter your email address.')
      return
    }

    if (error || !password) {
      alert('Please enter a valid password.')
      return
    }

    setCodeSent(true)
    setMessage(`A verification code has been sent to ${email}.`)
  }

  const verifyCode = () => {
    if (!code || code.length < 4) {
      alert('Please enter a valid verification code.')
      return
    }

    alert(isRegister ? 'Registration complete!' : 'Signed in successfully!')
    onNavigate('#home')
  }

  return (
    <div className="page-shell">
      <section className="auth-page">
        <div className="auth-panel">

          <div className="auth-head">
            <span className="eyebrow">{isRegister ? 'Register' : 'Sign in'}</span>
            <h1>{title}</h1>
            <p className="auth-subtitle">{subtitle}</p>
          </div>

          <div className="social-row">
            <button type="button" onClick={() => handleSocialSign('Google')}>
              🌐 Continue with Google
            </button>
            <button type="button" onClick={() => handleSocialSign('Facebook')}>
              📘 Continue with Facebook
            </button>
          </div>

          <div className="divider">Or use your email</div>

          <form onSubmit={sendVerificationCode}>

            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>

            <button type="submit">
              {isRegister ? 'Send verification code' : 'Send sign-in code'}
            </button>

          </form>

          {codeSent && (
            <div className="verify-panel">
              <p>{message}</p>

              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
              />

              <button onClick={verifyCode}>
                {isRegister ? 'Finish registration' : 'Sign in'}
              </button>
            </div>
          )}

          <div>
            {isRegister ? (
              <>Already have an account? <button onClick={() => onNavigate('#signin')}>Sign in</button></>
            ) : (
              <>New here? <button onClick={() => onNavigate('#register')}>Create account</button></>
            )}
          </div>

        </div>
      </section>
    </div>
  )
}

export default AuthPage