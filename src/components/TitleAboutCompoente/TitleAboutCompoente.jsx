import React from "react";
import styles from './TitleAboutCompoente.module.css';

export default function TitleAboutCompoente() {
  return (
    <div className={styles.title}>
      {/* Reference directly from the root of the public folder */}
      <img src="/img/fotoPerfil.webp" alt="Foto de perfil" className={styles.profileImage} />
      <div>
        <h1>Hello, I'm Nicolle!</h1>
        <p>
          I’m a Brazilian 2D digital artist and I’m starting to showcase my work while pursuing my childhood dream of making a career out of art. I study every day with the goal of working in character design and concept art.In the meantime, I create illustrations and fan art for myself a
        </p>
        <p>If you're interested in a commission, you can contact me at <a href="mailto:nicolleneves.art@gmail.com">nicolleneves.art@gmail.com</a> or use the form below</p>
      </div>
    </div>
  );
}
