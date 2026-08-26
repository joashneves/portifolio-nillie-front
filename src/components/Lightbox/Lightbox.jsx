import { useEffect } from 'react'
import styles from './Lightbox.module.css'

export default function Lightbox({ imagens, index, onClose, onPrev, onNext }) {
  if (index === null || !imagens[index]) return null

  const imagem = imagens[index]

  return (
    <LightboxOverlay
      imagem={imagem}
      index={index}
      total={imagens.length}
      onClose={onClose}
      onPrev={onPrev}
      onNext={onNext}
    />
  )
}

function LightboxOverlay({ imagem, index, total, onClose, onPrev, onNext }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }

    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <button className={styles.close} onClick={onClose} aria-label="Fechar">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {index > 0 && (
        <button
          className={`${styles.arrow} ${styles.prev}`}
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          aria-label="Anterior"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <img
          src={imagem.imagem_url}
          alt={imagem.nome || ''}
          className={styles.image}
        />
        {imagem.descricao && <p className={styles.caption}>{imagem.descricao}</p>}
      </div>

      {index < total - 1 && (
        <button
          className={`${styles.arrow} ${styles.next}`}
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label="Proximo"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  )
}
