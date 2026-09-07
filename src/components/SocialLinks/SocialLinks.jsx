import styles from './SocialLinks.module.css'
import EmailIcon from '../../assets/icons/email.svg?react'
import InstagramIcon from '../../assets/icons/instagram.svg?react'
import ArtstationIcon from '../../assets/icons/artstation.svg?react'
import LinkedinIcon from '../../assets/icons/linkedin.svg?react'

const redes = [
  { label: 'Email', Icon: EmailIcon, link: 'mailto:nilleneves@example.com' },
  { label: 'Instagram', Icon: InstagramIcon, link: 'https://www.instagram.com/nilleneves' },
  { label: 'ArtStation', Icon: ArtstationIcon, link: 'https://www.artstation.com/nilleneves' },
  { label: 'Linkedin', Icon: LinkedinIcon, link: 'https://www.linkedin.com/in/nicolleneves'}
]

export default function SocialLinks() {
  return (
    <div className={styles.social}>
      {redes.map((rede) => (
        <a href={rede.link} key={rede.label} className={styles.socialLink} aria-label={rede.label}>
          <rede.Icon />
        </a>
      ))}
    </div>
  )
}
