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

  // ✅ OTP generator
  const generateCode = (length = 6) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let code = ""

    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return code
  }

  // ✅ Save OTP to Firestore
  const sendCode = async (userEmail) => {
    const code = generateCode(6)

    await setDoc(doc(db, "emailCodes", userEmail), {
      code,
      createdAt: Date.now()
    })

    console.log("Verification code:", code)
  }

  // ✅ Google Login (CLEAN FIX)
  const handleGoogleLogin = async () => {
    try {
      setLoading(true)

      const result = await signInWithPopup(auth, googleProvider)

      const userEmail = result.user.email
      setEmail(userEmail)

      await sendCode(userEmail)

      alert("Google login successful. Verification code sent.")

      // ✅ small delay prevents navigation bugs
      setTimeout(() => {
        onNavigate('#verify')
      }, 300)

    } catch (err) {
      console.log(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Email auth + OTP
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      return alert('Please enter email and password')
    }

    if (error) {
      return alert('Fix password requirements')
    }

    try {
      setLoading(true)

      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }

      await sendCode(email)

      alert('Verification code sent')

      setTimeout(() => {
        onNavigate('#verify')
      }, 300)

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

          {/* Email form */}
          <form onSubmit={handleSubmit}>

            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : isRegister ? 'Register' : 'Sign In'}
            </button>

          </form>

        </div>
      </section>
    </div>
  )
}

export default AuthPage