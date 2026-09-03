import styles from './SocialLinks.module.css'
import EmailIcon from '../../assets/icons/email.svg?react'
import InstagramIcon from '../../assets/icons/instagram.svg?react'
import ArtstationIcon from '../../assets/icons/artstation.svg?react'

const redes = [
  { label: 'Email', Icon: EmailIcon, link: 'mailto:nilleneves@example.com' },
  { label: 'Instagram', Icon: InstagramIcon, link: 'https://www.instagram.com/nilleneves' },
  { label: 'ArtStation', Icon: ArtstationIcon, link: 'https://www.artstation.com/nilleneves' },
  { label: 'VG icon', icon: '/vgen.svg', link: 'https://vgen.co/bynillearts' },
]

export default function SocialLinks() {
  return (
    <div className={styles.social}>
      {redes.map((rede) => (
        <a href={rede.link} key={rede.label} className={styles.socialLink} aria-label={rede.label}>
          {rede.Icon ? <rede.Icon /> : <img src={rede.icon} alt={rede.label} />}
        </a>
      ))}
    </div>
  )
}
