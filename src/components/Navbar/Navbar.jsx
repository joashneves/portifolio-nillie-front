import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import SocialLinks from '../SocialLinks/SocialLinks'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        Home
      </Link>
      <Link to="/About" className={styles.brand}>
        About
      </Link>
      {user && (
        <Link to="/dashboard" className={styles.brand}>
          Painel de Admin
        </Link>
      )}
      <SocialLinks />
      <div className={styles.linksRedeSociais}>
      </div>
    </nav>
  )
}
