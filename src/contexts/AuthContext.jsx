import { createContext, useState, useCallback } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    return token ? 'checking' : null
  })

  const [loading, setLoading] = useState(() => {
    return localStorage.getItem('token') != null
  })

  const checkAuth = useCallback(async () => {
    try {
      const data = await api.getUser()
      setUser(data.user)
    } catch {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  if (user === 'checking' && loading) {
    checkAuth()
  }

  const login = async (username, password) => {
    const data = await api.login(username, password)
    localStorage.setItem('token', data.user.token)
    setUser(data.user)
    return data.user
  }

  const register = async (username, password, passwordConfirmation) => {
    const data = await api.register(username, password, passwordConfirmation)
    localStorage.setItem('token', data.user.token)
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch {
      // ignore
    }
    localStorage.removeItem('token')
    setUser(null)
  }

  const resolvedUser = user === 'checking' ? null : user

  return (
    <AuthContext.Provider value={{ user: resolvedUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
