import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "./LogoIcon.module.css";

export default function LogoIcon() {
      const { theme } = useTheme()

    return (<>
     <img
          src={theme === 'dark' ? '/logo/logo_nille_oficial_modo_preto.webp' : '/logo/logo_nille_ver_1_modo_branco.webp'}
          alt="Logo"
          className={styles.logo}
        />
        </>
    )

}