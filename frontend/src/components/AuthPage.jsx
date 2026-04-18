import { useState } from 'react'

function AuthPage({ mode, onNavigate }) {
  const isRegister = mode === 'register'
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [message, setMessage] = useState('')

  const title = isRegister ? 'Create your account' : 'Sign in to your account'
  const subtitle = isRegister
    ? 'Register with Google, Facebook, or email and verify with a code.'
    : 'Use Google, Facebook, or your email and verify with a code to sign in.'

  const handleSocialSign = (provider) => {
    alert(`${provider} sign-in is ready. In a real app, this would redirect to provider auth.`)
  }

  const sendVerificationCode = (event) => {
    event.preventDefault()
    if (!email) {
      alert('Please enter your email address.')
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

    alert(isRegister ? 'Registration complete! Welcome aboard.' : 'Signed in successfully!')
    onNavigate('#home')
  }

  return (
    <div className="page-shell">
      <section className="auth-page">
        <div className="auth-panel">
          <div className="auth-head">
            <div>
              <span className="eyebrow">{isRegister ? 'Register' : 'Sign in'}</span>
              <h1>{title}</h1>
            </div>
            <p className="auth-subtitle">{subtitle}</p>
          </div>

          <div className="social-row">
            <button type="button" className="social-button" onClick={() => handleSocialSign('Google')}>
              🌐 Continue with Google
            </button>
            <button type="button" className="social-button" onClick={() => handleSocialSign('Facebook')}>
              📘 Continue with Facebook
            </button>
          </div>

          <div className="divider">Or use your email</div>

          <form className="auth-form" onSubmit={sendVerificationCode}>
            {/* {isRegister && (
              <div className="form-field">
                <label htmlFor="authName">Full name</label>
                <input
                  id="authName"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jane Doe"
                  required={isRegister}
                />
              </div>
            )} */}

            <div className="form-field">
              <label htmlFor="authEmail">Email address</label>
              <input
                id="authEmail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jane@example.com"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="authPassword">Password</label>
              <input
                id="authPassword"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="solid-button">
              {isRegister ? 'Send verification code' : 'Send sign-in code'}
            </button>
          </form>

          <div className={codeSent ? 'verify-panel active' : 'verify-panel'}>
            <div className="alert">{message}</div>
            <div className="verify-code">
              <label htmlFor="authCode">Enter verification code</label>
              <input
                id="authCode"
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="123456"
              />
            </div>
            <button type="button" className="solid-button" onClick={verifyCode}>
              {isRegister ? 'Verify and finish registration' : 'Verify and sign in'}
            </button>
          </div>

          <div className="link-row">
            {isRegister ? (
              <>Already have an account? <button type="button" onClick={() => onNavigate('#signin')}>Sign in</button></>
            ) : (
              <>New here? <button type="button" onClick={() => onNavigate('#register')}>Create an account</button></>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AuthPage
