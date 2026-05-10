import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import toast from 'react-hot-toast'

/**
 * GoogleAuthButton
 *
 * Renders the official Google Sign-In button using
 * Google Identity Services (GIS) library.
 *
 * Works for both Login and Register:
 * - If the user already exists  → logs them in
 * - If the user is new          → auto-registers (no OTP needed)
 *
 * Props:
 *   label  — text shown above the divider  (e.g. "or sign in with")
 */
export default function GoogleAuthButton({ label = 'or continue with' }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const btnRef = useRef(null)

  useEffect(() => {
    // Load Google Identity Services script once
    const scriptId = 'google-gsi-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
      script.onload = initGoogle
    } else {
      // Script already loaded
      if (window.google) initGoogle()
      else {
        // Wait for it to finish loading
        const interval = setInterval(() => {
          if (window.google) { clearInterval(interval); initGoogle() }
        }, 100)
      }
    }
  }, [])

  const initGoogle = () => {
    if (!window.google || !btnRef.current) return

    window.google.accounts.id.initialize({
      // ⚠️  Replace with YOUR Google Client ID from Google Cloud Console
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    })

    window.google.accounts.id.renderButton(btnRef.current, {
      theme: 'outline',
      size: 'large',
      shape: 'rectangular',
      width: btnRef.current.offsetWidth || 360,
      text: 'continue_with',
      logo_alignment: 'center',
    })
  }

  const handleGoogleResponse = async (googleResponse) => {
    try {
      // Send the Google ID token to our backend
      const res = await axios.post('/auth/google', {
        credential: googleResponse.credential,
      })
      login(res.data.user, res.data.token)
      toast.success(`Welcome, ${res.data.user.fullName}! 🎉`)
      navigate('/')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Google sign-in failed')
    }
  }

  return (
    <div className="w-full">
      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{label}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google button rendered by GIS SDK into this div */}
      <div
        ref={btnRef}
        className="w-full flex justify-center"
        style={{ minHeight: '44px' }}
      />
    </div>
  )
}
