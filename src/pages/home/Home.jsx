import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import styles from './Home.module.css'

export default function Home() {
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
      <div className={styles.title}>
      <h1>Nicolle Melo Dias Neves</h1>
      </div>
      <div className={styles.grid}>
        {categorias.map((cat) => (
          <Link
            to={`/categoria/${cat.id}`}
            key={cat.id}
            className={styles.card}
          >
            {cat.imagem_url && (
              <img src={cat.imagem_url} alt={cat.nome} className={styles.thumb} />
            )}
            <div className={styles.info}>
              <h3>{cat.nome}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
