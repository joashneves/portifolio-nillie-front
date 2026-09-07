import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import CategoriaTab from './tabs/CategoriaTab'
import PainelShell from './PainelShell'
import styles from './cores/Painel.module.css'

export default function PainelCategorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState('')

  const loadCategorias = () => {
    api.getCategorias()
      .then(setCategorias)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadCategorias() }, [])

  const showToast = (type, message) => setToast({ type, message })

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  if (loading) return <p className={styles.loading}>Carregando...</p>

  return (
    <PainelShell active="categorias" error={error} toast={toast} onToastClose={() => setToast(null)}>
      <CategoriaTab categorias={categorias} loadCategorias={loadCategorias} setError={setError} showToast={showToast} />
    </PainelShell>
  )
}