import styles from './About.module.css'
import TitleAboutCompoente from '../../components/TitleAboutCompoente/TitleAboutCompoente'

const skills = [
  { name: 'Krita', icon: '/krita-svgrepo-com.svg', invert: true },
  { name: 'Clip Studio', icon: '/icons8-clip-studio-paint.svg', invert: true },
  { name: 'Aseprite', icon: '/aseprite-svgrepo-com.svg', invert: true },
]

export default function About() {
  return (
    <div className={styles.page}>
      <TitleAboutCompoente />

      <section className={styles.skillsSection}>
        <h2>Skills & Tools</h2>
        <div className={styles.skillsGrid}>
          {skills.map((skill) => (
            <div
              key={skill.name}
              className={`${styles.skillCard} ${skill.name === 'Clip Studio' ? styles.skillCardHighlight : ''}`}
            >
              <span className={styles.skillIcon}>
                <img src={skill.icon} alt={skill.name} />
              </span>
              <span className={styles.skillName}>{skill.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
