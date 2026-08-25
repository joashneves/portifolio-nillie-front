import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { useTheme } from '../../contexts/ThemeContext'
import SocialLinks from '../SocialLinks/SocialLinks'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user } = useAuth()
  const { theme } = useTheme()

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        <img
          src={theme === 'dark' ? '/logo/logo_nille_oficial_modo_preto.webp' : '/logo/logo_nille_ver_1_modo_branco.webp'}
          alt="Logo"
          className={styles.logo}
        />
      </Link>
      <div className={styles.links}>
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
      </div>
      <SocialLinks />
    </nav>
  )
}
