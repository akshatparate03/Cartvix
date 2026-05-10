import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('cartvix_token'))

  useEffect(() => {
    const stored = localStorage.getItem('cartvix_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('cartvix_user', JSON.stringify(userData))
    localStorage.setItem('cartvix_token', authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('cartvix_user')
    localStorage.removeItem('cartvix_token')
  }

  const isAdmin = user?.email === 'akshatparate@gmail.com'

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
