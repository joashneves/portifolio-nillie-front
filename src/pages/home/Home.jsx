import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import CategoryCard from '../../components/CategoryCard/CategoryCard'
import styles from './Home.module.css'
import TitleCompoente from '../../components/TitleCompoente/TitleCompoente'
import ImageCard from '../../components/ImageCard/ImageCard'
import Lightbox from '../../components/Lightbox/Lightbox'

export default function Home() {
  const [categorias, setCategorias] = useState([])
  const [colecaos, setColecaos] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i > 0 ? i - 1 : i))
  }, [])
  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i < colecaos.length - 1 ? i + 1 : i))
  }, [colecaos.length])

  useEffect(() => {
    Promise.all([
      api.getCategorias().catch(() => []),
      api.getColecaos().catch(() => []),
    ])
      .then(([cats, cols]) => {
        setCategorias(cats)
        setColecaos(cols)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className={styles.empty}>Carregando...</p>

  return (
    <div className={styles.page}>
       <TitleCompoente/>

      {colecaos.length > 0 ? (
              <div className={styles.grid_imagens}>
                {colecaos.map((img, i) => (
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

      <Lightbox
        imagens={colecaos}
        index={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </div>
  )
}
