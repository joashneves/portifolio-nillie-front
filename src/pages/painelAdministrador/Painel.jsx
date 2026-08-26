import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/useAuth'
import CategoriaTab from './CategoriaTab'
import ColecaoTab from './ColecaoTab'
import styles from './Painel.module.css'

export default function Painel() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('categorias')
  const [categorias, setCategorias] = useState([])
  const [colecaos, setColecaos] = useState([])
  const [toast, setToast] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadCategorias = () => {
    api.getCategorias()
      .then(setCategorias)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  const loadColecaos = () => {
    api.getColecaos()
      .then(setColecaos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadCategorias(); loadColecaos() }, [])

  const showToast = (type, message) => setToast({ type, message })

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  if (loading) return <p className={styles.loading}>Carregando...</p>

  return (
    <div className={styles.page}>
      <h2>Dashboard</h2>
      <p className={styles.welcome}>Ola, {user?.username}!</p>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'categorias' ? styles.tabActive : ''}`} onClick={() => setActiveTab('categorias')}>Categorias</button>
        <button className={`${styles.tab} ${activeTab === 'colecoes' ? styles.tabActive : ''}`} onClick={() => setActiveTab('colecoes')}>Colecoes</button>
      </div>

      {activeTab === 'categorias'
        ? <CategoriaTab categorias={categorias} loadCategorias={loadCategorias} setError={setError} showToast={showToast} />
        : <ColecaoTab colecaos={colecaos} loadColecaos={loadColecaos} setError={setError} showToast={showToast} />
      }

      {toast && (
        <div className={styles.overlay} onClick={() => setToast(null)}>
          <div className={`${styles.popup} ${toast.type === 'success' ? styles.success : styles.fail}`} onClick={(e) => e.stopPropagation()}>
            <span className={styles.popupIcon}>{toast.type === 'success' ? '✓' : '!'}</span>
            <p>{toast.message}</p>
            <button onClick={() => setToast(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  )
}
