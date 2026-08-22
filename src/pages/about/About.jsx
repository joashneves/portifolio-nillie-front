import react from 'react';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import styles from './About.module.css';
import TitleCompoente from '../../components/TitleCompoente/TitleCompoente';

export default function About() {

    return (
        <div className={styles.page}>
          <TitleCompoente/> 
          <div className={styles.grid}>
            Ola!
          </div>
        </div>
        )
}