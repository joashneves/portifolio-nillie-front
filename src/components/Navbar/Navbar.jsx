import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { useTheme } from '../../contexts/ThemeContext'
import SocialLinks from '../SocialLinks/SocialLinks'
import styles from './Navbar.module.css'
import LogoIcon from '../LogoIcon/LogoIcon'

export default function Navbar() {
  const { user } = useAuth()


  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        <LogoIcon />
      </Link>
      <div className={styles.links}>
        <Link to="/Menu" className={styles.brand}>
          Menu
        </Link>
        <Link to="/About" className={styles.brand}>
          About
        </Link>
        <Link to="/About" className={styles.brand}>
          Commissions
        
        </Link>
        {user && (
          <Link to="/dashboard" className={styles.brand}>
            Painel de Admin
          </Link>
        )}
      </div>
      <div className={styles.socialLinks}>
        <SocialLinks />
      </div>
    </nav>
  )
}
