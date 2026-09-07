import styles from '../../pages/painelAdministrador/cores/Painel.module.css'

export default function Toast({ toast, onClose }) {
  if (!toast) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.popup} ${toast.type === 'success' ? styles.success : styles.fail}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className={styles.popupIcon}>{toast.type === 'success' ? '✓' : '!'}</span>
        <p>{toast.message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  )
}