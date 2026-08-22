import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
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
      <div className={styles.social}>
        <a href="#" className={styles.socialLink} aria-label="Email">
          <img src="/email-svgrepo-com.svg" alt="Email" />
        </a>
        <a href="#" className={styles.socialLink} aria-label="Instagram">
          <img src="/instagram-logo-facebook-2-svgrepo-com.svg" alt="Instagram" />
        </a>
        <a href="#" className={styles.socialLink} aria-label="ArtStation">
          <img src="/artstation-svgrepo-com.svg" alt="ArtStation" />
        </a>
        <a href="#" className={styles.socialLink} aria-label="VG icon">
          <img src="/VG Icon - monochrome.svg" alt="VG icon"/>
        </a>
      </div>
      <div className={styles.linksRedeSociais}>
      </div>
    </nav>
  )
}
