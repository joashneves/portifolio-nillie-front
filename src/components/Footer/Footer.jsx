import React from "react";
import styles from "./Footer.module.css";
import SocialLinks from "../SocialLinks/SocialLinks";
import LogoIcon from "../LogoIcon/LogoIcon";

export default function Footer() {
  return (
    <footer className={styles.footer}>
     <LogoIcon />
      <SocialLinks />
      <p>Feito com amor S2 por <a href="https://github.com/joashneves" target="_blank" rel="noopener noreferrer">Joashneves</a></p>
      <p>© 2026 Nille Neves. Todos os direitos reservados.</p>
    </footer>
  );
}