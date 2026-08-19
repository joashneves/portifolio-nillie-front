import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        Nilleneves
      </Link>
      <div className={styles.links}>
        <Link to="/">Portfolio</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout} className={styles.logout}>
              Sair
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}
