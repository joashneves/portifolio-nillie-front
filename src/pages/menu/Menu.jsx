import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import CategoryCard from '../../components/CategoryCard/CategoryCard'
import styles from './Menu.module.css'
import TitleCompoente from '../../components/TitleCompoente/TitleCompoente'

export default function Menu() {
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
       <TitleCompoente/> 
      
    </div>
  )
}
