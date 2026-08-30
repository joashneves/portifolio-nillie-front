import react from 'react';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import styles from './About.module.css';
import TitleAboutCompoente from '../../components/TitleAboutCompoente/TitleAboutCompoente';

export default function About() {

    return (
        <div className={styles.page}>
          <TitleAboutCompoente/> 
          <div className={styles.grid}>
            Ola!
          </div>
        </div>
        )
}