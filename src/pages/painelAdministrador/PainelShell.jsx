import { useAuth } from '../../contexts/useAuth'
import Toast from '../../components/Toast/Toast'
import PainelNav from './PainelNav'
import styles from './cores/Painel.module.css'

export default function PainelShell({ active, error, toast, onToastClose, children }) {
  const { user } = useAuth()

  return (
    <div className={styles.shell}>
      <PainelNav active={active} />
      <div className={styles.page}>
        <h2>Dashboard</h2>
        <p className={styles.welcome}>Ola, {user?.username}!</p>
        {error && <p className={styles.error}>{error}</p>}
        {children}
      </div>
      <Toast toast={toast} onClose={onToastClose} />
    </div>
  )
}