import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import SocialLinks from '../SocialLinks/SocialLinks'
import styles from './Navbar.module.css'
import LogoIcon from '../LogoIcon/LogoIcon'

export default function Navbar() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand} onClick={closeMenu}>
        <LogoIcon />
      </Link>

      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <img src="/menu_celular.svg" alt="Menu" className={styles.menuIcon} />
      </button>

      <div className={styles.menu}>
        <Link to="/About" className={styles.brand}>
          About me
        </Link>
        <Link to="https://nillecommission.carrd.co" className={styles.brand} target="_blank" rel="noopener noreferrer">
          Commissions
        </Link>
        <Link to="/Menu" className={styles.brand}>
          Sketchbook
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

      {open && (
        <div className={styles.overlay}>
          <div className={styles.overlayMenu}>
            <Link to="/" className={styles.overlayBrand} onClick={closeMenu}>
              <LogoIcon />
            </Link>
            <button
              type="button"
              className={styles.closeButton}
              onClick={closeMenu}
              aria-label="Fechar menu"
            >
              <img src="/close_small_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt="Fechar" className={styles.closeIcon} />
            </button>
            <div className={styles.overlayContent}>
              <nav className={styles.overlayLinks}>
                <Link to="/About" className={styles.overlayLink} onClick={closeMenu}>
                  About me
                </Link>
                <Link to="https://nillecommission.carrd.co" className={styles.overlayLink} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                  Commissions
                </Link>
                <Link to="/Menu" className={styles.overlayLink} onClick={closeMenu}>
                  Sketchbook
                </Link>
                {user && (
                  <Link to="/dashboard" className={styles.overlayLink} onClick={closeMenu}>
                    Painel de Admin
                  </Link>
                )}
              </nav>
              <div className={styles.overlaySocial}>
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
