import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import SketchbookTab from './tabs/SketchbookTab'
import PainelShell from './PainelShell'
import styles from './cores/Painel.module.css'

export default function PainelSketchbook() {
  const [sketchbook, setSketchbook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState('')

  const loadSketchbook = () => {
    api.getSketchbooks()
      .then((list) => {
        const first = [...list].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))[0]
        if (first) return api.getSketchbook(first.id)
        return null
      })
      .then((data) => setSketchbook(data || null))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadSketchbook() }, [])

  const showToast = (type, message) => setToast({ type, message })

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  if (loading) return <p className={styles.loading}>Carregando...</p>

  return (
    <PainelShell active="sketchbook" error={error} toast={toast} onToastClose={() => setToast(null)}>
      <SketchbookTab sketchbook={sketchbook} loadSketchbook={loadSketchbook} setError={setError} showToast={showToast} />
    </PainelShell>
  )
}