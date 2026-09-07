import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import styles from './PainelNav.module.css'

export default function PainelNav({ active }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>
        Painel<span className={styles.brandAccent}>Admin</span>
      </span>

      <Link
        to="/dashboard/categorias"
        className={`${styles.link} ${active === 'categorias' ? styles.active : ''}`}
      >
        Categorias
      </Link>
      <Link
        to="/dashboard/colecoes"
        className={`${styles.link} ${active === 'colecoes' ? styles.active : ''}`}
      >
        Coleções
      </Link>

      <div className={styles.spacer} />

      <span className={styles.user}>{user?.username}</span>
      <Link to="/" className={styles.ghost}>
        Ver site
      </Link>
      <button type="button" className={styles.logout} onClick={handleLogout}>
        Sair
      </button>
    </nav>
  )
}