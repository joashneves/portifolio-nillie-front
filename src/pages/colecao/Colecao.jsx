import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../services/api'
import ImageCard from '../../components/ImageCard/ImageCard'
import Lightbox from '../../components/Lightbox/Lightbox'
import styles from './Colecao.module.css'

export default function Colecao() {
  const { id } = useParams()
  const [colecao, setColecao] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const imagens = colecao?.imagens || []

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i > 0 ? i - 1 : i))
  }, [])
  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i < imagens.length - 1 ? i + 1 : i))
  }, [imagens.length])

  useEffect(() => {
    api
      .getColecao(id)
      .then(setColecao)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className={styles.empty}>Carregando...</p>
  if (!colecao) return <p className={styles.empty}>Coleção não encontrada.</p>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>{colecao.nome}</h1>
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
        <p className={styles.empty}>Nenhuma imagem nesta coleção.</p>
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
