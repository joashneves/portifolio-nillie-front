import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../../services/api'
import styles from './Categoria.module.css'

export default function Categoria() {
  const { id } = useParams()
  const [categoria, setCategoria] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getCategoria(id)
      .then(setCategoria)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className={styles.empty}>Carregando...</p>
  if (!categoria) return <p className={styles.empty}>Categoria nao encontrada.</p>

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>
        &larr; Voltar
      </Link>
      <h2>{categoria.nome}</h2>

      {categoria.imagem_url && (
        <img
          src={categoria.imagem_url}
          alt={categoria.nome}
          className={styles.cover}
        />
      )}

      {categoria.imagens?.length > 0 ? (
        <div className={styles.grid}>
          {categoria.imagens.map((img) => (
            <div key={img.id} className={styles.card}>
              {img.imagem_url && (
                <img src={img.imagem_url} alt={img.nome} />
              )}
              <h4>{img.nome}</h4>
              {img.descricao && <p>{img.descricao}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Nenhuma imagem nesta categoria.</p>
      )}
    </div>
  )
}
