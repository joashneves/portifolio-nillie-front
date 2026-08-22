import styles from './ImageCard.module.css'

export default function ImageCard({ imagem }) {
  return (
    <div className={styles.card}>
      <img
        src={imagem?.imagem_url || '/placeholder.svg'}
        alt={imagem?.nome || 'Imagem'}
      />
    </div>
  )
}
