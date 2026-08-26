import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import CategoryCard from '../../components/CategoryCard/CategoryCard'
import styles from './Home.module.css'
import TitleCompoente from '../../components/TitleCompoente/TitleCompoente'
import ImageCard from '../../components/ImageCard/ImageCard'

export default function Home() {
  const [categorias, setCategorias] = useState([])
  const [colecaos, setColecaos] = useState([])
  const [loading, setLoading] = useState(true)

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

            
    </div>
  )
}
