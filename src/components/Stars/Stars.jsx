import styles from './Stars.module.css'

export default function Stars({ top, bottom, left, right, width, height, zIndex, transform }) {
  return (
    <img
      src="/img/estrelas.webp"
      alt="Estrelas"
      className={styles.stars}
      style={{
        top,
        bottom,
        left,
        right,
        width,
        height,
        zIndex,
        transform,
      }}
    />
  )
}