import { createContext, useContext, useState } from 'react'
import { loginUser } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      return null
    }

    try {
      return JSON.parse(storedUser)
    } catch {
      localStorage.removeItem('user')
      return null
    }
  })

  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)

    try {
      const data = await loginUser(email, password)

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setUser(data.user)

      return {
        success: true,
        user: data.user,
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Unable to login. Please try again.',
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}