import styles from './ImageCard.module.css'

export default function ImageCard({ imagem }) {
  return (
    <div className={styles.card}>
      {imagem.imagem_url && (
        <img src={imagem.imagem_url} alt={imagem.nome} />
      )}
    </div>
  )
}
