import React from "react";
import styles from "./Button.module.css";

const Button = ({ text, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      <span>{text}</span>
      <div className={styles.glow}></div>
      <div className={styles.ripple}></div>
    </button>
  );
};

export default Button;
