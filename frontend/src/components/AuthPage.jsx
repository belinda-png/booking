import { useState } from 'react'

function AuthPage({ mode, onNavigate }) {
  const isRegister = mode === 'register'
  const [screen, setScreen] = useState('chooseMethod')
  const [method, setMethod] = useState('')
  const [selectedEmail, setSelectedEmail] = useState('')
  const [customEmail, setCustomEmail] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  const title = isRegister ? 'Create your account' : 'Sign in to your account'
  const subtitle = isRegister
    ? 'Use Google, Facebook, or your email. Then verify with the code we send to your address.'
    : 'Sign in with Google, Facebook, or your email. Then enter the verification code we send.'

  const accountOptions = ['belinda@gmail.com', 'namuzbelinda@gmail.com']

  const beginMethod = (nextMethod) => {
    setMethod(nextMethod)
    setCode('')
    setMessage('')
    setSelectedEmail('')
    setCustomEmail('')
    if (nextMethod === 'email') {
      setScreen('chooseEmail')
    } else {
      setScreen('chooseAccount')
    }
  }

  const chooseAccount = (email) => {
    setSelectedEmail(email)
    setScreen('verify')
    sendCode(email)
  }

  const chooseEmail = (email) => {
    setSelectedEmail(email)
    setScreen('verify')
    sendCode(email)
  }

  const sendCode = (email) => {
    const address = email || customEmail || selectedEmail
    setMessage(`A verification code has been sent to ${address}.`)
  }

  const handleEmailContinue = (event) => {
    event.preventDefault()
    const emailToUse = customEmail || selectedEmail
    if (!emailToUse) {
      alert('Please choose or enter an email address.')
      return
    }
    chooseEmail(emailToUse)
  }

  const verifyCode = () => {
    if (!code || code.length < 4) {
      alert('Please enter a valid verification code.')
      return
    }
    alert(isRegister ? 'Registration complete! Welcome aboard.' : 'Signed in successfully!')
    onNavigate('#home')
  }

  const renderChooseMethod = () => (
    <>
      <div className="social-row">
        <button type="button" className="social-button google" onClick={() => beginMethod('google')}>
          🌐 Continue with Google
        </button>
        <button type="button" className="social-button facebook" onClick={() => beginMethod('facebook')}>
          📘 Continue with Facebook
        </button>
      </div>

      <div className="divider">Or continue with email</div>

      <button type="button" className="solid-button full-width" onClick={() => beginMethod('email')}>
        Continue with my email
      </button>
    </>
  )

  const renderChooseAccount = () => (
    <>
      <div className="auth-step">
        <h2>Choose an account</h2>
        <p>Continue with {method === 'google' ? 'Google' : 'Facebook'}.</p>
      </div>

      <div className="account-list">
        {accountOptions.map((emailOption) => (
          <button key={emailOption} type="button" className="account-item" onClick={() => chooseAccount(emailOption)}>
            <span className="account-icon">👤</span>
            <div>
              <strong>{emailOption}</strong>
              <p>Select this account</p>
            </div>
          </button>
        ))}
        <div className="account-item custom-email">
          <div>
            <strong>Use another account</strong>
          </div>
          <input
            type="email"
            value={customEmail}
            onChange={(event) => setCustomEmail(event.target.value)}
            placeholder="you@example.com"
          />
          <button type="button" className="ghost-button" onClick={() => chooseAccount(customEmail)}>
            Continue
          </button>
        </div>
      </div>
    </>
  )

  const renderChooseEmail = () => (
    <>
      <div className="auth-step">
        <h2>Choose your email</h2>
        <p>Select the email address you want to use for verification.</p>
      </div>

      <div className="account-list">
        {accountOptions.map((emailOption) => (
          <button key={emailOption} type="button" className="account-item" onClick={() => chooseEmail(emailOption)}>
            <span className="account-icon">✉️</span>
            <div>
              <strong>{emailOption}</strong>
              <p>Send the code here</p>
            </div>
          </button>
        ))}
        <div className="account-item custom-email">
          <div>
            <strong>Use another email</strong>
          </div>
          <input
            type="email"
            value={customEmail}
            onChange={(event) => setCustomEmail(event.target.value)}
            placeholder="you@example.com"
          />
          <button type="button" className="ghost-button" onClick={handleEmailContinue}>
            Continue
          </button>
        </div>
      </div>
    </>
  )

  const renderVerify = () => (
    <>
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
    </>
  )

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

          {screen === 'chooseMethod' && renderChooseMethod()}
          {screen === 'chooseAccount' && renderChooseAccount()}
          {screen === 'chooseEmail' && renderChooseEmail()}
          {screen === 'verify' && renderVerify()}

          <div className="link-row">
            {screen !== 'chooseMethod' ? (
              <button type="button" className="ghost-button small" onClick={() => setScreen('chooseMethod')}>
                Back to method selection
              </button>
            ) : isRegister ? (
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
