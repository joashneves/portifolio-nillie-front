import styles from './SocialLinks.module.css'

const redes = [
  { label: 'Email', icon: '/email-svgrepo-com.svg' },
  { label: 'Instagram', icon: '/instagram-logo-facebook-2-svgrepo-com.svg' },
  { label: 'ArtStation', icon: '/artstation-svgrepo-com.svg' },
  { label: 'VG icon', icon: '/VG Icon - monochrome.svg' },
]

export default function SocialLinks() {
  return (
    <div className={styles.social}>
      {redes.map((rede) => (
        <a href="#" key={rede.label} className={styles.socialLink} aria-label={rede.label}>
          <img src={rede.icon} alt={rede.label} />
        </a>
      ))}
    </div>
  )
}
