import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../services/api'
import ImageCard from '../../components/ImageCard/ImageCard'
import CategoryCard from '../../components/CategoryCard/CategoryCard'
import Lightbox from '../../components/Lightbox/Lightbox'
import styles from './Categoria.module.css'

export default function Categoria() {
  const { id } = useParams()
  const [categoria, setCategoria] = useState(null)
  const [sugestoes, setSugestoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const imagens = categoria?.imagens || []

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i > 0 ? i - 1 : i))
  }, [])
  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i < imagens.length - 1 ? i + 1 : i))
  }, [imagens.length])

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
      <div className={styles.header} style={{ backgroundImage: `url(${categoria.imagem_url})` }}>
        <h1>{categoria.nome}</h1>
      </div>

      {imagens.length > 0 ? (
        <div className={styles.grid}>
          {imagens.map((img, i) => (
            <ImageCard
              key={img.id}
              imagem={img}
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Nenhuma imagem nesta categoria.</p>
      )}

      {sugestoes.length > 0 && (
        <section className={styles.sugestoes}>
          <div className={styles.sugestoesGrid}>
            {sugestoes.map((cat) => (
              <CategoryCard key={cat.id} categoria={cat} tamanho="16rem" />
            ))}
          </div>
        </section>
      )}

      <Lightbox
        imagens={imagens}
        index={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </div>
  )
}
