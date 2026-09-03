import React from "react";
import styles from './TitleCompoente.module.css'
import Stars from "../Stars/Stars";

export default function TitleCompoente() {
    return (
          <div className={styles.title}>
            <div className={styles.titleRow}>
              <Stars width="90px" height="90px" />
              <h1>Nicolle Neves</h1>
              <Stars width="90px" height="90px" />
            </div>
          </div>
    )
}
