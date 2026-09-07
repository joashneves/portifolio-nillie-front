import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import Stars from '../../components/Stars/Stars'
import TitleCompoente from '../../components/TitleCompoente/TitleCompoente'
import styles from './Login.module.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <TitleCompoente />
      <form onSubmit={handleSubmit} className={styles.card}>
        <div className={styles.brand}>
          <Stars width="36px" height="36px" />
          <h2>Bem-vinda de volta</h2>
          <Stars width="36px" height="36px" />
        </div>

        <p className={styles.subtitle}>Entre para gerenciar seu portfólio</p>

        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.field}>
          <span>Usuário</span>
          <input
            type="text"
            placeholder="Seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className={styles.field}>
          <span>Senha</span>
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}