import styles from './ImageCard.module.css'

export default function ImageCard({ imagem, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <img
        src={imagem?.imagem_url || '/placeholder.svg'}
        alt={imagem?.nome || 'Imagem'}
      />
    </div>
  )
}
