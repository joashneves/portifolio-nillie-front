import styles from './SocialLinks.module.css'

const redes = [
  { label: 'Email', icon: '/email-svgrepo-com.svg', link: 'mailto:nilleneves@example.com' },
  { label: 'Instagram', icon: '/instagram-logo-facebook-2-svgrepo-com.svg', link: 'https://www.instagram.com/nilleneves' },
  { label: 'ArtStation', icon: '/artstation-svgrepo-com.svg', link: 'https://www.artstation.com/nilleneves' },
  { label: 'VG icon', icon: '/VG Icon - monochrome.svg', link: 'https://vgen.co/bynillearts' },
]

export default function SocialLinks() {
  return (
    <div className={styles.social}>
      {redes.map((rede) => (
        <a href={rede.link} key={rede.label} className={styles.socialLink} aria-label={rede.label}>
          <img src={rede.icon} alt={rede.label} />
        </a>
      ))}
    </div>
  )
}
