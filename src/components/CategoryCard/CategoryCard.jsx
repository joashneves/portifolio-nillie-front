import { Link } from 'react-router-dom'
import styles from './CategoryCard.module.css'

export default function CategoryCard({ categoria }) {
  return (
    <Link to={`/categoria/${categoria.id}`} className={styles.card}>
      {categoria.imagem_url && (
        <img
          src={categoria.imagem_url}
          alt={categoria.nome}
          className={styles.thumb}
        />
      )}
      <div className={styles.info}>
        <h3>{categoria.nome}</h3>
      </div>
    </Link>
  )
}
