import { useState } from 'react'
import { db } from "../firebase"
import { doc, setDoc } from "firebase/firestore"

function AuthPage({ mode, onNavigate }) {
  const isRegister = mode === 'register'

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [screen, setScreen] = useState('method')
  const [selectedMethod, setSelectedMethod] = useState('')
  const [selectedEmail, setSelectedEmail] = useState('')
  const [customEmail, setCustomEmail] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  // New state for email/password
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const title = isRegister
    ? 'Create your account'
    : 'Sign in to your account'

  const subtitle = isRegister
    ? 'Use Google, Facebook, or email. Then verify with the code we send.'
    : 'Sign in with Google, Facebook, or email, then enter the verification code.'

  const generateCode = (length = 6) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let codeValue = ""

    for (let i = 0; i < length; i++) {
      codeValue += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return codeValue
  }

  const sendCode = async (userEmail) => {
    const codeValue = generateCode(6)

    await setDoc(doc(db, "emailCodes", userEmail), {
      code: codeValue,
      createdAt: Date.now()
    })

    setMessage(`A verification code has been sent to ${userEmail}.`)
    console.log("Verification code:", codeValue)
  }

  const accountOptions = ['belinda@gmail.com', 'namuzbelinda@gmail.com']

  const startMethod = (method) => {
    setSelectedMethod(method)
    setError('')
    setCode('')
    setMessage('')
    setSelectedEmail('')
    setCustomEmail('')
    setScreen(method === 'email' ? 'emailSelect' : 'accountSelect')
  }

  // New handler for email/password method
  const startEmailPassword = () => {
    setSelectedMethod('emailPassword')
    setError('')
    setScreen('emailPassword')
  }

  const chooseAccount = async (emailToUse) => {
    if (!emailToUse) {
      alert('Please choose or enter an email address.')
      return
    }

    setSelectedEmail(emailToUse)
    setLoading(true)
    try {
      await sendCode(emailToUse)
      setScreen('verify')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailContinue = (event) => {
    event.preventDefault()
    const emailToUse = customEmail || selectedEmail
    chooseAccount(emailToUse)
  }

  // New handler for email/password submit
  const handleEmailPasswordSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      // Replace with actual Firebase Auth logic
      if (isRegister) {
        // await createUserWithEmailAndPassword(auth, email, password)
        alert('Account created successfully!')
      } else {
        // await signInWithEmailAndPassword(auth, email, password)
        alert('Signed in successfully!')
      }
      onNavigate('#home')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = () => {
    if (!code || code.length < 4) {
      alert('Please enter a valid verification code.')
      return
    }

    alert(isRegister ? 'Registration complete! Welcome aboard.' : 'Signed in successfully!')
    setScreen('method')
    onNavigate('#home')
  }

  const renderMethodScreen = () => (
    <>
      <div className="social-row">
        <button type="button" className="social-button google" onClick={() => startMethod('google')}>
          🌐 Continue with Google
        </button>
        <button type="button" className="social-button facebook" onClick={() => startMethod('facebook')}>
          📘 Continue with Facebook
        </button>
      </div>

      <div className="divider">Or continue with email</div>

      <button type="button" className="solid-button full-width" onClick={() => startMethod('email')}>
        Continue with my email (verification code)
      </button>
      <button type="button" className="solid-button full-width" onClick={startEmailPassword}>
        Continue with email and password
      </button>
    </>
  )

  const renderAccountSelect = () => (
    <>
      <div className="auth-step">
        <h2>Choose an account</h2>
        <p>Continue with {selectedMethod === 'google' ? 'Google' : 'Facebook'}.</p>
      </div>

      <div className="account-list">
        {accountOptions.map((account) => (
          <button key={account} type="button" className="account-item" onClick={() => chooseAccount(account)}>
            <span className="account-icon">👤</span>
            <div>
              <strong>{account}</strong>
              <p>Select this account</p>
            </div>
          </button>
        ))}

        <div className="account-item custom-email">
          <input
            type="email"
            placeholder="Use another account"
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
          />
          <button type="button" className="ghost-button" onClick={() => chooseAccount(customEmail)}>
            Continue
          </button>
        </div>
      </div>
    </>
  )

  const renderEmailSelect = () => (
    <>
      <div className="auth-step">
        <h2>Choose your email</h2>
        <p>Select the email address you want to use for verification.</p>
      </div>

      <div className="account-list">
        {accountOptions.map((account) => (
          <button key={account} type="button" className="account-item" onClick={() => chooseAccount(account)}>
            <span className="account-icon">✉️</span>
            <div>
              <strong>{account}</strong>
              <p>Send the code here</p>
            </div>
          </button>
        ))}

        <div className="account-item custom-email">
          <input
            type="email"
            placeholder="Enter a different email"
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
          />
          <button type="button" className="ghost-button" onClick={handleEmailContinue}>
            Continue
          </button>
        </div>
      </div>
    </>
  )

  // New render function for email/password
  const renderEmailPassword = () => (
    <>
      <div className="auth-step">
        <h2>{isRegister ? 'Create account' : 'Sign in'} with email</h2>
        <p>Enter your email and password.</p>
      </div>
      <form onSubmit={handleEmailPasswordSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="solid-button full-width">
          {isRegister ? 'Create account' : 'Sign in'}
        </button>
      </form>
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
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
        />
      </div>
      <button type="button" className="solid-button full-width" onClick={verifyCode}>
        {isRegister ? 'Verify and finish registration' : 'Verify and sign in'}
      </button>
    </>
  )

  return (
    <div className="page-shell">
      <section className="auth-page">
        <div className="auth-panel">
          <div className="auth-head">
            <span className="eyebrow">{isRegister ? 'Register' : 'Sign in'}</span>
            <h1>{title}</h1>
            <p className="auth-subtitle">{subtitle}</p>
          </div>

          {screen === 'method' && renderMethodScreen()}
          {screen === 'accountSelect' && renderAccountSelect()}
          {screen === 'emailSelect' && renderEmailSelect()}
          {screen === 'emailPassword' && renderEmailPassword()}
          {screen === 'verify' && renderVerify()}

          <div className="link-row">
            {screen !== 'method' ? (
              <button type="button" className="ghost-button small" onClick={() => setScreen('method')}>
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