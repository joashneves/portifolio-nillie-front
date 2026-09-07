import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import CategoryCard from '../../components/CategoryCard/CategoryCard'
import TitleCompoente from '../../components/TitleCompoente/TitleCompoente'
import Stars from '../../components/Stars/Stars'
import styles from './Categorias.module.css'

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getCategorias()
      .then(setCategorias)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className={styles.empty}>Carregando...</p>

  return (
    <div className={styles.page}>
      <TitleCompoente />
      <h3 className={styles.sectionTitle}>
        <Stars width="16px" height="16px" /> Categorias
      </h3>
      {categorias.length > 0 ? (
        <div className={styles.gridCategorias}>
          {categorias.map((cat) => (
            <CategoryCard key={cat.id} categoria={cat} tamanho="14rem" />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Nenhuma categoria ainda.</p>
      )}
    </div>
  )
}