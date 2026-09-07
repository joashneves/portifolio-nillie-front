import { useState, useEffect, useCallback } from 'react'
import { api } from '../../services/api'
import ImageCard from '../../components/ImageCard/ImageCard'
import Lightbox from '../../components/Lightbox/Lightbox'
import Stars from '../../components/Stars/Stars'
import styles from './Sketchbook.module.css'

export default function Sketchbook() {
  const [sketchbook, setSketchbook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const imagens = sketchbook?.imagens || []

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i > 0 ? i - 1 : i))
  }, [])
  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i < imagens.length - 1 ? i + 1 : i))
  }, [imagens.length])

  useEffect(() => {
    api
      .getSketchbooks()
      .then((list) => {
        const first = [...list].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))[0]
        if (first) {
          return api.getSketchbook(first.id)
        }
        return null
      })
      .then((data) => setSketchbook(data || null))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className={styles.empty}>Carregando...</p>
  if (!sketchbook) return <p className={styles.empty}>Sketchbook não encontrado.</p>

  return (
    <div className={styles.page}>
      <div className={styles.header} style={{ '--bg-img': `url(${sketchbook.imagem_url})` }}>
        <div className={styles.titleRow}>
          <Stars width="90px" height="90px" />
          <h1>{sketchbook.nome}</h1>
          <Stars width="90px" height="90px" />
        </div>
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
        <p className={styles.empty}>Nenhuma imagem neste sketchbook.</p>
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