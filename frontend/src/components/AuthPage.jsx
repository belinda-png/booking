import { useState } from 'react'
import { auth, googleProvider, db } from "../firebase"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth"

import { doc, setDoc } from "firebase/firestore"

function AuthPage({ mode, onNavigate }) {
  const isRegister = mode === 'register'

  const [authMethod, setAuthMethod] = useState('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const title = isRegister
    ? 'Create your account'
    : 'Sign in to your account'

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

  // ✅ Generate alphanumeric OTP
  const generateCode = (length = 6) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // no confusing chars
    let code = ""

    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return code
  }

  // ✅ Send & store OTP
  const sendCode = async () => {
    const code = generateCode(6)

    await setDoc(doc(db, "emailCodes", email), {
      code,
      createdAt: Date.now()
    })

    console.log("Verification code:", code) // ⚠️ remove in production

    // TODO: send email using EmailJS or backend
  }

  // ✅ Google login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)

      setAuthMethod('google')
      setEmail(result.user.email)

      alert("Google login successful!")
      onNavigate('#home')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Email auth + OTP
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (error) {
      alert('Fix password requirements')
      return
    }

    if (!email || !password) {
      alert('Please enter email and password')
      return
    }

    try {
      setLoading(true)

      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)

        await sendCode()

        alert('Verification code sent to your email')
        onNavigate('#verify')

      } else {
        await signInWithEmailAndPassword(auth, email, password)

        await sendCode()

        alert('Verification code sent')
        onNavigate('#verify')
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <section className="auth-page">
        <div className="auth-panel">

          <h1>{title}</h1>

          {/* Google login */}
          <button type="button" onClick={handleGoogleLogin}>
            🌐 Continue with Google
          </button>

          <div style={{ margin: '10px 0' }}>OR</div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setAuthMethod('email')
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

            <button type="submit" disabled={loading}>
              {loading
                ? 'Processing...'
                : isRegister
                ? 'Register'
                : 'Sign In'}
            </button>

          </form>

          {/* Navigation */}
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