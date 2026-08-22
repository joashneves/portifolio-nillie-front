import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../services/api'
import ImageCard from '../../components/ImageCard/ImageCard'
import CategoryCard from '../../components/CategoryCard/CategoryCard'
import styles from './Categoria.module.css'

export default function Categoria() {
  const { id } = useParams()
  const [categoria, setCategoria] = useState(null)
  const [sugestoes, setSugestoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getCategoria(id)
      .then(setCategoria)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    api
      .getCategorias()
      .then((cats) =>
        setSugestoes(
          cats.filter((c) => String(c.id) !== String(id)).slice(0, 3)
        )
      )
      .catch(console.error)
  }, [id])

  if (loading) return <p className={styles.empty}>Carregando...</p>
  if (!categoria) return <p className={styles.empty}>Categoria nao encontrada.</p>

  return (
    <div className={styles.page}>
      {categoria.imagens?.length > 0 ? (
        <div className={styles.grid}>
          {categoria.imagens.map((img) => (
            <ImageCard key={img.id} imagem={img} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Nenhuma imagem nesta categoria.</p>
      )}

      {sugestoes.length > 0 && (
        <section className={styles.sugestoes}>
          <div className={styles.sugestoesGrid}>
            {sugestoes.map((cat) => (
              <CategoryCard key={cat.id} categoria={cat} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
