import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import ColecaoTab from './tabs/ColecaoTab'
import PainelShell from './PainelShell'
import styles from './cores/Painel.module.css'

export default function PainelColecoes() {
  const [colecaos, setColecaos] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState('')

  const loadColecaos = () => {
    api.getColecaos()
      .then(setColecaos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadColecaos() }, [])

  const showToast = (type, message) => setToast({ type, message })

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  if (loading) return <p className={styles.loading}>Carregando...</p>

  return (
    <PainelShell active="colecoes" error={error} toast={toast} onToastClose={() => setToast(null)}>
      <ColecaoTab colecaos={colecaos} loadColecaos={loadColecaos} setError={setError} showToast={showToast} />
    </PainelShell>
  )
}